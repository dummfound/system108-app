export function EventCard({ event, onOpen }) {
  return (
    <article className="card event-card" onClick={onOpen} role="button" tabIndex={0}>
      {event.posterUrl && (
        <div
          className="card-cover"
          style={{ backgroundImage: `url(${event.posterUrl})` }}
          aria-hidden
        />
      )}
      <div className="card-body">
        <p className="meta">{event.date}</p>
        <h2>{event.title}</h2>
        <p className="muted">
          {event.venue}
          {event.city ? `, ${event.city}` : ""}
        </p>
        {event.lineup.length > 0 && (
          <div className="chips">
            {event.lineup.map((artist) => (
              <span key={artist} className="chip">
                {artist}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
