import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isGeminiConfigured } from "@/lib/env";
import { buildCoachStats } from "@/lib/coach/stats";
import { generateCoachPlan } from "@/lib/gemini/coach";
import { GeminiNotConfiguredError } from "@/lib/gemini/client";
import { isGeminiQuotaError, isGeminiOverloadError } from "@/lib/gemini/errors";
import {
  enforceGeminiRateLimit,
  GeminiRateLimitError,
} from "@/lib/gemini/rate-limit";

export async function POST() {
  if (!isGeminiConfigured()) {
    return NextResponse.json(
      { error: "Gemini n'est pas configurée côté serveur." },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "non authentifié" }, { status: 401 });
  }

  try {
    await enforceGeminiRateLimit(user.id);
  } catch (e) {
    if (e instanceof GeminiRateLimitError) {
      return NextResponse.json({ error: e.message }, { status: 429 });
    }
    throw e;
  }

  const stats = await buildCoachStats(supabase, user.id);

  try {
    const plan = await generateCoachPlan(stats);
    return NextResponse.json({ ok: true, plan, stats_summary: {
      topics: stats.topics.length,
      days_until_interview: stats.days_until_interview,
      total_attempts_week: stats.total_attempts_week,
    } });
  } catch (e) {
    if (e instanceof GeminiNotConfiguredError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    if (isGeminiQuotaError(e)) {
      return NextResponse.json(
        { error: "Quota IA atteint. Réessaie dans une minute." },
        { status: 429 }
      );
    }
    if (isGeminiOverloadError(e)) {
      return NextResponse.json(
        {
          error:
            "Le service Gemini est surchargé (free tier déprioritisé par Google). Réessaie dans quelques secondes.",
        },
        { status: 503 }
      );
    }
    const msg = e instanceof Error ? e.message : "erreur Gemini inconnue";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
