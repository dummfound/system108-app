import styles from "./ArticleCard.module.scss";

export function ArticleCard({ article, onRead }) {
  return (
    <article className={styles.card} onClick={onRead} role="button" tabIndex={0}>
      {article.coverUrl && (
        <div
          className={styles.articleCover}
          style={{ backgroundImage: `url(${article.coverUrl})` }}
          aria-hidden
        />
      )}
      <div className={styles.cardBody}>
        <h2>{article.title}</h2>
        <p className={styles.excerpt}>{article.excerpt}</p>
        <span className={styles.readMore}>Читать →</span>
      </div>
    </article>
  );
}
