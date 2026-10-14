import { useEffect, useMemo, useState } from "react";

export function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return useMemo(() => {
    const weekday = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
    }).format(now);
    const month = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(now);
    const day = new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
    }).format(now);

    return {
      now,
      time: new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(now),
      date: new Intl.DateTimeFormat("fr-FR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      }).format(now),
      dateParts: [weekday, month, day] as const,
    };
  }, [now]);
}
