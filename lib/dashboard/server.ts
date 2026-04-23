import "server-only";
import { createClient } from "@/lib/supabase/server";
import { selectDueFlashcardIds } from "@/lib/flashcards/due";

export type SubjectMastery = {
  id: string;
  name: string;
  color: string | null;
  description: string | null;
  topics: Array<{
    id: string;
    name: string;
    score: number;   // 0..1
    confidence: number;
    cir_importance: number;
  }>;
  avg_score: number;
};

export type DashboardData = {
  user_id: string;
  display_name: string | null;
  target_interview_date: string | null; // ISO date (YYYY-MM-DD) or null
  subjects: SubjectMastery[];
  weak_points: Array<{ topic_id: string; topic_name: string; subject_id: string; score: number }>;
  due_flashcards_today: number;
};

export async function loadDashboardData(): Promise<DashboardData | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileRes, subjectsRes, topicsRes, masteryRes, flashcardsRes, statesRes] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, target_interview_date")
        .eq("id", user.id)
        .maybeSingle(),
      supabase.from("subjects").select("id, name, description, color, order_index").order("order_index"),
      supabase
        .from("topics")
        .select("id, subject_id, name, cir_importance, order_index")
        .order("order_index"),
      supabase
        .from("mastery")
        .select("topic_id, score, confidence")
        .eq("user_id", user.id),
      supabase.from("flashcards").select("id, topic_id"),
      supabase
        .from("review_states")
        .select("flashcard_id, next_review_at")
        .eq("user_id", user.id),
    ]);

  const profile = profileRes.data ?? null;
  const subjects = subjectsRes.data ?? [];
  const topics = topicsRes.data ?? [];
  const mastery = masteryRes.data ?? [];
  const flashcards = flashcardsRes.data ?? [];
  const states = statesRes.data ?? [];

  const masteryByTopic = new Map(mastery.map((m) => [m.topic_id, m]));

  const weakPoints: DashboardData["weak_points"] = [];
  const subjectGroups: SubjectMastery[] = subjects.map((s) => {
    const subjectTopics = topics
      .filter((t) => t.subject_id === s.id)
      .map((t) => {
        const m = masteryByTopic.get(t.id);
        return {
          id: t.id,
          name: t.name,
          score: m?.score ?? 0,
          confidence: m?.confidence ?? 0,
          cir_importance: t.cir_importance,
        };
      });

    for (const t of subjectTopics) {
      if (t.confidence > 0) {
        weakPoints.push({
          topic_id: t.id,
          topic_name: t.name,
          subject_id: s.id,
          score: t.score,
        });
      }
    }

    const scored = subjectTopics.filter((t) => t.confidence > 0);
    const avg_score =
      scored.length === 0
        ? 0
        : scored.reduce((acc, t) => acc + t.score, 0) / scored.length;

    return {
      id: s.id,
      name: s.name,
      description: s.description,
      color: s.color,
      topics: subjectTopics,
      avg_score,
    };
  });

  weakPoints.sort((a, b) => a.score - b.score);

  const due = selectDueFlashcardIds(flashcards, states);

  return {
    user_id: user.id,
    display_name: profile?.display_name ?? null,
    target_interview_date: profile?.target_interview_date ?? null,
    subjects: subjectGroups,
    weak_points: weakPoints.slice(0, 3),
    due_flashcards_today: due.length,
  };
}
