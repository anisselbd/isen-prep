import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isGeminiConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Réglages · ISEN PREP" };

export default function SettingsPage() {
  const geminiOk = isGeminiConfigured();
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Réglages</h1>
        <p className="text-sm text-muted-foreground">
          Gestion du profil et intégrations.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Intégrations</CardTitle>
          <CardDescription>État des services externes</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span>Gemini API</span>
            {geminiOk ? (
              <Badge variant="default">Configurée ✓</Badge>
            ) : (
              <Badge variant="destructive">Non configurée ✗</Badge>
            )}
          </div>
          {!geminiOk ? (
            <p className="text-xs text-muted-foreground">
              Ajoute <code className="font-mono">GOOGLE_GEMINI_API_KEY</code> à
              ton <code className="font-mono">.env.local</code> pour activer la
              génération d&apos;exercices et l&apos;entretien simulé.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
