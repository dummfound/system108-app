import styles from "./ArticleCard.module.scss";

export function ArticleCard({ article, onRead }) {
  return (
    <article className={styles.card} onClick={onRead} role="button" tabIndex={0}>
      {article.coverUrl ? (
        <img className={styles.cover} src={article.coverUrl} alt="" />
      ) : null}
      <div className={styles.cardBody}>
        <p className={styles.meta}>Новость</p>
        <h2>{article.title}</h2>
        <p className={styles.excerpt}>{article.excerpt}</p>
        <span className={styles.readMore}>Читать</span>
      </div>
    </article>
  );
}
