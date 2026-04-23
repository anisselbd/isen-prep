"use client";

import { useMemo, useState, useTransition } from "react";
import { CheckCircle2, CircleHelp, Sparkles, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExerciseRenderer } from "@/components/exercise/ExerciseRenderer";
import { LessonRenderer } from "@/components/lesson/LessonRenderer";
import { gradeExercise, type GradeResult } from "@/lib/exercise/grading";
import { recordAttempt } from "@/lib/attempts/actions";
import type { Exercise } from "@/lib/exercise/types";
import type { ExerciseType } from "@/types/database";
import { cn } from "@/lib/utils";

type Props = {
  topicId: string;
  initialExercises: Exercise[];
  geminiConfigured: boolean;
};

type Outcome = { answer: unknown; result: GradeResult } | null;

const EXERCISE_TYPES: ExerciseType[] = [
  "mcq",
  "numeric",
  "formula",
  "text",
  "code",
  "circuit",
  "conversion",
  "ordering",
  "match_pairs",
];

export function PracticeClient({ topicId, initialExercises, geminiConfigured }: Props) {
  const [pool, setPool] = useState<Exercise[]>(() => shuffleInPlace([...initialExercises]));
  const [cursor, setCursor] = useState(0);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [difficulty, setDifficulty] = useState(2);
  const [streakCorrect, setStreakCorrect] = useState(0);
  const [streakWrong, setStreakWrong] = useState(0);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [generating, setGenerating] = useState(false);
  const [isPending, startTransition] = useTransition();

  const exercise = pool[cursor] ?? null;

  const adaptiveHint = useMemo(() => {
    if (streakCorrect >= 3) return "Bien — difficulté ↑ au prochain exo.";
    if (streakWrong >= 2) return "On redescend d'un cran au prochain exo.";
    return null;
  }, [streakCorrect, streakWrong]);

  function onSubmit(answer: unknown) {
    if (!exercise) return;
    const clientResult = gradeExercise(exercise.type, exercise.data, answer);
    setOutcome({ answer, result: clientResult });

    // Fire-and-forget server write; grading is re-run server-side.
    startTransition(async () => {
      await recordAttempt({ exerciseId: exercise.id, answer });
    });

    if (clientResult.status === "graded") {
      setStats((s) => ({
        correct: s.correct + (clientResult.is_correct ? 1 : 0),
        total: s.total + 1,
      }));
      if (clientResult.is_correct) {
        setStreakCorrect((n) => n + 1);
        setStreakWrong(0);
      } else {
        setStreakWrong((n) => n + 1);
        setStreakCorrect(0);
      }
    }
  }

  function onNext() {
    let nextDifficulty = difficulty;
    if (streakCorrect >= 3) {
      nextDifficulty = Math.min(5, difficulty + 1);
      setStreakCorrect(0);
    } else if (streakWrong >= 2) {
      nextDifficulty = Math.max(1, difficulty - 1);
      setStreakWrong(0);
    }
    setDifficulty(nextDifficulty);
    setOutcome(null);
    setCursor((c) => c + 1);
  }

  async function onGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/gemini/generate-exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic_id: topicId,
          difficulty,
          type: pickType(difficulty),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const { exercise: newEx } = await res.json();
      setPool((p) => [...p.slice(0, cursor + 1), newEx as Exercise, ...p.slice(cursor + 1)]);
      setCursor((c) => c + 1);
      setOutcome(null);
    } catch (e) {
      alert(`Génération impossible : ${e instanceof Error ? e.message : "erreur"}`);
    } finally {
      setGenerating(false);
    }
  }

  if (!exercise) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session terminée 🎯</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <p>
            {stats.correct} / {stats.total} bonnes réponses —{" "}
            {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}% de réussite.
          </p>
          {geminiConfigured ? (
            <Button onClick={onGenerate} disabled={generating} variant="outline">
              <Sparkles className="size-4" />
              {generating ? "Génération…" : "Générer un nouvel exercice"}
            </Button>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-base">
            Exercice {cursor + 1} — difficulté {exercise.difficulty}/5
          </CardTitle>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="font-mono text-[10px]">
              {exercise.type}
            </Badge>
            <span>
              Score session : {stats.correct}/{stats.total}
            </span>
            {adaptiveHint ? <span className="italic">{adaptiveHint}</span> : null}
          </div>
        </div>
        {geminiConfigured ? (
          <Button onClick={onGenerate} disabled={generating} variant="outline" size="sm">
            <Sparkles className="size-4" />
            {generating ? "…" : "Nouveau via IA"}
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-md border bg-background p-4">
          <LessonRenderer markdown={exercise.question_md} />
        </div>
        <ExerciseRenderer
          key={exercise.id}
          exercise={exercise}
          onSubmit={onSubmit}
          disabled={outcome !== null}
        />
        {outcome ? <ResultBlock exercise={exercise} result={outcome.result} pending={isPending} /> : null}
        {outcome ? (
          <div className="flex justify-end">
            <Button onClick={onNext}>Suivant →</Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ResultBlock({
  exercise,
  result,
  pending,
}: {
  exercise: Exercise;
  result: GradeResult;
  pending: boolean;
}) {
  let icon: React.ReactNode;
  let tone: string;
  let headline: string;
  if (result.status === "invalid") {
    icon = <XCircle className="size-5 text-destructive" />;
    tone = "border-destructive/30 bg-destructive/5";
    headline = `Réponse invalide : ${result.reason}`;
  } else if (result.status === "pending_ai") {
    icon = <CircleHelp className="size-5 text-muted-foreground" />;
    tone = "border-muted bg-muted/30";
    headline = "Réponse envoyée — correction IA à venir.";
  } else if (result.is_correct) {
    icon = <CheckCircle2 className="size-5 text-emerald-600" />;
    tone = "border-emerald-300/60 bg-emerald-50/60 dark:border-emerald-900/40 dark:bg-emerald-950/30";
    headline = "Correct ✓";
  } else {
    icon = <XCircle className="size-5 text-destructive" />;
    tone = "border-destructive/30 bg-destructive/5";
    headline = "Incorrect";
  }
  return (
    <div className={cn("flex gap-3 rounded-md border p-4", tone)}>
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="flex-1 text-sm">
        <p className="font-medium">
          {headline} {pending ? <span className="text-xs text-muted-foreground">· enregistrement…</span> : null}
        </p>
        {exercise.explanation_md ? (
          <div className="mt-2 text-muted-foreground">
            <LessonRenderer markdown={exercise.explanation_md} />
          </div>
        ) : null}
        {exercise.colibrimo_connection ? (
          <p className="mt-2 text-xs italic text-muted-foreground">
            Colibrimo · {exercise.colibrimo_connection}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i] as T;
    arr[i] = arr[j] as T;
    arr[j] = tmp;
  }
  return arr;
}

function pickType(_difficulty: number): ExerciseType {
  // For now, generate mostly MCQ + numeric + formula (the most reliable types
  // to auto-generate). Weighted sample.
  const weighted: ExerciseType[] = [
    "mcq", "mcq", "mcq", "numeric", "numeric", "formula", "text",
  ];
  const idx = Math.floor(Math.random() * weighted.length);
  return (weighted[idx] ?? "mcq") as ExerciseType;
}
