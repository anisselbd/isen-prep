import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { listDueFlashcards } from "@/lib/flashcards/server";
import { GlobalFlashcardsClient, type GlobalDeckCard } from "./flashcards-client";

export const metadata: Metadata = { title: "Flashcards · ISEN PREP" };

export default async function FlashcardsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Flashcards</h1>
        <p className="text-sm text-muted-foreground">
          Connecte-toi pour accéder à tes flashcards.
        </p>
      </div>
    );
  }

  const [cards, topicsRes, subjectsRes, totalRes] = await Promise.all([
    listDueFlashcards({}),
    supabase.from("topics").select("id, name, subject_id"),
    supabase.from("subjects").select("id, name"),
    supabase.from("flashcards").select("id", { count: "exact", head: true }),
  ]);

  const subjectById = new Map(
    (subjectsRes.data ?? []).map((s) => [s.id, s.name]),
  );
  const topicById = new Map(
    (topicsRes.data ?? []).map((t) => [
      t.id,
      { name: t.name, subject_id: t.subject_id },
    ]),
  );

  const deckCards: GlobalDeckCard[] = cards.map((c) => {
    const t = topicById.get(c.topic_id);
    return {
      id: c.id,
      front_md: c.front_md,
      back_md: c.back_md,
      topic_name: t?.name ?? c.topic_id,
      subject_name: t
        ? (subjectById.get(t.subject_id) ?? t.subject_id)
        : "",
      repetitions: c.repetitions,
    };
  });

  const totalCards = totalRes.count ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Flashcards</h1>
        <p className="text-sm text-muted-foreground">
          {deckCards.length === 0
            ? `Rien à réviser maintenant. ${totalCards} carte${totalCards > 1 ? "s" : ""} au total.`
            : `${deckCards.length} carte${deckCards.length > 1 ? "s" : ""} due${deckCards.length > 1 ? "s" : ""} · révision espacée SM-2.`}
        </p>
      </header>

      {deckCards.length === 0 ? (
        <div className="rounded-md border bg-card p-6 text-sm">
          <p className="mb-3 text-muted-foreground">
            Toutes les cartes dues sont révisées. Reviens plus tard ou passe à
            la pratique active pour renforcer un topic précis.
          </p>
          <Link
            href="/subjects"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Choisir un topic
          </Link>
        </div>
      ) : (
        <GlobalFlashcardsClient cards={deckCards} />
      )}
    </div>
  );
}
