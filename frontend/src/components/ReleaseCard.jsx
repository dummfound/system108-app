import styles from "./ReleaseCard.module.scss";

function PlayIcon() {
  return (
    <svg className={styles.playIcon} viewBox="0 0 12 12" aria-hidden>
      <path d="M3 2.5v7l6-3.5-6-3.5Z" fill="currentColor" />
    </svg>
  );
}

export function ReleaseCard({ release, onListen }) {
  return (
    <article className={styles.card}>
      {release.coverUrl ? (
        <img className={styles.cover} src={release.coverUrl} alt="" />
      ) : null}
      <div className={styles.cardBody}>
        <p className={styles.meta}>{release.catalogNumber}</p>
        <h2>{release.title}</h2>
        <p className={styles.muted}>{release.artist}</p>
        <button type="button" className={styles.inlineAction} onClick={onListen}>
          <PlayIcon />
          Слушать
        </button>      </div>
    </article>
  );
}
