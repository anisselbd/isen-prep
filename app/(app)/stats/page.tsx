import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  Clock,
  Layers,
  MessageSquare,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { ActivityHeatmap } from "@/components/stats/activity-heatmap";
import { HourlyActivity } from "@/components/stats/hourly-activity";
import { SubjectMasteryBars } from "@/components/stats/subject-mastery-bars";

export const metadata: Metadata = { title: "Stats · ISEN PREP" };

const DAYS = 90;

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r === 0 ? `${h} h` : `${h} h ${r}`;
}

export default async function StatsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Stats</h1>
        <p className="text-sm text-muted-foreground">
          Connecte-toi pour voir tes statistiques.
        </p>
      </div>
    );
  }

  const sinceIso = new Date(
    Date.now() - DAYS * 86_400_000,
  ).toISOString();

  const [attemptsRes, reviewsRes, sessionsRes, subjectsRes, topicsRes, masteryRes] =
    await Promise.all([
      supabase
        .from("attempts")
        .select("id, exercise_id, is_correct, time_seconds, created_at")
        .eq("user_id", user.id)
        .gte("created_at", sinceIso),
      supabase
        .from("review_states")
        .select("repetitions, last_reviewed_at")
        .eq("user_id", user.id),
      supabase
        .from("interview_sessions")
        .select("id, started_at, ended_at")
        .eq("user_id", user.id),
      supabase
        .from("subjects")
        .select("id, name, color, order_index")
        .order("order_index"),
      supabase.from("topics").select("id, subject_id, name"),
      supabase
        .from("mastery")
        .select("topic_id, score, confidence")
        .eq("user_id", user.id),
    ]);

  const attempts = attemptsRes.data ?? [];
  const reviews = reviewsRes.data ?? [];
  const sessions = sessionsRes.data ?? [];
  const subjects = subjectsRes.data ?? [];
  const topics = topicsRes.data ?? [];
  const mastery = masteryRes.data ?? [];

  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((a) => a.is_correct).length;
  const accuracy =
    totalAttempts === 0 ? 0 : Math.round((correctAttempts / totalAttempts) * 100);
  const totalStudySeconds = attempts.reduce(
    (sum, a) => sum + (a.time_seconds ?? 0),
    0,
  );
  const reviewsDone = reviews.reduce((sum, r) => sum + (r.repetitions ?? 0), 0);

  const interviewSeconds = sessions.reduce((sum, s) => {
    if (!s.started_at || !s.ended_at) return sum;
    const d = new Date(s.ended_at).getTime() - new Date(s.started_at).getTime();
    return sum + Math.max(0, Math.floor(d / 1000));
  }, 0);

  // Activity heatmap: count attempts per day over last DAYS days.
  const byDay = new Map<string, number>();
  for (const a of attempts) {
    const d = new Date(a.created_at).toISOString().slice(0, 10);
    byDay.set(d, (byDay.get(d) ?? 0) + 1);
  }
  const heatmapDays: { date: string; count: number }[] = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
    heatmapDays.push({ date: d, count: byDay.get(d) ?? 0 });
  }

  // Activity by hour: bucket attempts into 0..23.
  const hourBuckets = new Array<number>(24).fill(0);
  for (const a of attempts) {
    const h = new Date(a.created_at).getHours();
    hourBuckets[h] = (hourBuckets[h] ?? 0) + 1;
  }

  // Mastery by subject (only topics with confidence > 0).
  const masteryByTopic = new Map(mastery.map((m) => [m.topic_id, m]));
  const topicById = new Map(topics.map((t) => [t.id, t]));
  const subjectStats = subjects.map((s) => {
    const subjectTopics = topics.filter((t) => t.subject_id === s.id);
    const scored = subjectTopics
      .map((t) => masteryByTopic.get(t.id))
      .filter((m): m is NonNullable<typeof m> => !!m && m.confidence > 0);
    const avg =
      scored.length === 0
        ? 0
        : scored.reduce((acc, m) => acc + m.score, 0) / scored.length;
    return {
      id: s.id,
      name: s.name,
      color: s.color,
      avg,
      touched: scored.length,
      total: subjectTopics.length,
    };
  });

  // Top strong / weak topics.
  const enrichedMastery = mastery
    .filter((m) => m.confidence > 0)
    .map((m) => {
      const t = topicById.get(m.topic_id);
      return t
        ? {
            topic_id: m.topic_id,
            topic_name: t.name,
            subject_id: t.subject_id,
            score: m.score,
          }
        : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  const strong = [...enrichedMastery].sort((a, b) => b.score - a.score).slice(0, 5);
  const weak = [...enrichedMastery].sort((a, b) => a.score - b.score).slice(0, 5);

  const overview = [
    {
      icon: Target,
      label: `${DAYS} j`,
      value: `${accuracy}%`,
      hint: `${correctAttempts}/${totalAttempts} réussies`,
    },
    {
      icon: Clock,
      label: "Temps étudié",
      value: formatDuration(totalStudySeconds),
      hint: `${DAYS} derniers jours`,
    },
    {
      icon: Layers,
      label: "Cartes révisées",
      value: String(reviewsDone),
      hint: "cumul SM-2",
    },
    {
      icon: MessageSquare,
      label: "Entretiens",
      value: String(sessions.length),
      hint: interviewSeconds > 0 ? formatDuration(interviewSeconds) : "aucun encore",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Stats</h1>
        <p className="text-sm text-muted-foreground">
          Tes {DAYS} derniers jours, en chiffres.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {overview.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                <Icon className="size-4 text-muted-foreground" />
                <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold tabular-nums">
                  {s.value}
                </div>
                <p className="text-xs text-muted-foreground">{s.hint}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-muted-foreground" />
            <CardTitle>Heatmap d&apos;activité</CardTitle>
          </div>
          <CardDescription>
            Une case par jour sur les {DAYS} derniers. Plus c&apos;est dense, plus tu
            as été régulier.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityHeatmap days={heatmapDays} />
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Maîtrise par matière</CardTitle>
            <CardDescription>
              Moyenne des topics pratiqués (confidence &gt; 0).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubjectMasteryBars subjects={subjectStats} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Créneaux d&apos;étude</CardTitle>
            <CardDescription>
              À quelle heure tu pratiques le plus sur les {DAYS} derniers jours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HourlyActivity hours={hourBuckets} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <TrendingUp className="size-4 text-emerald-500" />
            <CardTitle>Points forts</CardTitle>
          </CardHeader>
          <CardContent>
            {strong.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Pas encore assez de données.
              </p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {strong.map((t) => (
                  <li key={t.topic_id}>
                    <Link
                      href={`/subjects/${t.subject_id}/${t.topic_id}`}
                      className={cn(
                        "flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm hover:bg-accent/40",
                      )}
                    >
                      <span className="truncate">{t.topic_name}</span>
                      <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-xs text-emerald-600 dark:text-emerald-400">
                        {Math.round(t.score * 100)}%
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <TrendingDown className="size-4 text-destructive" />
            <CardTitle>À retravailler</CardTitle>
          </CardHeader>
          <CardContent>
            {weak.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Pas encore assez de données.
              </p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {weak.map((t) => (
                  <li key={t.topic_id}>
                    <Link
                      href={`/subjects/${t.subject_id}/${t.topic_id}/practice`}
                      className={cn(
                        "flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm hover:bg-accent/40",
                      )}
                    >
                      <span className="truncate">{t.topic_name}</span>
                      <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 font-mono text-xs text-destructive">
                        {Math.round(t.score * 100)}%
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      {totalAttempts === 0 && (
        <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
          <p className="mb-3">
            Pas encore d&apos;activité sur les {DAYS} derniers jours.
          </p>
          <Link
            href="/quiz"
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Commencer par le quiz
          </Link>
        </div>
      )}
    </div>
  );
}
