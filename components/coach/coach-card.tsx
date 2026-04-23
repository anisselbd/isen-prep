"use client";

import { Sparkles, Loader2, BookOpen, Dumbbell, Layers } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CoachPlan = {
  summary: string;
  today_focus: Array<{
    topic_id: string;
    topic_name: string;
    reason: string;
    suggested_minutes: number;
    action: "lesson" | "practice" | "flashcards";
  }>;
  week_strategy: string;
};

const ACTION_META: Record<
  CoachPlan["today_focus"][number]["action"],
  { label: string; icon: typeof BookOpen; segment: string }
> = {
  lesson: { label: "Leçon", icon: BookOpen, segment: "lesson" },
  practice: { label: "Pratique", icon: Dumbbell, segment: "practice" },
  flashcards: { label: "Flashcards", icon: Layers, segment: "flashcards" },
};

export function CoachCard({ geminiConfigured }: { geminiConfigured: boolean }) {
  const [plan, setPlan] = useState<CoachPlan | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/gemini/coach-plan", { method: "POST" });
      const body = await res.json();
      if (!res.ok) {
        toast.error(body.error ?? "Erreur lors de la génération du plan");
        return;
      }
      setPlan(body.plan);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "erreur inconnue";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <Sparkles className="size-4 text-primary" />
        <div className="flex-1">
          <CardTitle>Coach IA</CardTitle>
          <CardDescription>
            Plan d&apos;étude personnalisé basé sur ta maîtrise actuelle.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!plan ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-muted-foreground">
              Demande un plan adapté à tes points forts et faibles. Gemini
              analyse tes stats et te dit par où commencer aujourd&apos;hui.
            </p>
            <Button
              onClick={generate}
              disabled={loading || !geminiConfigured}
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Génération…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 size-4" />
                  {geminiConfigured ? "Générer un plan" : "Gemini non configuré"}
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-6">{plan.summary}</p>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                À faire aujourd&apos;hui
              </h4>
              <ul className="flex flex-col gap-2">
                {plan.today_focus.map((item, i) => {
                  const meta = ACTION_META[item.action];
                  const subject = item.topic_id.split(".")[0];
                  const href = `/subjects/${subject}/${item.topic_id}/${meta.segment}`;
                  const Icon = meta.icon;
                  return (
                    <li key={i}>
                      <Link
                        href={href}
                        className={cn(
                          "flex items-start gap-3 rounded-md border bg-card px-3 py-2 text-sm hover:bg-accent/40",
                        )}
                      >
                        <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium">{item.topic_name}</span>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {meta.label} · ~{item.suggested_minutes} min
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.reason}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Stratégie jusqu&apos;à l&apos;entretien
              </h4>
              <div className="prose-sm max-w-none text-sm leading-6 [&_p]:mb-2 [&_ul]:ml-5 [&_ul]:list-disc">
                <ReactMarkdown>{plan.week_strategy}</ReactMarkdown>
              </div>
            </div>

            <Button
              onClick={generate}
              disabled={loading}
              variant="outline"
              size="sm"
              className="self-start"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Régénération…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 size-4" />
                  Régénérer
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
