import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { LessonRenderer } from "./LessonRenderer";

describe("LessonRenderer", () => {
  it("renders inline KaTeX", () => {
    const { container } = render(
      <LessonRenderer markdown={`La dérivée est $f'(x) = 2x$ ici.`} />
    );
    expect(container.querySelector(".katex")).not.toBeNull();
  });

  it("renders block KaTeX (display math on its own block)", () => {
    // remark-math v6 only emits display math when $$ delimiters are on their
    // own lines — inline `$$...$$` within a paragraph stays inline.
    const { container } = render(
      <LessonRenderer
        markdown={`Formule :\n\n$$\n\\int_0^1 x\\,dx = \\frac{1}{2}\n$$\n`}
      />
    );
    expect(container.querySelector(".katex-display")).not.toBeNull();
  });

  it("renders an example callout from `[!example]` syntax", () => {
    const md = `> [!example]\n> Un exemple concret de $x^2$.`;
    const { container } = render(<LessonRenderer markdown={md} />);
    expect(container.querySelector("aside")).not.toBeNull();
  });

  it("renders a Colibrimo callout from `[!colibrimo]` syntax", () => {
    const md = `> [!colibrimo]\n> Tu utilises ça pour le RAG.`;
    const { getByText } = render(<LessonRenderer markdown={md} />);
    expect(getByText(/Connexion Colibrimo/i)).not.toBeNull();
  });
});
