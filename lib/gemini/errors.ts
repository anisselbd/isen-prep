import "server-only";

export class GeminiQuotaExceededError extends Error {
  constructor() {
    super("Quota IA atteint. Réessaie dans une minute.");
    this.name = "GeminiQuotaExceededError";
  }
}

export function isGeminiQuotaError(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  const anyE = e as { status?: number; message?: string };
  if (anyE.status === 429) return true;
  if (typeof anyE.message === "string") {
    return /RESOURCE_EXHAUSTED|\b429\b|quota/i.test(anyE.message);
  }
  return false;
}

// Free-tier traffic is deprioritised when Gemini is under load — Google
// returns 503 / UNAVAILABLE rather than queueing the request.
export function isGeminiOverloadError(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  const anyE = e as { status?: number; message?: string };
  if (anyE.status === 503) return true;
  if (typeof anyE.message === "string") {
    return /\b503\b|UNAVAILABLE|overload|high demand/i.test(anyE.message);
  }
  return false;
}
