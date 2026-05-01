import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/server";

const MAX_CALLS_PER_MINUTE = 15;
const WINDOW_MS = 60_000;

export class GeminiRateLimitError extends Error {
  constructor() {
    super("Trop de requêtes IA en peu de temps. Patiente une minute.");
    this.name = "GeminiRateLimitError";
  }
}

export async function enforceGeminiRateLimit(userId: string): Promise<void> {
  const admin = createServiceRoleClient();
  const since = new Date(Date.now() - WINDOW_MS).toISOString();

  const { count, error } = await admin
    .from("gemini_call_log")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("called_at", since);
  if (error) throw new Error(`rate-limit query failed: ${error.message}`);
  if ((count ?? 0) >= MAX_CALLS_PER_MINUTE) throw new GeminiRateLimitError();

  const { error: insErr } = await admin
    .from("gemini_call_log")
    .insert({ user_id: userId });
  if (insErr) throw new Error(`rate-limit insert failed: ${insErr.message}`);
}
