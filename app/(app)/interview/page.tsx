import type { Metadata } from "next";

export const metadata: Metadata = { title: "Entretien · ISEN PREP" };

export default function InterviewPage() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-semibold tracking-tight">Simulation d&apos;entretien</h1>
      <p className="text-sm text-muted-foreground">Disponible en Phase 6.</p>
    </div>
  );
}
