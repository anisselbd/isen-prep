// Running weighted mean of attempt scores per (user, topic).
//
// Rationale:
//   - Each attempt contributes score ∈ [0, 1] (gradeResult.score).
//   - We store a cumulative "confidence" (# attempts) so the dashboard can
//     show both a score and how stable that score is.
//   - Running mean gives a noise-robust signal that still reacts to a
//     persistent change in performance after a handful of attempts, and is
//     trivial to reason about ("I'm at 72% on integrales with 18 attempts").
//   - We deliberately do NOT weight by difficulty in v1. Exercises at a
//     topic are already picked adaptively (Phase 6), so the mix of
//     difficulties is representative of the learner's level.

export type MasteryState = {
  score: number;        // 0..1
  confidence: number;   // total number of attempts ingested
  last_updated: string; // ISO 8601
};

export type MasteryInput = Pick<MasteryState, "score" | "confidence"> | null;

export function updateMastery(
  prev: MasteryInput,
  attemptScore: number,
  now: Date = new Date()
): MasteryState {
  if (!Number.isFinite(attemptScore) || attemptScore < 0 || attemptScore > 1) {
    throw new RangeError(`attemptScore must be in [0, 1], got ${attemptScore}`);
  }
  const c = prev?.confidence ?? 0;
  const s = prev?.score ?? 0;
  const newConfidence = c + 1;
  const newScore = (s * c + attemptScore) / newConfidence;
  return {
    score: newScore,
    confidence: newConfidence,
    last_updated: now.toISOString(),
  };
}
