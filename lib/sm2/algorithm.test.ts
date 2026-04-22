import { describe, it, expect } from "vitest";
import { applySM2, type Quality, type ReviewState } from "./algorithm";

const FIXED_NOW = new Date("2026-04-23T10:00:00.000Z");

function step(prev: ReviewState | null, quality: Quality, now = FIXED_NOW): ReviewState {
  return applySM2({ quality, prev, now });
}

describe("applySM2 — new card paths", () => {
  it("quality 5 on a new card: reps=1, EF rises to 2.6, interval=1 day", () => {
    const r = step(null, 5);
    expect(r.repetitions).toBe(1);
    expect(r.easiness).toBeCloseTo(2.6, 5);
    expect(r.interval_days).toBe(1);
    expect(r.next_review_at).toBe("2026-04-24T00:00:00.000Z");
  });

  it("quality 4 on a new card: reps=1, EF stable at 2.5, interval=1", () => {
    const r = step(null, 4);
    expect(r.repetitions).toBe(1);
    expect(r.easiness).toBeCloseTo(2.5, 5);
    expect(r.interval_days).toBe(1);
  });

  it("quality 3 on a new card: reps=1, EF drops to 2.36, interval=1", () => {
    const r = step(null, 3);
    expect(r.repetitions).toBe(1);
    expect(r.easiness).toBeCloseTo(2.36, 2);
    expect(r.interval_days).toBe(1);
  });

  it("quality 0 on a new card: reps=0, EF drops, interval=1, still scheduled tomorrow", () => {
    const r = step(null, 0);
    expect(r.repetitions).toBe(0);
    expect(r.easiness).toBeLessThan(2.5);
    expect(r.interval_days).toBe(1);
  });
});

describe("applySM2 — the canonical SM-2 progression with perfect recalls", () => {
  it("interval sequence 1 → 6 → round(6 * EF) with quality 5 throughout", () => {
    const r1 = step(null, 5);
    expect(r1.interval_days).toBe(1);

    const r2 = step(r1, 5);
    expect(r2.repetitions).toBe(2);
    expect(r2.interval_days).toBe(6);

    const r3 = step(r2, 5);
    expect(r3.repetitions).toBe(3);
    // SM-2 uses the freshly-updated EF to compute the new interval.
    expect(r3.interval_days).toBe(Math.round(r2.interval_days * r3.easiness));
    expect(r3.interval_days).toBeGreaterThanOrEqual(14);
  });
});

describe("applySM2 — failure resets the streak but keeps (reduced) easiness", () => {
  it("quality 0 after 3 perfect reviews resets repetitions to 0 and interval to 1 day", () => {
    const r1 = step(null, 5);
    const r2 = step(r1, 5);
    const r3 = step(r2, 5);
    const r4 = step(r3, 0);
    expect(r4.repetitions).toBe(0);
    expect(r4.interval_days).toBe(1);
    // Easiness is reduced but must never fall below the SM-2 floor.
    expect(r4.easiness).toBeLessThan(r3.easiness);
    expect(r4.easiness).toBeGreaterThanOrEqual(1.3);
  });
});

describe("applySM2 — easiness floor is 1.3", () => {
  it("repeated quality 0 clamps EF to 1.3 exactly", () => {
    let r: ReviewState = step(null, 0);
    for (let i = 0; i < 30; i++) r = step(r, 0);
    expect(r.easiness).toBeCloseTo(1.3, 5);
  });

  it("quality 3 alone pushes EF down by ~0.14 per review but stays ≥ 1.3", () => {
    let r: ReviewState = step(null, 3);
    for (let i = 0; i < 30; i++) r = step(r, 3);
    expect(r.easiness).toBeCloseTo(1.3, 5);
  });
});

describe("applySM2 — quality 5 past the early stages keeps compounding EF", () => {
  it("long chain of quality-5 reviews lengthens the interval", () => {
    let r: ReviewState = step(null, 5);
    for (let i = 0; i < 6; i++) r = step(r, 5);
    expect(r.repetitions).toBe(7);
    // After many quality-5s, interval has grown well beyond 6 days
    expect(r.interval_days).toBeGreaterThan(60);
  });
});

describe("applySM2 — date arithmetic", () => {
  it("next_review_at is now + interval_days at UTC midnight", () => {
    const now = new Date("2026-04-23T14:37:00.000Z");
    const r = applySM2({ quality: 5, prev: null, now });
    expect(r.next_review_at).toBe("2026-04-24T00:00:00.000Z");
    expect(r.last_reviewed_at).toBe("2026-04-23T14:37:00.000Z");
  });

  it("interval after many successes still lands on an exact UTC day boundary", () => {
    let r: ReviewState = step(null, 5);
    for (let i = 0; i < 5; i++) r = step(r, 5);
    expect(r.next_review_at.endsWith("T00:00:00.000Z")).toBe(true);
  });
});

describe("applySM2 — interval never reaches 0", () => {
  it("round(prev * ef) with small prev stays ≥ 1", () => {
    // Force a path where prev is small; since quality=3 repeats give prev=6 eventually,
    // this is mostly a sanity check on Math.max(1, …).
    let r: ReviewState = step(null, 3);
    r = step(r, 3); // now prev=6, ef ≈ 2.22
    r = step(r, 3);
    expect(r.interval_days).toBeGreaterThanOrEqual(1);
  });
});
