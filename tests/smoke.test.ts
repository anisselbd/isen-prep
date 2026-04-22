import { describe, it, expect } from "vitest";

describe("smoke", () => {
  it("runs the vitest + jsdom pipeline", () => {
    expect(1 + 1).toBe(2);
    expect(typeof document).toBe("object");
  });

  it("has access to tailwind-merge utility", async () => {
    const { cn } = await import("@/lib/utils");
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
