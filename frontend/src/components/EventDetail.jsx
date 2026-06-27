import styles from "./EventDetail.module.scss";

export function EventDetail({ event, onBack, onOpenLink }) {
  return (
    <div className={styles.screen}>
      <div className={styles.topBar}>
        <button type="button" className={styles.back} onClick={onBack}>
          ← Назад
        </button>
      </div>

      {event.posterUrl && (
        <div className={styles.detailPosterWrap}>
          <img className={styles.detailPoster} src={event.posterUrl} alt={event.title} />
        </div>
      )}

      <div className={styles.detailBody}>
        <p className={styles.meta}>{event.date}</p>
        <h1>{event.title}</h1>
        <p className={styles.muted}>
          {event.venue}
          {event.city ? `, ${event.city}` : ""}
        </p>

        {event.lineup.length > 0 && (
          <section className={styles.detailSection}>
            <h3>Лайнап</h3>
            <ul className={styles.lineup}>
              {event.lineup.map((artist) => (
                <li key={artist}>{artist}</li>
              ))}
            </ul>
          </section>
        )}

        <div className={styles.actions}>
          {(event.ticketUrl || event.url) && (
            <button
              type="button"
              className={styles.primary}
              onClick={() => onOpenLink(event.ticketUrl || event.url)}
            >
              Билеты
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
