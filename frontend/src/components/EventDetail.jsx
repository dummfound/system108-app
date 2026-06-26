import styles from "./EventDetail.module.scss";

export function EventDetail({ event, onBack, onOpenLink }) {
  return (
    <div className={styles.screen}>
      <button type="button" className={styles.back} onClick={onBack}>
        ← Назад
      </button>

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
          {event.ticketUrl && (
            <button
              type="button"
              className={styles.primary}
              onClick={() => onOpenLink(event.ticketUrl)}
            >
              Купить билеты
            </button>
          )}
          <button type="button" className={styles.secondary} onClick={() => onOpenLink(event.url)}>
            На сайте
          </button>
        </div>
      </div>
    </div>
  );
}
