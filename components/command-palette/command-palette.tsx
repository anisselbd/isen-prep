"use client";

import { BookOpen, FileText, Folder, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { fuzzySearch } from "@/lib/search/fuzzy";
import type { SearchItem, SearchKind } from "@/lib/search/build-index";
import { cn } from "@/lib/utils";

const KIND_META: Record<SearchKind, { label: string; icon: typeof Folder }> = {
  subject: { label: "Matière", icon: Folder },
  topic: { label: "Topic", icon: BookOpen },
  lesson: { label: "Leçon", icon: FileText },
  exercise: { label: "Exercice", icon: FileText },
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandPalette({ open, onOpenChange }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<SearchItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const loadedRef = useRef(false);

  // Lazy-fetch the index on first open.
  useEffect(() => {
    if (!open || loadedRef.current) return;
    loadedRef.current = true;
    setLoading(true);
    fetch("/api/search-index")
      .then((r) => r.json())
      .then((body) => {
        setItems(body.items ?? []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [open]);

  // Focus input + reset on open.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results = useMemo(
    () => (items ? fuzzySearch(items, query) : []),
    [items, query],
  );

  const go = useCallback(
    (item: SearchItem) => {
      onOpenChange(false);
      router.push(item.href);
    },
    [router, onOpenChange],
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[activeIndex];
      if (item) go(item);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 sm:max-w-xl"
        showCloseButton={false}
        aria-label="Recherche globale"
      >
        <div className="flex items-center gap-2 border-b px-3 py-2.5">
          <Search className="size-4 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Matière, topic, leçon…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {loading ? (
            <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
          ) : (
            <kbd className="rounded border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              Esc
            </kbd>
          )}
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-1">
          {items === null && loading ? (
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
              Chargement de l&apos;index…
            </div>
          ) : results.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
              Aucun résultat.
            </div>
          ) : (
            <ul className="flex flex-col">
              {results.map((item, i) => {
                const meta = KIND_META[item.kind];
                const Icon = meta.icon;
                const active = i === activeIndex;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => go(item)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                        active ? "bg-accent" : "hover:bg-accent/60",
                      )}
                    >
                      <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{item.title}</div>
                        {item.subtitle ? (
                          <div className="truncate text-xs text-muted-foreground">
                            {item.subtitle}
                          </div>
                        ) : null}
                      </div>
                      <span className="shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {meta.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-3">
            <span>
              <kbd className="rounded border px-1 py-0.5 font-mono text-[10px]">↑</kbd>
              <kbd className="ml-1 rounded border px-1 py-0.5 font-mono text-[10px]">↓</kbd>
              <span className="ml-2">naviguer</span>
            </span>
            <span>
              <kbd className="rounded border px-1 py-0.5 font-mono text-[10px]">
                Entrée
              </kbd>
              <span className="ml-2">ouvrir</span>
            </span>
          </span>
          <span>{results.length} résultats</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
