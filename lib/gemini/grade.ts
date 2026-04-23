import "server-only";
import { requireGeminiClient, GEMINI_MODEL } from "./client";
import { gradeAnswerResponseSchema, gradeAnswerZod } from "./schemas";
import { buildGradeAnswerPrompt } from "./prompts";
import type { ExerciseType } from "@/types/database";

export type AiGrade = {
  score: number;
  is_correct: boolean;
  feedback_md: string;
};

export async function gradeAnswerViaGemini(args: {
  type: ExerciseType;
  question_md: string;
  data: unknown;
  user_answer: unknown;
}): Promise<AiGrade> {
  const client = requireGeminiClient();
  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: gradeAnswerResponseSchema,
      temperature: 0.2,
    },
  });

  const prompt = buildGradeAnswerPrompt(args);
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`Gemini returned non-JSON: ${text.slice(0, 200)}`);
  }

  const validated = gradeAnswerZod.safeParse(parsed);
  if (!validated.success) {
    throw new Error(
      `Gemini returned a payload that does not match the schema: ${validated.error.message}`
    );
  }
  return validated.data;
}
