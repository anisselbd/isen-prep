// Pure streak math. Given a set of YYYY-MM-DD dates (user's activity days),
// returns the current and best streak values.

export type StreakResult = {
  current: number;
  best: number;
  /** true if the user was active today. */
  active_today: boolean;
  /** true if the user was active yesterday (used for soft-fail messaging). */
  active_yesterday: boolean;
};

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function computeStreak(
  activeDates: Iterable<string>,
  today: Date = new Date(),
): StreakResult {
  const set = new Set(activeDates);
  if (set.size === 0) {
    return { current: 0, best: 0, active_today: false, active_yesterday: false };
  }

  const todayStr = ymd(today);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = ymd(yesterday);

  const activeToday = set.has(todayStr);
  const activeYesterday = set.has(yesterdayStr);

  // Compute current streak: walk backwards from today (or from yesterday if
  // today is not active yet — "soft fail" that still shows the streak).
  let cursor = new Date(today);
  if (!activeToday) {
    // Start from yesterday if today not yet active.
    cursor.setDate(cursor.getDate() - 1);
  }
  let current = 0;
  while (set.has(ymd(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  // Best streak: scan all dates sorted ascending, count consecutive runs.
  const sorted = [...set].sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const s of sorted) {
    const d = new Date(s + "T00:00:00");
    if (prev) {
      const diffDays = Math.round((d.getTime() - prev.getTime()) / 86_400_000);
      if (diffDays === 1) {
        run += 1;
      } else {
        run = 1;
      }
    } else {
      run = 1;
    }
    if (run > best) best = run;
    prev = d;
  }

  return {
    current,
    best,
    active_today: activeToday,
    active_yesterday: activeYesterday,
  };
}

/** Convert a list of timestamps (ISO) into a set of YYYY-MM-DD strings. */
export function datesFromTimestamps(timestamps: Array<string | null>): string[] {
  const out = new Set<string>();
  for (const t of timestamps) {
    if (!t) continue;
    out.add(t.slice(0, 10));
  }
  return [...out];
}
