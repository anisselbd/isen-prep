import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isGeminiConfigured } from "@/lib/env";
import { runInterviewTurn } from "@/lib/gemini/interview";
import { GeminiNotConfiguredError } from "@/lib/gemini/client";
import type { Json } from "@/types/database";

const messageSchema = z.object({
  role: z.enum(["user", "jury"]),
  content: z.string().min(1),
});

const bodySchema = z.object({
  session_id: z.string().uuid().optional(),
  history: z.array(messageSchema).max(40),
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

  // Start or resume a session row. The transcript is persisted after each
  // successful turn so refreshing the page doesn't lose context.
  let sessionId = parsed.data.session_id ?? null;
  if (!sessionId) {
    const { data: created, error } = await supabase
      .from("interview_sessions")
      .insert({ user_id: user.id })
      .select("id")
      .single();
    if (error || !created) {
      return NextResponse.json(
        { error: error?.message ?? "échec création session" },
        { status: 500 }
      );
    }
    sessionId = created.id;
  }

  let turn;
  try {
    turn = await runInterviewTurn({ history: parsed.data.history });
  } catch (e) {
    if (e instanceof GeminiNotConfiguredError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    const msg = e instanceof Error ? e.message : "unknown Gemini error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  // Persist updated transcript (full history + this jury turn).
  const newTranscript = [
    ...parsed.data.history,
    { role: "jury" as const, content: turn.message, timestamp: new Date().toISOString() },
  ];

  const update: {
    transcript: Json;
    ended_at?: string;
    feedback_md?: string;
    score?: number;
  } = { transcript: newTranscript as Json };
  if (turn.done) {
    update.ended_at = new Date().toISOString();
    update.feedback_md = turn.feedback_md;
    update.score = turn.score;
  }

  const { error: upErr } = await supabase
    .from("interview_sessions")
    .update(update)
    .eq("id", sessionId);
  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    session_id: sessionId,
    turn,
  });
}
