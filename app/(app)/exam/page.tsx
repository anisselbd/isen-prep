import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExamClient } from "./exam-client";
import type { Exercise } from "@/lib/exercise/types";

export const metadata: Metadata = { title: "Examen blanc · ISEN PREP" };

// Stratification par matière (30 questions au total).
const PER_SUBJECT = {
  maths: 10,
  informatique: 8,
  physique: 6,
  electronique: 6,
} as const;

async function sampleStratified(supabase: Awaited<ReturnType<typeof createClient>>): Promise<Exercise[]> {
  const { data: topics } = await supabase.from("topics").select("id, subject_id");
  if (!topics) return [];
  const topicsBySubject = new Map<string, string[]>();
  for (const t of topics) {
    const list = topicsBySubject.get(t.subject_id) ?? [];
    list.push(t.id);
    topicsBySubject.set(t.subject_id, list);
  }
  const picks: Exercise[] = [];
  for (const [subject, count] of Object.entries(PER_SUBJECT)) {
    const topicIds = topicsBySubject.get(subject) ?? [];
    if (topicIds.length === 0) continue;
    const { data: pool } = await supabase
      .from("exercises")
      .select(
        "id, topic_id, type, difficulty, question_md, data, explanation_md, colibrimo_connection"
      )
      .in("topic_id", topicIds)
      .limit(50);
    const shuffled = [...(pool ?? [])].sort(() => Math.random() - 0.5).slice(0, count);
    picks.push(...(shuffled as unknown as Exercise[]));
  }
  return picks;
}

export default async function ExamPage() {
  const supabase = await createClient();
  const exercises = await sampleStratified(supabase);

  if (exercises.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Examen blanc</h1>
          <p className="text-sm text-muted-foreground">30 questions · 45 minutes · pas de retour en arrière</p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Pas encore d&apos;exercices</CardTitle>
            <CardDescription>
              Le seed des exercices arrive en Phase 7. Reviens plus tard — ou génère
              des exercices dans les topics avant de lancer un examen blanc.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Seuil minimum pour lancer : ~30 exercices répartis sur les 4 matières.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Examen blanc</h1>
        <p className="text-sm text-muted-foreground">
          {exercises.length} questions · 45 minutes · pas de retour en arrière ni de feedback entre questions
        </p>
      </header>
      <ExamClient exercises={exercises} durationSeconds={45 * 60} />
    </div>
  );
}
