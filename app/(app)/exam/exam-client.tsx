"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExerciseRenderer } from "@/components/exercise/ExerciseRenderer";
import { LessonRenderer } from "@/components/lesson/LessonRenderer";
import { Progress } from "@/components/ui/progress";
import { gradeExercise } from "@/lib/exercise/grading";
import type { Exercise } from "@/lib/exercise/types";
import { cn } from "@/lib/utils";

type Phase = "ready" | "running" | "ended";

export function ExamClient({
  exercises,
  durationSeconds,
}: {
  exercises: Exercise[];
  durationSeconds: number;
}) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<unknown[]>([]);
  const [startAt, setStartAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    if (phase !== "running" || !startAt) return;
    const h = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(h);
  }, [phase, startAt]);

  const remaining = startAt ? Math.max(0, durationSeconds - Math.floor((now - startAt) / 1000)) : durationSeconds;

  useEffect(() => {
    if (phase === "running" && remaining === 0) setPhase("ended");
  }, [phase, remaining]);

  const results = useMemo(() => {
    if (phase !== "ended") return null;
    const out = exercises.map((ex, i) =>
      gradeExercise(ex.type, ex.data, answers[i])
    );
    const correct = out.filter(
      (r) => r.status === "graded" && r.is_correct
    ).length;
    return { per: out, correct, total: exercises.length };
  }, [phase, exercises, answers]);

  if (phase === "ready") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prêt ?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <p>{exercises.length} questions, {Math.round(durationSeconds / 60)} minutes. Pas de feedback entre questions.</p>
          <Button
            onClick={() => {
              setPhase("running");
              setStartAt(Date.now());
            }}
            className="self-start"
          >
            Démarrer
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (phase === "ended" && results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Score : {results.correct}/{results.total} ({Math.round((results.correct / results.total) * 100)}%)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm">
          <Progress value={(results.correct / results.total) * 100} aria-label="Score final de l'examen" />
          <ul className="flex flex-col gap-3">
            {exercises.map((ex, i) => {
              const r = results.per[i];
              const ok = r?.status === "graded" && r.is_correct;
              return (
                <li
                  key={ex.id}
                  className={cn(
                    "rounded-md border p-3",
                    ok
                      ? "border-emerald-300/60 bg-emerald-50/60 dark:border-emerald-900/40 dark:bg-emerald-950/30"
                      : "border-destructive/30 bg-destructive/5"
                  )}
                >
                  <div className="text-xs text-muted-foreground">
                    Q{i + 1} · {ex.type} · diff {ex.difficulty}/5
                  </div>
                  <div className="mt-1">
                    <LessonRenderer markdown={ex.question_md} />
                  </div>
                  {ex.explanation_md ? (
                    <details className="mt-2 text-xs text-muted-foreground">
                      <summary className="cursor-pointer">Voir l&apos;explication</summary>
                      <div className="mt-2">
                        <LessonRenderer markdown={ex.explanation_md} />
                      </div>
                    </details>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    );
  }

  const current = exercises[index];
  if (!current) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">
          Question {index + 1}/{exercises.length}
        </CardTitle>
        <div className="flex items-center gap-2 rounded-md border px-2 py-1 font-mono text-sm">
          <Clock className="size-4" />
          {formatTime(remaining)}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Progress value={((index + 1) / exercises.length) * 100} aria-label="Progression examen" />
        <div className="rounded-md border bg-background p-4">
          <LessonRenderer markdown={current.question_md} />
        </div>
        <ExerciseRenderer
          key={current.id}
          exercise={current}
          onSubmit={(answer) => {
            setAnswers((prev) => {
              const next = [...prev];
              next[index] = answer;
              return next;
            });
            if (index + 1 >= exercises.length) setPhase("ended");
            else setIndex((i) => i + 1);
          }}
        />
      </CardContent>
    </Card>
  );
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
