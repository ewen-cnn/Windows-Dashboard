import type { WidgetCategory } from "../types/widget";

type PhoneDockProps = {
  isEditing: boolean;
  onOpenLibrary: () => void;
  onOpenCategory: (category: WidgetCategory | "all") => void;
  onResetLayout: () => void;
  onToggleEditing: () => void;
};

export function PhoneDock({
  isEditing,
  onOpenLibrary,
  onOpenCategory,
  onResetLayout,
  onToggleEditing,
}: PhoneDockProps) {
  return (
    <nav className="phone-dock" aria-label="Actions principales">
      <button type="button" onClick={onOpenLibrary} aria-label="Ouvrir les widgets">
        <span aria-hidden="true">WG</span>
        Widgets
      </button>
      <button
        type="button"
        onClick={() => onOpenCategory("productivity")}
        aria-label="Ouvrir les services productivite"
      >
        <span aria-hidden="true">PR</span>
        Productivite
      </button>
      <button
        type="button"
        onClick={onToggleEditing}
        aria-pressed={isEditing}
        aria-label={isEditing ? "Terminer la modification" : "Modifier l'ecran"}
      >
        <span aria-hidden="true">{isEditing ? "OK" : "ED"}</span>
        {isEditing ? "Terminer" : "Modifier"}
      </button>
      <button
        type="button"
        onClick={onResetLayout}
        aria-label="Reinitialiser l'ecran"
      >
        <span aria-hidden="true">RS</span>
        Reset
      </button>
    </nav>
  );
}
