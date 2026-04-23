import { Flame, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { StreakData } from "@/lib/streak/server";
import { DAILY_GOAL_ATTEMPTS, DAILY_GOAL_REVIEWS } from "@/lib/streak/server";

export function StreakCard({ data }: { data: StreakData }) {
  const { streak, today_attempts, today_reviews } = data;

  const attemptsPct = Math.min(
    100,
    Math.round((today_attempts / DAILY_GOAL_ATTEMPTS) * 100),
  );
  const reviewsPct = Math.min(
    100,
    Math.round((today_reviews / DAILY_GOAL_REVIEWS) * 100),
  );

  const streakLine = (() => {
    if (streak.current === 0 && streak.best === 0) {
      return "Pas encore de série. Commence aujourd'hui.";
    }
    if (streak.current === 0 && streak.active_yesterday) {
      return `Série interrompue. ${streak.best} jour${streak.best > 1 ? "s" : ""} au maximum.`;
    }
    if (streak.current === 0) {
      return `Série à 0. Meilleur : ${streak.best} jour${streak.best > 1 ? "s" : ""}.`;
    }
    const today = streak.active_today ? "actif aujourd'hui" : "pas encore aujourd'hui";
    return `Série en cours — ${today}. Meilleur historique : ${streak.best}.`;
  })();

  const goalsHit =
    today_attempts >= DAILY_GOAL_ATTEMPTS && today_reviews >= DAILY_GOAL_REVIEWS;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <Flame
          className={
            streak.current > 0
              ? "size-4 text-orange-500"
              : "size-4 text-muted-foreground"
          }
        />
        <div className="flex-1">
          <CardTitle>Série & objectifs</CardTitle>
          <CardDescription>{streakLine}</CardDescription>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-semibold tabular-nums">
            {streak.current}
          </span>
          <span className="text-xs text-muted-foreground">
            jour{streak.current > 1 ? "s" : ""}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Exercices aujourd&apos;hui</span>
            <span className="font-mono tabular-nums">
              {today_attempts} / {DAILY_GOAL_ATTEMPTS}
            </span>
          </div>
          <Progress value={attemptsPct} aria-label="Progression exercices du jour" />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Flashcards aujourd&apos;hui</span>
            <span className="font-mono tabular-nums">
              {today_reviews} / {DAILY_GOAL_REVIEWS}
            </span>
          </div>
          <Progress value={reviewsPct} aria-label="Progression flashcards du jour" />
        </div>
        {goalsHit ? (
          <p className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400">
            <Target className="size-3.5" />
            Objectif du jour atteint.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
