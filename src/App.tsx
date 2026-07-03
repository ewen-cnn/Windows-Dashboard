import { useEffect, useMemo, useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { WidgetLibrary } from "./components/WidgetLibrary";
import type { LibraryCategory } from "./components/WidgetLibrary";
import { defaultWidgets } from "./data/widgetConfig";
import {
  loadWidgets,
  resetWidgets,
  saveWidgets,
} from "./services/widgetStorage";
import type { WidgetModule, WidgetSize } from "./types/widget";

function orderWidgets(widgets: WidgetModule[]): WidgetModule[] {
  return widgets
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((widget, index) => ({ ...widget, order: index + 1 }));
}

function App() {
  const [widgets, setWidgets] = useState<WidgetModule[]>(() =>
    loadWidgets(defaultWidgets)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryCategory, setLibraryCategory] =
    useState<LibraryCategory>("all");
  const [librarySearch, setLibrarySearch] = useState("");
  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    saveWidgets(widgets);
  }, [widgets]);

  const orderedWidgets = useMemo(() => orderWidgets(widgets), [widgets]);
  const activeWidgetCount = orderedWidgets.filter((widget) => widget.visible).length;

  function announce(message: string) {
    setAnnouncement(message);
  }

  function getWidgetTitle(widgetId: string) {
    return (
      widgets.find((widget) => widget.id === widgetId)?.title ?? "Widget"
    );
  }

  function updateWidgets(nextWidgets: WidgetModule[]) {
    setWidgets(orderWidgets(nextWidgets));
  }

  function openLibrary(category: LibraryCategory = "all") {
    setLibraryCategory(category);
    setLibraryOpen(true);
  }

  function setWidgetVisible(widgetId: string, visible: boolean) {
    const maxOrder = Math.max(...widgets.map((widget) => widget.order), 0);
    const title = getWidgetTitle(widgetId);

    updateWidgets(
      widgets.map((widget) =>
        widget.id === widgetId
          ? {
              ...widget,
              visible,
              order: visible ? maxOrder + 1 : widget.order,
            }
          : widget
      )
    );
    announce(visible ? `${title} ajoute.` : `${title} masque.`);

    if (visible) {
      setIsEditing(true);
    }
  }

  function changeWidgetSize(widgetId: string, size: WidgetSize) {
    updateWidgets(
      widgets.map((widget) =>
        widget.id === widgetId ? { ...widget, size } : widget
      )
    );
    announce(`${getWidgetTitle(widgetId)} passe en taille ${size}.`);
  }

  function dropWidget(sourceId: string, targetId: string) {
    if (sourceId === targetId) {
      return;
    }

    const nextWidgets = orderedWidgets.slice();
    const sourceIndex = nextWidgets.findIndex((widget) => widget.id === sourceId);
    const targetIndex = nextWidgets.findIndex((widget) => widget.id === targetId);

    if (sourceIndex < 0 || targetIndex < 0) {
      return;
    }

    const [movedWidget] = nextWidgets.splice(sourceIndex, 1);
    nextWidgets.splice(targetIndex, 0, movedWidget);
    updateWidgets(nextWidgets);
    announce(`${getWidgetTitle(sourceId)} deplace.`);
  }

  function moveWidget(widgetId: string, direction: -1 | 1) {
    const visibleWidgets = orderedWidgets.filter((widget) => widget.visible);
    const currentIndex = visibleWidgets.findIndex(
      (widget) => widget.id === widgetId
    );
    const targetWidget = visibleWidgets[currentIndex + direction];

    if (!targetWidget) {
      return;
    }

    dropWidget(widgetId, targetWidget.id);
  }

  function toggleEditing() {
    setIsEditing((editing) => {
      announce(editing ? "Modification terminee." : "Modification active.");
      return !editing;
    });
  }

  function restoreDefaultLayout() {
    setWidgets(resetWidgets(defaultWidgets));
    setDraggedWidgetId(null);
    announce("Ecran reinitialise.");
  }

  return (
    <main className={`dashboard-app ${isEditing ? "is-editing" : ""}`}>
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>

      <header className="dashboard-header">
        <div className="title-block">
          <p className="app-kicker">Windows Dashboard</p>
          <h1>Accueil</h1>
        </div>

        <div className="header-actions">
          <span className="layout-pill">
            {activeWidgetCount}/{orderedWidgets.length}
          </span>
          <button
            type="button"
            className="icon-button"
            title="Ajouter un widget"
            aria-label="Ajouter un widget"
            onClick={() => openLibrary("all")}
          >
            +
          </button>
          <button
            type="button"
            className="icon-button"
            title={isEditing ? "Terminer" : "Modifier"}
            aria-label={isEditing ? "Terminer" : "Modifier"}
            aria-pressed={isEditing}
            onClick={toggleEditing}
          >
            {isEditing ? "OK" : "ED"}
          </button>
        </div>
      </header>

      <div className={`manager-layout ${libraryOpen ? "has-library" : ""}`}>
        <Dashboard
          widgets={orderedWidgets}
          isEditing={isEditing}
          draggedWidgetId={draggedWidgetId}
          onDragStart={setDraggedWidgetId}
          onDragEnd={() => setDraggedWidgetId(null)}
          onDrop={dropWidget}
          onMove={moveWidget}
          onOpenLibrary={() => openLibrary("all")}
          onOpenLibraryCategory={openLibrary}
          onResetLayout={restoreDefaultLayout}
          onSizeChange={changeWidgetSize}
          onToggleEditing={toggleEditing}
          onToggleVisible={setWidgetVisible}
        />

        <WidgetLibrary
          widgets={orderedWidgets}
          isOpen={libraryOpen}
          selectedCategory={libraryCategory}
          searchQuery={librarySearch}
          onCategoryChange={setLibraryCategory}
          onClose={() => setLibraryOpen(false)}
          onSearchChange={setLibrarySearch}
          onToggleVisible={setWidgetVisible}
        />
      </div>
    </main>
  );
}

export default App;
