import type { WidgetCategory, WidgetModule } from "../types/widget";

export type LibraryCategory = WidgetCategory | "all";

type WidgetLibraryProps = {
  widgets: WidgetModule[];
  isOpen: boolean;
  selectedCategory: LibraryCategory;
  searchQuery: string;
  onCategoryChange: (category: LibraryCategory) => void;
  onClose: () => void;
  onSearchChange: (query: string) => void;
  onToggleVisible: (widgetId: string, visible: boolean) => void;
};

const categoryLabels: Record<LibraryCategory, string> = {
  all: "Tous",
  today: "Aujourd'hui",
  productivity: "Productivite",
  media: "Media",
  system: "Systeme",
  web: "Web",
  health: "Sante",
};

const categories: LibraryCategory[] = [
  "all",
  "today",
  "productivity",
  "media",
  "system",
  "web",
  "health",
];

function widgetMatchesSearch(widget: WidgetModule, searchQuery: string) {
  const query = searchQuery.trim().toLowerCase();

  if (!query) {
    return true;
  }

  return [widget.title, widget.description, widget.service, widget.type]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLowerCase().includes(query));
}

export function WidgetLibrary({
  widgets,
  isOpen,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onClose,
  onSearchChange,
  onToggleVisible,
}: WidgetLibraryProps) {
  const visibleWidgets = widgets.filter((widget) => {
    const inCategory =
      selectedCategory === "all" || widget.category === selectedCategory;

    return inCategory && widgetMatchesSearch(widget, searchQuery);
  });

  return (
    <aside
      className={`widget-library ${isOpen ? "is-open" : ""}`}
      aria-label="Bibliotheque de widgets"
    >
      <div className="library-header">
        <div>
          <h2>Bibliotheque</h2>
          <p>{visibleWidgets.length} services</p>
        </div>
        <button
          type="button"
          className="icon-button subtle"
          title="Fermer"
          aria-label="Fermer la bibliotheque"
          onClick={onClose}
        >
          x
        </button>
      </div>

      <label className="library-search">
        <span>Recherche</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <div className="category-tabs" role="tablist" aria-label="Categories">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            role="tab"
            aria-selected={selectedCategory === category}
            className={selectedCategory === category ? "is-selected" : ""}
            onClick={() => onCategoryChange(category)}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>

      <div className="library-list">
        {visibleWidgets.length > 0 ? (
          visibleWidgets.map((widget) => (
            <article
              className={`library-item widget-theme-${widget.accent ?? "slate"}`}
              key={widget.id}
            >
              <span className="library-glyph" aria-hidden="true">
                {widget.glyph}
              </span>
              <div>
                <div className="library-title-row">
                  <h3>{widget.title}</h3>
                  <span className={`status-pill ${widget.visible ? "on" : ""}`}>
                    {widget.visible ? "Actif" : "Dispo"}
                  </span>
                </div>
                <p>{widget.description}</p>
                <span className="library-meta">
                  {widget.service} - {widget.privacy}
                </span>
              </div>
              <button
                type="button"
                className={`icon-button ${widget.visible ? "danger" : ""}`}
                title={widget.visible ? "Masquer" : "Ajouter"}
                aria-label={
                  widget.visible
                    ? `Masquer ${widget.title}`
                    : `Ajouter ${widget.title}`
                }
                onClick={() => onToggleVisible(widget.id, !widget.visible)}
              >
                {widget.visible ? "x" : "+"}
              </button>
            </article>
          ))
        ) : (
          <p className="library-empty">Aucun service.</p>
        )}
      </div>
    </aside>
  );
}
