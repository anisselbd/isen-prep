"use client";

import { useTransition } from "react";
import { FlashcardDeck, type DeckCard, type FlashcardQuality } from "@/components/flashcard/FlashcardDeck";
import { applyFlashcardReview } from "@/lib/flashcards/actions";
import { toast } from "sonner";

export function FlashcardsClient({ cards }: { cards: DeckCard[] }) {
  const [, startTransition] = useTransition();

  function onReview(card: DeckCard, quality: FlashcardQuality) {
    startTransition(async () => {
      const res = await applyFlashcardReview({ flashcardId: card.id, quality });
      if (!res.ok) {
        toast.error(`Échec enregistrement : ${res.reason}`);
      }
    });
  }

  return <FlashcardDeck cards={cards} onReview={onReview} />;
}
