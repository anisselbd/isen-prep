import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "@/app/(app)/actions";

type TopbarProps = {
  email: string;
  displayName: string | null;
};

export function Topbar({ email, displayName }: TopbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium">{displayName ?? email}</span>
        {displayName ? (
          <span className="text-xs text-muted-foreground">{email}</span>
        ) : null}
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <form action={signOut}>
          <Button type="submit" variant="ghost" size="sm">
            <LogOut className="size-4" aria-hidden="true" />
            <span className="ml-2">Déconnexion</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
