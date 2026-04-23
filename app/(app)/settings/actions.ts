"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  display_name: z.string().trim().max(80).optional(),
  target_interview_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format attendu : AAAA-MM-JJ")
    .or(z.literal(""))
    .optional(),
});

export type UpdateProfileState =
  | { status: "idle" }
  | { status: "ok" }
  | { status: "error"; message: string };

export async function updateProfileAction(
  _prev: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Non authentifié" };

  const parsed = profileSchema.safeParse({
    display_name: formData.get("display_name") ?? undefined,
    target_interview_date: formData.get("target_interview_date") ?? undefined,
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Données invalides",
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.display_name || null,
      target_interview_date: parsed.data.target_interview_date
        ? parsed.data.target_interview_date
        : null,
    })
    .eq("id", user.id);

  if (error) return { status: "error", message: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  return { status: "ok" };
}
