import { describe, it, expect } from "vitest";
import {
  CANDIDATE_CONTEXT,
  buildGenerateExercisePrompt,
  buildGradeAnswerPrompt,
  buildInterviewSystemPrompt,
  formatInterviewHistory,
} from "./prompts";

describe("prompts — candidate context", () => {
  it("mentions the key positioning facts Gemini needs", () => {
    expect(CANDIDATE_CONTEXT).toMatch(/Anisse/);
    expect(CANDIDATE_CONTEXT).toMatch(/Colibrimo/);
    expect(CANDIDATE_CONTEXT).toMatch(/ISEN/);
    expect(CANDIDATE_CONTEXT).toMatch(/CIR/);
  });
});

describe("buildGenerateExercisePrompt", () => {
  it("injects topic + type + difficulty and asks for strict JSON", () => {
    const p = buildGenerateExercisePrompt({
      topic_id: "maths.analyse.derivees",
      topic_name: "Dérivées",
      topic_description: "Formules usuelles",
      subject_name: "Mathématiques",
      difficulty: 3,
      type: "mcq",
    });
    expect(p).toMatch(/Dérivées/);
    expect(p).toMatch(/maths\.analyse\.derivees/);
    expect(p).toMatch(/3\/5/);
    expect(p).toMatch(/choix multiples/);
    expect(p).toMatch(/KaTeX/);
  });

  it("handles a null topic description without printing 'null'", () => {
    const p = buildGenerateExercisePrompt({
      topic_id: "t",
      topic_name: "T",
      topic_description: null,
      subject_name: "S",
      difficulty: 2,
      type: "numeric",
    });
    expect(p).not.toMatch(/Description : null/);
    expect(p).toMatch(/Description : —/);
  });

  it("produces different instructions for each type", () => {
    const mcq = buildGenerateExercisePrompt({
      topic_id: "x",
      topic_name: "x",
      topic_description: null,
      subject_name: "s",
      difficulty: 1,
      type: "mcq",
    });
    const code = buildGenerateExercisePrompt({
      topic_id: "x",
      topic_name: "x",
      topic_description: null,
      subject_name: "s",
      difficulty: 1,
      type: "code",
    });
    expect(mcq).not.toEqual(code);
    expect(mcq).toMatch(/choix multiples/);
    expect(code).toMatch(/function_signature/);
  });
});

describe("buildGradeAnswerPrompt", () => {
  it("embeds the question + user answer + data", () => {
    const p = buildGradeAnswerPrompt({
      type: "text",
      question_md: "Explique le RAG.",
      data: { expected_key_points: ["retrieval"] },
      user_answer: { text: "un truc vectoriel" },
    });
    expect(p).toMatch(/Explique le RAG/);
    expect(p).toMatch(/un truc vectoriel/);
    expect(p).toMatch(/retrieval/);
  });
});

describe("buildInterviewSystemPrompt + formatInterviewHistory", () => {
  it("announces remaining turns in the system prompt", () => {
    const p = buildInterviewSystemPrompt({ turnsRemaining: 5 });
    expect(p).toMatch(/5 tour/);
    expect(p).toMatch(/ISEN/);
  });

  it("formats history with explicit role labels", () => {
    const out = formatInterviewHistory([
      { role: "jury", content: "Bonjour." },
      { role: "user", content: "Bonjour." },
    ]);
    expect(out).toMatch(/JURY : Bonjour\./);
    expect(out).toMatch(/CANDIDAT : Bonjour\./);
  });
});
