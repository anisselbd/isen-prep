import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isGeminiConfigured } from "@/lib/env";
import { PracticeClient } from "./practice-client";
import { buttonVariants } from "@/components/ui/button";
import type { Exercise } from "@/lib/exercise/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  return { title: `Pratique ${topic} · ISEN PREP` };
}

export default async function PracticePage({
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

  const { data: exercises } = await supabase
    .from("exercises")
    .select(
      "id, topic_id, type, difficulty, question_md, data, explanation_md, colibrimo_connection"
    )
    .eq("topic_id", topicId)
    .order("difficulty")
    .limit(30);

  const hasExercises = (exercises?.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <nav className="mb-2 text-xs text-muted-foreground">
          <Link href={`/subjects/${slug}/${topicId}`} className="hover:text-foreground">
            ← {topic.name}
          </Link>
        </nav>
        <h1 className="text-2xl font-semibold tracking-tight">
          Pratique : {topic.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Difficulté adaptative : +1 après 3 bonnes réponses, -1 après 2 erreurs consécutives.
        </p>
      </header>

      {hasExercises ? (
        <PracticeClient
          topicId={topicId}
          initialExercises={(exercises ?? []) as unknown as Exercise[]}
          geminiConfigured={isGeminiConfigured()}
        />
      ) : (
        <div className="rounded-md border bg-card p-6 text-sm">
          <p className="mb-3">
            Aucun exercice seed pour ce topic — le contenu arrive en Phase 7.
          </p>
          {isGeminiConfigured() ? (
            <PracticeClient
              topicId={topicId}
              initialExercises={[]}
              geminiConfigured
            />
          ) : (
            <p className="text-muted-foreground">
              Active <code className="font-mono">GOOGLE_GEMINI_API_KEY</code> pour
              générer des exercices à la volée.
            </p>
          )}
          <Link
            href={`/subjects/${slug}/${topicId}`}
            className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4" })}
          >
            Retour au topic
          </Link>
        </div>
      )}
    </div>
  );
}
