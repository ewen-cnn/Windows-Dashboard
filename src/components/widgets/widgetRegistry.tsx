import type { WidgetModule } from "../../types/widget";
import { useClock } from "../../hooks/useClock";
import { WeatherWidget } from "./WeatherWidget";

export function splitWidgetContent(content: string | undefined): string[] {
  return (content ?? "")
    .split(/[;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

type WidgetContentProps = {
  widget: WidgetModule;
};

function ServiceList({ items }: { items: string[] }) {
  return (
    <div className="service-list">
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  );
}

function ShortcutWidget({ items }: { items: string[] }) {
  return (
    <div className="control-grid">
      {items.slice(0, 4).map((shortcut) => (
        <button type="button" key={shortcut} aria-label={shortcut}>
          <span aria-hidden="true" />
          <b>{shortcut.slice(0, 2)}</b>
        </button>
      ))}
    </div>
  );
}

function CalendarWidget({ items }: { items: string[] }) {
  const clock = useClock();
  const [weekday, month, day] = clock.dateParts;

  return (
    <div className="date-widget">
      <span>{weekday} {month}</span>
      <strong>{day}</strong>
      <p>{items[0]}</p>
    </div>
  );
}

function WorldClockWidget({ items }: { items: string[] }) {
  return (
    <div className="world-clock-widget">
      {items.slice(0, 4).map((item) => {
        const parts = item.split(" ");
        const offset = parts[parts.length - 1] ?? "Today";
        const city = parts.slice(0, -1).join(" ");

        return (
          <div className="clock-face-card" key={item}>
            <span className="clock-face" aria-hidden="true">
              <i />
            </span>
            <b>{city}</b>
            <small>{offset ?? "Today"}</small>
          </div>
        );
      })}
    </div>
  );
}

function SpotifyWidget({ items }: { items: string[] }) {
  return (
    <div className="spotify-widget">
      <span className="album-art" aria-hidden="true" />
      <div>
        <b>{items[0]}</b>
        <p>{items[1]}</p>
        <small>{items[2]}</small>
      </div>
      <div className="player-controls" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function ObsidianWidget({ items }: { items: string[] }) {
  return (
    <div className="obsidian-widget">
      <b>Vault</b>
      {items.slice(0, 3).map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  );
}

function ProgressWidget({ items }: { items: string[] }) {
  return (
    <div className="progress-widget">
      {items.slice(0, 3).map((item, index) => (
        <p key={item}>
          <span style={{ width: `${86 - index * 18}%` }} />
          {item}
        </p>
      ))}
    </div>
  );
}

function CompactStatWidget({ items }: { items: string[] }) {
  return (
    <div className="compact-stat-widget">
      <strong>{items[0]}</strong>
      <p>{items[1]}</p>
      <small>{items[2]}</small>
    </div>
  );
}

export function WidgetContent({ widget }: WidgetContentProps) {
  const clock = useClock();
  const contentItems = splitWidgetContent(widget.content);

  switch (widget.type) {
    case "weather":
      return <WeatherWidget />;

    case "shortcuts":
      return <ShortcutWidget items={contentItems} />;

    case "calendar":
      return <CalendarWidget items={contentItems} />;

    case "worldClock":
      return <WorldClockWidget items={contentItems} />;

    case "spotify":
      return <SpotifyWidget items={contentItems} />;

    case "obsidian":
      return <ObsidianWidget items={contentItems} />;

    case "strava":
    case "health":
    case "stocks":
      return <ProgressWidget items={contentItems} />;

    case "battery":
    case "timer":
      return <CompactStatWidget items={contentItems} />;

    case "clock":
      return (
        <div className="clock-widget">
          <p>{clock.time}</p>
          <span>{clock.date}</span>
        </div>
      );

    case "tasks":
    case "reminders":
      return (
        <ul className="task-list">
          {contentItems.map((task) => (
            <li key={task}>
              <span aria-hidden="true" />
              {task}
            </li>
          ))}
        </ul>
      );

    case "photos":
      return (
        <div className="photos-widget" aria-label={widget.title}>
          <span />
          <span />
          <span />
          <p>{contentItems[0]}</p>
        </div>
      );

    case "website":
      return widget.url ? (
        <iframe
          className="website-frame"
          src={widget.url}
          title={widget.title}
        />
      ) : (
        <p>Aucune URL configuree.</p>
      );

    case "notes":
      return <p className="note-content">{widget.content}</p>;

    case "events":
    case "focus":
    case "music":
    case "system":
    case "news":
    case "files":
    case "gmail":
    case "github":
    case "notion":
    case "youtube":
    case "maps":
      return <ServiceList items={contentItems} />;

    default:
      return <p className="note-content">{widget.content}</p>;
  }
}
