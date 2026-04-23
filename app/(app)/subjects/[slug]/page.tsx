import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug} · ISEN PREP` };
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subject } = await supabase
    .from("subjects")
    .select("id, name, description, color")
    .eq("id", slug)
    .maybeSingle();
  if (!subject) notFound();

  const [{ data: topics }, { data: mastery }] = await Promise.all([
    supabase
      .from("topics")
      .select("id, name, description, difficulty, cir_importance, order_index")
      .eq("subject_id", slug)
      .order("order_index"),
    supabase
      .from("mastery")
      .select("topic_id, score, confidence")
      .eq("user_id", user?.id ?? ""),
  ]);

  const masteryByTopic = new Map((mastery ?? []).map((m) => [m.topic_id, m]));

  return (
    <div className="flex flex-col gap-6">
      <header>
        <nav className="mb-2 text-xs text-muted-foreground">
          <Link href="/subjects" className="hover:text-foreground">
            Matières
          </Link>{" "}
          / <span>{subject.name}</span>
        </nav>
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="h-6 w-1 rounded-full"
            style={{ backgroundColor: subject.color ?? "var(--primary)" }}
          />
          <h1 className="text-2xl font-semibold tracking-tight">{subject.name}</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{subject.description}</p>
      </header>

      <ul className="flex flex-col gap-3">
        {(topics ?? []).map((t) => {
          const m = masteryByTopic.get(t.id);
          const score = m?.score ?? 0;
          return (
            <li key={t.id}>
              <Link
                href={`/subjects/${slug}/${t.id}`}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
              >
                <Card className="transition-colors hover:bg-accent/40">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-base">
                        {t.name}
                        <Badge variant="secondary" className="font-mono text-[10px]">
                          diff {t.difficulty}/5
                        </Badge>
                        {t.cir_importance >= 4 ? (
                          <Badge variant="default" className="text-[10px]">
                            CIR priorité
                          </Badge>
                        ) : null}
                      </CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-3">
                      <Progress value={score * 100} className="flex-1" aria-label="Maîtrise du topic" />
                      <span className="font-mono text-xs text-muted-foreground">
                        {m?.confidence
                          ? `${Math.round(score * 100)}% · ${m.confidence} essais`
                          : "Non étudié"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
