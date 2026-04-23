import { describe, it, expect } from "vitest";
import { computeStreak, datesFromTimestamps } from "./compute";

function at(y: number, m: number, d: number): Date {
  return new Date(y, m - 1, d, 12);
}

describe("computeStreak", () => {
  it("returns zeros when no activity", () => {
    const r = computeStreak([], at(2026, 4, 23));
    expect(r).toEqual({
      current: 0,
      best: 0,
      active_today: false,
      active_yesterday: false,
    });
  });

  it("counts a 1-day streak when only today is active", () => {
    const r = computeStreak(["2026-04-23"], at(2026, 4, 23));
    expect(r.current).toBe(1);
    expect(r.best).toBe(1);
    expect(r.active_today).toBe(true);
  });

  it("counts a 3-day streak ending today", () => {
    const r = computeStreak(
      ["2026-04-21", "2026-04-22", "2026-04-23"],
      at(2026, 4, 23),
    );
    expect(r.current).toBe(3);
    expect(r.best).toBe(3);
  });

  it("keeps the streak visible if today not yet active but yesterday was", () => {
    const r = computeStreak(
      ["2026-04-21", "2026-04-22"],
      at(2026, 4, 23),
    );
    expect(r.current).toBe(2);
    expect(r.active_today).toBe(false);
    expect(r.active_yesterday).toBe(true);
  });

  it("resets current if last activity was 2+ days ago", () => {
    const r = computeStreak(
      ["2026-04-20"],
      at(2026, 4, 23),
    );
    expect(r.current).toBe(0);
    expect(r.best).toBe(1);
  });

  it("computes best as the longest historical run", () => {
    const r = computeStreak(
      ["2026-04-01", "2026-04-02", "2026-04-03", "2026-04-04", "2026-04-10"],
      at(2026, 4, 23),
    );
    expect(r.current).toBe(0);
    expect(r.best).toBe(4);
  });

  it("ignores duplicates in input", () => {
    const r = computeStreak(
      ["2026-04-23", "2026-04-23"],
      at(2026, 4, 23),
    );
    expect(r.current).toBe(1);
    expect(r.best).toBe(1);
  });
});

describe("datesFromTimestamps", () => {
  it("extracts YYYY-MM-DD and dedupes", () => {
    const out = datesFromTimestamps([
      "2026-04-23T10:00:00Z",
      "2026-04-23T22:30:00Z",
      "2026-04-22T09:00:00Z",
      null,
    ]);
    expect(out.sort()).toEqual(["2026-04-22", "2026-04-23"]);
  });

  it("handles empty", () => {
    expect(datesFromTimestamps([])).toEqual([]);
  });
});
