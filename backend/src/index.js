import cors from "cors";
import express from "express";
import NodeCache from "node-cache";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scrapeAll } from "./scraper.js";
import { syncMenuButton } from "./telegram.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 3001);
const CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS ?? 900);
const cache = new NodeCache({ stdTTL: CACHE_TTL_SECONDS });

const seedData = {
  fetchedAt: new Date(0).toISOString(),
  releases: [
    {
      id: "S108-263",
      catalogNumber: "S108-263",
      title: "Shades",
      artist: "Amp Effect",
      listenUrl: "https://band.link/amp_effect_shades",
    },
    {
      id: "S108-232S7",
      catalogNumber: "S108-232S7",
      title: "Дела",
      artist: "Juravlove",
      listenUrl: "https://band.link/",
    },
  ],
  events: [
    {
      id: "e100726",
      slug: "e100726",
      date: "10.07.2026",
      title: "SIMPLE SYMMETRY & GEJU",
      venue: "АЛЬФА КРИСТАЛЛ",
      city: "MOSCOW",
      status: "upcoming",
      lineup: ["SIMPLE SYMMETRY", "GEJU"],
      url: "https://system108.com/e100726",
    },
    {
      id: "e310726",
      slug: "e310726",
      date: "31.07.2026",
      title: "МАМА СВЕТА",
      venue: "АЛЬФА КРИСТАЛЛ",
      city: "MOSCOW",
      status: "upcoming",
      lineup: ["МАМА СВЕТА"],
      url: "https://system108.com/e310726",
    },
  ],
  articles: [
    {
      id: "playlist11years",
      slug: "playlist11years",
      title: "Плейлист от резидентов System 108",
      excerpt:
        "К 11-летию лейбла друзья и резиденты собрали треки, связанные с их историей взаимодействия с System 108.",
      url: "https://system108.com/playlist11years",
    },
  ],
};

async function getData() {
  const cached = cache.get("app-data");
  if (cached) return cached;

  try {
    const data = await scrapeAll();
    cache.set("app-data", data);
    return data;
  } catch (error) {
    console.error("Scrape failed, using seed data:", error);
    return { ...seedData, fetchedAt: new Date().toISOString() };
  }
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/data", async (_req, res) => {
  const data = await getData();
  res.json(data);
});

app.post("/api/refresh", async (_req, res) => {
  cache.del("app-data");
  const data = await getData();
  res.json(data);
});

const frontendDist = path.resolve(__dirname, "../public");
app.use(express.static(frontendDist));
app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"), (error) => {
    if (error) {
      res.status(404).json({ error: "Frontend build not found. Run npm run build." });
    }
  });
});

const server = app.listen(PORT, () => {
  console.log(`System 108 API running on http://localhost:${PORT}`);
  syncMenuButton();
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the other process or set PORT to another value.`);
    process.exit(1);
  }

  throw error;
});
