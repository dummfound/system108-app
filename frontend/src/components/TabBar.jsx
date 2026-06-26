import styles from "./TabBar.module.scss";

const tabs = [
  { id: "events", label: "Ивенты" },
  { id: "releases", label: "Релизы" },
  { id: "news", label: "Новости" },
];

export function TabBar({ active, onChange }) {
  return (
    <nav className={styles.tabs} aria-label="Разделы">
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
