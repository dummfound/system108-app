import * as cheerio from "cheerio";

const BASE_URL = "https://system108.com";
const FETCH_HEADERS = {
  "User-Agent": "System108TelegramApp/0.1 (+https://t.me/system108)",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
};

async function fetchHtml(path) {
  const response = await fetch(`${BASE_URL}${path}`, { headers: FETCH_HEADERS });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }
  return response.text();
}

function decodeText(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseVenue(raw) {
  const text = decodeText(raw);
  const parts = text
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return {
      venue: parts.slice(0, -1).join(", "),
      city: parts[parts.length - 1],
    };
  }

  return { venue: text, city: "" };
}

function parseLineup(title) {
  const normalized = decodeText(title);
  if (!normalized) return [];

  const separators = /\s*(?:&|\+|×|x|\/|,| and | feat\.? | vs\.? )\s*/i;
  return normalized
    .split(separators)
    .map((name) => name.trim())
    .filter((name) => name.length > 1);
}

function parseEventStatus(card) {
  const buttonText = decodeText(card.find(".t-btnflex__text").text()).toUpperCase();

  if (buttonText.includes("CANCEL")) return "cancelled";
  if (buttonText.includes("POSTPONED")) return "postponed";
  if (buttonText.includes("PASSED") || buttonText.includes("ПРОШ")) return "passed";
  return "upcoming";
}

function getCardRoot(card) {
  return card.closest(".t772__content, .t-card");
}

export async function scrapeReleases() {
  const html = await fetchHtml("/catalogue");
  const $ = cheerio.load(html);
  const releases = [];
  const seen = new Set();

  $(".t-card__uptitle").each((_, element) => {
    const uptitle = $(element);
    const card = getCardRoot(uptitle);
    const catalogNumber = decodeText(uptitle.text());
    const title = decodeText(card.find(".t-card__title").first().text());
    const artist = decodeText(card.find(".t-card__descr").first().text());
    const listenUrl = card.find("a.t-card__link").attr("href") ?? "";
    const coverUrl =
      card.find("img").attr("src") ??
      card.find("[data-original]").attr("data-original") ??
      card.closest(".t772__col").find("[data-original]").attr("data-original") ??
      undefined;

    if (!catalogNumber.startsWith("S108")) return;
    if (seen.has(catalogNumber)) return;

    seen.add(catalogNumber);
    releases.push({
      id: catalogNumber,
      catalogNumber,
      title,
      artist,
      listenUrl,
      coverUrl,
    });
  });

  return releases.slice(0, 24);
}

export async function scrapeEvents() {
  const html = await fetchHtml("/events");
  const $ = cheerio.load(html);
  const events = [];
  const seen = new Set();

  $(".t-card__uptitle").each((_, element) => {
    const uptitle = $(element);
    const card = getCardRoot(uptitle);
    const date = decodeText(uptitle.text());
    const title = decodeText(card.find(".t-card__title").first().text());
    const venueRaw = decodeText(card.find(".t-card__descr").first().text());
    const href = card.find("a.t-card__link").attr("href") ?? "";
    const slug = href.replace(BASE_URL, "").replace(/^\//, "");
    const posterUrl =
      card.find("img").attr("src") ??
      card.find("[data-original]").attr("data-original") ??
      card.closest(".t772__col").find("[data-original]").attr("data-original") ??
      undefined;

    if (!date || !title || !slug.startsWith("e")) return;
    if (seen.has(slug)) return;

    seen.add(slug);
    const { venue, city } = parseVenue(venueRaw);

    events.push({
      id: slug,
      slug,
      date,
      title,
      venue,
      city,
      status: parseEventStatus(card),
      posterUrl,
      lineup: parseLineup(title),
      url: `${BASE_URL}/${slug}`,
    });
  });

  const upcoming = events.filter((event) => event.status === "upcoming");
  const enriched = await Promise.all(
    upcoming.slice(0, 6).map(async (event) => {
      try {
        const detailHtml = await fetchHtml(`/${event.slug}`);
        const detail = cheerio.load(detailHtml);
        const poster =
          detail("[data-original]").first().attr("data-original") ??
          detail('meta[property="og:image"]').attr("content");
        const ticketHref =
          detail('a[href*="radario"], a[href*="ticket"], a[href*="билет"]')
            .first()
            .attr("href") ?? undefined;

        return {
          ...event,
          posterUrl: poster ?? event.posterUrl,
          ticketUrl: ticketHref,
        };
      } catch {
        return event;
      }
    }),
  );

  const enrichedMap = new Map(enriched.map((event) => [event.id, event]));
  return events.map((event) => enrichedMap.get(event.id) ?? event);
}

export async function scrapeArticles() {
  const html = await fetchHtml("/reading");
  const $ = cheerio.load(html);
  const articles = [];
  const seen = new Set();

  $("a.t404__link").each((_, element) => {
    const link = $(element);
    const href = link.attr("href") ?? "";
    const slug = href.replace(/^\//, "");
    const title = decodeText(link.find(".t404__title").first().text());
    const excerpt = decodeText(link.find(".t404__descr").first().text());
    const coverUrl = link.find("[data-original]").attr("data-original") ?? undefined;

    if (!slug || slug === "reading" || seen.has(slug)) return;
    seen.add(slug);

    articles.push({
      id: slug,
      slug,
      title: title || excerpt.slice(0, 80),
      excerpt: excerpt || title,
      coverUrl,
      url: `${BASE_URL}/${slug}`,
    });
  });

  return articles.slice(0, 20);
}

export async function scrapeAll() {
  const [releases, events, articles] = await Promise.all([
    scrapeReleases(),
    scrapeEvents(),
    scrapeArticles(),
  ]);

  return {
    releases,
    events,
    articles,
    fetchedAt: new Date().toISOString(),
  };
}
