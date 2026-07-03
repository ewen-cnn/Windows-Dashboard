export type WidgetSize = "small" | "medium" | "large";

export type WidgetType =
  | "weather"
  | "calendar"
  | "events"
  | "tasks"
  | "notes"
  | "website"
  | "strava"
  | "spotify"
  | "obsidian"
  | "worldClock"
  | "reminders"
  | "gmail"
  | "github"
  | "notion"
  | "youtube"
  | "maps"
  | "battery"
  | "timer"
  | "health"
  | "stocks"
  | "clock"
  | "focus"
  | "music"
  | "system"
  | "shortcuts"
  | "news"
  | "photos"
  | "files";

export type WidgetAccent =
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "violet"
  | "slate";

export type WidgetCategory =
  | "today"
  | "productivity"
  | "media"
  | "system"
  | "web"
  | "health";

export type WidgetPrivacy = "local" | "online";

export type WidgetModule = {
  id: string;
  title: string;
  type: WidgetType;
  visible: boolean;
  size: WidgetSize;
  order: number;
  accent?: WidgetAccent;
  category: WidgetCategory;
  description?: string;
  glyph: string;
  privacy: WidgetPrivacy;
  service: string;
  content?: string;
  url?: string;
};
