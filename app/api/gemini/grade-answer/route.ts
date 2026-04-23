import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isGeminiConfigured } from "@/lib/env";
import { gradeAnswerViaGemini } from "@/lib/gemini/grade";
import { updateMastery } from "@/lib/mastery/update";
import {
  GeminiNotConfiguredError,
} from "@/lib/gemini/client";

const bodySchema = z.object({
  attempt_id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  if (!isGeminiConfigured()) {
    return NextResponse.json(
      { error: "Gemini n'est pas configurée côté serveur." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "corps JSON invalide" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "body invalide" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "non authentifié" }, { status: 401 });
  }

  // Load attempt + linked exercise. RLS enforces ownership on attempts.
  const { data: attempt, error: attemptErr } = await supabase
    .from("attempts")
    .select("id, user_id, exercise_id, answer, score")
    .eq("id", parsed.data.attempt_id)
    .maybeSingle();
  if (attemptErr || !attempt) {
    return NextResponse.json(
      { error: "tentative introuvable" },
      { status: 404 }
    );
  }

  const { data: exercise, error: exErr } = await supabase
    .from("exercises")
    .select("id, topic_id, type, question_md, data")
    .eq("id", attempt.exercise_id)
    .maybeSingle();
  if (exErr || !exercise) {
    return NextResponse.json({ error: "exercice introuvable" }, { status: 404 });
  }

  let grade;
  try {
    grade = await gradeAnswerViaGemini({
      type: exercise.type,
      question_md: exercise.question_md,
      data: exercise.data,
      user_answer: attempt.answer,
    });
  } catch (e) {
    if (e instanceof GeminiNotConfiguredError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    const msg = e instanceof Error ? e.message : "unknown Gemini error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  // Update attempt with the AI grade.
  const { error: upAttempt } = await supabase
    .from("attempts")
    .update({
      is_correct: grade.is_correct,
      score: grade.score,
    })
    .eq("id", attempt.id);
  if (upAttempt) {
    return NextResponse.json({ error: upAttempt.message }, { status: 500 });
  }

  // Update mastery — running mean includes this AI score.
  const { data: prevMastery } = await supabase
    .from("mastery")
    .select("score, confidence")
    .eq("user_id", user.id)
    .eq("topic_id", exercise.topic_id)
    .maybeSingle();

  const nextMastery = updateMastery(prevMastery, grade.score);
  const { error: upMastery } = await supabase.from("mastery").upsert({
    user_id: user.id,
    topic_id: exercise.topic_id,
    score: nextMastery.score,
    confidence: nextMastery.confidence,
    last_updated: nextMastery.last_updated,
  });
  if (upMastery) {
    return NextResponse.json({ error: upMastery.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    grade,
    mastery: { score: nextMastery.score, confidence: nextMastery.confidence },
  });
}
