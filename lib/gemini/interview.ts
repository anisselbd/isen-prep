import "server-only";
import { requireGeminiClient, GEMINI_MODEL } from "./client";
import { interviewTurnResponseSchema, interviewTurnZod } from "./schemas";
import {
  buildInterviewSystemPrompt,
  formatInterviewHistory,
  type InterviewMessage,
} from "./prompts";

const MAX_TURNS = 10; // after this many exchanges, the jury concludes

export type InterviewTurn = {
  message: string;
  done: boolean;
  feedback_md: string;
  score: number;
};

export async function runInterviewTurn(args: {
  history: InterviewMessage[];
}): Promise<InterviewTurn> {
  const client = requireGeminiClient();

  const userTurnCount = args.history.filter((m) => m.role === "user").length;
  const turnsRemaining = Math.max(0, MAX_TURNS - userTurnCount);
  const systemPrompt = buildInterviewSystemPrompt({ turnsRemaining });

  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: systemPrompt,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: interviewTurnResponseSchema,
      temperature: 0.8,
    },
  });

  const userPrompt =
    args.history.length === 0
      ? "Démarre l'entretien par une prise de contact naturelle, puis pose ta première question."
      : `Historique de la conversation jusqu'ici :\n\n${formatInterviewHistory(
          args.history
        )}\n\nProduis la prochaine intervention du jury.`;

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error(`Gemini returned non-JSON: ${text.slice(0, 200)}`);
  }

  const parsed = interviewTurnZod.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Malformed interview turn: ${parsed.error.message}`);
  }
  return parsed.data;
}

export { MAX_TURNS };
