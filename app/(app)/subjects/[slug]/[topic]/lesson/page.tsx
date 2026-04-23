import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Dumbbell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LessonRenderer } from "@/components/lesson/LessonRenderer";
import { TtsControls } from "@/components/tts/tts-controls";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  return { title: `Cours ${topic} · ISEN PREP` };
}

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; topic: string }>;
  searchParams: Promise<{ i?: string }>;
}) {
  const { slug, topic: topicId } = await params;
  const { i } = await searchParams;
  const supabase = await createClient();

  const { data: topic } = await supabase
    .from("topics")
    .select("id, name")
    .eq("id", topicId)
    .maybeSingle();
  if (!topic) notFound();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, title, content_md, estimated_minutes, order_index")
    .eq("topic_id", topicId)
    .order("order_index");

  if (!lessons || lessons.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{topic.name}</h1>
        <p className="text-sm text-muted-foreground">
          Aucune leçon pour l&apos;instant. Le contenu seed arrive en Phase 7.
        </p>
        <Link
          href={`/subjects/${slug}/${topicId}`}
          className={buttonVariants({ variant: "outline", className: "self-start" })}
        >
          Retour au topic
        </Link>
      </div>
    );
  }

  const idx = Math.max(0, Math.min(lessons.length - 1, Number(i ?? 0)));
  const lesson = lessons[idx];
  if (!lesson) notFound();
  const prev = idx > 0 ? idx - 1 : null;
  const next = idx < lessons.length - 1 ? idx + 1 : null;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <nav className="mb-2 text-xs text-muted-foreground">
          <Link href={`/subjects/${slug}/${topicId}`} className="hover:text-foreground">
            ← {topic.name}
          </Link>
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
          <Badge variant="secondary" className="font-mono text-[10px]">
            {idx + 1} / {lessons.length}
          </Badge>
          <Badge variant="outline" className="font-mono text-[10px]">
            ~{lesson.estimated_minutes} min
          </Badge>
        </div>
      </header>

      <TtsControls markdown={lesson.content_md} />

      <article className="rounded-lg border bg-card p-6">
        <LessonRenderer markdown={lesson.content_md} />
      </article>

      <footer className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {prev !== null ? (
            <Link
              href={`/subjects/${slug}/${topicId}/lesson?i=${prev}`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <ChevronLeft className="size-4" />
              Précédent
            </Link>
          ) : null}
          {next !== null ? (
            <Link
              href={`/subjects/${slug}/${topicId}/lesson?i=${next}`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Suivant
              <ChevronRight className="size-4" />
            </Link>
          ) : null}
        </div>
        <Link
          href={`/subjects/${slug}/${topicId}/practice`}
          className={buttonVariants({ size: "sm" })}
        >
          <Dumbbell className="size-4" />
          Pratiquer maintenant
        </Link>
      </footer>
    </div>
  );
}
