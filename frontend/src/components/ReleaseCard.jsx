export function ReleaseCard({ release, onListen }) {
  return (
    <article className="card release-card">
      {release.coverUrl && (
        <div
          className="release-cover"
          style={{ backgroundImage: `url(${release.coverUrl})` }}
          aria-hidden
        />
      )}
      <div className="card-body">
        <p className="meta">{release.catalogNumber}</p>
        <h2>{release.title}</h2>
        <p className="muted">{release.artist}</p>
        <button type="button" className="inline-action" onClick={onListen}>
          Слушать
        </button>
      </div>
    </article>
  );
}
