import { PhoneDock } from "./PhoneDock";
import { PhoneStatusBar } from "./PhoneStatusBar";
import type { LibraryCategory } from "./WidgetLibrary";
import type { WidgetModule, WidgetSize } from "../types/widget";
import { WidgetCard } from "./widgets/WidgetCard";

type DashboardProps = {
  widgets: WidgetModule[];
  isEditing: boolean;
  draggedWidgetId: string | null;
  onDragStart: (widgetId: string) => void;
  onDragEnd: () => void;
  onDrop: (sourceId: string, targetId: string) => void;
  onMove: (widgetId: string, direction: -1 | 1) => void;
  onOpenLibrary: () => void;
  onOpenLibraryCategory: (category: LibraryCategory) => void;
  onResetLayout: () => void;
  onSizeChange: (widgetId: string, size: WidgetSize) => void;
  onToggleEditing: () => void;
  onToggleVisible: (widgetId: string, visible: boolean) => void;
};

export function Dashboard({
  widgets,
  isEditing,
  draggedWidgetId,
  onDragStart,
  onDragEnd,
  onDrop,
  onMove,
  onOpenLibrary,
  onOpenLibraryCategory,
  onResetLayout,
  onSizeChange,
  onToggleEditing,
  onToggleVisible,
}: DashboardProps) {
  const visibleWidgets = widgets
    .filter((widget) => widget.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="phone-board" aria-label="Ecran de widgets">
      <PhoneStatusBar
        activeCount={visibleWidgets.length}
        totalCount={widgets.length}
      />

      {visibleWidgets.length > 0 ? (
        <div className="dashboard-grid">
          {visibleWidgets.map((widget, index) => (
            <WidgetCard
              key={widget.id}
              widget={widget}
              isEditing={isEditing}
              isDragged={draggedWidgetId === widget.id}
              isFirst={index === 0}
              isLast={index === visibleWidgets.length - 1}
              position={index + 1}
              total={visibleWidgets.length}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDrop={(targetId) => {
                if (draggedWidgetId) {
                  onDrop(draggedWidgetId, targetId);
                }
              }}
              onMove={onMove}
              onSizeChange={onSizeChange}
              onToggleVisible={onToggleVisible}
            />
          ))}
        </div>
      ) : (
        <div className="empty-board">
          <h2>Aucun widget</h2>
          <button type="button" className="primary-action" onClick={onOpenLibrary}>
            Ajouter
          </button>
        </div>
      )}

      <PhoneDock
        isEditing={isEditing}
        onOpenLibrary={onOpenLibrary}
        onOpenCategory={onOpenLibraryCategory}
        onResetLayout={onResetLayout}
        onToggleEditing={onToggleEditing}
      />
    </section>
  );
}
