import { describe, it, expect } from "vitest";
import { updateMastery } from "./update";

describe("updateMastery", () => {
  it("first attempt: score equals the attempt score, confidence=1", () => {
    const r = updateMastery(null, 1);
    expect(r.score).toBe(1);
    expect(r.confidence).toBe(1);
  });

  it("first attempt with 0 score", () => {
    const r = updateMastery(null, 0);
    expect(r.score).toBe(0);
    expect(r.confidence).toBe(1);
  });

  it("five perfect + one wrong averages to 5/6", () => {
    let m = updateMastery(null, 1);
    for (let i = 0; i < 4; i++) m = updateMastery(m, 1);
    m = updateMastery(m, 0);
    expect(m.score).toBeCloseTo(5 / 6, 6);
    expect(m.confidence).toBe(6);
  });

  it("converges to the true rate over many attempts", () => {
    let m = updateMastery(null, 1);
    // 70 correct, 30 incorrect, interleaved
    for (let i = 0; i < 100; i++) {
      const correct = i % 10 < 7; // first 7 of every 10
      m = updateMastery(m, correct ? 1 : 0);
    }
    expect(m.confidence).toBe(101); // first + 100
    expect(m.score).toBeCloseTo(0.7, 1);
  });

  it("partial scores (0.5) contribute proportionally", () => {
    let m = updateMastery(null, 0.5);
    m = updateMastery(m, 0.5);
    m = updateMastery(m, 0.5);
    expect(m.score).toBeCloseTo(0.5, 6);
  });

  it("rejects out-of-range attemptScore", () => {
    expect(() => updateMastery(null, 1.5)).toThrow(RangeError);
    expect(() => updateMastery(null, -0.1)).toThrow(RangeError);
    expect(() => updateMastery(null, Number.NaN)).toThrow(RangeError);
  });

  it("last_updated reflects the provided `now`", () => {
    const now = new Date("2026-04-23T15:00:00.000Z");
    const m = updateMastery(null, 1, now);
    expect(m.last_updated).toBe("2026-04-23T15:00:00.000Z");
  });
});
