import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { selectDueFlashcardIds } from "@/lib/flashcards/due";

export type CoachTopicStat = {
  topic_id: string;
  topic_name: string;
  subject_name: string;
  mastery_pct: number; // 0..100, rounded
  attempts: number;
  cir_importance: number;
};

export type CoachStats = {
  days_until_interview: number | null;
  due_flashcards: number;
  total_attempts_week: number;
  topics: CoachTopicStat[];
};

/**
 * Aggregate user-facing stats for the Coach IA. Kept intentionally small so
 * the Gemini prompt stays readable.
 */
export async function buildCoachStats(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<CoachStats> {
  const oneWeekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();

  const [
    profileRes,
    subjectsRes,
    topicsRes,
    masteryRes,
    flashcardsRes,
    statesRes,
    attemptsRes,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("target_interview_date")
      .eq("id", userId)
      .maybeSingle(),
    supabase.from("subjects").select("id, name"),
    supabase
      .from("topics")
      .select("id, subject_id, name, cir_importance, order_index")
      .order("order_index"),
    supabase
      .from("mastery")
      .select("topic_id, score, confidence")
      .eq("user_id", userId),
    supabase.from("flashcards").select("id, topic_id"),
    supabase
      .from("review_states")
      .select("flashcard_id, next_review_at")
      .eq("user_id", userId),
    supabase
      .from("attempts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", oneWeekAgo),
  ]);

  const subjects = subjectsRes.data ?? [];
  const topics = topicsRes.data ?? [];
  const mastery = masteryRes.data ?? [];
  const flashcards = flashcardsRes.data ?? [];
  const states = statesRes.data ?? [];

  const subjectName = new Map(subjects.map((s) => [s.id, s.name]));
  const masteryByTopic = new Map(mastery.map((m) => [m.topic_id, m]));

  const coachTopics: CoachTopicStat[] = topics.map((t) => {
    const m = masteryByTopic.get(t.id);
    return {
      topic_id: t.id,
      topic_name: t.name,
      subject_name: subjectName.get(t.subject_id) ?? "",
      mastery_pct: Math.round((m?.score ?? 0) * 100),
      attempts: m?.confidence ?? 0,
      cir_importance: t.cir_importance,
    };
  });

  const daysUntil =
    profileRes.data?.target_interview_date
      ? Math.ceil(
          (new Date(profileRes.data.target_interview_date).getTime() -
            Date.now()) /
            86_400_000,
        )
      : null;

  return {
    days_until_interview: daysUntil,
    due_flashcards: selectDueFlashcardIds(flashcards, states).length,
    total_attempts_week: attemptsRes.count ?? 0,
    topics: coachTopics,
  };
}
