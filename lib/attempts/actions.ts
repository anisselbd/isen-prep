"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { gradeExercise, type GradeResult } from "@/lib/exercise/grading";
import { updateMastery } from "@/lib/mastery/update";
import type { Json } from "@/types/database";

const inputSchema = z.object({
  exerciseId: z.string().uuid(),
  answer: z.unknown(),
  timeSeconds: z.number().int().nonnegative().optional(),
});

export type RecordAttemptResult =
  | { ok: true; result: GradeResult; masteryScore: number }
  | { ok: false; reason: string };

/**
 * Record an attempt: load exercise (source of truth for data+type), grade
 * server-side (no cheating), insert into attempts, update mastery.
 *
 * IA-graded types return pending_ai — mastery is not updated; Phase 5 will
 * attach the Gemini grade in a follow-up call.
 */
export async function recordAttempt(input: {
  exerciseId: string;
  answer: unknown;
  timeSeconds?: number;
}): Promise<RecordAttemptResult> {
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, reason: parsed.error.issues[0]?.message ?? "invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthenticated" };

  const { data: exercise, error: exErr } = await supabase
    .from("exercises")
    .select("id, topic_id, type, data")
    .eq("id", parsed.data.exerciseId)
    .maybeSingle();
  if (exErr || !exercise) {
    return { ok: false, reason: exErr?.message ?? "exercise not found" };
  }

  const result = gradeExercise(exercise.type, exercise.data, parsed.data.answer);

  const { error: insErr } = await supabase.from("attempts").insert({
    user_id: user.id,
    exercise_id: exercise.id,
    answer: parsed.data.answer as Json,
    is_correct: result.status === "graded" ? result.is_correct : false,
    score: result.status === "graded" ? result.score : 0,
    time_seconds: parsed.data.timeSeconds ?? null,
  });
  if (insErr) return { ok: false, reason: insErr.message };

  // Update mastery only for deterministically-graded attempts.
  // IA-graded (pending_ai) and invalid results do not count toward mastery.
  let masteryScore = 0;
  if (result.status === "graded") {
    const { data: prev } = await supabase
      .from("mastery")
      .select("score, confidence")
      .eq("user_id", user.id)
      .eq("topic_id", exercise.topic_id)
      .maybeSingle();

    const nextMastery = updateMastery(prev, result.score);
    masteryScore = nextMastery.score;

    const { error: upErr } = await supabase.from("mastery").upsert({
      user_id: user.id,
      topic_id: exercise.topic_id,
      score: nextMastery.score,
      confidence: nextMastery.confidence,
      last_updated: nextMastery.last_updated,
    });
    if (upErr) return { ok: false, reason: upErr.message };
  }

  return { ok: true, result, masteryScore };
}
