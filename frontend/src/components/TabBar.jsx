const tabs = [
  { id: "events", label: "Ивенты" },
  { id: "releases", label: "Релизы" },
  { id: "news", label: "Новости" },
];

export function TabBar({ active, onChange }) {
  return (
    <nav className="tabs" aria-label="Разделы">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={active === tab.id ? "tab active" : "tab"}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
