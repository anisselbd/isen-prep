import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MasteryHeatmap } from "@/components/dashboard/MasteryHeatmap";
import { createClient } from "@/lib/supabase/server";
import type { SubjectMastery } from "@/lib/dashboard/server";

export async function HeatmapSection() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [subjectsRes, topicsRes, masteryRes] = await Promise.all([
    supabase
      .from("subjects")
      .select("id, name, description, color, order_index")
      .order("order_index"),
    supabase
      .from("topics")
      .select("id, subject_id, name, cir_importance, order_index")
      .order("order_index"),
    supabase
      .from("mastery")
      .select("topic_id, score, confidence")
      .eq("user_id", user.id),
  ]);

  const subjects = subjectsRes.data ?? [];
  const topics = topicsRes.data ?? [];
  const mastery = masteryRes.data ?? [];
  const masteryByTopic = new Map(mastery.map((m) => [m.topic_id, m]));

  const subjectGroups: SubjectMastery[] = subjects.map((s) => {
    const subjectTopics = topics
      .filter((t) => t.subject_id === s.id)
      .map((t) => {
        const m = masteryByTopic.get(t.id);
        return {
          id: t.id,
          name: t.name,
          score: m?.score ?? 0,
          confidence: m?.confidence ?? 0,
          cir_importance: t.cir_importance,
        };
      });
    const scored = subjectTopics.filter((t) => t.confidence > 0);
    const avg_score =
      scored.length === 0
        ? 0
        : scored.reduce((acc, t) => acc + t.score, 0) / scored.length;
    return {
      id: s.id,
      name: s.name,
      description: s.description,
      color: s.color,
      topics: subjectTopics,
      avg_score,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heatmap de maîtrise</CardTitle>
        <CardDescription>
          Clique un topic pour y aller directement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MasteryHeatmap subjects={subjectGroups} />
      </CardContent>
    </Card>
  );
}

export function HeatmapSectionSkeleton() {
  return <div className="h-64 animate-pulse rounded-lg bg-muted" />;
}
