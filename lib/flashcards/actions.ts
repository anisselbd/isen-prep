"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { applySM2, type Quality, type ReviewState } from "@/lib/sm2/algorithm";

const qualitySchema = z.union([z.literal(0), z.literal(3), z.literal(4), z.literal(5)]);

const inputSchema = z.object({
  flashcardId: z.string().uuid(),
  quality: qualitySchema,
});

export type ApplyReviewResult =
  | { ok: true; state: ReviewState }
  | { ok: false; reason: string };

/**
 * Record a flashcard review: runs SM-2 on the previous state (if any) and
 * upserts review_states. RLS scopes to the authenticated user.
 */
export async function applyFlashcardReview(input: {
  flashcardId: string;
  quality: Quality;
}): Promise<ApplyReviewResult> {
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, reason: parsed.error.issues[0]?.message ?? "invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthenticated" };

  const { data: prev } = await supabase
    .from("review_states")
    .select("repetitions, easiness, interval_days")
    .eq("user_id", user.id)
    .eq("flashcard_id", parsed.data.flashcardId)
    .maybeSingle();

  const nextState = applySM2({ quality: parsed.data.quality, prev });

  const { error } = await supabase.from("review_states").upsert({
    user_id: user.id,
    flashcard_id: parsed.data.flashcardId,
    repetitions: nextState.repetitions,
    easiness: nextState.easiness,
    interval_days: nextState.interval_days,
    next_review_at: nextState.next_review_at,
    last_reviewed_at: nextState.last_reviewed_at,
  });

  if (error) return { ok: false, reason: error.message };
  return { ok: true, state: nextState };
}
