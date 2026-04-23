import Link from "next/link";
import { BookOpenCheck, CalendarClock, MessageSquareHeart, Target } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { selectDueFlashcardIds } from "@/lib/flashcards/due";

export async function StatsSection() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileRes, masteryRes, flashcardsRes, statesRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("target_interview_date")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("mastery")
      .select("score, confidence, topic_id")
      .eq("user_id", user.id),
    supabase.from("flashcards").select("id, topic_id"),
    supabase
      .from("review_states")
      .select("flashcard_id, next_review_at")
      .eq("user_id", user.id),
  ]);

  const { data: topics } = await supabase
    .from("topics")
    .select("id, subject_id");

  const targetDate = profileRes.data?.target_interview_date ?? null;
  const daysLeft = targetDate
    ? Math.ceil((new Date(targetDate).getTime() - Date.now()) / 86_400_000)
    : null;

  const dueCount = selectDueFlashcardIds(
    flashcardsRes.data ?? [],
    statesRes.data ?? [],
  ).length;

  // Global mastery avg: weighted by subject (each subject's avg, then mean).
  const mastery = masteryRes.data ?? [];
  const bySubject = new Map<string, { sum: number; n: number }>();
  for (const m of mastery) {
    if (m.confidence === 0) continue;
    const topic = (topics ?? []).find((t) => t.id === m.topic_id);
    if (!topic) continue;
    const cur = bySubject.get(topic.subject_id) ?? { sum: 0, n: 0 };
    cur.sum += m.score;
    cur.n += 1;
    bySubject.set(topic.subject_id, cur);
  }
  const subjectAvgs = [...bySubject.values()].map((v) => v.sum / v.n);
  const globalAvg =
    subjectAvgs.length === 0
      ? 0
      : subjectAvgs.reduce((a, b) => a + b, 0) / subjectAvgs.length;

  return (
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
              <p className="text-xs text-muted-foreground">{targetDate}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
          <BookOpenCheck className="size-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">
            À réviser aujourd&apos;hui
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold tabular-nums">{dueCount}</div>
          <p className="text-xs text-muted-foreground">
            flashcard{dueCount !== 1 ? "s" : ""} due{dueCount !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
          <Target className="size-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Maîtrise globale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold tabular-nums">
            {Math.round(globalAvg * 100)}%
          </div>
          <p className="text-xs text-muted-foreground">
            moyenne sur {subjectAvgs.length || 4} matière{subjectAvgs.length > 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
          <MessageSquareHeart className="size-4 text-primary" />
          <CardTitle className="text-sm font-medium">
            Simulation d&apos;entretien
          </CardTitle>
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
  );
}

export function StatsSectionSkeleton() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
      ))}
    </section>
  );
}
