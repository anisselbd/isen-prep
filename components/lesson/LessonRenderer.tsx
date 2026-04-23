import ReactMarkdown, { type Components } from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { ExampleBox } from "./ExampleBox";
import { MermaidBlock } from "./MermaidBlock";

// Lesson markdown conventions:
//   - Inline math  : $...$
//   - Block math   : $$...$$
//   - Callouts     : `> [!example]`, `> [!colibrimo]`, `> [!warning]`, `> [!note]`, `> [!tip]`
// Each callout is wrapped in a `> [!name]` prefix and content lines begin with `> `.

function preprocess(md: string): string {
  const callouts = ["example", "colibrimo", "warning", "note", "tip"];
  let out = md;
  for (const name of callouts) {
    const re = new RegExp(`^>\\s*\\[!${name}\\]\\s*\\n((?:>.*\\n?)*)`, "gm");
    out = out.replace(re, (_m, body: string) =>
      `\n<div data-callout="${name}">\n\n${body.replace(/^>\s?/gm, "")}\n</div>\n`
    );
  }
  return out;
}

const components: Components = {
  h1: ({ children }) => <h1 className="mb-4 text-2xl font-semibold tracking-tight">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-8 mb-3 text-xl font-semibold tracking-tight">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-6 mb-2 text-lg font-semibold tracking-tight">{children}</h3>,
  p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 list-disc pl-6 [&>li]:mb-1">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal pl-6 [&>li]:mb-1">{children}</ol>,
  code: ({ children, className }) => {
    const isBlock = (className ?? "").startsWith("language-");
    if (isBlock) {
      if (className === "language-mermaid") {
        const code = Array.isArray(children) ? children.join("") : String(children ?? "");
        return <MermaidBlock code={code} />;
      }
      return (
        <pre className="my-4 overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs">
          <code>{children}</code>
        </pre>
      );
    }
    return (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">
        {children}
      </code>
    );
  },
  a: ({ children, href }) => (
    <a href={href} className="text-primary underline-offset-4 hover:underline">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-2 border-border pl-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  div: ({ children, ...props }) => {
    const callout = (props as { "data-callout"?: string })["data-callout"];
    if (callout === "example") return <ExampleBox>{children}</ExampleBox>;
    if (callout === "colibrimo") {
      return <Callout label="Connexion Colibrimo" tone="emerald">{children}</Callout>;
    }
    if (callout === "warning") {
      return <Callout label="Piège à éviter" tone="amber">{children}</Callout>;
    }
    if (callout === "note") {
      return <Callout label="À savoir avant" tone="sky">{children}</Callout>;
    }
    if (callout === "tip") {
      return <Callout label="Astuce" tone="violet">{children}</Callout>;
    }
    return <div>{children}</div>;
  },
};

type Tone = "emerald" | "amber" | "sky" | "violet";

const TONE_CLASSES: Record<Tone, { box: string; label: string }> = {
  emerald: {
    box: "border-emerald-300/70 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/30",
    label: "text-emerald-700 dark:text-emerald-300",
  },
  amber: {
    box: "border-amber-300/70 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/30",
    label: "text-amber-800 dark:text-amber-300",
  },
  sky: {
    box: "border-sky-300/70 bg-sky-50/60 dark:border-sky-900/40 dark:bg-sky-950/30",
    label: "text-sky-700 dark:text-sky-300",
  },
  violet: {
    box: "border-violet-300/70 bg-violet-50/60 dark:border-violet-900/40 dark:bg-violet-950/30",
    label: "text-violet-700 dark:text-violet-300",
  },
};

function Callout({
  label,
  tone,
  children,
}: {
  label: string;
  tone: Tone;
  children: React.ReactNode;
}) {
  const cls = TONE_CLASSES[tone];
  return (
    <aside className={`my-5 rounded-lg border p-4 text-sm ${cls.box}`}>
      <div
        className={`mb-1 text-xs font-medium uppercase tracking-wide ${cls.label}`}
      >
        {label}
      </div>
      <div className="[&_p:last-child]:mb-0 [&_p]:mb-2">{children}</div>
    </aside>
  );
}

export function LessonRenderer({ markdown }: { markdown: string }) {
  return (
    <article className="prose-slate max-w-none text-[0.95rem] leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={components}
      >
        {preprocess(markdown)}
      </ReactMarkdown>
    </article>
  );
}
