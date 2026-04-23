export type GameStats = {
  final_score: number;
  total_answers: number;
  correct_count: number;
  wrong_count: number;
  max_combo: number;
  fast_answer_count: number; // correct answers in < 3s
  power_ups_used: number;
  mode_key: string;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  check: (s: GameStats) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_game",
    name: "Premier pas",
    description: "Terminer une première partie.",
    check: (s) => s.total_answers > 0,
  },
  {
    id: "no_mistake",
    name: "Partie parfaite",
    description: "Finir une partie sans aucune erreur (min. 5 questions).",
    check: (s) => s.wrong_count === 0 && s.total_answers >= 5,
  },
  {
    id: "combo_10",
    name: "Dix en rafale",
    description: "Enchaîner un combo de 10.",
    check: (s) => s.max_combo >= 10,
  },
  {
    id: "score_500",
    name: "500 pts",
    description: "Franchir la barre des 500 points en une partie.",
    check: (s) => s.final_score >= 500,
  },
  {
    id: "score_1000",
    name: "1000 pts",
    description: "Franchir la barre des 1000 points en une partie.",
    check: (s) => s.final_score >= 1000,
  },
  {
    id: "quick_reflexes",
    name: "Réflexes rapides",
    description: "10 bonnes réponses en < 3 s dans une même partie.",
    check: (s) => s.fast_answer_count >= 10,
  },
  {
    id: "survival_30",
    name: "Marathonien",
    description: "Répondre à 30 questions en mode Survival.",
    check: (s) => s.mode_key === "survival" && s.total_answers >= 30,
  },
  {
    id: "no_powerups",
    name: "À l'ancienne",
    description: "Finir une partie (≥ 10 questions) sans aucun power-up.",
    check: (s) => s.power_ups_used === 0 && s.total_answers >= 10,
  },
];

const STORAGE_KEY = "isen-prep:quiz-achievements";

export function loadUnlocked(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

export function saveUnlocked(ids: Set<string>): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {}
}

/**
 * Return the set of newly-unlocked achievement ids given end-of-game stats,
 * and persist the updated set.
 */
export function reconcileAchievements(stats: GameStats): {
  all: Set<string>;
  newly: string[];
} {
  const current = loadUnlocked();
  const newly: string[] = [];
  for (const a of ACHIEVEMENTS) {
    if (!current.has(a.id) && a.check(stats)) {
      current.add(a.id);
      newly.push(a.id);
    }
  }
  if (newly.length > 0) saveUnlocked(current);
  return { all: current, newly };
}
