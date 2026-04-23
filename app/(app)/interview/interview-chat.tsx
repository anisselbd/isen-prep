"use client";

import { useEffect, useRef, useState } from "react";
import { Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LessonRenderer } from "@/components/lesson/LessonRenderer";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "jury"; content: string };
type FinalFeedback = { feedback_md: string; score: number };

export function InterviewChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [final, setFinal] = useState<FinalFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  // Kick off the first jury turn automatically on mount.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void nextTurn([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, final]);

  async function nextTurn(history: Message[]) {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/gemini/interview-turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId ?? undefined,
          history,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const { session_id, turn } = await res.json();
      setSessionId(session_id);
      setMessages((m) => [...m, { role: "jury", content: turn.message }]);
      if (turn.done) {
        setDone(true);
        setFinal({ feedback_md: turn.feedback_md, score: turn.score });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setPending(false);
    }
  }

  async function sendUserMessage() {
    const text = input.trim();
    if (!text || pending || done) return;
    const userMsg: Message = { role: "user", content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    await nextTurn(newHistory);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <Card className="flex h-[70vh] flex-col">
        <CardHeader>
          <CardTitle className="text-base">Jury ISEN</CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <MessageBubble key={i} role={m.role} content={m.content} />
            ))}
            {pending ? (
              <MessageBubble role="jury" content="…" />
            ) : null}
            {error ? (
              <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                {error}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 border-t pt-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void sendUserMessage();
                }
              }}
              placeholder={done ? "Entretien terminé" : "Ta réponse…"}
              disabled={pending || done}
              rows={2}
              className="flex-1 resize-none rounded-md border bg-background p-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            />
            <Button onClick={sendUserMessage} disabled={pending || done || input.trim() === ""}>
              <Send className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <aside className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Déroulé</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            <p>Jury virtuel propulsé par Gemini. Tu peux couper à tout moment — la session est sauvegardée dans <code className="font-mono">interview_sessions</code>.</p>
            <p className="mt-2">Entrée : envoyer. Shift+Entrée : saut de ligne.</p>
          </CardContent>
        </Card>
        {final ? (
          <Card className="border-emerald-300/60 bg-emerald-50/60 dark:border-emerald-900/40 dark:bg-emerald-950/30">
            <CardHeader>
              <CardTitle className="text-sm">
                Feedback final · score {Math.round(final.score * 100)}%
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <LessonRenderer markdown={final.feedback_md} />
            </CardContent>
          </Card>
        ) : null}
      </aside>
    </div>
  );
}

function MessageBubble({ role, content }: { role: "user" | "jury"; content: string }) {
  const isJury = role === "jury";
  return (
    <div className={cn("flex gap-3", isJury ? "" : "flex-row-reverse")}>
      <div
        aria-hidden="true"
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium",
          isJury ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {isJury ? "J" : <User className="size-4" />}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-lg border px-4 py-2 text-sm",
          isJury ? "bg-card" : "bg-muted/50"
        )}
      >
        {isJury ? <LessonRenderer markdown={content} /> : <p>{content}</p>}
      </div>
    </div>
  );
}
