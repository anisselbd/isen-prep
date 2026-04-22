"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mcqDataSchema, type MCQAnswer } from "@/lib/exercise/types";
import type { Exercise } from "@/lib/exercise/types";

type Props = {
  exercise: Exercise;
  onSubmit: (answer: MCQAnswer) => void;
  disabled?: boolean;
};

export function MCQExercise({ exercise, onSubmit, disabled }: Props) {
  const parsed = mcqDataSchema.safeParse(exercise.data);
  const [selected, setSelected] = useState<number[]>([]);

  const multiple = parsed.success && parsed.data.multiple === true;

  useEffect(() => {
    if (disabled) return;
    const handler = (e: KeyboardEvent) => {
      if (!parsed.success) return;
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= parsed.data.choices.length) {
        e.preventDefault();
        toggle(n - 1);
      } else if (e.key === "Enter" && selected.length > 0) {
        e.preventDefault();
        onSubmit({ selected });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, selected, parsed.success]);

  if (!parsed.success) {
    return <p className="text-sm text-destructive">Exercice MCQ corrompu.</p>;
  }

  function toggle(i: number) {
    setSelected((prev) => {
      if (multiple) {
        return prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i].sort();
      }
      return [i];
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {parsed.data.choices.map((choice, i) => {
          const isSelected = selected.includes(i);
          return (
            <li key={i}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => toggle(i)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-accent/40",
                  disabled && "cursor-not-allowed opacity-70"
                )}
                aria-pressed={isSelected}
              >
                <span className="font-mono text-xs text-muted-foreground">{i + 1}</span>
                <span className="flex-1 text-sm">{choice}</span>
                {isSelected ? (
                  <span className="size-2 rounded-full bg-primary" aria-hidden />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
        <span>{multiple ? "Plusieurs réponses possibles · touches 1-9" : "Une seule réponse · touches 1-9"}</span>
        <Button
          size="sm"
          type="button"
          disabled={disabled || selected.length === 0}
          onClick={() => onSubmit({ selected })}
        >
          Valider (Entrée)
        </Button>
      </div>
    </div>
  );
}
