import { describe, it, expect } from "vitest";
import { gradeExercise } from "./grading";

describe("gradeExercise — MCQ", () => {
  const data = { choices: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 1 };

  it("correct single selection", () => {
    expect(gradeExercise("mcq", data, { selected: [1] })).toEqual({
      status: "graded",
      is_correct: true,
      score: 1,
    });
  });

  it("wrong selection", () => {
    expect(gradeExercise("mcq", data, { selected: [3] })).toMatchObject({
      status: "graded",
      is_correct: false,
      score: 0,
    });
  });

  it("empty selection is incorrect, not invalid", () => {
    expect(gradeExercise("mcq", data, { selected: [] })).toMatchObject({
      status: "graded",
      is_correct: false,
    });
  });

  it("multi-answer set-equality (order independent)", () => {
    const multi = { choices: ["a", "b", "c", "d"], answer: [0, 2], multiple: true };
    expect(gradeExercise("mcq", multi, { selected: [2, 0] })).toMatchObject({ is_correct: true });
    expect(gradeExercise("mcq", multi, { selected: [0] })).toMatchObject({ is_correct: false });
    expect(gradeExercise("mcq", multi, { selected: [0, 1, 2] })).toMatchObject({ is_correct: false });
  });

  it("malformed data (answer out of range)", () => {
    expect(
      gradeExercise("mcq", { choices: ["a", "b"], answer: 5 }, { selected: [0] })
    ).toMatchObject({ status: "invalid" });
  });

  it("malformed answer payload", () => {
    expect(gradeExercise("mcq", data, { wrong: "shape" })).toMatchObject({ status: "invalid" });
  });
});

describe("gradeExercise — Numeric", () => {
  it("exact match with default tolerance", () => {
    expect(gradeExercise("numeric", { answer: 7 }, { value: 7 })).toMatchObject({
      is_correct: true,
    });
  });

  it("within tolerance", () => {
    expect(
      gradeExercise("numeric", { answer: 66.67, tolerance: 0.5 }, { value: 66.6667 })
    ).toMatchObject({ is_correct: true });
  });

  it("just outside tolerance", () => {
    expect(
      gradeExercise("numeric", { answer: 10, tolerance: 0.1 }, { value: 10.11 })
    ).toMatchObject({ is_correct: false });
  });

  it("exactly at tolerance boundary is correct", () => {
    expect(
      gradeExercise("numeric", { answer: 0, tolerance: 0.5 }, { value: 0.5 })
    ).toMatchObject({ is_correct: true });
    expect(
      gradeExercise("numeric", { answer: 0, tolerance: 0.5 }, { value: -0.5 })
    ).toMatchObject({ is_correct: true });
  });

  it("NaN is invalid", () => {
    expect(gradeExercise("numeric", { answer: 7 }, { value: Number.NaN })).toMatchObject({
      status: "invalid",
    });
  });

  it("Infinity is invalid", () => {
    expect(gradeExercise("numeric", { answer: 7 }, { value: Infinity })).toMatchObject({
      status: "invalid",
    });
  });

  it("very large value far from answer", () => {
    expect(gradeExercise("numeric", { answer: 0 }, { value: 1e308 })).toMatchObject({
      is_correct: false,
    });
  });

  it("negative tolerance in data is rejected", () => {
    expect(
      gradeExercise("numeric", { answer: 1, tolerance: -0.1 }, { value: 1 })
    ).toMatchObject({ status: "invalid" });
  });
});

describe("gradeExercise — Formula", () => {
  const data = { expected_latex: "x^2 + x + C", equivalent_forms: ["x^{2}+x+C"] };

  it("exact match", () => {
    expect(gradeExercise("formula", data, { latex: "x^2 + x + C" })).toMatchObject({
      is_correct: true,
    });
  });

  it("whitespace + braces normalized", () => {
    expect(gradeExercise("formula", data, { latex: "x ^{2} + x + C" })).toMatchObject({
      is_correct: true,
    });
  });

  it("matches equivalent form", () => {
    expect(gradeExercise("formula", data, { latex: "x^{2}+x+C" })).toMatchObject({
      is_correct: true,
    });
  });

  it("unknown form defers to AI", () => {
    expect(gradeExercise("formula", data, { latex: "x(x+1)+C" })).toMatchObject({
      status: "pending_ai",
    });
  });

  it("empty formula is incorrect, not AI-pending", () => {
    expect(gradeExercise("formula", data, { latex: "   " })).toMatchObject({
      status: "graded",
      is_correct: false,
    });
  });
});

describe("gradeExercise — Text / Code defer to AI", () => {
  it("text with content → pending_ai", () => {
    expect(
      gradeExercise(
        "text",
        { expected_key_points: ["retrieval", "embeddings"] },
        { text: "Un RAG combine de la recherche vectorielle et de la génération." }
      )
    ).toMatchObject({ status: "pending_ai" });
  });

  it("empty text → graded incorrect", () => {
    expect(
      gradeExercise("text", { expected_key_points: ["x"] }, { text: "" })
    ).toMatchObject({ status: "graded", is_correct: false });
  });

  it("code with content → pending_ai", () => {
    expect(
      gradeExercise(
        "code",
        { language: "js" },
        { code: "function max(arr){return Math.max(...arr);}" }
      )
    ).toMatchObject({ status: "pending_ai" });
  });

  it("empty code → graded incorrect", () => {
    expect(
      gradeExercise("code", { language: "js" }, { code: "" })
    ).toMatchObject({ status: "graded", is_correct: false });
  });
});

describe("gradeExercise — Circuit", () => {
  const parallel = {
    components: [
      { type: "R", label: "R1", value: 100 },
      { type: "R", label: "R2", value: 200 },
    ],
    configuration: "parallel",
    question: "R_eq",
    answer: 66.67,
    tolerance: 0.5,
  };

  it("within tolerance", () => {
    expect(gradeExercise("circuit", parallel, { value: 66.666 })).toMatchObject({
      is_correct: true,
    });
  });

  it("outside tolerance", () => {
    expect(gradeExercise("circuit", parallel, { value: 100 })).toMatchObject({
      is_correct: false,
    });
  });

  it("NaN rejected", () => {
    expect(gradeExercise("circuit", parallel, { value: Number.NaN })).toMatchObject({
      status: "invalid",
    });
  });
});

describe("gradeExercise — Conversion", () => {
  const data = {
    source: { base: "hex", value: "A3" },
    targets: ["decimal", "binary"],
  };

  it("all correct (case-insensitive hex, with/without 0x, 0b prefix tolerated)", () => {
    expect(
      gradeExercise("conversion", data, {
        values: { decimal: "163", binary: "0b10100011" },
      })
    ).toMatchObject({ is_correct: true, score: 1 });
  });

  it("decimal correct, binary wrong → partial score", () => {
    const r = gradeExercise("conversion", data, {
      values: { decimal: "163", binary: "10100010" },
    });
    expect(r).toMatchObject({ status: "graded", is_correct: false });
    if (r.status === "graded") expect(r.score).toBeCloseTo(0.5);
  });

  it("missing a target value → no credit for that target", () => {
    const r = gradeExercise("conversion", data, { values: { decimal: "163" } });
    if (r.status === "graded") expect(r.score).toBeCloseTo(0.5);
  });

  it("invalid digits for the base → rejected", () => {
    const r = gradeExercise("conversion", data, {
      values: { decimal: "163", binary: "12345" },
    });
    if (r.status === "graded") expect(r.score).toBeCloseTo(0.5);
  });

  it("malformed source is invalid", () => {
    expect(
      gradeExercise(
        "conversion",
        { source: { base: "hex", value: "ZZ" }, targets: ["decimal"] },
        { values: { decimal: "0" } }
      )
    ).toMatchObject({ status: "invalid" });
  });

  it("decimal → hex target, uppercase tolerated via case-insensitive compare", () => {
    expect(
      gradeExercise(
        "conversion",
        { source: { base: "decimal", value: "255" }, targets: ["hex"] },
        { values: { hex: "0xFF" } }
      )
    ).toMatchObject({ is_correct: true, score: 1 });
  });
});

describe("gradeExercise — Ordering", () => {
  const data = { items: ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)"] };

  it("exact order → correct", () => {
    expect(gradeExercise("ordering", data, { order: data.items })).toMatchObject({
      is_correct: true,
    });
  });

  it("one swap → incorrect", () => {
    const wrong = [...data.items];
    [wrong[0], wrong[1]] = [wrong[1] as string, wrong[0] as string];
    expect(gradeExercise("ordering", data, { order: wrong })).toMatchObject({
      is_correct: false,
    });
  });

  it("length mismatch → invalid", () => {
    expect(gradeExercise("ordering", data, { order: ["O(1)"] })).toMatchObject({
      status: "invalid",
    });
  });
});

describe("gradeExercise — MatchPairs", () => {
  const data = {
    pairs: [
      { left: "Dichotomie", right: "O(log n)" },
      { left: "Tri rapide", right: "O(n log n)" },
      { left: "Tri à bulles", right: "O(n²)" },
    ],
  };

  it("all matched correctly", () => {
    expect(gradeExercise("match_pairs", data, { matches: data.pairs })).toMatchObject({
      is_correct: true,
      score: 1,
    });
  });

  it("one wrong → partial score", () => {
    const r = gradeExercise("match_pairs", data, {
      matches: [
        { left: "Dichotomie", right: "O(log n)" },
        { left: "Tri rapide", right: "O(n²)" },
        { left: "Tri à bulles", right: "O(n log n)" },
      ],
    });
    if (r.status === "graded") expect(r.score).toBeCloseTo(1 / 3);
  });

  it("incomplete matches → invalid", () => {
    expect(
      gradeExercise("match_pairs", data, {
        matches: [{ left: "Dichotomie", right: "O(log n)" }],
      })
    ).toMatchObject({ status: "invalid" });
  });
});
