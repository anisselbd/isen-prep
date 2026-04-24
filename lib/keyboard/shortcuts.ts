export type Shortcut = {
  chord: "nav" | "single" | "modifier";
  keys: string[];
  label: string;
  href?: string;
  action?: "help" | "search";
};

export const SHORTCUTS: Shortcut[] = [
  { chord: "nav", keys: ["g", "d"], label: "Dashboard", href: "/dashboard" },
  { chord: "nav", keys: ["g", "s"], label: "Matières", href: "/subjects" },
  { chord: "nav", keys: ["g", "q"], label: "Quiz arcade", href: "/quiz" },
  { chord: "nav", keys: ["g", "f"], label: "Flashcards", href: "/flashcards" },
  { chord: "nav", keys: ["g", "e"], label: "Examen blanc", href: "/exam" },
  { chord: "nav", keys: ["g", "i"], label: "Entretien", href: "/interview" },
  { chord: "nav", keys: ["g", "r"], label: "Révision ciblée", href: "/review" },
  { chord: "nav", keys: ["g", "t"], label: "Stats", href: "/stats" },
  { chord: "nav", keys: ["g", "h"], label: "Fiches", href: "/fiches" },
  { chord: "nav", keys: ["g", "p"], label: "Réglages", href: "/settings" },
  { chord: "modifier", keys: ["⌘", "K"], label: "Recherche globale", action: "search" },
  { chord: "single", keys: ["?"], label: "Afficher les raccourcis", action: "help" },
];

export function isTypingInField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

export function hasModifier(event: KeyboardEvent): boolean {
  return event.metaKey || event.ctrlKey || event.altKey;
}
