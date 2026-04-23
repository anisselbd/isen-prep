"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { updateMastery } from "@/lib/mastery/update";

const recordSchema = z.object({
  exercise_id: z.string().uuid(),
  // -1 = timeout (nothing picked); otherwise the 0-based index of the choice.
  picked_index: z.number().int().min(-1).max(10),
  is_correct: z.boolean(),
  time_seconds: z.number().int().min(0).max(3600),
});

/**
 * Record a quiz answer as a normal exercise attempt (so it feeds into mastery
 * and the rest of the stats pipeline). Fire-and-forget: the client does not
 * need to block on this to continue the game.
 */
export async function recordQuizAttempt(input: unknown): Promise<{ ok: boolean }> {
  const parsed = recordSchema.safeParse(input);
  if (!parsed.success) return { ok: false };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { data: exercise } = await supabase
    .from("exercises")
    .select("id, topic_id")
    .eq("id", parsed.data.exercise_id)
    .maybeSingle();
  if (!exercise) return { ok: false };

  const score = parsed.data.is_correct ? 1 : 0;

  await supabase.from("attempts").insert({
    user_id: user.id,
    exercise_id: exercise.id,
    answer: { picked: parsed.data.picked_index, mode: "quiz" },
    is_correct: parsed.data.is_correct,
    score,
    time_seconds: parsed.data.time_seconds,
  });

  const { data: prevMastery } = await supabase
    .from("mastery")
    .select("score, confidence")
    .eq("user_id", user.id)
    .eq("topic_id", exercise.topic_id)
    .maybeSingle();

  const next = updateMastery(prevMastery, score);
  await supabase.from("mastery").upsert({
    user_id: user.id,
    topic_id: exercise.topic_id,
    score: next.score,
    confidence: next.confidence,
    last_updated: next.last_updated,
  });

  return { ok: true };
}
