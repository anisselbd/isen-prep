"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "next-themes";

// mermaid is a heavy library (~500KB gzip). Load it only when a mermaid block
// actually appears in the DOM.
type MermaidApi = {
  initialize: (config: Record<string, unknown>) => void;
  render: (id: string, code: string) => Promise<{ svg: string }>;
};

let _mermaid: MermaidApi | null = null;
let _loader: Promise<MermaidApi> | null = null;

async function loadMermaid(): Promise<MermaidApi> {
  if (_mermaid) return _mermaid;
  if (!_loader) {
    _loader = import("mermaid").then((m) => {
      _mermaid = m.default as unknown as MermaidApi;
      return _mermaid;
    });
  }
  return _loader;
}

export function MermaidBlock({ code }: { code: string }) {
  const id = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = await loadMermaid();
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === "dark" ? "dark" : "default",
          fontFamily: "Inter, system-ui, sans-serif",
          securityLevel: "strict",
        });
        const { svg } = await mermaid.render(`mermaid-${id}`, code.trim());
        if (cancelled) return;
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
        setError(null);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (!cancelled) setError(msg);
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [code, id, resolvedTheme]);

  if (error) {
    return (
      <div className="my-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 font-mono text-xs text-destructive">
        Erreur mermaid : {error.slice(0, 160)}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center overflow-x-auto rounded-md border bg-card p-4 [&>svg]:h-auto [&>svg]:max-w-full"
    />
  );
}
