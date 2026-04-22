"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z.string().email("Adresse email invalide"),
  next: z.string().optional(),
});

export type LoginState =
  | { status: "idle" }
  | { status: "success"; email: string }
  | { status: "error"; message: string };

async function resolveOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto =
    h.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") ? "http" : "https");
  if (!host) throw new Error("Impossible de déterminer l'origine de la requête");
  return `${proto}://${host}`;
}

export async function loginWithMagicLink(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    next: formData.get("next") ?? undefined,
  });
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { status: "error", message: first?.message ?? "Données invalides" };
  }

  const supabase = await createClient();
  const origin = await resolveOrigin();
  const callback = new URL("/auth/callback", origin);
  if (parsed.data.next) callback.searchParams.set("next", parsed.data.next);

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: callback.toString(),
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { status: "error", message: error.message };
  }
  return { status: "success", email: parsed.data.email };
}
