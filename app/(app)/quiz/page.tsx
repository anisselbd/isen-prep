import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { QuizGame, type QuizQuestion } from "./quiz-game";

export const metadata: Metadata = { title: "Quiz · ISEN PREP" };

export default async function QuizPage() {
  const supabase = await createClient();

  const [exercisesRes, topicsRes] = await Promise.all([
    supabase
      .from("exercises")
      .select("id, topic_id, question_md, data, explanation_md")
      .eq("type", "mcq"),
    supabase.from("topics").select("id, name, subject_id"),
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
        question_md: ex.question_md,
        choices: data.choices,
        correct_index: data.answer,
        explanation_md: ex.explanation_md ?? "",
      };
    })
    .filter((q): q is QuizQuestion => q !== null);

  return <QuizGame questions={questions} />;
}
