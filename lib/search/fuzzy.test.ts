import { describe, it, expect } from "vitest";
import { fuzzySearch } from "./fuzzy";
import type { SearchItem } from "./build-index";

const items: SearchItem[] = [
  {
    id: "topic:maths.analyse.derivees",
    kind: "topic",
    title: "Dérivées",
    subtitle: "Mathématiques",
    href: "/subjects/maths/maths.analyse.derivees",
  },
  {
    id: "lesson:derivees-lesson",
    kind: "lesson",
    title: "Dérivées : du sens physique aux formules",
    subtitle: "Leçon · Dérivées",
    href: "/subjects/maths/maths.analyse.derivees/lesson",
  },
  {
    id: "topic:maths.proba.bayes",
    kind: "topic",
    title: "Probabilités conditionnelles",
    subtitle: "Mathématiques",
    href: "/subjects/maths/maths.proba.bayes",
  },
  {
    id: "subject:physique",
    kind: "subject",
    title: "Physique",
    subtitle: "Mécanique, électrocinétique, ondes",
    href: "/subjects/physique",
  },
];

describe("fuzzySearch", () => {
  it("returns all items when query is empty", () => {
    expect(fuzzySearch(items, "").length).toBe(4);
  });

  it("matches accents-insensitively", () => {
    const r = fuzzySearch(items, "derivees");
    expect(r.length).toBeGreaterThan(0);
    expect(r[0]?.title.toLowerCase()).toContain("dérivées");
  });

  it("ranks title starts-with above subtitle matches", () => {
    const r = fuzzySearch(items, "physique");
    expect(r[0]?.id).toBe("subject:physique");
  });

  it("returns no items when words don't all match", () => {
    expect(fuzzySearch(items, "kubernetes gitops").length).toBe(0);
  });

  it("handles multi-word queries", () => {
    const r = fuzzySearch(items, "probabilités conditionnelles");
    expect(r[0]?.id).toBe("topic:maths.proba.bayes");
  });
});
