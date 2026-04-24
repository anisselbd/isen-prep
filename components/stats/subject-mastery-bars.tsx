"use client";

type SubjectStat = {
  id: string;
  name: string;
  color: string | null;
  avg: number;
  touched: number;
  total: number;
};

export function SubjectMasteryBars({ subjects }: { subjects: SubjectStat[] }) {
  if (subjects.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Aucune matière à afficher.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {subjects.map((s) => {
        const pct = Math.round(s.avg * 100);
        return (
          <li key={s.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: s.color ?? "currentColor" }}
                />
                {s.name}
              </span>
              <span className="font-mono tabular-nums text-muted-foreground">
                {s.touched}/{s.total} · {pct}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  backgroundColor: s.color ?? undefined,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
