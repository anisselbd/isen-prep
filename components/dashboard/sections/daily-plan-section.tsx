import Link from "next/link";
import { Flame, BookOpen, Target as TargetIcon, Layers } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

type PlanTopic = {
  topic_id: string;
  topic_name: string;
  subject_id: string;
  subject_name: string;
  score: number;
  confidence: number;
  cir_importance: number;
};

type Phase = {
  label: string;
  tone: "neutral" | "warm" | "hot" | "final" | "past";
  message: string;
};

function phaseForDaysLeft(daysLeft: number | null): Phase {
  if (daysLeft === null) {
    return {
      label: "Phase préparation",
      tone: "neutral",
      message:
        "Renseigne la date de ton entretien pour activer le compte à rebours.",
    };
  }
  if (daysLeft < 0) {
    return {
      label: "Après l'entretien",
      tone: "past",
      message: "Continue à consolider ce que tu sais le moins.",
    };
  }
  if (daysLeft === 0) {
    return {
      label: "Jour J",
      tone: "final",
      message: "Respire, relis les fiches, tu sais ce que tu as révisé.",
    };
  }
  if (daysLeft <= 3) {
    return {
      label: "Sprint final",
      tone: "final",
      message: "Répète en flashcards, pas de nouveau contenu lourd.",
    };
  }
  if (daysLeft <= 7) {
    return {
      label: "Dernière ligne droite",
      tone: "hot",
      message: "Simulations + points faibles. C'est la semaine décisive.",
    };
  }
  if (daysLeft <= 14) {
    return {
      label: "Consolidation",
      tone: "warm",
      message: "Approfondis chaque topic et teste-toi régulièrement.",
    };
  }
  return {
    label: "Apprentissage",
    tone: "neutral",
    message: "Construis les bases topic par topic, sans pression.",
  };
}

function priorityScore(t: PlanTopic): number {
  // Un topic jamais touché (confidence 0) compte comme mastery 0 : priorité
  // basée uniquement sur l'importance CIR.
  const mastery = t.confidence === 0 ? 0 : t.score;
  const importance = (t.cir_importance ?? 3) / 5;
  return (1 - mastery) * (0.4 + 0.6 * importance);
}

export async function DailyPlanSection() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileRes, topicsRes, subjectsRes, masteryRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("target_interview_date")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("topics")
      .select("id, subject_id, name, cir_importance"),
    supabase.from("subjects").select("id, name"),
    supabase
      .from("mastery")
      .select("topic_id, score, confidence")
      .eq("user_id", user.id),
  ]);

  const targetDate = profileRes.data?.target_interview_date ?? null;
  const daysLeft = targetDate
    ? Math.ceil((new Date(targetDate).getTime() - Date.now()) / 86_400_000)
    : null;
  const phase = phaseForDaysLeft(daysLeft);

  const subjectById = new Map(
    (subjectsRes.data ?? []).map((s) => [s.id, s.name]),
  );
  const masteryByTopic = new Map(
    (masteryRes.data ?? []).map((m) => [
      m.topic_id,
      { score: m.score, confidence: m.confidence },
    ]),
  );

  const plan: PlanTopic[] = (topicsRes.data ?? []).map((t) => {
    const m = masteryByTopic.get(t.id);
    return {
      topic_id: t.id,
      topic_name: t.name,
      subject_id: t.subject_id,
      subject_name: subjectById.get(t.subject_id) ?? t.subject_id,
      score: m?.score ?? 0,
      confidence: m?.confidence ?? 0,
      cir_importance: t.cir_importance ?? 3,
    };
  });

  const topPlan = plan
    .map((t) => ({ t, p: priorityScore(t) }))
    .sort((a, b) => b.p - a.p || a.t.topic_name.localeCompare(b.t.topic_name))
    .slice(0, 4)
    .map((x) => x.t);

  const toneClass = {
    neutral: "border-border bg-card",
    warm: "border-amber-500/30 bg-amber-500/5",
    hot: "border-orange-500/40 bg-orange-500/10",
    final: "border-primary/50 bg-primary/10",
    past: "border-muted bg-muted/40",
  }[phase.tone];

  return (
    <section className="flex flex-col gap-3">
      <div
        className={cn(
          "flex flex-col gap-1 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
          toneClass,
        )}
      >
        <div className="flex items-center gap-3">
          <Flame
            className={cn(
              "size-5 shrink-0",
              phase.tone === "final" && "text-primary",
              phase.tone === "hot" && "text-orange-500",
              phase.tone === "warm" && "text-amber-500",
              phase.tone === "neutral" && "text-muted-foreground",
              phase.tone === "past" && "text-muted-foreground",
            )}
          />
          <div className="flex flex-col">
            <p className="text-sm font-semibold">
              Plan du jour · {phase.label}
            </p>
            <p className="text-xs text-muted-foreground">{phase.message}</p>
          </div>
        </div>
        {daysLeft !== null && daysLeft >= 0 && (
          <div className="text-right">
            <div className="text-2xl font-bold tabular-nums leading-none">
              J-{daysLeft}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {daysLeft === 0 ? "aujourd'hui" : `jour${daysLeft > 1 ? "s" : ""} restant${daysLeft > 1 ? "s" : ""}`}
            </div>
          </div>
        )}
      </div>

      {topPlan.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-sm text-muted-foreground">
            Aucun topic disponible. Vérifie le seed.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {topPlan.map((t) => {
            const pct =
              t.confidence === 0 ? null : Math.round(t.score * 100);
            return (
              <Card key={t.topic_id} className="flex flex-col gap-3">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {t.subject_name}
                      </p>
                      <CardTitle className="text-base leading-tight">
                        {t.topic_name}
                      </CardTitle>
                    </div>
                    <div
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-mono",
                        pct === null && "bg-muted text-muted-foreground",
                        pct !== null &&
                          pct < 40 &&
                          "bg-destructive/10 text-destructive",
                        pct !== null &&
                          pct >= 40 &&
                          pct < 70 &&
                          "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                        pct !== null &&
                          pct >= 70 &&
                          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                      )}
                    >
                      {pct === null ? "neuf" : `${pct}%`}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-1.5 pt-0">
                  <Link
                    href={`/subjects/${t.subject_id}/${t.topic_id}/lesson`}
                    className={cn(
                      buttonVariants({ size: "sm", variant: "outline" }),
                      "justify-start gap-2",
                    )}
                  >
                    <BookOpen className="size-3.5" />
                    Leçon
                  </Link>
                  <Link
                    href={`/subjects/${t.subject_id}/${t.topic_id}/practice`}
                    className={cn(
                      buttonVariants({ size: "sm", variant: "outline" }),
                      "justify-start gap-2",
                    )}
                  >
                    <TargetIcon className="size-3.5" />
                    Quiz
                  </Link>
                  <Link
                    href={`/subjects/${t.subject_id}/${t.topic_id}/flashcards`}
                    className={cn(
                      buttonVariants({ size: "sm", variant: "outline" }),
                      "justify-start gap-2",
                    )}
                  >
                    <Layers className="size-3.5" />
                    Flashcards
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function DailyPlanSectionSkeleton() {
  return (
    <section className="flex flex-col gap-3">
      <div className="h-16 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </section>
  );
}
