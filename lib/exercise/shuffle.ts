// Mulberry32 PRNG + FNV-1a 32-bit string hash → deterministic shuffle.
// Same seed string always produces the same permutation, so an exercise
// with id "ordering-1" renders the same shuffled order across reloads
// and across devices.

function hashSeed(seed: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  if (items.length <= 1) return [...items];
  const rng = mulberry32(hashSeed(seed));
  const result = [...items];

  // Fisher-Yates
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = result[i] as T;
    result[i] = result[j] as T;
    result[j] = tmp;
  }

  // Guarantee a visible shuffle: if we landed on the original order
  // (≈1/n! probability, noticeable for n ≤ 3), cyclic shift by one.
  const isIdentity = result.every((x, i) => x === items[i]);
  if (isIdentity) {
    const first = result.shift() as T;
    result.push(first);
  }
  return result;
}
