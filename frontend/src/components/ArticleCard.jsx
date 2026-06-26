export function ArticleCard({ article, onRead }) {
  return (
    <article className="card article-card" onClick={onRead} role="button" tabIndex={0}>
      {article.coverUrl && (
        <div
          className="article-cover"
          style={{ backgroundImage: `url(${article.coverUrl})` }}
          aria-hidden
        />
      )}
      <div className="card-body">
        <h2>{article.title}</h2>
        <p className="excerpt">{article.excerpt}</p>
        <span className="read-more">Читать →</span>
      </div>
    </article>
  );
}
