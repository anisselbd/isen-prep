import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { isGeminiConfigured } from "@/lib/env";
import { generateExerciseViaGemini } from "@/lib/gemini/generate";
import { GeminiNotConfiguredError } from "@/lib/gemini/client";
import type { Json } from "@/types/database";

const bodySchema = z.object({
  topic_id: z.string().min(1),
  difficulty: z.number().int().min(1).max(5),
  type: z.enum([
    "mcq",
    "numeric",
    "formula",
    "text",
    "code",
    "circuit",
    "conversion",
    "ordering",
    "match_pairs",
  ]),
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

  // Load topic then its subject. Separate queries because the hand-written
  // Database type does not expose the topics→subjects relationship.
  const { data: topic, error: topicErr } = await supabase
    .from("topics")
    .select("id, name, description, subject_id")
    .eq("id", parsed.data.topic_id)
    .maybeSingle();
  if (topicErr || !topic) {
    return NextResponse.json(
      { error: "topic introuvable" },
      { status: 404 }
    );
  }

  const { data: subject } = await supabase
    .from("subjects")
    .select("name")
    .eq("id", topic.subject_id)
    .maybeSingle();
  const subjectName = subject?.name ?? "";

  let generated;
  try {
    generated = await generateExerciseViaGemini({
      topic_id: topic.id,
      topic_name: topic.name,
      topic_description: topic.description,
      subject_name: subjectName,
      difficulty: parsed.data.difficulty,
      type: parsed.data.type,
    });
  } catch (e) {
    if (e instanceof GeminiNotConfiguredError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    const msg = e instanceof Error ? e.message : "unknown Gemini error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  // Cache in DB so the same generation can be reused by future sessions.
  // Use service_role client — content-table INSERTs are not exposed to the
  // authenticated role via RLS policies (only SELECT is).
  const admin = createServiceRoleClient();
  const { data: inserted, error: insErr } = await admin
    .from("exercises")
    .insert({
      topic_id: topic.id,
      type: parsed.data.type,
      difficulty: parsed.data.difficulty,
      question_md: generated.question_md,
      data: generated.data as Json,
      explanation_md: generated.explanation_md,
      colibrimo_connection: generated.colibrimo_connection,
      created_by: "gemini",
    })
    .select("id, topic_id, type, difficulty, question_md, data, explanation_md, colibrimo_connection, created_by")
    .single();
  if (insErr || !inserted) {
    return NextResponse.json(
      { error: insErr?.message ?? "échec insertion" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, exercise: inserted });
}
