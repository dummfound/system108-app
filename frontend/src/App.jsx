import { useEffect, useMemo, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { fetchAppData } from "./api";
import { EventCard } from "./components/EventCard";
import { ReleaseCard } from "./components/ReleaseCard";
import { ArticleCard } from "./components/ArticleCard";
import { EventDetail } from "./components/EventDetail";
import { TabBar } from "./components/TabBar";

const LOGO_URL =
  "https://static.tildacdn.com/tild3631-3437-4565-a337-336365663138/Asset_24x.png";

function openExternal(url) {
  if (WebApp.openLink) {
    WebApp.openLink(url);
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("events");
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchAppData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const upcomingEvents = useMemo(
    () => data?.events.filter((event) => event.status === "upcoming") ?? [],
    [data],
  );

  if (loading) {
    return (
      <div className="screen loading-screen">
        <div className="logo-loader" aria-label="Загрузка">
          <img className="logo-loader__image" src={LOGO_URL} alt="System 108" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return <div className="screen center error">{error ?? "Ошибка загрузки"}</div>;
  }

  if (selectedEvent) {
    return (
      <EventDetail
        event={selectedEvent}
        onBack={() => setSelectedEvent(null)}
        onOpenLink={openExternal}
      />
    );
  }

  return (
    <div className="screen">
      <header className="header">
        <img className="header-logo" src={LOGO_URL} alt="System 108" />
        <p className="eyebrow">Moscow · since 2015</p>
        <p className="subtitle">Релизы, ивенты и новости лейбла</p>
      </header>

      <TabBar active={tab} onChange={setTab} />

      <main className="content">
        {tab === "events" && (
          <section>
            {upcomingEvents.length === 0 ? (
              <p className="empty">Ближайших ивентов пока нет</p>
            ) : (
              upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onOpen={() => setSelectedEvent(event)}
                />
              ))
            )}
          </section>
        )}

        {tab === "releases" && (
          <section>
            {data.releases.map((release) => (
              <ReleaseCard
                key={release.id}
                release={release}
                onListen={() => openExternal(release.listenUrl)}
              />
            ))}
          </section>
        )}

        {tab === "news" && (
          <section>
            {data.articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onRead={() => openExternal(article.url)}
              />
            ))}
          </section>
        )}
      </main>

      <footer className="footer">
        <button type="button" onClick={() => openExternal("https://system108.com")}>
          system108.com
        </button>
        <span>обновлено {new Date(data.fetchedAt).toLocaleString("ru-RU")}</span>
      </footer>
    </div>
  );
}
