import Link from "next/link";
import type { SubjectMastery } from "@/lib/dashboard/server";
import { cn } from "@/lib/utils";

function cellClass(score: number, confidence: number): string {
  if (confidence === 0) return "bg-muted/30";
  if (score < 0.4) return "bg-red-500/70";
  if (score < 0.7) return "bg-amber-400/80";
  return "bg-emerald-500/80";
}

export function MasteryHeatmap({ subjects }: { subjects: SubjectMastery[] }) {
  return (
    <div className="flex flex-col gap-3">
      {subjects.map((subject) => (
        <div key={subject.id} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-2 rounded-full"
                style={{ backgroundColor: subject.color ?? "var(--primary)" }}
              />
              <span className="text-sm font-medium">{subject.name}</span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {Math.round(subject.avg_score * 100)}%
            </span>
          </div>
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${Math.max(
                subject.topics.length,
                1
              )}, minmax(16px, 1fr))`,
            }}
          >
            {subject.topics.map((t) => (
              <Link
                key={t.id}
                href={`/subjects/${subject.id}/${t.id}`}
                title={`${t.name} — ${Math.round(t.score * 100)}% (${t.confidence} tentatives)`}
                className={cn(
                  "h-6 rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  cellClass(t.score, t.confidence)
                )}
              >
                <span className="sr-only">
                  {t.name} — {Math.round(t.score * 100)}%
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
      <div className="flex items-center justify-end gap-3 pt-1 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-sm bg-muted/30" /> Non testé
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-sm bg-red-500/70" /> 0-40%
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-sm bg-amber-400/80" /> 40-70%
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-sm bg-emerald-500/80" /> 70%+
        </span>
      </div>
    </div>
  );
}
