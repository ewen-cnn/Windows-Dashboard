import type { KeyboardEvent } from "react";
import type { WidgetModule, WidgetSize } from "../../types/widget";
import { WidgetContent } from "./widgetRegistry";

type WidgetCardProps = {
  widget: WidgetModule;
  isEditing: boolean;
  isDragged: boolean;
  isFirst: boolean;
  isLast: boolean;
  position: number;
  total: number;
  onDragStart: (widgetId: string) => void;
  onDragEnd: () => void;
  onDrop: (targetId: string) => void;
  onMove: (widgetId: string, direction: -1 | 1) => void;
  onSizeChange: (widgetId: string, size: WidgetSize) => void;
  onToggleVisible: (widgetId: string, visible: boolean) => void;
};

const sizeLabels: Record<WidgetSize, string> = {
  small: "S",
  medium: "M",
  large: "L",
};

function sizeFromKey(key: string): WidgetSize | null {
  if (key === "1") {
    return "small";
  }

  if (key === "2") {
    return "medium";
  }

  if (key === "3") {
    return "large";
  }

  return null;
}

export function WidgetCard({
  widget,
  isEditing,
  isDragged,
  isFirst,
  isLast,
  position,
  total,
  onDragStart,
  onDragEnd,
  onDrop,
  onMove,
  onSizeChange,
  onToggleVisible,
}: WidgetCardProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!isEditing) {
      return;
    }

    const nextSize = sizeFromKey(event.key);

    if (nextSize) {
      event.preventDefault();
      onSizeChange(widget.id, nextSize);
      return;
    }

    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      onToggleVisible(widget.id, false);
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      onMove(widget.id, -1);
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      onMove(widget.id, 1);
    }
  }

  return (
    <section
      className={[
        "widget-card",
        `widget-${widget.size}`,
        `widget-theme-${widget.accent ?? "slate"}`,
        `${widget.type}-card`,
        isEditing ? "is-editing" : "",
        isDragged ? "is-dragged" : "",
      ].join(" ")}
      draggable={isEditing}
      role="group"
      aria-label={`${widget.title}, position ${position} sur ${total}`}
      aria-roledescription="widget"
      aria-grabbed={isEditing ? isDragged : undefined}
      tabIndex={isEditing ? 0 : undefined}
      onKeyDown={handleKeyDown}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        onDragStart(widget.id);
      }}
      onDragEnd={onDragEnd}
      onDragOver={(event) => {
        if (isEditing) {
          event.preventDefault();
        }
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDrop(widget.id);
      }}
    >
      <div className="widget-topline">
        <span className="widget-glyph" aria-hidden="true">
          {widget.glyph}
        </span>
        <div className="widget-title-stack">
          <h2>{widget.title}</h2>
          <span>{widget.service}</span>
        </div>
      </div>

      <div className="widget-content">
        <WidgetContent widget={widget} />
      </div>

      {isEditing ? (
        <div className="widget-edit-controls">
          <button
            type="button"
            className="icon-button subtle"
            title="Deplacer avant"
            aria-label={`Deplacer ${widget.title} avant`}
            disabled={isFirst}
            onClick={() => onMove(widget.id, -1)}
          >
            &lt;
          </button>

          <div className="size-segmented" aria-label={`Taille ${widget.title}`}>
            {(["small", "medium", "large"] as const).map((size) => (
              <button
                type="button"
                key={size}
                className={widget.size === size ? "is-selected" : ""}
                aria-pressed={widget.size === size}
                aria-label={`Taille ${size}`}
                onClick={() => onSizeChange(widget.id, size)}
              >
                {sizeLabels[size]}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="icon-button subtle"
            title="Deplacer apres"
            aria-label={`Deplacer ${widget.title} apres`}
            disabled={isLast}
            onClick={() => onMove(widget.id, 1)}
          >
            &gt;
          </button>

          <button
            type="button"
            className="icon-button danger"
            title="Masquer"
            aria-label={`Masquer ${widget.title}`}
            onClick={() => onToggleVisible(widget.id, false)}
          >
            x
          </button>
        </div>
      ) : null}
    </section>
  );
}
