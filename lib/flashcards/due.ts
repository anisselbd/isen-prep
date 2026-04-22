// Pure selection logic: given a set of flashcards and the user's review
// states, return the cards that are "due or new", ordered so that never-seen
// cards come first, then cards due earliest.

export type FlashcardRef = { id: string };
export type ReviewStateRef = { flashcard_id: string; next_review_at: string };

export function selectDueFlashcardIds<F extends FlashcardRef>(
  flashcards: readonly F[],
  states: readonly ReviewStateRef[],
  now: Date = new Date()
): F[] {
  const stateByFlashcard = new Map<string, string>();
  for (const s of states) stateByFlashcard.set(s.flashcard_id, s.next_review_at);

  const nowMs = now.getTime();

  return flashcards
    .map((f) => ({ card: f, due: stateByFlashcard.get(f.id) }))
    .filter(({ due }) => {
      if (!due) return true; // never-reviewed → always due
      return new Date(due).getTime() <= nowMs;
    })
    .sort((a, b) => {
      // NULLS FIRST: new cards before cards that were already reviewed.
      if (!a.due && !b.due) return 0;
      if (!a.due) return -1;
      if (!b.due) return 1;
      return new Date(a.due).getTime() - new Date(b.due).getTime();
    })
    .map(({ card }) => card);
}
