import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/app-shell/sidebar";
import { Topbar } from "@/components/app-shell/topbar";
import { ShortcutsProvider } from "@/components/keyboard/shortcuts-provider";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  const showDev = process.env.NODE_ENV === "development";

  return (
    <div className="grid min-h-dvh grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="row-span-2 hidden md:block">
        <Sidebar showDev={showDev} />
      </aside>
      <div className="flex min-w-0 flex-col">
        <Topbar
          email={user.email ?? ""}
          displayName={profile?.display_name ?? null}
          showDev={showDev}
        />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
      <ShortcutsProvider />
    </div>
  );
}
