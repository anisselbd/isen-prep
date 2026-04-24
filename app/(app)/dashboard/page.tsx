import type { Metadata } from "next";
import { Suspense } from "react";
import { CoachCard } from "@/components/coach/coach-card";
import {
  DailyPlanSection,
  DailyPlanSectionSkeleton,
} from "@/components/dashboard/sections/daily-plan-section";
import {
  HeatmapSection,
  HeatmapSectionSkeleton,
} from "@/components/dashboard/sections/heatmap-section";
import {
  StatsSection,
  StatsSectionSkeleton,
} from "@/components/dashboard/sections/stats-section";
import {
  StreakSection,
  StreakSectionSkeleton,
} from "@/components/dashboard/sections/streak-section";
import {
  WeakPointsSection,
  WeakPointsSectionSkeleton,
} from "@/components/dashboard/sections/weak-points-section";
import { isGeminiConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard · ISEN PREP" };

export default async function DashboardPage() {
  // Only fetch the minimum needed for the header — keeps the first byte fast.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  const geminiOk = isGeminiConfigured();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          Bonjour{profile?.display_name ? `, ${profile.display_name}` : ""}.
        </h1>
        <p className="text-sm text-muted-foreground">
          Vue d&apos;ensemble de ta préparation à l&apos;entretien ISEN CIR.
        </p>
      </header>

      <Suspense fallback={<DailyPlanSectionSkeleton />}>
        <DailyPlanSection />
      </Suspense>

      <Suspense fallback={<StatsSectionSkeleton />}>
        <StatsSection />
      </Suspense>

      <Suspense fallback={<StreakSectionSkeleton />}>
        <StreakSection />
      </Suspense>

      <CoachCard geminiConfigured={geminiOk} />

      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Suspense fallback={<HeatmapSectionSkeleton />}>
          <HeatmapSection />
        </Suspense>
        <Suspense fallback={<WeakPointsSectionSkeleton />}>
          <WeakPointsSection />
        </Suspense>
      </section>
    </div>
  );
}
