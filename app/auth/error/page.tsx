import Link from "next/link";
import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Erreur de connexion · ISEN PREP",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-6">
      <div className="max-w-sm text-center">
        <h1 className="text-xl font-semibold">Connexion impossible</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {reason ?? "Le lien a expiré ou est invalide."}
        </p>
        <Link href="/login" className={buttonVariants({ className: "mt-6" })}>
          Renvoyer un lien
        </Link>
      </div>
    </main>
  );
}
