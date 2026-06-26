import styles from "./ReleaseCard.module.scss";

export function ReleaseCard({ release, onListen }) {
  return (
    <article className={styles.card}>
      {release.coverUrl && (
        <div
          className={styles.releaseCover}
          style={{ backgroundImage: `url(${release.coverUrl})` }}
          aria-hidden
        />
      )}
      <div className={styles.cardBody}>
        <p className={styles.meta}>{release.catalogNumber}</p>
        <h2>{release.title}</h2>
        <p className={styles.muted}>{release.artist}</p>
        <button type="button" className={styles.inlineAction} onClick={onListen}>
          Слушать
        </button>
      </div>
    </article>
  );
}
