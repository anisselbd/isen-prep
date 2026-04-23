import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { QuizGame, type QuizQuestion, type QuizSubject } from "./quiz-game";

export const metadata: Metadata = { title: "Quiz · ISEN PREP" };

export default async function QuizPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [exercisesRes, topicsRes, subjectsRes, masteryRes] = await Promise.all([
    supabase
      .from("exercises")
      .select("id, topic_id, difficulty, question_md, data, explanation_md")
      .eq("type", "mcq"),
    supabase.from("topics").select("id, name, subject_id"),
    supabase.from("subjects").select("id, name").order("order_index"),
    user
      ? supabase
          .from("mastery")
          .select("topic_id, score")
          .eq("user_id", user.id)
      : Promise.resolve({ data: [] }),
  ]);

  const topics = topicsRes.data ?? [];
  const topicById = new Map(topics.map((t) => [t.id, t]));

  const questions: QuizQuestion[] = (exercisesRes.data ?? [])
    .map((ex) => {
      const data = ex.data as { choices?: string[]; answer?: number };
      const topic = topicById.get(ex.topic_id);
      if (
        !data?.choices ||
        !Array.isArray(data.choices) ||
        typeof data.answer !== "number"
      ) {
        return null;
      }
      return {
        id: ex.id,
        topic_id: ex.topic_id,
        topic_name: topic?.name ?? ex.topic_id,
        subject_id: topic?.subject_id ?? "",
        difficulty: ex.difficulty,
        question_md: ex.question_md,
        choices: data.choices,
        correct_index: data.answer,
        explanation_md: ex.explanation_md ?? "",
      };
    })
    .filter((q): q is QuizQuestion => q !== null);

  const subjects: QuizSubject[] = (subjectsRes.data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
  }));

  const masteryByTopic: Record<string, number> = {};
  for (const m of masteryRes.data ?? []) {
    masteryByTopic[m.topic_id] = m.score ?? 0;
  }

  return (
    <QuizGame
      questions={questions}
      subjects={subjects}
      masteryByTopic={masteryByTopic}
    />
  );
}
