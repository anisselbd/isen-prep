import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { computeStreak, datesFromTimestamps, type StreakResult } from "./compute";

export const DAILY_GOAL_ATTEMPTS = 10;
export const DAILY_GOAL_REVIEWS = 20;

export type StreakData = {
  streak: StreakResult;
  today_attempts: number;
  today_reviews: number;
};

export async function loadStreakData(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<StreakData> {
  // Earliest boundary we care about (limit the size of the query).
  const since = new Date();
  since.setDate(since.getDate() - 365);
  const sinceIso = since.toISOString();

  const [attemptsRes, reviewsRes] = await Promise.all([
    supabase
      .from("attempts")
      .select("created_at")
      .eq("user_id", userId)
      .gte("created_at", sinceIso),
    supabase
      .from("review_states")
      .select("last_reviewed_at")
      .eq("user_id", userId)
      .not("last_reviewed_at", "is", null),
  ]);

  const attempts = attemptsRes.data ?? [];
  const reviews = reviewsRes.data ?? [];

  const allDates = datesFromTimestamps([
    ...attempts.map((a) => a.created_at),
    ...reviews.map((r) => r.last_reviewed_at),
  ]);

  const streak = computeStreak(allDates);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayAttempts = attempts.filter(
    (a) => a.created_at.slice(0, 10) === todayStr,
  ).length;
  const todayReviews = reviews.filter(
    (r) => (r.last_reviewed_at ?? "").slice(0, 10) === todayStr,
  ).length;

  return {
    streak,
    today_attempts: todayAttempts,
    today_reviews: todayReviews,
  };
}
