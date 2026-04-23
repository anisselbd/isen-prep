import "server-only";
import { requireGeminiClient, GEMINI_MODEL } from "./client";
import { generateExerciseResponseSchema, generatedExerciseZod } from "./schemas";
import { buildGenerateExercisePrompt } from "./prompts";
import {
  mcqDataSchema,
  numericDataSchema,
  formulaDataSchema,
  textDataSchema,
  codeDataSchema,
  circuitDataSchema,
  conversionDataSchema,
  orderingDataSchema,
  matchPairsDataSchema,
} from "@/lib/exercise/types";
import type { ExerciseType } from "@/types/database";

const DATA_VALIDATOR_BY_TYPE = {
  mcq: mcqDataSchema,
  numeric: numericDataSchema,
  formula: formulaDataSchema,
  text: textDataSchema,
  code: codeDataSchema,
  circuit: circuitDataSchema,
  conversion: conversionDataSchema,
  ordering: orderingDataSchema,
  match_pairs: matchPairsDataSchema,
} as const;

export type GeneratedExercise = {
  question_md: string;
  data: unknown;
  explanation_md: string;
  colibrimo_connection: string | null;
};

export async function generateExerciseViaGemini(args: {
  topic_id: string;
  topic_name: string;
  topic_description: string | null;
  subject_name: string;
  difficulty: number;
  type: ExerciseType;
}): Promise<GeneratedExercise> {
  const client = requireGeminiClient();
  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: generateExerciseResponseSchema(args.type),
      temperature: 0.7,
    },
  });

  const prompt = buildGenerateExercisePrompt(args);
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error(`Gemini returned non-JSON: ${text.slice(0, 200)}`);
  }

  const outer = generatedExerciseZod.safeParse(raw);
  if (!outer.success) {
    throw new Error(`Malformed Gemini envelope: ${outer.error.message}`);
  }

  // Validate the type-specific `data` block with our own Zod schema
  // — Gemini sometimes produces shapes that are structurally close but off.
  const dataValidator = DATA_VALIDATOR_BY_TYPE[args.type];
  const dataValidated = dataValidator.safeParse(outer.data.data);
  if (!dataValidated.success) {
    throw new Error(
      `Malformed ${args.type} data from Gemini: ${dataValidated.error.message}`
    );
  }

  return {
    question_md: outer.data.question_md,
    data: dataValidated.data,
    explanation_md: outer.data.explanation_md,
    colibrimo_connection: outer.data.colibrimo_connection.trim() || null,
  };
}
