import "server-only";

import { createClient } from "@/lib/supabase/server";
import { selectDueFlashcardIds } from "./due";
import type { Database } from "@/types/database";

type Flashcard = Database["public"]["Tables"]["flashcards"]["Row"];

export type FlashcardWithState = Flashcard & {
  next_review_at: string | null;
  repetitions: number;
  easiness: number;
  interval_days: number;
};

/**
 * Returns the flashcards the current user should review right now.
 *
 * "Due" = never reviewed OR next_review_at ≤ now. Ordered never-seen first
 * (most value for brand-new cards), then by earliest overdue.
 */
export async function listDueFlashcards(options: {
  topicId?: string;
  limit?: number;
}): Promise<FlashcardWithState[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  let flashcardsQuery = supabase
    .from("flashcards")
    .select("id, topic_id, front_md, back_md, tags");
  if (options.topicId) flashcardsQuery = flashcardsQuery.eq("topic_id", options.topicId);

  const [{ data: flashcards }, { data: states }] = await Promise.all([
    flashcardsQuery,
    supabase
      .from("review_states")
      .select("flashcard_id, next_review_at, repetitions, easiness, interval_days")
      .eq("user_id", user.id),
  ]);

  if (!flashcards) return [];

  const dueOrder = selectDueFlashcardIds(flashcards, states ?? []);
  const stateById = new Map((states ?? []).map((s) => [s.flashcard_id, s]));

  const enriched: FlashcardWithState[] = dueOrder.map((card) => {
    const s = stateById.get(card.id);
    return {
      ...card,
      next_review_at: s?.next_review_at ?? null,
      repetitions: s?.repetitions ?? 0,
      easiness: s?.easiness ?? 2.5,
      interval_days: s?.interval_days ?? 0,
    };
  });

  return options.limit ? enriched.slice(0, options.limit) : enriched;
}
