import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type SearchKind = "subject" | "topic" | "lesson" | "exercise";

export type SearchItem = {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle?: string;
  href: string;
  hint?: string;
};

/**
 * Flat list indexed for client-side fuzzy search. Topics/lessons/subjects are
 * small (~50 items) so we ship the full list and let the client filter.
 */
export async function buildSearchIndex(
  supabase: SupabaseClient<Database>,
): Promise<SearchItem[]> {
  const [subjectsRes, topicsRes, lessonsRes] = await Promise.all([
    supabase
      .from("subjects")
      .select("id, name, description")
      .order("order_index"),
    supabase
      .from("topics")
      .select("id, subject_id, name, description")
      .order("order_index"),
    supabase.from("lessons").select("id, topic_id, title"),
  ]);

  const items: SearchItem[] = [];

  for (const s of subjectsRes.data ?? []) {
    items.push({
      id: `subject:${s.id}`,
      kind: "subject",
      title: s.name,
      subtitle: s.description ?? undefined,
      href: `/subjects/${s.id}`,
    });
  }

  const subjectNameById = new Map(
    (subjectsRes.data ?? []).map((s) => [s.id, s.name]),
  );

  for (const t of topicsRes.data ?? []) {
    items.push({
      id: `topic:${t.id}`,
      kind: "topic",
      title: t.name,
      subtitle: subjectNameById.get(t.subject_id),
      href: `/subjects/${t.subject_id}/${t.id}`,
      hint: t.description ?? undefined,
    });
  }

  const topicById = new Map(
    (topicsRes.data ?? []).map((t) => [t.id, t]),
  );

  for (const l of lessonsRes.data ?? []) {
    const t = topicById.get(l.topic_id);
    if (!t) continue;
    items.push({
      id: `lesson:${l.id}`,
      kind: "lesson",
      title: l.title,
      subtitle: `Leçon · ${t.name}`,
      href: `/subjects/${t.subject_id}/${t.id}/lesson`,
    });
  }

  return items;
}
