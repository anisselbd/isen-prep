"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FlashcardView } from "@/components/flashcard/FlashcardView";
import { applyFlashcardReview } from "@/lib/flashcards/actions";
import type { FlashcardQuality } from "@/components/flashcard/FlashcardDeck";

export type GlobalDeckCard = {
  id: string;
  front_md: string;
  back_md: string;
  topic_name: string;
  subject_name: string;
  repetitions: number;
};

const QUALITY_BUTTONS: Array<{
  quality: FlashcardQuality;
  label: string;
  hint: string;
  variant: "destructive" | "outline" | "secondary" | "default";
}> = [
  { quality: 0, label: "Oublié", hint: "1", variant: "destructive" },
  { quality: 3, label: "Difficile", hint: "2", variant: "outline" },
  { quality: 4, label: "Correct", hint: "3", variant: "secondary" },
  { quality: 5, label: "Facile", hint: "4", variant: "default" },
];

export function GlobalFlashcardsClient({
  cards,
}: {
  cards: GlobalDeckCard[];
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [, startTransition] = useTransition();

  const total = cards.length;
  const current = cards[index];

  const grade = useCallback(
    (quality: FlashcardQuality) => {
      if (!current) return;
      const card = current;
      startTransition(async () => {
        const res = await applyFlashcardReview({
          flashcardId: card.id,
          quality,
        });
        if (!res.ok) {
          toast.error(`Échec enregistrement : ${res.reason}`);
        }
      });
      const next = index + 1;
      setIndex(next);
      setRevealed(false);
      if (next >= total) setDone(true);
    },
    [current, index, total, startTransition],
  );

  useEffect(() => {
    if (done) return;
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return;
      if (e.target instanceof HTMLTextAreaElement) return;
      if (!revealed) return;
      const map: Record<string, FlashcardQuality> = {
        "1": 0,
        "2": 3,
        "3": 4,
        "4": 5,
      };
      const q = map[e.key];
      if (q !== undefined) {
        e.preventDefault();
        grade(q);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done, revealed, grade]);

  if (done || !current) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border bg-card p-8 text-center">
        <p className="text-2xl">🎉</p>
        <p className="text-lg font-medium">Session terminée.</p>
        <p className="text-sm text-muted-foreground">
          {total} carte{total > 1 ? "s" : ""} révisée{total > 1 ? "s" : ""}.
          Les prochaines reviendront selon leur intervalle SM-2.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-mono tabular-nums">
            {index + 1} / {total}
          </span>
          <span className="text-border">·</span>
          <span className="rounded-full bg-muted px-2 py-0.5">
            {current.subject_name}
          </span>
          <span className="font-medium text-foreground">
            {current.topic_name}
          </span>
          {current.repetitions === 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
              nouvelle
            </span>
          )}
        </div>
        <span>
          {revealed ? "Note ta réponse" : "Clic ou Espace pour retourner"}
        </span>
      </div>

      <FlashcardView
        key={current.id}
        front={current.front_md}
        back={current.back_md}
        onReveal={() => setRevealed(true)}
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {QUALITY_BUTTONS.map(({ quality, label, hint, variant }) => (
          <Button
            key={quality}
            variant={variant}
            disabled={!revealed}
            onClick={() => grade(quality)}
            className="flex-col gap-0 py-3"
          >
            <span>{label}</span>
            <span className="text-[10px] opacity-60">touche {hint}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
