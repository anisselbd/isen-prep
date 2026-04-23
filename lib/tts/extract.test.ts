import { describe, it, expect } from "vitest";
import { extractReadableText } from "./extract";

describe("extractReadableText", () => {
  it("strips inline and block KaTeX", () => {
    const input =
      "Soit $f(x) = x^2$ une fonction.\n\n$$\\int_0^1 f(x)\\,dx = 1/3$$\n\nC'est fini.";
    const out = extractReadableText(input);
    expect(out).not.toContain("$");
    expect(out).not.toContain("\\int");
    expect(out).toContain("Soit");
    expect(out).toContain("C'est fini");
  });

  it("strips fenced code blocks", () => {
    const input =
      "Voici un exemple :\n\n```js\nconst x = 1;\n```\n\nEt voilà.";
    const out = extractReadableText(input);
    expect(out).not.toContain("const x");
    expect(out).toContain("Voici un exemple");
    expect(out).toContain("Et voilà");
  });

  it("converts callouts to French labels", () => {
    const input =
      "Texte.\n\n> [!warning]\n> Attention à ce piège.\n\nSuite.";
    const out = extractReadableText(input);
    expect(out).toContain("Attention, piège à éviter");
    expect(out).toContain("Attention à ce piège");
    expect(out).not.toContain("[!warning]");
  });

  it("removes bold and italic markers but keeps content", () => {
    const input = "Voici du **gras** et de l'*italique*.";
    const out = extractReadableText(input);
    expect(out).toBe("Voici du gras et de l'italique.");
  });

  it("drops heading markers", () => {
    const input = "## Titre\n\nContenu.";
    const out = extractReadableText(input);
    expect(out).toContain("Titre");
    expect(out).not.toContain("##");
  });

  it("extracts inline code content without backticks", () => {
    const input = "On utilise `Array.sort()` ici.";
    const out = extractReadableText(input);
    expect(out).toContain("Array.sort");
    expect(out).not.toContain("`");
  });

  it("drops table rows", () => {
    const input =
      "Avant le tableau.\n\n| col1 | col2 |\n|------|------|\n| a | b |\n\nAprès.";
    const out = extractReadableText(input);
    expect(out).not.toContain("col1");
    expect(out).toContain("Avant");
    expect(out).toContain("Après");
  });

  it("keeps link text, drops URL", () => {
    const input = "Voir [la doc](https://example.com) pour plus d'info.";
    const out = extractReadableText(input);
    expect(out).toContain("la doc");
    expect(out).not.toContain("https://example.com");
  });

  it("strips list bullets at line start", () => {
    const input = "Liste :\n- premier\n- deuxième";
    const out = extractReadableText(input);
    expect(out).not.toMatch(/^\s*-/m);
    expect(out).toContain("premier");
    expect(out).toContain("deuxième");
  });
});
