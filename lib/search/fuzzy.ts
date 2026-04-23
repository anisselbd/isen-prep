import type { SearchItem } from "./build-index";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Score 0 = no match. Higher is better. */
function scoreItem(item: SearchItem, normalizedQuery: string): number {
  if (!normalizedQuery) return 1;
  const title = normalize(item.title);
  const subtitle = normalize(item.subtitle ?? "");
  const hint = normalize(item.hint ?? "");

  let score = 0;
  // Split query into words; each word must match somewhere.
  const words = normalizedQuery.split(" ").filter(Boolean);
  for (const w of words) {
    if (title.includes(w)) {
      // Word that matches the title counts more. Bonus if the title starts
      // with the word.
      score += title.startsWith(w) ? 10 : 5;
    } else if (subtitle.includes(w)) {
      score += 2;
    } else if (hint.includes(w)) {
      score += 1;
    } else {
      return 0; // all words must match at least somewhere
    }
  }
  return score;
}

export function fuzzySearch(
  items: SearchItem[],
  query: string,
): SearchItem[] {
  const q = normalize(query);
  if (!q) return items.slice(0, 50);

  const scored = items
    .map((it) => ({ it, score: scoreItem(it, q) }))
    .filter((x) => x.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 50).map((x) => x.it);
}
