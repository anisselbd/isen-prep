"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { numericDataSchema, type NumericAnswer } from "@/lib/exercise/types";
import type { Exercise } from "@/lib/exercise/types";

type Props = {
  exercise: Exercise;
  onSubmit: (answer: NumericAnswer) => void;
  disabled?: boolean;
};

export function NumericExercise({ exercise, onSubmit, disabled }: Props) {
  const parsed = numericDataSchema.safeParse(exercise.data);
  const [raw, setRaw] = useState("");

  if (!parsed.success) {
    return <p className="text-sm text-destructive">Exercice numérique corrompu.</p>;
  }

  function submit() {
    const v = parseFloat(raw.replace(",", "."));
    if (!Number.isFinite(v)) return;
    onSubmit({ value: v });
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="flex items-center gap-2">
        <Input
          type="text"
          inputMode="decimal"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="Ta réponse"
          disabled={disabled}
          className="max-w-xs font-mono"
          aria-label="Réponse numérique"
        />
        {parsed.data.unit ? (
          <span className="text-sm text-muted-foreground">{parsed.data.unit}</span>
        ) : null}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {parsed.data.tolerance
            ? `Tolérance : ±${parsed.data.tolerance}`
            : "Réponse exacte attendue"}
        </span>
        <Button size="sm" type="submit" disabled={disabled || raw.trim() === ""}>
          Valider
        </Button>
      </div>
    </form>
  );
}
