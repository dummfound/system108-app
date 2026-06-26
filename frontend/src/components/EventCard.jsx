import styles from "./EventCard.module.scss";

export function EventCard({ event, onOpen }) {
  return (
    <article
      className={`${styles.card} ${styles.eventCard}`}
      onClick={onOpen}
      role="button"
      tabIndex={0}
    >
      {event.posterUrl && (
        <div
          className={styles.cardCover}
          style={{ backgroundImage: `url(${event.posterUrl})` }}
          aria-hidden
        />
      )}
      <div className={styles.cardBody}>
        <p className={styles.meta}>{event.date}</p>
        <h2>{event.title}</h2>
        <p className={styles.muted}>
          {event.venue}
          {event.city ? `, ${event.city}` : ""}
        </p>
        {event.lineup.length > 0 && (
          <div className={styles.chips}>
            {event.lineup.map((artist) => (
              <span key={artist} className={styles.chip}>
                {artist}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
