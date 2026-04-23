import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { isGeminiConfigured } from "@/lib/env";
import { InterviewChat } from "./interview-chat";

export const metadata: Metadata = { title: "Entretien · ISEN PREP" };

export default function InterviewPage() {
  const geminiOk = isGeminiConfigured();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Simulation d&apos;entretien</h1>
        <p className="text-sm text-muted-foreground">
          Jury virtuel. Alternance de questions techniques, de motivation et de mises en difficulté. 10 tours puis feedback final.
        </p>
      </header>

      {geminiOk ? (
        <InterviewChat />
      ) : (
        <div className="rounded-md border bg-card p-6 text-sm">
          <p className="text-muted-foreground">
            Gemini n&apos;est pas configurée. Ajoute{" "}
            <code className="font-mono">GOOGLE_GEMINI_API_KEY</code> pour activer
            le jury virtuel.
          </p>
          <Link
            href="/settings"
            className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4" })}
          >
            Aller aux réglages
          </Link>
        </div>
      )}
    </div>
  );
}
