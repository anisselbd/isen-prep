import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LessonRenderer } from "@/components/lesson/LessonRenderer";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { PrintButton } from "./print-button";

export const metadata: Metadata = { title: "Fiches · ISEN PREP" };

export default async function FichesPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const { subject: subjectFilter } = await searchParams;

  const supabase = await createClient();
  const [subjectsRes, topicsRes, lessonsRes] = await Promise.all([
    supabase
      .from("subjects")
      .select("id, name, description")
      .order("order_index"),
    supabase
      .from("topics")
      .select("id, subject_id, name, description, order_index")
      .order("order_index"),
    supabase.from("lessons").select("id, topic_id, title, content_md"),
  ]);

  const subjects = subjectsRes.data ?? [];
  const topics = topicsRes.data ?? [];
  const lessons = lessonsRes.data ?? [];
  const lessonByTopic = new Map(lessons.map((l) => [l.topic_id, l]));

  const filtered = subjectFilter
    ? subjects.filter((s) => s.id === subjectFilter)
    : subjects;

  return (
    <div className="flex flex-col gap-6">
      <header className="fiches-toolbar flex flex-col gap-3 print:hidden">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Fiches</h1>
            <p className="text-sm text-muted-foreground">
              Toutes les leçons, prêtes à imprimer ou exporter en PDF.
            </p>
          </div>
          <PrintButton />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href="/fiches"
            className={cn(
              "rounded-full border px-3 py-1 transition-colors",
              !subjectFilter
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:bg-accent/40",
            )}
          >
            Toutes
          </Link>
          {subjects.map((s) => (
            <Link
              key={s.id}
              href={`/fiches?subject=${s.id}`}
              className={cn(
                "rounded-full border px-3 py-1 transition-colors",
                subjectFilter === s.id
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:bg-accent/40",
              )}
            >
              {s.name}
            </Link>
          ))}
        </div>

        <div className="rounded-md border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
          <strong>Astuce :</strong> clique «&nbsp;Imprimer&nbsp;» puis choisis
          «&nbsp;Enregistrer au format PDF&nbsp;» comme destination pour
          récupérer un PDF propre.
        </div>
      </header>

      <div className="fiches-content flex flex-col gap-8">
        {filtered.map((s) => {
          const subjectTopics = topics.filter((t) => t.subject_id === s.id);
          return (
            <section key={s.id} className="subject-section flex flex-col gap-4">
              <header className="border-b pb-2">
                <h2 className="text-xl font-semibold">{s.name}</h2>
                {s.description && (
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                )}
              </header>
              {subjectTopics.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucun topic.
                </p>
              ) : (
                subjectTopics.map((t) => {
                  const lesson = lessonByTopic.get(t.id);
                  return (
                    <article
                      key={t.id}
                      className="lesson-card flex flex-col gap-2 rounded-md border bg-card p-4 print:border-0 print:p-0"
                    >
                      <header className="flex items-baseline justify-between gap-3">
                        <h3 className="text-lg font-semibold">{t.name}</h3>
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          {s.name}
                        </span>
                      </header>
                      {lesson?.content_md ? (
                        <LessonRenderer markdown={lesson.content_md} />
                      ) : (
                        <p className="text-sm italic text-muted-foreground">
                          Leçon non disponible pour ce topic.
                        </p>
                      )}
                    </article>
                  );
                })
              )}
            </section>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-md border bg-card p-6 text-sm">
          <p className="mb-3 text-muted-foreground">
            Aucune matière trouvée pour ce filtre.
          </p>
          <Link
            href="/fiches"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Voir toutes les fiches
          </Link>
        </div>
      )}
    </div>
  );
}
