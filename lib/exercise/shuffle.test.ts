import { describe, it, expect } from "vitest";
import { seededShuffle } from "./shuffle";

describe("seededShuffle", () => {
  it("is deterministic for the same seed", () => {
    const items = ["a", "b", "c", "d", "e", "f"];
    const a = seededShuffle(items, "mcq-1");
    const b = seededShuffle(items, "mcq-1");
    expect(a).toEqual(b);
  });

  it("produces different orders for different seeds", () => {
    const items = ["a", "b", "c", "d", "e", "f"];
    const a = seededShuffle(items, "exercise-a");
    const b = seededShuffle(items, "exercise-b");
    expect(a).not.toEqual(b);
  });

  it("preserves all elements (no duplicates, no losses)", () => {
    const items = ["x", "y", "z", "w"];
    const out = seededShuffle(items, "test");
    expect(out.sort()).toEqual([...items].sort());
  });

  it("never leaves short arrays in their original order", () => {
    // For n=2, Fisher-Yates has 50% chance of identity — our
    // cyclic-shift fallback should guarantee a swap.
    for (let i = 0; i < 20; i++) {
      const items = ["A", "B"];
      const out = seededShuffle(items, `seed-${i}`);
      expect(out).not.toEqual(items);
    }
  });

  it("handles empty and singleton arrays", () => {
    expect(seededShuffle([], "s")).toEqual([]);
    expect(seededShuffle(["only"], "s")).toEqual(["only"]);
  });

  it("does not mutate the input array", () => {
    const items = ["a", "b", "c"];
    const snapshot = [...items];
    seededShuffle(items, "seed");
    expect(items).toEqual(snapshot);
  });
});
