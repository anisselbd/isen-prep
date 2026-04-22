"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { circuitDataSchema, type CircuitAnswer } from "@/lib/exercise/types";
import type { Exercise } from "@/lib/exercise/types";

type Props = {
  exercise: Exercise;
  onSubmit: (answer: CircuitAnswer) => void;
  disabled?: boolean;
};

export function CircuitExercise({ exercise, onSubmit, disabled }: Props) {
  const parsed = circuitDataSchema.safeParse(exercise.data);
  const [raw, setRaw] = useState("");

  if (!parsed.success) {
    return <p className="text-sm text-destructive">Exercice circuit corrompu.</p>;
  }

  const { components, configuration, tolerance } = parsed.data;

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const v = parseFloat(raw.replace(",", "."));
        if (Number.isFinite(v)) onSubmit({ value: v });
      }}
    >
      <div className="rounded-md border bg-muted/30 p-3">
        <p className="mb-2 text-xs text-muted-foreground">
          Configuration : <span className="font-medium text-foreground">{configuration === "series" ? "série" : "parallèle"}</span>
        </p>
        <ul className="flex flex-wrap gap-2 font-mono text-sm">
          {components.map((c, i) => (
            <li key={i} className="rounded bg-background px-2 py-1 shadow-sm">
              {c.label} = {c.value} Ω
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium" htmlFor="circuit-req">
          R<sub>éq</sub> =
        </label>
        <Input
          id="circuit-req"
          type="text"
          inputMode="decimal"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          disabled={disabled}
          className="max-w-xs font-mono"
          placeholder="valeur en Ω"
        />
        <span className="text-sm text-muted-foreground">Ω</span>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Tolérance : ±{tolerance} Ω</span>
        <Button size="sm" type="submit" disabled={disabled || raw.trim() === ""}>
          Valider
        </Button>
      </div>
    </form>
  );
}
