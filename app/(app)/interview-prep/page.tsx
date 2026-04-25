import type { Metadata } from "next";
import { AlertTriangle, Compass, MessageSquareQuote, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  PITCHES,
  PITFALLS,
  QA_SECTIONS,
  SCIENTIFIC_GAP_RESPONSE,
} from "@/lib/interview-prep/content";
import { PrintButton } from "./print-button";

export const metadata: Metadata = {
  title: "Préparation entretien · ISEN PREP",
};

function daysUntil(target: string | null): number | null {
  if (!target) return null;
  const d = new Date(target);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = d.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default async function InterviewPrepPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let countdownLabel: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("target_interview_date")
      .eq("id", user.id)
      .maybeSingle();
    const days = daysUntil(profile?.target_interview_date ?? null);
    if (days !== null) {
      if (days > 1) countdownLabel = `J-${days}`;
      else if (days === 1) countdownLabel = "J-1 — demain";
      else if (days === 0) countdownLabel = "Aujourd'hui";
      else countdownLabel = `Entretien passé (J+${Math.abs(days)})`;
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 print:hidden">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Préparation entretien Junia ISEN
            </h1>
            <p className="text-sm text-muted-foreground">
              Banque de questions, pitch, anti-pièges et réponse au doute
              scientifique. Imprimable pour réviser hors-ligne.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {countdownLabel && (
              <span className="rounded-full border bg-card px-3 py-1 text-xs font-medium tabular-nums">
                {countdownLabel}
              </span>
            )}
            <PrintButton />
          </div>
        </div>

        <nav className="flex flex-wrap gap-2 text-xs">
          <a
            href="#doute-scientifique-bloc"
            className="rounded-full border border-amber-300/70 bg-amber-50/60 px-3 py-1 text-amber-900 transition-colors hover:bg-amber-100/80 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200"
          >
            Réponse au doute scientifique
          </a>
          <a
            href="#pitches"
            className="rounded-full border border-border bg-card px-3 py-1 text-muted-foreground transition-colors hover:bg-accent/40"
          >
            Pitches perso (1 / 2 / 5 min)
          </a>
          <a
            href="#qa"
            className="rounded-full border border-border bg-card px-3 py-1 text-muted-foreground transition-colors hover:bg-accent/40"
          >
            Banque de 25 questions
          </a>
          <a
            href="#anti-pieges"
            className="rounded-full border border-border bg-card px-3 py-1 text-muted-foreground transition-colors hover:bg-accent/40"
          >
            Anti-pièges
          </a>
        </nav>

        <div className="rounded-md border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
          <strong>Astuce :</strong> les exemples sont des trames à
          t'approprier, pas à réciter. À voix haute en marchant, plusieurs
          fois, jusqu'à ce que ça sorte naturellement.
        </div>
      </header>

      <section
        id="doute-scientifique-bloc"
        className="subject-section flex flex-col gap-3"
      >
        <header className="flex items-center gap-2 border-b pb-2">
          <Target className="size-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-xl font-semibold">
            Réponse au doute scientifique (3 phrases prêtes)
          </h2>
        </header>
        <article className="lesson-card rounded-md border border-amber-300/70 bg-amber-50/40 p-4 text-sm leading-relaxed dark:border-amber-900/40 dark:bg-amber-950/20 print:border-0 print:bg-transparent print:p-0">
          {SCIENTIFIC_GAP_RESPONSE.split("\n\n").map((para, i) => (
            <p key={i} className={i === 0 ? "" : "mt-3"}>
              {para}
            </p>
          ))}
        </article>
      </section>

      <section id="pitches" className="subject-section flex flex-col gap-4">
        <header className="flex items-center gap-2 border-b pb-2">
          <MessageSquareQuote className="size-5" />
          <h2 className="text-xl font-semibold">Pitches perso (3 versions)</h2>
        </header>
        <p className="text-sm text-muted-foreground print:text-xs">
          Trois durées selon ce qu'on te demande. Le 2 minutes est le plus
          utile en pratique.
        </p>
        <div className="grid gap-4 lg:grid-cols-3">
          {PITCHES.map((p) => (
            <article
              key={p.id}
              className="lesson-card flex flex-col gap-2 rounded-md border bg-card p-4 print:border-0 print:p-0"
            >
              <header className="flex items-baseline justify-between gap-2 border-b pb-2">
                <h3 className="text-lg font-semibold">{p.duration}</h3>
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {p.wordCount} mots
                </span>
              </header>
              <div className="flex flex-col gap-3 text-sm leading-relaxed">
                {p.body.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <p className="mt-2 rounded-md bg-muted/40 p-2 text-xs italic text-muted-foreground">
                <strong className="not-italic">Note :</strong> {p.notes}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="qa" className="subject-section flex flex-col gap-6">
        <header className="flex items-center gap-2 border-b pb-2">
          <Compass className="size-5" />
          <h2 className="text-xl font-semibold">
            Banque de 25 questions structurées
          </h2>
        </header>
        <p className="text-sm text-muted-foreground print:text-xs">
          Chaque question a son piège, sa structure de réponse, et un exemple
          ancré sur ton parcours (militaire → dev → ingé, ACSSI, Java,
          Colibrimo). À adapter, jamais à apprendre par cœur.
        </p>

        {QA_SECTIONS.map((section) => (
          <div
            key={section.id}
            id={section.id}
            className="flex flex-col gap-3"
          >
            <header className="border-l-4 border-primary/40 pl-3">
              <h3 className="text-base font-semibold">{section.title}</h3>
              <p className="text-xs text-muted-foreground">
                {section.description}
              </p>
            </header>
            <div className="flex flex-col gap-3">
              {section.questions.map((qa, idx) => (
                <article
                  key={qa.id}
                  className="lesson-card flex flex-col gap-3 rounded-md border bg-card p-4 print:border-0 print:p-0"
                >
                  <header>
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      Question {idx + 1}
                    </span>
                    <h4 className="text-base font-semibold leading-snug">
                      {qa.question}
                    </h4>
                  </header>
                  <div className="grid gap-2 text-sm leading-relaxed">
                    <div className="rounded-md border border-amber-300/60 bg-amber-50/40 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
                        Piège à éviter
                      </span>
                      <p className="mt-1">{qa.trap}</p>
                    </div>
                    <div className="rounded-md border border-sky-300/60 bg-sky-50/40 p-3 dark:border-sky-900/40 dark:bg-sky-950/20">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-sky-800 dark:text-sky-300">
                        Structure de réponse
                      </span>
                      <p className="mt-1">{qa.structure}</p>
                    </div>
                    <div className="rounded-md border border-emerald-300/60 bg-emerald-50/40 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                        Exemple ancré (à reformuler avec tes mots)
                      </span>
                      <p className="mt-1 italic">{qa.example}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section
        id="anti-pieges"
        className="subject-section flex flex-col gap-4"
      >
        <header className="flex items-center gap-2 border-b pb-2">
          <AlertTriangle className="size-5 text-destructive" />
          <h2 className="text-xl font-semibold">
            Anti-pièges ({PITFALLS.length} erreurs à ne pas commettre)
          </h2>
        </header>
        <div className="grid gap-3 md:grid-cols-2">
          {PITFALLS.map((p) => (
            <article
              key={p.id}
              className="lesson-card flex flex-col gap-2 rounded-md border bg-card p-4 print:border-0 print:p-0"
            >
              <h3 className="text-sm font-semibold text-destructive">
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">Pourquoi c'est piégeux : </span>
                {p.why}
              </p>
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">À faire à la place : </span>
                {p.fix}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
