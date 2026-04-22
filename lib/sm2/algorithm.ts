// Classic SuperMemo-2 spaced repetition.
// Reference: Piotr Wozniak, https://super-memory.com/english/ol/sm2.htm
//
// Quality scale used by the UI:
//   0 = Oublié   (complete blackout)
//   3 = Difficile (correct with serious difficulty)
//   4 = Correct   (correct after hesitation)
//   5 = Facile    (perfect recall)
//
// State per (user, flashcard):
//   repetitions    — consecutive correct recalls (reset on failure)
//   easiness       — EF factor, ≥ 1.3 (how fast intervals grow)
//   interval_days  — days until next_review_at from last_reviewed_at
//   next_review_at — when the card is due again
//   last_reviewed_at — timestamp of the review that produced this state

export type Quality = 0 | 3 | 4 | 5;

export type ReviewState = {
  repetitions: number;
  easiness: number;
  interval_days: number;
  next_review_at: string;
  last_reviewed_at: string;
};

export type ReviewStateInput = Partial<
  Pick<ReviewState, "repetitions" | "easiness" | "interval_days">
> | null;

export type SM2Input = {
  quality: Quality;
  prev: ReviewStateInput;
  now?: Date;
};

const MIN_EASINESS = 1.3;
const DEFAULT_EASINESS = 2.5;

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

export function applySM2({ quality, prev, now = new Date() }: SM2Input): ReviewState {
  const prevRep = prev?.repetitions ?? 0;
  const prevEF = prev?.easiness ?? DEFAULT_EASINESS;
  const prevInt = prev?.interval_days ?? 0;

  // Easiness update — applies on every review, regardless of success.
  // The formula penalises low-quality answers and rewards high-quality ones.
  const q = quality;
  let ef = prevEF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ef < MIN_EASINESS) ef = MIN_EASINESS;

  let repetitions: number;
  let interval_days: number;

  if (quality < 3) {
    // Failure: reset the streak but keep the (reduced) easiness.
    repetitions = 0;
    interval_days = 1;
  } else {
    // Success: progress through 1-day → 6-day → previous * EF.
    if (prevRep === 0) interval_days = 1;
    else if (prevRep === 1) interval_days = 6;
    else interval_days = Math.max(1, Math.round(prevInt * ef));
    repetitions = prevRep + 1;
  }

  return {
    repetitions,
    easiness: ef,
    interval_days,
    next_review_at: addDays(now, interval_days).toISOString(),
    last_reviewed_at: now.toISOString(),
  };
}
