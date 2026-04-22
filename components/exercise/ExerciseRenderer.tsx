"use client";

import type { Exercise } from "@/lib/exercise/types";
import { MCQExercise } from "./MCQExercise";
import { NumericExercise } from "./NumericExercise";
import { FormulaExercise } from "./FormulaExercise";
import { TextAnswerExercise } from "./TextAnswerExercise";
import { CodeExercise } from "./CodeExercise";
import { CircuitExercise } from "./CircuitExercise";
import { ConversionExercise } from "./ConversionExercise";
import { OrderingExercise } from "./OrderingExercise";
import { MatchPairsExercise } from "./MatchPairsExercise";

type Props = {
  exercise: Exercise;
  onSubmit: (answer: unknown) => void;
  disabled?: boolean;
};

export function ExerciseRenderer({ exercise, onSubmit, disabled }: Props) {
  switch (exercise.type) {
    case "mcq":
      return <MCQExercise exercise={exercise} onSubmit={onSubmit} disabled={disabled} />;
    case "numeric":
      return <NumericExercise exercise={exercise} onSubmit={onSubmit} disabled={disabled} />;
    case "formula":
      return <FormulaExercise exercise={exercise} onSubmit={onSubmit} disabled={disabled} />;
    case "text":
      return <TextAnswerExercise exercise={exercise} onSubmit={onSubmit} disabled={disabled} />;
    case "code":
      return <CodeExercise exercise={exercise} onSubmit={onSubmit} disabled={disabled} />;
    case "circuit":
      return <CircuitExercise exercise={exercise} onSubmit={onSubmit} disabled={disabled} />;
    case "conversion":
      return <ConversionExercise exercise={exercise} onSubmit={onSubmit} disabled={disabled} />;
    case "ordering":
      return <OrderingExercise exercise={exercise} onSubmit={onSubmit} disabled={disabled} />;
    case "match_pairs":
      return <MatchPairsExercise exercise={exercise} onSubmit={onSubmit} disabled={disabled} />;
  }
}
