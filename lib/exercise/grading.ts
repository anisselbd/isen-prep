import type { ExerciseType } from "@/types/database";
import {
  mcqDataSchema,
  mcqAnswerSchema,
  numericDataSchema,
  numericAnswerSchema,
  formulaDataSchema,
  formulaAnswerSchema,
  textDataSchema,
  textAnswerSchema,
  codeDataSchema,
  codeAnswerSchema,
  circuitDataSchema,
  circuitAnswerSchema,
  conversionDataSchema,
  conversionAnswerSchema,
  orderingDataSchema,
  orderingAnswerSchema,
  matchPairsDataSchema,
  matchPairsAnswerSchema,
} from "./types";

export type GradeResult =
  | { status: "graded"; is_correct: boolean; score: number; feedback?: string }
  | { status: "invalid"; reason: string }
  | { status: "pending_ai"; reason: string };

const DEFAULT_NUMERIC_TOLERANCE = 1e-6;

// ---------- utilities -----------------------------------------------------

const setEqual = (a: readonly number[], b: readonly number[]): boolean =>
  a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);

const normalizeLatex = (s: string): string =>
  s
    .replace(/\s+/g, "")
    .replace(/\\\\/g, "\\")
    .replace(/\{\s*\}/g, "")
    .replace(/\\,|\\;|\\!|\\:/g, "")
    .toLowerCase();

const stripPrefix = (s: string, base: "decimal" | "binary" | "hex"): string => {
  const t = s.trim().replace(/\s+/g, "").toLowerCase();
  if (base === "binary") return t.replace(/^0b/, "");
  if (base === "hex") return t.replace(/^0x/, "");
  return t;
};

const convertDecimal = (value: string, base: "decimal" | "binary" | "hex"): bigint | null => {
  const v = stripPrefix(value, base);
  if (!v) return null;
  try {
    if (base === "decimal") return /^[0-9]+$/.test(v) ? BigInt(v) : null;
    if (base === "binary") return /^[01]+$/.test(v) ? BigInt("0b" + v) : null;
    return /^[0-9a-f]+$/.test(v) ? BigInt("0x" + v) : null;
  } catch {
    return null;
  }
};

const toBase = (n: bigint, base: "decimal" | "binary" | "hex"): string => {
  if (base === "decimal") return n.toString(10);
  if (base === "binary") return n.toString(2);
  return n.toString(16);
};

// ---------- per-type graders ---------------------------------------------

function gradeMCQ(data: unknown, answer: unknown): GradeResult {
  const d = mcqDataSchema.safeParse(data);
  const a = mcqAnswerSchema.safeParse(answer);
  if (!d.success) return { status: "invalid", reason: "malformed MCQ data" };
  if (!a.success) return { status: "invalid", reason: "malformed MCQ answer" };
  if (a.data.selected.length === 0) {
    return { status: "graded", is_correct: false, score: 0, feedback: "Aucune réponse sélectionnée." };
  }
  const expected = Array.isArray(d.data.answer) ? d.data.answer : [d.data.answer];
  const ok = setEqual(expected, a.data.selected);
  return { status: "graded", is_correct: ok, score: ok ? 1 : 0 };
}

function gradeNumeric(data: unknown, answer: unknown): GradeResult {
  const d = numericDataSchema.safeParse(data);
  const a = numericAnswerSchema.safeParse(answer);
  if (!d.success) return { status: "invalid", reason: "malformed numeric data" };
  if (!a.success) return { status: "invalid", reason: "malformed numeric answer" };
  const tol = d.data.tolerance ?? DEFAULT_NUMERIC_TOLERANCE;
  const diff = Math.abs(a.data.value - d.data.answer);
  const ok = diff <= tol;
  return { status: "graded", is_correct: ok, score: ok ? 1 : 0 };
}

function gradeFormula(data: unknown, answer: unknown): GradeResult {
  const d = formulaDataSchema.safeParse(data);
  const a = formulaAnswerSchema.safeParse(answer);
  if (!d.success) return { status: "invalid", reason: "malformed formula data" };
  if (!a.success) return { status: "invalid", reason: "malformed formula answer" };
  if (a.data.latex.trim().length === 0) {
    return { status: "graded", is_correct: false, score: 0, feedback: "Formule vide." };
  }
  const user = normalizeLatex(a.data.latex);
  const candidates = [d.data.expected_latex, ...(d.data.equivalent_forms ?? [])].map(normalizeLatex);
  if (candidates.includes(user)) {
    return { status: "graded", is_correct: true, score: 1 };
  }
  return { status: "pending_ai", reason: "formula not matched against known forms" };
}

function gradeText(data: unknown, answer: unknown): GradeResult {
  const d = textDataSchema.safeParse(data);
  const a = textAnswerSchema.safeParse(answer);
  if (!d.success) return { status: "invalid", reason: "malformed text data" };
  if (!a.success) return { status: "invalid", reason: "malformed text answer" };
  if (a.data.text.trim().length === 0) {
    return { status: "graded", is_correct: false, score: 0, feedback: "Réponse vide." };
  }
  return { status: "pending_ai", reason: "open-ended response, grading deferred to Gemini" };
}

function gradeCode(data: unknown, answer: unknown): GradeResult {
  const d = codeDataSchema.safeParse(data);
  const a = codeAnswerSchema.safeParse(answer);
  if (!d.success) return { status: "invalid", reason: "malformed code data" };
  if (!a.success) return { status: "invalid", reason: "malformed code answer" };
  if (a.data.code.trim().length === 0) {
    return { status: "graded", is_correct: false, score: 0, feedback: "Code vide." };
  }
  return { status: "pending_ai", reason: "code review deferred to Gemini" };
}

function gradeCircuit(data: unknown, answer: unknown): GradeResult {
  const d = circuitDataSchema.safeParse(data);
  const a = circuitAnswerSchema.safeParse(answer);
  if (!d.success) return { status: "invalid", reason: "malformed circuit data" };
  if (!a.success) return { status: "invalid", reason: "malformed circuit answer" };
  const diff = Math.abs(a.data.value - d.data.answer);
  const ok = diff <= d.data.tolerance;
  return { status: "graded", is_correct: ok, score: ok ? 1 : 0 };
}

function gradeConversion(data: unknown, answer: unknown): GradeResult {
  const d = conversionDataSchema.safeParse(data);
  const a = conversionAnswerSchema.safeParse(answer);
  if (!d.success) return { status: "invalid", reason: "malformed conversion data" };
  if (!a.success) return { status: "invalid", reason: "malformed conversion answer" };

  const n = convertDecimal(d.data.source.value, d.data.source.base);
  if (n === null) return { status: "invalid", reason: "source value not parseable in its base" };

  let hits = 0;
  for (const base of d.data.targets) {
    const expected = toBase(n, base);
    const user = a.data.values[base];
    if (user === undefined) continue;
    const parsed = convertDecimal(user, base);
    if (parsed !== null && parsed === n && stripPrefix(user, base) === expected) hits++;
  }
  const score = hits / d.data.targets.length;
  const is_correct = score === 1;
  return { status: "graded", is_correct, score };
}

function gradeOrdering(data: unknown, answer: unknown): GradeResult {
  const d = orderingDataSchema.safeParse(data);
  const a = orderingAnswerSchema.safeParse(answer);
  if (!d.success) return { status: "invalid", reason: "malformed ordering data" };
  if (!a.success) return { status: "invalid", reason: "malformed ordering answer" };
  if (a.data.order.length !== d.data.items.length) {
    return { status: "invalid", reason: "answer length mismatch" };
  }
  const ok = a.data.order.every((v, i) => v === d.data.items[i]);
  return { status: "graded", is_correct: ok, score: ok ? 1 : 0 };
}

function gradeMatchPairs(data: unknown, answer: unknown): GradeResult {
  const d = matchPairsDataSchema.safeParse(data);
  const a = matchPairsAnswerSchema.safeParse(answer);
  if (!d.success) return { status: "invalid", reason: "malformed pairs data" };
  if (!a.success) return { status: "invalid", reason: "malformed pairs answer" };

  const expected = new Map(d.data.pairs.map((p) => [p.left, p.right]));
  if (a.data.matches.length !== expected.size) {
    return { status: "invalid", reason: "number of matches does not cover all pairs" };
  }
  let hits = 0;
  for (const m of a.data.matches) {
    if (expected.get(m.left) === m.right) hits++;
  }
  const score = hits / expected.size;
  return { status: "graded", is_correct: score === 1, score };
}

// ---------- public dispatcher --------------------------------------------

export function gradeExercise(
  type: ExerciseType,
  data: unknown,
  answer: unknown
): GradeResult {
  switch (type) {
    case "mcq":
      return gradeMCQ(data, answer);
    case "numeric":
      return gradeNumeric(data, answer);
    case "formula":
      return gradeFormula(data, answer);
    case "text":
      return gradeText(data, answer);
    case "code":
      return gradeCode(data, answer);
    case "circuit":
      return gradeCircuit(data, answer);
    case "conversion":
      return gradeConversion(data, answer);
    case "ordering":
      return gradeOrdering(data, answer);
    case "match_pairs":
      return gradeMatchPairs(data, answer);
  }
}
