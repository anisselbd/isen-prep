"use client";

import { cn } from "@/lib/utils";

const BAND_LABELS: Record<number, string> = {
  0: "nuit",
  6: "matin",
  12: "après-midi",
  18: "soir",
};

export function HourlyActivity({ hours }: { hours: number[] }) {
  const total = hours.reduce((s, h) => s + h, 0);
  if (total === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucune activité encore. Les créneaux apparaîtront avec les tentatives.
      </p>
    );
  }
  const max = hours.reduce((m, h) => Math.max(m, h), 0);
  const peakHour = hours.indexOf(max);
  const peakLabel = `${String(peakHour).padStart(2, "0")} h`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end gap-[2px]" style={{ height: 88 }}>
        {hours.map((count, h) => {
          const ratio = max === 0 ? 0 : count / max;
          const isPeak = h === peakHour && count > 0;
          return (
            <div
              key={h}
              title={`${String(h).padStart(2, "0")}h — ${count}`}
              className="flex flex-1 flex-col justify-end"
            >
              <div
                className={cn(
                  "w-full rounded-sm transition-colors",
                  count === 0 && "bg-muted",
                  count > 0 && !isPeak && "bg-primary/60",
                  isPeak && "bg-primary",
                )}
                style={{ height: `${Math.max(2, ratio * 84)}px` }}
              />
            </div>
          );
        })}
      </div>
      <div className="relative flex text-[10px] text-muted-foreground">
        {[0, 6, 12, 18].map((h) => (
          <div
            key={h}
            className="flex-1 text-left"
            style={{ marginLeft: h === 0 ? 0 : undefined }}
          >
            <span className="block">{String(h).padStart(2, "0")}h</span>
            <span className="block text-[9px] opacity-70">
              {BAND_LABELS[h]}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Pic à <span className="font-medium text-foreground">{peakLabel}</span> · {max}{" "}
        tentative{max > 1 ? "s" : ""}.
      </p>
    </div>
  );
}
