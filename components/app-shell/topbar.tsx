import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/app-shell/mobile-nav";
import { SearchButton } from "@/components/command-palette/search-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "@/app/(app)/actions";

type TopbarProps = {
  email: string;
  displayName: string | null;
  showDev: boolean;
};

export function Topbar({ email, displayName, showDev }: TopbarProps) {
  return (
    <header className="flex h-14 items-center justify-between gap-2 border-b bg-background px-2 md:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <MobileNav showDev={showDev} />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium">
            {displayName ?? email}
          </span>
          {displayName ? (
            <span className="truncate text-xs text-muted-foreground">
              {email}
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <SearchButton />
        <ThemeToggle />
        <form action={signOut}>
          <Button type="submit" variant="ghost" size="sm">
            <LogOut className="size-4" aria-hidden="true" />
            <span className="ml-2 hidden sm:inline">Déconnexion</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
