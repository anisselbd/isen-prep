import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const metadata: Metadata = { title: "Matières · ISEN PREP" };

export default async function SubjectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: subjects }, { data: mastery }, { data: topics }] = await Promise.all([
    supabase
      .from("subjects")
      .select("id, name, description, color")
      .order("order_index"),
    supabase
      .from("mastery")
      .select("topic_id, score, confidence")
      .eq("user_id", user?.id ?? ""),
    supabase.from("topics").select("id, subject_id"),
  ]);

  const masteryByTopic = new Map((mastery ?? []).map((m) => [m.topic_id, m]));
  const topicsBySubject = new Map<string, string[]>();
  for (const t of topics ?? []) {
    const list = topicsBySubject.get(t.subject_id) ?? [];
    list.push(t.id);
    topicsBySubject.set(t.subject_id, list);
  }

  function subjectScore(subjectId: string): { avg: number; studied: number; total: number } {
    const topicIds = topicsBySubject.get(subjectId) ?? [];
    const scored = topicIds
      .map((id) => masteryByTopic.get(id))
      .filter((m): m is { topic_id: string; score: number; confidence: number } =>
        Boolean(m && m.confidence > 0)
      );
    const avg =
      scored.length === 0 ? 0 : scored.reduce((acc, m) => acc + m.score, 0) / scored.length;
    return { avg, studied: scored.length, total: topicIds.length };
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Matières</h1>
        <p className="text-sm text-muted-foreground">
          Choisis une matière pour voir les sujets.
        </p>
      </header>
      <section className="grid gap-4 sm:grid-cols-2">
        {(subjects ?? []).map((subject) => {
          const s = subjectScore(subject.id);
          return (
            <Link
              key={subject.id}
              href={`/subjects/${subject.id}`}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
            >
              <Card className="h-full transition-colors hover:bg-accent/40">
                <CardHeader>
                  <div
                    aria-hidden="true"
                    className="h-1 w-10 rounded-full"
                    style={{ backgroundColor: subject.color ?? "var(--primary)" }}
                  />
                  <CardTitle>{subject.name}</CardTitle>
                  <CardDescription>{subject.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>
                      {s.studied}/{s.total} topics étudiés
                    </span>
                    <span className="font-mono">
                      {Math.round(s.avg * 100)}%
                    </span>
                  </div>
                  <Progress value={s.avg * 100} />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
