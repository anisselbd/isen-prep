import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard · ISEN PREP",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name, description, color")
    .order("order_index");

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Vue d&apos;ensemble de ta progression. Les stats réelles arriveront en Phase 6.
        </p>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(subjects ?? []).map((subject) => (
          <Card key={subject.id}>
            <CardHeader>
              <div
                aria-hidden="true"
                className="h-1 w-10 rounded-full"
                style={{ backgroundColor: subject.color ?? "var(--primary)" }}
              />
              <CardTitle>{subject.name}</CardTitle>
              <CardDescription>{subject.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Maîtrise : — / 100
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
