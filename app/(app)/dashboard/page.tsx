import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, BookOpenCheck, CalendarClock, MessageSquareHeart, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MasteryHeatmap } from "@/components/dashboard/MasteryHeatmap";
import { loadDashboardData } from "@/lib/dashboard/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard · ISEN PREP" };

export default async function DashboardPage() {
  const data = await loadDashboardData();
  if (!data) return null;

  const daysLeft = data.target_interview_date
    ? Math.ceil(
        (new Date(data.target_interview_date).getTime() - Date.now()) / 86_400_000
      )
    : null;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          Bonjour{data.display_name ? `, ${data.display_name}` : ""}.
        </h1>
        <p className="text-sm text-muted-foreground">
          Vue d&apos;ensemble de ta préparation à l&apos;entretien ISEN CIR.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
            <CalendarClock className="size-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Entretien</CardTitle>
          </CardHeader>
          <CardContent>
            {daysLeft === null ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">Date non définie</span>
                <Link
                  href="/settings"
                  className={buttonVariants({ size: "sm", variant: "outline" })}
                >
                  Définir la date
                </Link>
              </div>
            ) : daysLeft < 0 ? (
              <span className="text-sm text-muted-foreground">Entretien passé</span>
            ) : (
              <div>
                <div className="text-2xl font-semibold tabular-nums">
                  J-{daysLeft}
                </div>
                <p className="text-xs text-muted-foreground">
                  {data.target_interview_date}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
            <BookOpenCheck className="size-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">À réviser aujourd&apos;hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">
              {data.due_flashcards_today}
            </div>
            <p className="text-xs text-muted-foreground">flashcard{data.due_flashcards_today !== 1 ? "s" : ""} due{data.due_flashcards_today !== 1 ? "s" : ""}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
            <Target className="size-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Maîtrise globale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">
              {Math.round(
                (data.subjects.reduce((acc, s) => acc + s.avg_score, 0) /
                  Math.max(data.subjects.length, 1)) *
                  100
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">moyenne sur 4 matières</p>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
            <MessageSquareHeart className="size-4 text-primary" />
            <CardTitle className="text-sm font-medium">Simulation d&apos;entretien</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">
              Passe 10 min face à un jury virtuel.
            </p>
            <Link href="/interview" className={buttonVariants({ size: "sm" })}>
              Lancer
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Heatmap de maîtrise</CardTitle>
            <CardDescription>
              Clique un topic pour y aller directement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MasteryHeatmap subjects={data.subjects} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <AlertTriangle className="size-4 text-amber-500" />
            <CardTitle>Points faibles</CardTitle>
          </CardHeader>
          <CardContent>
            {data.weak_points.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Pas encore assez de données. Commence par une session de pratique.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {data.weak_points.map((wp) => (
                  <li key={wp.topic_id}>
                    <Link
                      href={`/subjects/${wp.subject_id}/${wp.topic_id}/practice`}
                      className={cn(
                        "flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm hover:bg-accent/40"
                      )}
                    >
                      <span className="flex-1 truncate">{wp.topic_name}</span>
                      <Badge variant="destructive" className="font-mono">
                        {Math.round(wp.score * 100)}%
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
