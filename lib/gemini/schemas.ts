import "server-only";
import { SchemaType, type Schema } from "@google/generative-ai";
import { z } from "zod";
import type { ExerciseType } from "@/types/database";

// ---------------------------------------------------------------------------
// Gemini responseSchemas — forces structured JSON output
// ---------------------------------------------------------------------------

const mcqDataSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    choices: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Between 3 and 5 choices",
    },
    answer: {
      type: SchemaType.NUMBER,
      description: "0-indexed position of the single correct choice",
    },
  },
  required: ["choices", "answer"],
};

const numericDataSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    answer: { type: SchemaType.NUMBER },
    tolerance: {
      type: SchemaType.NUMBER,
      description: "Absolute tolerance around the answer; 0 for exact match",
    },
    unit: { type: SchemaType.STRING, description: "Short unit label, or empty" },
  },
  required: ["answer", "tolerance", "unit"],
};

const formulaDataSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    expected_latex: { type: SchemaType.STRING },
    equivalent_forms: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Other LaTeX forms that should be accepted as correct",
    },
  },
  required: ["expected_latex", "equivalent_forms"],
};

const textDataSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    expected_key_points: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "3-6 key points the learner should mention",
    },
    min_score: { type: SchemaType.NUMBER },
  },
  required: ["expected_key_points", "min_score"],
};

const codeDataSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    language: {
      type: SchemaType.STRING,
      enum: ["js", "python", "pseudocode"],
      format: "enum",
    },
    function_signature: { type: SchemaType.STRING },
    hints: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
  },
  required: ["language", "function_signature", "hints"],
};

const conversionDataSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    source: {
      type: SchemaType.OBJECT,
      properties: {
        base: {
          type: SchemaType.STRING,
          enum: ["decimal", "binary", "hex"],
          format: "enum",
        },
        value: { type: SchemaType.STRING },
      },
      required: ["base", "value"],
    },
    targets: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
        enum: ["decimal", "binary", "hex"],
        format: "enum",
      },
    },
  },
  required: ["source", "targets"],
};

const orderingDataSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    items: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Items in their correct order (smallest/first to largest/last)",
    },
  },
  required: ["items"],
};

const matchPairsDataSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    pairs: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          left: { type: SchemaType.STRING },
          right: { type: SchemaType.STRING },
        },
        required: ["left", "right"],
      },
    },
  },
  required: ["pairs"],
};

const circuitDataSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    components: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          type: {
            type: SchemaType.STRING,
            enum: ["R"],
            format: "enum",
          },
          label: { type: SchemaType.STRING },
          value: { type: SchemaType.NUMBER },
        },
        required: ["type", "label", "value"],
      },
    },
    configuration: {
      type: SchemaType.STRING,
      enum: ["series", "parallel"],
      format: "enum",
    },
    question: {
      type: SchemaType.STRING,
      enum: ["R_eq"],
      format: "enum",
    },
    answer: { type: SchemaType.NUMBER },
    tolerance: { type: SchemaType.NUMBER },
  },
  required: ["components", "configuration", "question", "answer", "tolerance"],
};

const DATA_SCHEMAS: Record<ExerciseType, Schema> = {
  mcq: mcqDataSchema,
  numeric: numericDataSchema,
  formula: formulaDataSchema,
  text: textDataSchema,
  code: codeDataSchema,
  circuit: circuitDataSchema,
  conversion: conversionDataSchema,
  ordering: orderingDataSchema,
  match_pairs: matchPairsDataSchema,
};

export function generateExerciseResponseSchema(type: ExerciseType): Schema {
  return {
    type: SchemaType.OBJECT,
    properties: {
      question_md: {
        type: SchemaType.STRING,
        description: "Énoncé en français au format Markdown, KaTeX autorisé",
      },
      data: DATA_SCHEMAS[type],
      explanation_md: {
        type: SchemaType.STRING,
        description: "Explication pédagogique détaillée en français",
      },
      colibrimo_connection: {
        type: SchemaType.STRING,
        description:
          "Lien explicite avec le travail Colibrimo du candidat — ou chaîne vide si non pertinent",
      },
    },
    required: ["question_md", "data", "explanation_md", "colibrimo_connection"],
  };
}

export const gradeAnswerResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    score: {
      type: SchemaType.NUMBER,
      description: "Between 0 and 1 — how complete and correct the answer is",
    },
    is_correct: { type: SchemaType.BOOLEAN },
    feedback_md: {
      type: SchemaType.STRING,
      description: "Short pedagogical feedback in French (2-4 lines)",
    },
  },
  required: ["score", "is_correct", "feedback_md"],
};

export const interviewTurnResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    message: {
      type: SchemaType.STRING,
      description: "The jury's next message, in French",
    },
    done: {
      type: SchemaType.BOOLEAN,
      description: "true if the interview should end after this message",
    },
    feedback_md: {
      type: SchemaType.STRING,
      description:
        "When done=true, final structured feedback (points forts / points faibles / conseils) in French Markdown; otherwise empty",
    },
    score: {
      type: SchemaType.NUMBER,
      description: "When done=true, overall score 0..1; otherwise 0",
    },
  },
  required: ["message", "done", "feedback_md", "score"],
};

// ---------------------------------------------------------------------------
// Zod validators — defense in depth against malformed Gemini output
// ---------------------------------------------------------------------------

export const gradeAnswerZod = z.object({
  score: z.number().min(0).max(1),
  is_correct: z.boolean(),
  feedback_md: z.string().min(1),
});

// ---------------------------------------------------------------------------
// coach-plan — personalized study plan generated from user stats
// ---------------------------------------------------------------------------

export const coachPlanResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: {
      type: SchemaType.STRING,
      description: "2-3 phrases en français sur l'état actuel de la préparation.",
    },
    today_focus: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          topic_id: {
            type: SchemaType.STRING,
            description: "id exact du topic (ex: maths.analyse.derivees)",
          },
          topic_name: { type: SchemaType.STRING },
          reason: {
            type: SchemaType.STRING,
            description: "1 phrase expliquant pourquoi ce topic est prioritaire",
          },
          suggested_minutes: {
            type: SchemaType.NUMBER,
            description: "Durée suggérée en minutes, entre 15 et 60",
          },
          action: {
            type: SchemaType.STRING,
            description: "Une des actions : lesson, practice, flashcards",
          },
        },
        required: ["topic_id", "topic_name", "reason", "suggested_minutes", "action"],
      },
      description: "2 à 3 items prioritaires pour aujourd'hui",
    },
    week_strategy: {
      type: SchemaType.STRING,
      description:
        "Plan stratégique markdown (~100-150 mots) jusqu'à l'entretien, avec ordre d'attaque des matières.",
    },
  },
  required: ["summary", "today_focus", "week_strategy"],
};

export const coachPlanZod = z.object({
  summary: z.string().min(1),
  today_focus: z
    .array(
      z.object({
        topic_id: z.string().min(1),
        topic_name: z.string().min(1),
        reason: z.string().min(1),
        suggested_minutes: z.number().min(5).max(120),
        action: z.enum(["lesson", "practice", "flashcards"]),
      }),
    )
    .min(1)
    .max(5),
  week_strategy: z.string().min(1),
});

export type CoachPlan = z.infer<typeof coachPlanZod>;

export const interviewTurnZod = z.object({
  message: z.string().min(1),
  done: z.boolean(),
  feedback_md: z.string(),
  score: z.number().min(0).max(1),
});

export const generatedExerciseZod = z.object({
  question_md: z.string().min(1),
  data: z.unknown(),
  explanation_md: z.string().min(1),
  colibrimo_connection: z.string(),
});
