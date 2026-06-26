export function EventDetail({ event, onBack, onOpenLink }) {
  return (
    <div className="screen detail">
      <button type="button" className="back" onClick={onBack}>
        ← Назад
      </button>

      {event.posterUrl && (
        <div
          className="detail-poster"
          style={{ backgroundImage: `url(${event.posterUrl})` }}
        />
      )}

      <div className="detail-body">
        <p className="meta">{event.date}</p>
        <h1>{event.title}</h1>
        <p className="muted">
          {event.venue}
          {event.city ? `, ${event.city}` : ""}
        </p>

        {event.lineup.length > 0 && (
          <section className="detail-section">
            <h3>Лайнап</h3>
            <ul className="lineup">
              {event.lineup.map((artist) => (
                <li key={artist}>{artist}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="actions">
          {event.ticketUrl && (
            <button
              type="button"
              className="primary"
              onClick={() => onOpenLink(event.ticketUrl)}
            >
              Купить билеты
            </button>
          )}
          <button type="button" className="secondary" onClick={() => onOpenLink(event.url)}>
            На сайте
          </button>
        </div>
      </div>
    </div>
  );
}
