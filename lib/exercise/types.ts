import { z } from "zod";
import type { ExerciseType } from "@/types/database";

// ---------------------------------------------------------------------------
// Data schemas (shape of exercises.data jsonb, per exercise type)
// ---------------------------------------------------------------------------

export const mcqDataSchema = z
  .object({
    choices: z.array(z.string().min(1)).min(2).max(8),
    answer: z.union([z.number().int().nonnegative(), z.array(z.number().int().nonnegative()).min(1)]),
    multiple: z.boolean().optional(),
  })
  .refine(
    (d) => {
      const max = d.choices.length - 1;
      if (Array.isArray(d.answer)) return d.answer.every((i) => i <= max);
      return d.answer <= max;
    },
    { message: "answer index out of range" }
  );

export const numericDataSchema = z.object({
  answer: z.number().finite(),
  tolerance: z.number().nonnegative().optional(),
  unit: z.string().optional(),
});

export const formulaDataSchema = z.object({
  expected_latex: z.string().min(1),
  equivalent_forms: z.array(z.string().min(1)).optional(),
  variables: z.array(z.string()).optional(),
});

export const textDataSchema = z.object({
  expected_key_points: z.array(z.string().min(1)).min(1),
  min_score: z.number().min(0).max(1).optional(),
  max_chars: z.number().int().positive().optional(),
});

export const codeDataSchema = z.object({
  language: z.enum(["js", "python", "pseudocode"]),
  function_signature: z.string().optional(),
  hints: z.array(z.string()).optional(),
  starter_code: z.string().optional(),
});

export const circuitDataSchema = z.object({
  components: z
    .array(
      z.object({
        type: z.literal("R"),
        label: z.string().min(1),
        value: z.number().positive(),
      })
    )
    .min(2),
  configuration: z.enum(["series", "parallel"]),
  question: z.enum(["R_eq"]),
  answer: z.number().finite(),
  tolerance: z.number().nonnegative(),
});

export const conversionBase = z.enum(["decimal", "binary", "hex"]);
export const conversionDataSchema = z.object({
  source: z.object({ base: conversionBase, value: z.string().min(1) }),
  targets: z.array(conversionBase).min(1),
});

export const orderingDataSchema = z.object({
  items: z.array(z.string().min(1)).min(2),
});

export const matchPairsDataSchema = z.object({
  pairs: z
    .array(z.object({ left: z.string().min(1), right: z.string().min(1) }))
    .min(2),
});

// ---------------------------------------------------------------------------
// Answer schemas (shape submitted by the UI to the grader)
// ---------------------------------------------------------------------------

export const mcqAnswerSchema = z.object({ selected: z.array(z.number().int().nonnegative()) });
export const numericAnswerSchema = z.object({ value: z.number().finite() });
export const formulaAnswerSchema = z.object({ latex: z.string() });
export const textAnswerSchema = z.object({ text: z.string() });
export const codeAnswerSchema = z.object({ code: z.string() });
export const circuitAnswerSchema = z.object({ value: z.number().finite() });
export const conversionAnswerSchema = z.object({
  values: z.object({
    decimal: z.string().optional(),
    binary: z.string().optional(),
    hex: z.string().optional(),
  }),
});
export const orderingAnswerSchema = z.object({ order: z.array(z.string()) });
export const matchPairsAnswerSchema = z.object({
  matches: z.array(z.object({ left: z.string(), right: z.string() })),
});

// ---------------------------------------------------------------------------
// Inferred TS types
// ---------------------------------------------------------------------------

export type MCQData = z.infer<typeof mcqDataSchema>;
export type NumericData = z.infer<typeof numericDataSchema>;
export type FormulaData = z.infer<typeof formulaDataSchema>;
export type TextData = z.infer<typeof textDataSchema>;
export type CodeData = z.infer<typeof codeDataSchema>;
export type CircuitData = z.infer<typeof circuitDataSchema>;
export type ConversionData = z.infer<typeof conversionDataSchema>;
export type OrderingData = z.infer<typeof orderingDataSchema>;
export type MatchPairsData = z.infer<typeof matchPairsDataSchema>;

export type MCQAnswer = z.infer<typeof mcqAnswerSchema>;
export type NumericAnswer = z.infer<typeof numericAnswerSchema>;
export type FormulaAnswer = z.infer<typeof formulaAnswerSchema>;
export type TextAnswer = z.infer<typeof textAnswerSchema>;
export type CodeAnswer = z.infer<typeof codeAnswerSchema>;
export type CircuitAnswer = z.infer<typeof circuitAnswerSchema>;
export type ConversionAnswer = z.infer<typeof conversionAnswerSchema>;
export type OrderingAnswer = z.infer<typeof orderingAnswerSchema>;
export type MatchPairsAnswer = z.infer<typeof matchPairsAnswerSchema>;

export type ExerciseBase = {
  id: string;
  topic_id: string;
  difficulty: number;
  question_md: string;
  explanation_md?: string | null;
  colibrimo_connection?: string | null;
};

export type Exercise = ExerciseBase & {
  type: ExerciseType;
  data: unknown; // validated at the boundary via the schemas above
};
