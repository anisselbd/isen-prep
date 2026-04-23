import { StreakCard } from "@/components/streak/streak-card";
import { loadStreakData } from "@/lib/streak/server";
import { createClient } from "@/lib/supabase/server";

export async function StreakSection() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const data = await loadStreakData(supabase, user.id);
  return <StreakCard data={data} />;
}

export function StreakSectionSkeleton() {
  return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
}
