"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchButton() {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Recherche globale (Cmd+K)"
      onClick={() => {
        window.dispatchEvent(new Event("isen:open-palette"));
      }}
    >
      <Search className="size-4" aria-hidden="true" />
    </Button>
  );
}
