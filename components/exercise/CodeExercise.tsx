"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { codeDataSchema, type CodeAnswer } from "@/lib/exercise/types";
import type { Exercise } from "@/lib/exercise/types";
import { isGeminiConfigured } from "@/lib/env";

type Props = {
  exercise: Exercise;
  onSubmit: (answer: CodeAnswer) => void;
  disabled?: boolean;
};

const LANGUAGE_LABEL: Record<string, string> = {
  js: "JavaScript",
  python: "Python",
  pseudocode: "Pseudo-code",
};

export function CodeExercise({ exercise, onSubmit, disabled }: Props) {
  const parsed = codeDataSchema.safeParse(exercise.data);
  const [code, setCode] = useState(parsed.success ? parsed.data.starter_code ?? "" : "");

  if (!parsed.success) {
    return <p className="text-sm text-destructive">Exercice code corrompu.</p>;
  }

  const geminiOk = isGeminiConfigured();

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (code.trim()) onSubmit({ code });
      }}
    >
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{LANGUAGE_LABEL[parsed.data.language] ?? parsed.data.language}</Badge>
        {parsed.data.function_signature ? (
          <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
            {parsed.data.function_signature}
          </code>
        ) : null}
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="// écris ton code ici"
        disabled={disabled}
        rows={10}
        spellCheck={false}
        className="w-full rounded-md border bg-background p-3 font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Éditeur de code"
      />
      {parsed.data.hints && parsed.data.hints.length > 0 ? (
        <details className="text-xs">
          <summary className="cursor-pointer text-muted-foreground">Indices ({parsed.data.hints.length})</summary>
          <ul className="mt-2 list-disc pl-4">
            {parsed.data.hints.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </details>
      ) : null}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {geminiOk ? "Correction par IA après soumission" : "Gemini non configurée"}
        </span>
        <Button size="sm" type="submit" disabled={disabled || code.trim() === "" || !geminiOk}>
          Envoyer
        </Button>
      </div>
    </form>
  );
}
