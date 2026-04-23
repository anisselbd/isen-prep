import "server-only";
import { GEMINI_MODEL, requireGeminiClient } from "./client";
import { buildCoachPlanPrompt } from "./prompts";
import { coachPlanResponseSchema, coachPlanZod, type CoachPlan } from "./schemas";
import type { CoachStats } from "@/lib/coach/stats";

export async function generateCoachPlan(stats: CoachStats): Promise<CoachPlan> {
  const client = requireGeminiClient();
  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: coachPlanResponseSchema,
      temperature: 0.4,
    },
  });

  const prompt = buildCoachPlanPrompt(stats);
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`Gemini a renvoyé du non-JSON : ${text.slice(0, 200)}`);
  }

  const validated = coachPlanZod.safeParse(parsed);
  if (!validated.success) {
    throw new Error(
      `Réponse Gemini invalide pour le coach : ${validated.error.message}`,
    );
  }
  return validated.data;
}
