import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { listDueFlashcards } from "@/lib/flashcards/server";
import { FlashcardsClient } from "./flashcards-client";
import { buttonVariants } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  return { title: `Flashcards ${topic} · ISEN PREP` };
}

export default async function FlashcardsPage({
  params,
}: {
  params: Promise<{ slug: string; topic: string }>;
}) {
  const { slug, topic: topicId } = await params;
  const supabase = await createClient();

  const { data: topic } = await supabase
    .from("topics")
    .select("id, name")
    .eq("id", topicId)
    .maybeSingle();
  if (!topic) notFound();

  const cards = await listDueFlashcards({ topicId });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <nav className="mb-2 text-xs text-muted-foreground">
          <Link href={`/subjects/${slug}/${topicId}`} className="hover:text-foreground">
            ← {topic.name}
          </Link>
        </nav>
        <h1 className="text-2xl font-semibold tracking-tight">
          Flashcards : {topic.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          {cards.length === 0
            ? "Aucune carte à réviser maintenant."
            : `${cards.length} carte${cards.length > 1 ? "s" : ""} à réviser.`}
        </p>
      </header>

      {cards.length === 0 ? (
        <div className="rounded-md border bg-card p-6 text-sm">
          <p className="mb-3 text-muted-foreground">
            Tu n&apos;as rien de dû pour ce topic. Reviens plus tard — ou passe à la pratique active.
          </p>
          <Link
            href={`/subjects/${slug}/${topicId}/practice`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Aller à la pratique
          </Link>
        </div>
      ) : (
        <FlashcardsClient cards={cards.map((c) => ({ id: c.id, front_md: c.front_md, back_md: c.back_md }))} />
      )}
    </div>
  );
}
