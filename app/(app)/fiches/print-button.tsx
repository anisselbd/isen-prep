"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      className="gap-2"
      variant="default"
      size="sm"
    >
      <Printer className="size-4" />
      Imprimer / PDF
    </Button>
  );
}
