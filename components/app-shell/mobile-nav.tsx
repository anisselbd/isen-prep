"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/app-shell/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileNav({ showDev }: { showDev: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={(next) => setOpen(next)}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Ouvrir le menu"
            className="md:hidden"
          >
            <Menu className="size-5" />
          </Button>
        }
      />
      <SheetContent side="left" className="w-64 p-0">
        <Sidebar showDev={showDev} />
      </SheetContent>
    </Sheet>
  );
}
