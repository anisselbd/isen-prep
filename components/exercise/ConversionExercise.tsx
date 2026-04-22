"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { conversionDataSchema, type ConversionAnswer } from "@/lib/exercise/types";
import type { Exercise } from "@/lib/exercise/types";

type Props = {
  exercise: Exercise;
  onSubmit: (answer: ConversionAnswer) => void;
  disabled?: boolean;
};

const BASE_LABEL = {
  decimal: "Décimal",
  binary: "Binaire",
  hex: "Hexadécimal",
} as const;

const BASE_PLACEHOLDER = {
  decimal: "ex: 163",
  binary: "ex: 10100011",
  hex: "ex: A3",
} as const;

export function ConversionExercise({ exercise, onSubmit, disabled }: Props) {
  const parsed = conversionDataSchema.safeParse(exercise.data);
  const [values, setValues] = useState<ConversionAnswer["values"]>({});

  if (!parsed.success) {
    return <p className="text-sm text-destructive">Exercice conversion corrompu.</p>;
  }

  const { source, targets } = parsed.data;

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ values });
      }}
    >
      <div className="rounded-md border bg-muted/30 p-3 text-sm">
        <span className="text-muted-foreground">Source ({BASE_LABEL[source.base]}) :</span>{" "}
        <code className="font-mono text-base font-medium">{source.value}</code>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {targets.map((base) => (
          <div key={base} className="flex flex-col gap-1">
            <Label htmlFor={`conv-${base}`}>{BASE_LABEL[base]}</Label>
            <Input
              id={`conv-${base}`}
              value={values[base] ?? ""}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [base]: e.target.value }))
              }
              placeholder={BASE_PLACEHOLDER[base]}
              disabled={disabled}
              className="font-mono"
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Préfixes <code className="font-mono">0b</code> et <code className="font-mono">0x</code> tolérés</span>
        <Button
          size="sm"
          type="submit"
          disabled={
            disabled ||
            targets.every((b) => (values[b] ?? "").trim() === "")
          }
        >
          Valider
        </Button>
      </div>
    </form>
  );
}
