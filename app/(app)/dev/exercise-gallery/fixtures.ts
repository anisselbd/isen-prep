// TODO: à supprimer en Phase 7 avec la route /dev/exercise-gallery.
import type { Exercise } from "@/lib/exercise/types";

export const GALLERY_FIXTURES: readonly Exercise[] = [
  {
    id: "mcq-demo",
    topic_id: "informatique.algo.big_o",
    type: "mcq",
    difficulty: 2,
    question_md:
      "Quelle est la complexité **moyenne** d'une recherche dichotomique sur un tableau trié ?",
    data: {
      choices: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      answer: 1,
    },
    explanation_md:
      "Une dichotomie divise l'espace de recherche par 2 à chaque étape → hauteur de l'arbre = $\\log_2(n)$.",
    colibrimo_connection:
      "Même idée pour chercher un embedding dans un index vectoriel trié (pgvector HNSW).",
  },
  {
    id: "numeric-demo",
    topic_id: "maths.analyse.derivees",
    type: "numeric",
    difficulty: 2,
    question_md: "Dérivée de $f(x) = x^2 + 3x$ en $x = 2$ ?",
    data: { answer: 7, tolerance: 0 },
    explanation_md:
      "$f'(x) = 2x + 3$, donc $f'(2) = 2 \\times 2 + 3 = 7$.",
  },
  {
    id: "formula-demo",
    topic_id: "maths.analyse.integrales",
    type: "formula",
    difficulty: 3,
    question_md: "Donne une primitive de $f(x) = 2x + 1$.",
    data: {
      expected_latex: "x^2 + x + C",
      equivalent_forms: ["x^{2}+x+C", "x^2+x + C"],
    },
    explanation_md:
      "Primitives usuelles : $\\int (2x+1)dx = x^2 + x + C$ (avec $C$ une constante).",
  },
  {
    id: "text-demo",
    topic_id: "maths.algebre.similarite_cosinus",
    type: "text",
    difficulty: 3,
    question_md: "Explique en 3-5 lignes le principe d'un RAG.",
    data: {
      expected_key_points: ["retrieval", "embeddings", "similarité", "génération", "contexte"],
      max_chars: 800,
    },
    explanation_md:
      "Un RAG (Retrieval-Augmented Generation) récupère via similarité cosinus les chunks pertinents d'une base vectorielle, puis les injecte dans le contexte du LLM.",
    colibrimo_connection:
      "C'est exactement ce que fait Colibrimo pour récupérer les règles d'estimation avant de générer un devis.",
  },
  {
    id: "code-demo",
    topic_id: "informatique.algo.tris",
    type: "code",
    difficulty: 2,
    question_md:
      "Écris une fonction `max(arr)` qui retourne le plus grand élément d'un tableau non vide.",
    data: {
      language: "js",
      function_signature: "function max(arr: number[]): number",
      hints: ["Pense au cas d'un tableau à 1 élément.", "Tu peux utiliser une boucle ou une méthode native."],
      starter_code: "function max(arr) {\n  // ...\n}",
    },
    explanation_md:
      "Solution concise : `arr.reduce((a, b) => a > b ? a : b)`. Complexité $O(n)$.",
  },
  {
    id: "circuit-demo",
    topic_id: "physique.elec.assoc_resistances",
    type: "circuit",
    difficulty: 2,
    question_md:
      "Calcule la résistance équivalente $R_{\\text{éq}}$ de R1 et R2 en parallèle.",
    data: {
      components: [
        { type: "R", label: "R1", value: 100 },
        { type: "R", label: "R2", value: 200 },
      ],
      configuration: "parallel",
      question: "R_eq",
      answer: 66.67,
      tolerance: 0.5,
    },
    explanation_md:
      "En parallèle : $\\frac{1}{R_{éq}} = \\frac{1}{R_1} + \\frac{1}{R_2}$, donc $R_{éq} = \\frac{R_1 R_2}{R_1 + R_2} = \\frac{100 \\times 200}{300} \\approx 66{,}67\\,\\Omega$.",
  },
  {
    id: "conversion-demo",
    topic_id: "electronique.num.conversions",
    type: "conversion",
    difficulty: 2,
    question_md: "Convertis `0xA3` en décimal et en binaire.",
    data: {
      source: { base: "hex", value: "A3" },
      targets: ["decimal", "binary"],
    },
    explanation_md:
      "0xA3 = $10 \\times 16 + 3 = 163$ en décimal. En binaire : A=1010, 3=0011 → `10100011`.",
  },
  {
    id: "ordering-demo",
    topic_id: "informatique.algo.big_o",
    type: "ordering",
    difficulty: 2,
    question_md:
      "Ordonne ces complexités **de la plus rapide à la plus lente** (pour $n$ grand).",
    data: {
      items: ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)"],
    },
    explanation_md:
      "Ordre asymptotique : $1 < \\log n < n < n\\log n < n^2$.",
  },
  {
    id: "match-demo",
    topic_id: "informatique.algo.tris",
    type: "match_pairs",
    difficulty: 2,
    question_md: "Associe chaque algorithme à sa complexité de référence.",
    data: {
      pairs: [
        { left: "Recherche dichotomique", right: "O(log n)" },
        { left: "Tri rapide (moyen)", right: "O(n log n)" },
        { left: "Tri à bulles", right: "O(n²)" },
        { left: "Accès à une hashmap", right: "O(1)" },
      ],
    },
    explanation_md:
      "Les tris comparatifs ne peuvent pas descendre sous $O(n \\log n)$ dans le pire cas (théorème de la borne inférieure).",
  },
];
