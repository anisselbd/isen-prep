import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { isGeminiConfigured } from "@/lib/env";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "Réglages · ISEN PREP" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, target_interview_date")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  const geminiOk = isGeminiConfigured();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Réglages</h1>
        <p className="text-sm text-muted-foreground">
          Profil, date de l&apos;entretien et intégrations.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Ton nom et la date cible.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            displayName={profile?.display_name ?? null}
            targetDate={profile?.target_interview_date ?? null}
          />
        </CardContent>
      </Card>

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
