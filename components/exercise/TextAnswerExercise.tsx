"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { textDataSchema, type TextAnswer } from "@/lib/exercise/types";
import type { Exercise } from "@/lib/exercise/types";
import { isGeminiConfigured } from "@/lib/env";

type Props = {
  exercise: Exercise;
  onSubmit: (answer: TextAnswer) => void;
  disabled?: boolean;
};

export function TextAnswerExercise({ exercise, onSubmit, disabled }: Props) {
  const parsed = textDataSchema.safeParse(exercise.data);
  const [text, setText] = useState("");

  if (!parsed.success) {
    return <p className="text-sm text-destructive">Exercice texte corrompu.</p>;
  }

  const maxChars = parsed.data.max_chars ?? 1500;
  const remaining = maxChars - text.length;
  const geminiOk = isGeminiConfigured();

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (text.trim()) onSubmit({ text });
      }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, maxChars))}
        placeholder="Rédige ta réponse…"
        disabled={disabled}
        rows={6}
        className="w-full rounded-md border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Réponse libre"
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {!geminiOk
            ? "Gemini non configurée — correction IA indisponible"
            : `${remaining} caractères restants · correction par IA`}
        </span>
        <Button size="sm" type="submit" disabled={disabled || text.trim() === "" || !geminiOk}>
          Envoyer pour correction
        </Button>
      </div>
    </form>
  );
}
