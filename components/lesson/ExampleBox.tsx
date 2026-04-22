import { Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

export function ExampleBox({ children }: { children: ReactNode }) {
  return (
    <aside className="my-5 flex gap-3 rounded-lg border border-amber-200/70 bg-amber-50/60 p-4 text-sm dark:border-amber-900/40 dark:bg-amber-950/30">
      <Lightbulb
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400"
      />
      <div className="flex-1 [&_p:last-child]:mb-0 [&_p]:mb-2">{children}</div>
    </aside>
  );
}
