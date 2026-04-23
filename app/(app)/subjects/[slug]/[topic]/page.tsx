import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Brain, Dumbbell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { selectDueFlashcardIds } from "@/lib/flashcards/due";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  return { title: `${topic} · ISEN PREP` };
}

export default async function TopicHubPage({
  params,
}: {
  params: Promise<{ slug: string; topic: string }>;
}) {
  const { slug, topic: topicId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: topic },
    { data: subject },
    { data: mastery },
    { data: lessonsCount },
    { data: exercisesCount },
    { data: flashcards },
    { data: states },
  ] = await Promise.all([
    supabase
      .from("topics")
      .select("id, name, description, subject_id, difficulty, cir_importance")
      .eq("id", topicId)
      .maybeSingle(),
    supabase.from("subjects").select("id, name, color").eq("id", slug).maybeSingle(),
    supabase
      .from("mastery")
      .select("score, confidence")
      .eq("user_id", user?.id ?? "")
      .eq("topic_id", topicId)
      .maybeSingle(),
    supabase.from("lessons").select("id").eq("topic_id", topicId),
    supabase.from("exercises").select("id").eq("topic_id", topicId),
    supabase.from("flashcards").select("id, topic_id").eq("topic_id", topicId),
    supabase
      .from("review_states")
      .select("flashcard_id, next_review_at")
      .eq("user_id", user?.id ?? ""),
  ]);

  if (!topic || !subject) notFound();

  const numLessons = lessonsCount?.length ?? 0;
  const numExercises = exercisesCount?.length ?? 0;
  const numDue = selectDueFlashcardIds(flashcards ?? [], states ?? []).length;
  const numFlashcards = flashcards?.length ?? 0;
  const score = mastery?.score ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <nav className="mb-2 text-xs text-muted-foreground">
          <Link href="/subjects" className="hover:text-foreground">
            Matières
          </Link>{" "}
          /{" "}
          <Link href={`/subjects/${slug}`} className="hover:text-foreground">
            {subject.name}
          </Link>{" "}
          / <span>{topic.name}</span>
        </nav>
        <h1 className="text-2xl font-semibold tracking-tight">{topic.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{topic.description}</p>
        <div className="mt-4 flex items-center gap-3">
          <Progress value={score * 100} className="max-w-xs" />
          <span className="font-mono text-xs text-muted-foreground">
            {mastery?.confidence
              ? `Maîtrise ${Math.round(score * 100)}% (${mastery.confidence} essais)`
              : "Pas encore testé"}
          </span>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <HubCard
          href={`/subjects/${slug}/${topicId}/lesson`}
          icon={<BookOpen className="size-4" />}
          title="Cours"
          description={`${numLessons} leçon${numLessons !== 1 ? "s" : ""} · théorie + exemples`}
          disabled={numLessons === 0}
        />
        <HubCard
          href={`/subjects/${slug}/${topicId}/practice`}
          icon={<Dumbbell className="size-4" />}
          title="Pratique"
          description={`${numExercises} exercice${numExercises !== 1 ? "s" : ""} disponibles`}
          disabled={numExercises === 0}
          allowGenerate
        />
        <HubCard
          href={`/subjects/${slug}/${topicId}/flashcards`}
          icon={<Brain className="size-4" />}
          title="Flashcards"
          description={`${numFlashcards} carte${numFlashcards !== 1 ? "s" : ""} · ${numDue} due${numDue !== 1 ? "s" : ""}`}
          disabled={numFlashcards === 0}
        />
      </section>
    </div>
  );
}

function HubCard({
  href,
  icon,
  title,
  description,
  disabled,
  allowGenerate,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  disabled?: boolean;
  allowGenerate?: boolean;
}) {
  if (disabled && !allowGenerate) {
    return (
      <Card className="opacity-60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {icon}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Rien à afficher pour l&apos;instant.
        </CardContent>
      </Card>
    );
  }
  return (
    <Link
      href={href}
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
    >
      <Card className="h-full transition-colors hover:bg-accent/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {icon}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {disabled && allowGenerate ? (
          <CardContent className="text-xs text-muted-foreground">
            Aucun exercice seed — tu peux en générer via IA depuis cette page.
          </CardContent>
        ) : null}
      </Card>
    </Link>
  );
}
