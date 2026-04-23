"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const saveNoteSchema = z.object({
  topic_id: z.string().min(1).max(200),
  slug: z.string().min(1).max(50),
  content_md: z.string().max(50_000),
});

export async function saveNote(input: {
  topic_id: string;
  slug: string;
  content_md: string;
}): Promise<{ ok: true; updated_at: string } | { ok: false; error: string }> {
  const parsed = saveNoteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Entrée invalide." };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié." };

  const now = new Date().toISOString();
  const { error } = await supabase.from("user_notes").upsert(
    {
      user_id: user.id,
      topic_id: parsed.data.topic_id,
      content_md: parsed.data.content_md,
      updated_at: now,
    },
    { onConflict: "user_id,topic_id" },
  );
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/subjects/${parsed.data.slug}/${parsed.data.topic_id}`);
  return { ok: true, updated_at: now };
}
