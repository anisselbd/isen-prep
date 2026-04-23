import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadDashboardData } from "@/lib/dashboard/server";

export const metadata: Metadata = { title: "Révision ciblée · ISEN PREP" };

export default async function ReviewPage() {
  const data = await loadDashboardData();
  if (!data) return null;

  const weak = data.weak_points;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Révision ciblée</h1>
        <p className="text-sm text-muted-foreground">
          Les 3 topics où ta maîtrise est la plus basse. Attaque-les d&apos;abord.
        </p>
      </header>

      {weak.length === 0 ? (
        <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
          Pas encore assez de données. Commence par une session de pratique pour que l&apos;algorithme identifie tes points faibles.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {weak.map((w) => (
            <li key={w.topic_id}>
              <Card>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-base">{w.topic_name}</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Topic <code className="font-mono">{w.topic_id}</code>
                    </p>
                  </div>
                  <Badge variant="destructive" className="font-mono">
                    {Math.round(w.score * 100)}%
                  </Badge>
                </CardHeader>
                <CardContent className="flex items-center gap-2 pt-0">
                  <Link
                    href={`/subjects/${w.subject_id}/${w.topic_id}/flashcards`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    Flashcards
                  </Link>
                  <Link
                    href={`/subjects/${w.subject_id}/${w.topic_id}/practice`}
                    className={buttonVariants({ size: "sm" })}
                  >
                    Pratiquer
                    <ArrowRight className="size-4" />
                  </Link>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
