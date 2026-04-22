import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Matières · ISEN PREP" };

export default async function SubjectsPage() {
  const supabase = await createClient();
  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name, description, color")
    .order("order_index");

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Matières</h1>
        <p className="text-sm text-muted-foreground">
          Choisis une matière pour voir les sujets.
        </p>
      </header>
      <section className="grid gap-4 sm:grid-cols-2">
        {(subjects ?? []).map((subject) => (
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
              <CardContent className="text-xs text-muted-foreground">
                Voir les sujets →
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
