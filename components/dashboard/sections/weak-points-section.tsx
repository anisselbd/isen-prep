import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export async function WeakPointsSection() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [topicsRes, masteryRes] = await Promise.all([
    supabase.from("topics").select("id, subject_id, name"),
    supabase
      .from("mastery")
      .select("topic_id, score, confidence")
      .eq("user_id", user.id)
      .gt("confidence", 0),
  ]);

  const topics = topicsRes.data ?? [];
  const mastery = masteryRes.data ?? [];
  const topicById = new Map(topics.map((t) => [t.id, t]));

  const weak = mastery
    .map((m) => {
      const t = topicById.get(m.topic_id);
      if (!t) return null;
      return {
        topic_id: t.id,
        topic_name: t.name,
        subject_id: t.subject_id,
        score: m.score,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <AlertTriangle className="size-4 text-amber-500" />
        <CardTitle>Points faibles</CardTitle>
      </CardHeader>
      <CardContent>
        {weak.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Pas encore assez de données. Commence par une session de pratique.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {weak.map((wp) => (
              <li key={wp.topic_id}>
                <Link
                  href={`/subjects/${wp.subject_id}/${wp.topic_id}/practice`}
                  className={cn(
                    "flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm hover:bg-accent/40",
                  )}
                >
                  <span className="flex-1 truncate">{wp.topic_name}</span>
                  <Badge variant="destructive" className="font-mono">
                    {Math.round(wp.score * 100)}%
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function WeakPointsSectionSkeleton() {
  return <div className="h-64 animate-pulse rounded-lg bg-muted" />;
}
