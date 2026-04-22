"use client";

// TODO: à supprimer en Phase 7 avec la route /dev/exercise-gallery.

import { useState } from "react";
import { CheckCircle2, CircleHelp, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExerciseRenderer } from "@/components/exercise/ExerciseRenderer";
import { LessonRenderer } from "@/components/lesson/LessonRenderer";
import { gradeExercise, type GradeResult } from "@/lib/exercise/grading";
import type { Exercise } from "@/lib/exercise/types";
import { cn } from "@/lib/utils";
import { GALLERY_FIXTURES } from "./fixtures";

const TYPE_LABEL: Record<Exercise["type"], string> = {
  mcq: "MCQ",
  numeric: "Numérique",
  formula: "Formule",
  text: "Réponse libre",
  code: "Code",
  circuit: "Circuit",
  conversion: "Conversion",
  ordering: "Mise en ordre",
  match_pairs: "Associations",
};

type State = { answer: unknown; result: GradeResult } | null;

export function GalleryClient() {
  const [selectedId, setSelectedId] = useState(GALLERY_FIXTURES[0]?.id ?? "");
  const [state, setState] = useState<State>(null);
  const exercise = GALLERY_FIXTURES.find((e) => e.id === selectedId);

  function onSelect(id: string) {
    setSelectedId(id);
    setState(null);
  }

  function onSubmit(answer: unknown) {
    if (!exercise) return;
    setState({ answer, result: gradeExercise(exercise.type, exercise.data, answer) });
  }

  return (
    <div className="grid min-h-[70vh] gap-6 lg:grid-cols-[220px_1fr]">
      <nav aria-label="Types d'exercice" className="flex flex-col gap-1">
        {GALLERY_FIXTURES.map((ex) => {
          const active = ex.id === selectedId;
          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => onSelect(ex.id)}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
                active ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
              )}
              aria-current={active ? "page" : undefined}
            >
              <span>{TYPE_LABEL[ex.type]}</span>
              <Badge variant="secondary" className="font-mono text-[10px]">
                {ex.type}
              </Badge>
            </button>
          );
        })}
      </nav>
      <section>
        {exercise ? (
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle className="text-base">
                  {TYPE_LABEL[exercise.type]} — difficulté {exercise.difficulty}/5
                </CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Topic : <code className="font-mono">{exercise.topic_id}</code>
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setState(null)}
                disabled={!state}
              >
                Réessayer
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="rounded-md border bg-background p-4">
                <LessonRenderer markdown={exercise.question_md} />
              </div>
              <ExerciseRenderer
                key={exercise.id}
                exercise={exercise}
                onSubmit={onSubmit}
                disabled={state !== null}
              />
              {state ? <ResultBlock exercise={exercise} result={state.result} /> : null}
            </CardContent>
          </Card>
        ) : null}
      </section>
    </div>
  );
}

function ResultBlock({ exercise, result }: { exercise: Exercise; result: GradeResult }) {
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
    headline = "Réponse envoyée — correction par IA à venir (Phase 5)";
  } else if (result.is_correct) {
    icon = <CheckCircle2 className="size-5 text-emerald-600" />;
    tone = "border-emerald-300/60 bg-emerald-50/60 dark:border-emerald-900/40 dark:bg-emerald-950/30";
    headline = `Correct ✓ (score ${result.score.toFixed(2)})`;
  } else {
    icon = <XCircle className="size-5 text-destructive" />;
    tone = "border-destructive/30 bg-destructive/5";
    headline = `Incorrect (score ${result.score.toFixed(2)})`;
  }

  return (
    <div className={cn("flex gap-3 rounded-md border p-4", tone)}>
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="flex-1 text-sm">
        <p className="font-medium">{headline}</p>
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
