// Extract plain, TTS-friendly text from our lesson markdown.
//
// Goals:
// - Strip KaTeX (inline and block) — formulas don't read well.
// - Strip code blocks and inline code — same reason.
// - Strip tables — they don't read linearly.
// - Convert our custom callouts `> [!example]` to readable French labels.
// - Remove markdown syntax (bold/italic/heading markers, link markup)
//   while keeping the surrounding text.

const CALLOUT_LABELS: Record<string, string> = {
  example: "Exemple.",
  colibrimo: "Connexion Colibrimo.",
  warning: "Attention, piège à éviter.",
  note: "À savoir avant.",
  tip: "Astuce.",
};

export function extractReadableText(markdown: string): string {
  let text = markdown;

  // 1. Strip fenced code blocks ```...```
  text = text.replace(/```[\s\S]*?```/g, "");

  // 2. Strip block math $$...$$
  text = text.replace(/\$\$[\s\S]*?\$\$/g, " ");

  // 3. Strip inline math $...$
  text = text.replace(/\$[^$\n]+\$/g, " ");

  // 4. Strip HTML-style div wrappers that might leak from preprocessing
  text = text.replace(/<\/?div[^>]*>/g, "");

  // 5. Transform callouts `> [!name]\n> body...` into "Label: body"
  text = text.replace(/^>\s*\[!(\w+)\]\s*$/gm, (_m, name: string) =>
    CALLOUT_LABELS[name.toLowerCase()] ?? "Note.",
  );

  // 6. Strip remaining blockquote markers `>` at line start
  text = text.replace(/^>\s?/gm, "");

  // 7. Strip markdown tables (any line that is mostly pipes).
  //    A table line is one that starts with `|` or that contains 2+ `|`.
  text = text
    .split("\n")
    .filter((line) => {
      const pipes = (line.match(/\|/g) ?? []).length;
      return !(line.trimStart().startsWith("|") || pipes >= 2);
    })
    .join("\n");

  // 8. Inline code → drop backticks, keep content.
  text = text.replace(/`([^`]+)`/g, "$1");

  // 9. Images ![alt](url) → alt
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");

  // 10. Links [text](url) → text
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");

  // 11. Headings: drop leading # signs.
  text = text.replace(/^#{1,6}\s+/gm, "");

  // 12. Bold / italic markers (**, __, *, _) — keep content.
  text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");
  text = text.replace(/([*_])(.*?)\1/g, "$2");

  // 13. Strikethrough ~~text~~
  text = text.replace(/~~(.*?)~~/g, "$1");

  // 14. Horizontal rules ---
  text = text.replace(/^\s*[-*_]{3,}\s*$/gm, "");

  // 15. List bullets at line start
  text = text.replace(/^\s*[-*]\s+/gm, "");
  text = text.replace(/^\s*\d+\.\s+/gm, "");

  // 16. Collapse whitespace: multiple blank lines → single, trim.
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.trim();

  return text;
}
