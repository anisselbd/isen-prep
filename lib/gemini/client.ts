import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { serverEnv } from "@/lib/env";

export const GEMINI_MODEL = "gemini-2.5-flash";

let _client: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI | null {
  if (!serverEnv?.GOOGLE_GEMINI_API_KEY) return null;
  if (!_client) _client = new GoogleGenerativeAI(serverEnv.GOOGLE_GEMINI_API_KEY);
  return _client;
}

export class GeminiNotConfiguredError extends Error {
  constructor() {
    super("GOOGLE_GEMINI_API_KEY is not set on the server");
    this.name = "GeminiNotConfiguredError";
  }
}

export function requireGeminiClient(): GoogleGenerativeAI {
  const c = getGeminiClient();
  if (!c) throw new GeminiNotConfiguredError();
  return c;
}
