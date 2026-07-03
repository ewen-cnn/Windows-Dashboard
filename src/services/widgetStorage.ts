import type { WidgetModule } from "../types/widget";

const STORAGE_KEY = "dashboard-widgets-phone-v1";

function normalizeOrders(widgets: WidgetModule[]): WidgetModule[] {
  return widgets
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((widget, index) => ({ ...widget, order: index + 1 }));
}

function mergeWithDefaults(
  storedWidgets: WidgetModule[],
  defaultWidgets: WidgetModule[]
): WidgetModule[] {
  const defaultsById = new Map(
    defaultWidgets.map((widget) => [widget.id, widget])
  );
  const storedIds = new Set(storedWidgets.map((widget) => widget.id));

  const restoredWidgets = storedWidgets.map((widget) => {
    const defaultWidget = defaultsById.get(widget.id);

    if (!defaultWidget) {
      return widget;
    }

    return {
      ...defaultWidget,
      visible: widget.visible,
      size: widget.size,
      order: widget.order,
      url: widget.url ?? defaultWidget.url,
    };
  });
  const missingWidgets = defaultWidgets.filter(
    (widget) => !storedIds.has(widget.id)
  );

  return normalizeOrders([
    ...restoredWidgets,
    ...structuredClone(missingWidgets),
  ]);
}

export function loadWidgets(defaultWidgets: WidgetModule[]): WidgetModule[] {
  const storedWidgets = localStorage.getItem(STORAGE_KEY);

  if (storedWidgets === null) {
    return normalizeOrders(structuredClone(defaultWidgets));
  }

  try {
    return mergeWithDefaults(
      JSON.parse(storedWidgets) as WidgetModule[],
      defaultWidgets
    );
  } catch (error) {
    console.error("Erreur lors du chargement des widgets :", error);
    return normalizeOrders(structuredClone(defaultWidgets));
  }
}

export function saveWidgets(widgets: WidgetModule[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
}

export function resetWidgets(defaultWidgets: WidgetModule[]): WidgetModule[] {
  localStorage.removeItem(STORAGE_KEY);
  return normalizeOrders(structuredClone(defaultWidgets));
}
