import { describe, it, expect } from "vitest";
import { selectDueFlashcardIds } from "./due";

const now = new Date("2026-04-23T12:00:00.000Z");

describe("selectDueFlashcardIds", () => {
  it("returns all new cards (no state) as due, preserving input order", () => {
    const flashcards = [{ id: "a" }, { id: "b" }, { id: "c" }];
    const result = selectDueFlashcardIds(flashcards, [], now);
    expect(result.map((c) => c.id)).toEqual(["a", "b", "c"]);
  });

  it("orders never-reviewed cards before already-reviewed cards", () => {
    const flashcards = [{ id: "old" }, { id: "new" }];
    const states = [{ flashcard_id: "old", next_review_at: "2026-04-20T00:00:00.000Z" }];
    const result = selectDueFlashcardIds(flashcards, states, now);
    expect(result.map((c) => c.id)).toEqual(["new", "old"]);
  });

  it("orders due cards by ascending next_review_at (most overdue first)", () => {
    const flashcards = [{ id: "c1" }, { id: "c2" }, { id: "c3" }];
    const states = [
      { flashcard_id: "c1", next_review_at: "2026-04-22T00:00:00.000Z" },
      { flashcard_id: "c2", next_review_at: "2026-04-21T00:00:00.000Z" },
      { flashcard_id: "c3", next_review_at: "2026-04-20T00:00:00.000Z" },
    ];
    const result = selectDueFlashcardIds(flashcards, states, now);
    expect(result.map((c) => c.id)).toEqual(["c3", "c2", "c1"]);
  });

  it("excludes cards whose next_review_at is in the future", () => {
    const flashcards = [{ id: "due" }, { id: "later" }];
    const states = [
      { flashcard_id: "due", next_review_at: "2026-04-22T00:00:00.000Z" },
      { flashcard_id: "later", next_review_at: "2026-04-25T00:00:00.000Z" },
    ];
    const result = selectDueFlashcardIds(flashcards, states, now);
    expect(result.map((c) => c.id)).toEqual(["due"]);
  });

  it("card with next_review_at exactly equal to now is due", () => {
    const flashcards = [{ id: "edge" }];
    const states = [{ flashcard_id: "edge", next_review_at: now.toISOString() }];
    expect(selectDueFlashcardIds(flashcards, states, now)).toHaveLength(1);
  });

  it("ignores states referencing flashcards not in the input set", () => {
    const flashcards = [{ id: "a" }];
    const states = [{ flashcard_id: "ghost", next_review_at: "2026-04-22T00:00:00.000Z" }];
    const result = selectDueFlashcardIds(flashcards, states, now);
    expect(result.map((c) => c.id)).toEqual(["a"]);
  });

  it("is pure: does not mutate inputs", () => {
    const flashcards = [{ id: "a" }, { id: "b" }];
    const states = [{ flashcard_id: "a", next_review_at: "2026-04-22T00:00:00.000Z" }];
    const snapshotF = [...flashcards];
    const snapshotS = [...states];
    selectDueFlashcardIds(flashcards, states, now);
    expect(flashcards).toEqual(snapshotF);
    expect(states).toEqual(snapshotS);
  });
});
