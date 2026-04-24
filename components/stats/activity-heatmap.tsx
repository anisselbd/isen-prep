"use client";

import { cn } from "@/lib/utils";

const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];
const MONTH_LABELS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

type Day = { date: string; count: number };

function intensityClass(count: number, max: number): string {
  if (count === 0) return "bg-muted";
  if (max === 0) return "bg-muted";
  const ratio = count / max;
  if (ratio < 0.25) return "bg-primary/20";
  if (ratio < 0.5) return "bg-primary/40";
  if (ratio < 0.75) return "bg-primary/60";
  return "bg-primary";
}

export function ActivityHeatmap({ days }: { days: Day[] }) {
  if (days.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucune activité à afficher.
      </p>
    );
  }

  const max = days.reduce((m, d) => Math.max(m, d.count), 0);

  // Group by week (Monday start) to build a grid of 7 rows × weeks columns.
  // Align first column so weeks always start on Monday.
  const firstDate = new Date(days[0]!.date);
  const firstDow = (firstDate.getDay() + 6) % 7; // Mon=0..Sun=6
  const padded: (Day | null)[] = [
    ...new Array<Day | null>(firstDow).fill(null),
    ...days,
  ];
  while (padded.length % 7 !== 0) padded.push(null);

  const weekCount = padded.length / 7;

  // Build month label columns (show label only at the week where month changes).
  const monthByWeek = new Array<string | null>(weekCount).fill(null);
  let prevMonth = -1;
  for (let w = 0; w < weekCount; w++) {
    const cell = padded[w * 7];
    if (!cell) continue;
    const m = new Date(cell.date).getMonth();
    if (m !== prevMonth) {
      monthByWeek[w] = MONTH_LABELS[m] ?? null;
      prevMonth = m;
    }
  }

  const totalDays = days.filter((d) => d.count > 0).length;
  const totalAttempts = days.reduce((s, d) => s + d.count, 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-x-auto">
        <div className="inline-block">
          <div
            className="ml-6 grid gap-[3px]"
            style={{
              gridTemplateColumns: `repeat(${weekCount}, 10px)`,
            }}
          >
            {monthByWeek.map((label, i) => (
              <div
                key={i}
                className="h-3 text-[9px] leading-none text-muted-foreground"
              >
                {label ?? ""}
              </div>
            ))}
          </div>
          <div className="flex gap-[3px]">
            <div className="flex w-5 flex-col gap-[3px] pt-[2px]">
              {DAY_LABELS.map((d, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-[10px] text-[8px] leading-none text-muted-foreground",
                    i % 2 === 0 ? "opacity-100" : "opacity-0",
                  )}
                >
                  {d}
                </div>
              ))}
            </div>
            <div
              className="grid gap-[3px]"
              style={{
                gridTemplateColumns: `repeat(${weekCount}, 10px)`,
                gridAutoFlow: "column",
                gridTemplateRows: "repeat(7, 10px)",
              }}
            >
              {padded.map((d, i) =>
                d === null ? (
                  <div key={i} className="size-[10px]" aria-hidden />
                ) : (
                  <div
                    key={i}
                    title={`${d.date} — ${d.count} tentative${d.count > 1 ? "s" : ""}`}
                    className={cn(
                      "size-[10px] rounded-[2px]",
                      intensityClass(d.count, max),
                    )}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <span>
          {totalDays} jour{totalDays > 1 ? "s" : ""} actif{totalDays > 1 ? "s" : ""} ·{" "}
          {totalAttempts} tentative{totalAttempts > 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-1">
          <span>moins</span>
          <div className="size-[10px] rounded-[2px] bg-muted" />
          <div className="size-[10px] rounded-[2px] bg-primary/20" />
          <div className="size-[10px] rounded-[2px] bg-primary/40" />
          <div className="size-[10px] rounded-[2px] bg-primary/60" />
          <div className="size-[10px] rounded-[2px] bg-primary" />
          <span>plus</span>
        </div>
      </div>
    </div>
  );
}
