import styles from "./TabBar.module.scss";

const tabs = [
  { id: "events", label: "События" },
  { id: "releases", label: "Релизы" },
  { id: "news", label: "Новости" },
];

export function TabBar({ active, onChange }) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === active),
  );

  return (
    <nav className={styles.tabs} aria-label="Разделы">
      <span
        className={styles.slider}
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
        aria-hidden
      />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`${styles.tab} ${active === tab.id ? styles.active : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
