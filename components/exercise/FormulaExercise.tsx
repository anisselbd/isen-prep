"use client";

import { useState } from "react";
import { InlineMath } from "react-katex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formulaDataSchema, type FormulaAnswer } from "@/lib/exercise/types";
import type { Exercise } from "@/lib/exercise/types";

type Props = {
  exercise: Exercise;
  onSubmit: (answer: FormulaAnswer) => void;
  disabled?: boolean;
};

export function FormulaExercise({ exercise, onSubmit, disabled }: Props) {
  const parsed = formulaDataSchema.safeParse(exercise.data);
  const [latex, setLatex] = useState("");
  if (!parsed.success) {
    return <p className="text-sm text-destructive">Exercice formule corrompu.</p>;
  }
  const hasPreview = latex.trim().length > 0;
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (latex.trim()) onSubmit({ latex });
      }}
    >
      <Input
        value={latex}
        onChange={(e) => setLatex(e.target.value)}
        placeholder="Ta formule en LaTeX — ex: x^2 + x + C"
        disabled={disabled}
        className="font-mono"
        aria-label="Formule LaTeX"
      />
      <div
        aria-label="Prévisualisation KaTeX"
        className="min-h-10 rounded-md border bg-muted/40 px-3 py-2 text-sm"
      >
        {hasPreview ? (
          <FormulaPreview latex={latex} />
        ) : (
          <span className="text-muted-foreground">Prévisualisation…</span>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Tu peux écrire <code className="font-mono">x^2</code>,{" "}
          <code className="font-mono">\frac{`{a}{b}`}</code>,{" "}
          <code className="font-mono">\int</code>, etc.
        </span>
        <Button size="sm" type="submit" disabled={disabled || !hasPreview}>
          Valider
        </Button>
      </div>
    </form>
  );
}

function FormulaPreview({ latex }: { latex: string }) {
  try {
    return <InlineMath math={latex} />;
  } catch {
    return (
      <span className="text-destructive">Syntaxe LaTeX invalide</span>
    );
  }
}
