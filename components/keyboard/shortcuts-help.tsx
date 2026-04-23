"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SHORTCUTS } from "@/lib/keyboard/shortcuts";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ShortcutsHelp({ open, onOpenChange }: Props) {
  const navItems = SHORTCUTS.filter((s) => s.chord === "nav");
  const singleItems = SHORTCUTS.filter((s) => s.chord === "single");
  const modifierItems = SHORTCUTS.filter((s) => s.chord === "modifier");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Raccourcis clavier</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 text-sm">
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Navigation
            </h3>
            <ul className="flex flex-col gap-2">
              {navItems.map((s) => (
                <li key={s.keys.join("+")} className="flex items-center justify-between">
                  <span>{s.label}</span>
                  <KeyChord keys={s.keys} separator="puis" />
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Général
            </h3>
            <ul className="flex flex-col gap-2">
              {modifierItems.map((s) => (
                <li key={s.keys.join("+")} className="flex items-center justify-between">
                  <span>{s.label}</span>
                  <KeyChord keys={s.keys} separator="+" />
                </li>
              ))}
              {singleItems.map((s) => (
                <li key={s.keys.join("+")} className="flex items-center justify-between">
                  <span>{s.label}</span>
                  <KeyChord keys={s.keys} />
                </li>
              ))}
            </ul>
          </section>
          <p className="text-xs text-muted-foreground">
            Les raccourcis chord (ex. <Kbd>g</Kbd> puis <Kbd>d</Kbd>) se
            déclenchent si tu appuies sur la seconde touche dans la seconde qui suit.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function KeyChord({
  keys,
  separator = "puis",
}: {
  keys: string[];
  separator?: string;
}) {
  return (
    <span className="flex items-center gap-1">
      {keys.map((k, i) => (
        <span key={i} className="flex items-center gap-1">
          <Kbd>{k}</Kbd>
          {i < keys.length - 1 ? (
            <span className="text-xs text-muted-foreground">{separator}</span>
          ) : null}
        </span>
      ))}
    </span>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">
      {children}
    </kbd>
  );
}
