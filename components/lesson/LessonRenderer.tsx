import ReactMarkdown, { type Components } from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { ExampleBox } from "./ExampleBox";

// Lesson markdown conventions:
//   - Inline math  : $...$
//   - Block math   : $$...$$
//   - Example box  : wrap content inside a blockquote starting with "> [!example]"
//   - Colibrimo    : wrap inside "> [!colibrimo]" for the dedicated callout
// The callout syntax is pre-processed to a custom marker, then rendered below.

function preprocess(md: string): string {
  return md
    .replace(/^>\s*\[!example\]\s*\n((?:>.*\n?)*)/gm, (_m, body: string) =>
      `\n<div data-callout="example">\n\n${body.replace(/^>\s?/gm, "")}\n</div>\n`
    )
    .replace(/^>\s*\[!colibrimo\]\s*\n((?:>.*\n?)*)/gm, (_m, body: string) =>
      `\n<div data-callout="colibrimo">\n\n${body.replace(/^>\s?/gm, "")}\n</div>\n`
    );
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
      return (
        <aside className="my-5 rounded-lg border border-emerald-300/70 bg-emerald-50/50 p-4 text-sm dark:border-emerald-900/40 dark:bg-emerald-950/30">
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            Connexion Colibrimo
          </div>
          <div className="[&_p:last-child]:mb-0 [&_p]:mb-2">{children}</div>
        </aside>
      );
    }
    return <div>{children}</div>;
  },
};

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
