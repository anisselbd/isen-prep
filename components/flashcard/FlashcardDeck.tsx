"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FlashcardView } from "./FlashcardView";

export type FlashcardQuality = 0 | 3 | 4 | 5; // SM-2 input scale

export type DeckCard = {
  id: string;
  front_md: string;
  back_md: string;
};

type Props = {
  cards: DeckCard[];
  onReview: (card: DeckCard, quality: FlashcardQuality) => void;
  onComplete?: () => void;
};

const QUALITY_BUTTONS: Array<{
  quality: FlashcardQuality;
  label: string;
  variant: "destructive" | "outline" | "secondary" | "default";
}> = [
  { quality: 0, label: "Oublié", variant: "destructive" },
  { quality: 3, label: "Difficile", variant: "outline" },
  { quality: 4, label: "Correct", variant: "secondary" },
  { quality: 5, label: "Facile", variant: "default" },
];

export function FlashcardDeck({ cards, onReview, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  if (cards.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Aucune flashcard à réviser.</p>
    );
  }

  const current = cards[index];
  if (!current) {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-lg font-medium">Session terminée 🎉</p>
        <p className="text-sm text-muted-foreground">
          {cards.length} carte{cards.length > 1 ? "s" : ""} révisée{cards.length > 1 ? "s" : ""}.
        </p>
      </div>
    );
  }

  function onGrade(quality: FlashcardQuality) {
    if (!current) return;
    onReview(current, quality);
    const next = index + 1;
    setIndex(next);
    setRevealed(false);
    if (next >= cards.length) onComplete?.();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Carte {index + 1} / {cards.length}
        </span>
        <span>{revealed ? "Note ta réponse" : "Clic ou Espace pour retourner"}</span>
      </div>
      <FlashcardView
        key={current.id}
        front={current.front_md}
        back={current.back_md}
        onReveal={() => setRevealed(true)}
      />
      <div className="grid grid-cols-4 gap-2">
        {QUALITY_BUTTONS.map(({ quality, label, variant }) => (
          <Button
            key={quality}
            variant={variant}
            disabled={!revealed}
            onClick={() => onGrade(quality)}
            className="w-full"
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
