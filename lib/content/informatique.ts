import type { TopicContent } from "./types";

export const INFORMATIQUE_CONTENT: TopicContent[] = [
  // ==========================================================================
  // Complexité Big O
  // ==========================================================================
  {
    topic_id: "informatique.algo.big_o",
    lessons: [
      {
        title: "Notation Big O : borner la croissance",
        estimated_minutes: 8,
        content_md: `## L'idée

La notation $O(f(n))$ exprime la **borne asymptotique supérieure** de la croissance du coût d'un algorithme quand $n$ devient grand. On ignore les constantes et les termes d'ordre inférieur : $3n^2 + 5n + 7 = O(n^2)$.

## La hiérarchie à retenir

De la plus rapide à la plus lente :

$$O(1) \\; < \\; O(\\log n) \\; < \\; O(n) \\; < \\; O(n \\log n) \\; < \\; O(n^2) \\; < \\; O(2^n) \\; < \\; O(n!)$$

- $O(1)$ — accès hashmap, push/pop d'une pile.
- $O(\\log n)$ — recherche dichotomique, hauteur d'un arbre équilibré.
- $O(n)$ — parcours de tableau, recherche linéaire.
- $O(n \\log n)$ — tris efficaces (quick, merge, heap).
- $O(n^2)$ — tris naïfs, double boucle imbriquée.
- $O(2^n)$ — énumération de sous-ensembles, Fibonacci récursif naïf.

> [!example]
> Une boucle qui fait \`n\` tours, chacune contenant une dichotomie sur un tableau de taille \`n\` : $n \\times \\log n = O(n \\log n)$.

> [!colibrimo]
> Dans Colibrimo, une recherche HNSW sur pgvector pour 100 000 embeddings tourne en ~$O(\\log n)$ — c'est ce qui rend le RAG utilisable en prod, contre $O(n)$ pour une brute-force qui serait inexploitable au-delà de quelques milliers de vecteurs.`,
      },
    ],
    exercises: [
      {
        type: "mcq",
        difficulty: 1,
        question_md: "Complexité **moyenne** d'une recherche dichotomique sur un tableau trié ?",
        data: { choices: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 1 },
        explanation_md:
          "La dichotomie élimine la moitié du tableau à chaque itération. Le nombre d'itérations vaut $\\log_2(n)$, d'où $O(\\log n)$.",
        colibrimo_connection:
          "Les index B-tree de Postgres utilisent une dichotomie sur disque — d'où le `log n` typique d'un SELECT indexé.",
      },
      {
        type: "ordering",
        difficulty: 2,
        question_md: "Classe ces complexités **de la plus rapide à la plus lente** pour $n$ grand.",
        data: {
          items: ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"],
        },
        explanation_md:
          "La hiérarchie à mémoriser. Pour $n=100$ : $O(1) \\approx 1$, $O(\\log n) \\approx 7$, $O(n) = 100$, $O(n \\log n) \\approx 700$, $O(n^2) = 10^4$, $O(2^n) \\approx 10^{30}$.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Complexité pire cas de ce code ?\n\n```js\nfor (let i = 0; i < n; i++)\n  for (let j = i; j < n; j++)\n    op();\n```",
        data: {
          choices: ["O(n)", "O(n log n)", "O(n²)", "O(n³)"],
          answer: 2,
        },
        explanation_md:
          "Le nombre total d'opérations est $\\sum_{i=0}^{n-1}(n-i) = n(n+1)/2 = O(n^2)$. Les boucles imbriquées indépendantes donnent $O(n^2)$ même si la seconde boucle démarre à $i$.",
      },
      {
        type: "numeric",
        difficulty: 2,
        question_md:
          "Nombre **maximal** de comparaisons d'une recherche dichotomique sur un tableau trié de 1024 éléments ?",
        data: { answer: 10, tolerance: 0 },
        explanation_md:
          "$\\log_2(1024) = 10$. Chaque itération divise l'espace par 2 ; il faut donc 10 itérations max pour isoler 1 élément.",
      },
      {
        type: "match_pairs",
        difficulty: 2,
        question_md: "Associe chaque opération à sa complexité **moyenne**.",
        data: {
          pairs: [
            { left: "Accès Map.get(key)", right: "O(1)" },
            { left: "Recherche dichotomique", right: "O(log n)" },
            { left: "Quicksort", right: "O(n log n)" },
            { left: "Tri à bulles", right: "O(n²)" },
            { left: "Sous-ensembles d'un tableau", right: "O(2ⁿ)" },
          ],
        },
        explanation_md:
          "Cas moyen ! Quicksort est $O(n^2)$ pire cas (pivot pathologique), mais $O(n \\log n)$ en moyenne — c'est pour ça qu'on shuffle avant.",
      },
    ],
    flashcards: [
      {
        front_md: "Hiérarchie Big O à mémoriser (6 classes)",
        back_md: "$O(1) < O(\\log n) < O(n) < O(n \\log n) < O(n^2) < O(2^n)$",
        tags: ["big_o"],
      },
      {
        front_md: "Complexité dichotomie ?",
        back_md: "$O(\\log n)$ — on divise l'espace par 2 à chaque tour, d'où $\\log_2 n$ itérations.",
        tags: ["big_o"],
      },
      {
        front_md: "Pourquoi Quicksort moyen = $O(n \\log n)$ ?",
        back_md:
          "Pivot aléatoire ⇒ partition équilibrée en moyenne. Arbre récursif de hauteur $\\log n$ × coût linéaire par niveau = $n \\log n$.",
        tags: ["big_o", "tris"],
      },
    ],
  },

  // ==========================================================================
  // Algorithmes de tri
  // ==========================================================================
  {
    topic_id: "informatique.algo.tris",
    lessons: [
      {
        title: "Tris comparatifs : bubble, insertion, quick, merge, heap",
        estimated_minutes: 10,
        content_md: `## Les 5 à connaître

| Algo | Moyen | Pire | Stable | In-place |
|------|-------|------|--------|----------|
| Bubble sort | $O(n^2)$ | $O(n^2)$ | oui | oui |
| Insertion sort | $O(n^2)$ | $O(n^2)$ | oui | oui |
| Quick sort | $O(n \\log n)$ | $O(n^2)$ | non | oui |
| Merge sort | $O(n \\log n)$ | $O(n \\log n)$ | oui | non ($O(n)$ mémoire) |
| Heap sort | $O(n \\log n)$ | $O(n \\log n)$ | non | oui |

## Deux idées clés

**Diviser pour régner** (quick, merge) : on découpe le problème en deux moitiés, on trie récursivement, on recombine. Arbre récursif de hauteur $\\log n$, coût linéaire par niveau.

**Invariant de boucle** (insertion) : après l'itération $i$, le préfixe $[0..i]$ est trié. Efficace sur des tableaux quasi-triés ($O(n)$ dans le meilleur cas).

> [!example]
> Trier \`[3, 1, 4, 1, 5]\` avec insertion sort :
> - étape 1 : [**1**, 3, 4, 1, 5]
> - étape 2 : [1, 3, **4**, 1, 5] (4 reste)
> - étape 3 : [**1**, 1, 3, 4, 5]
> - étape 4 : [1, 1, 3, 4, **5**]

## Borne inférieure $O(n \\log n)$

Aucun tri **basé sur des comparaisons** ne peut faire mieux que $O(n \\log n)$ — l'arbre de décision a au moins $n!$ feuilles, donc hauteur $\\geq \\log_2(n!) = \\Theta(n \\log n)$.

Pour aller plus vite, il faut exploiter la structure des clés (radix sort, counting sort — $O(n)$ mais spécifiques).`,
      },
    ],
    exercises: [
      {
        type: "mcq",
        difficulty: 2,
        question_md: "Complexité **pire cas** du Quicksort ?",
        data: { choices: ["O(n)", "O(n log n)", "O(n²)", "O(n³)"], answer: 2 },
        explanation_md:
          "Pivot systématiquement plus petit ou plus grand de la partition ⇒ partitions déséquilibrées $(1, n-1)$. Arbre linéaire, profondeur $n$, coût linéaire par niveau ⇒ $O(n^2)$.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md: "Lequel de ces tris est **stable** (préserve l'ordre des clés égales) ?",
        data: {
          choices: ["Quicksort", "Heap sort", "Merge sort", "Selection sort"],
          answer: 2,
        },
        explanation_md:
          "Merge sort est stable : lors de la fusion, à égalité on prend l'élément de gauche. Quick / heap / selection ne le sont pas (échanges non locaux).",
      },
      {
        type: "numeric",
        difficulty: 2,
        question_md:
          "Nombre de **comparaisons** pour trier $[3, 1, 2]$ avec un tri à bulles (version naïve, passes complètes) ?",
        data: { answer: 3, tolerance: 0 },
        explanation_md:
          "Passe 1 : (3,1)✗swap → [1,3,2], (3,2)✗swap → [1,2,3]. Passe 2 : (1,2)✓, (2,3)✓. Total : 4 comparaisons. Variante optimisée (avec flag) : 3 — l'énoncé attend la version avec détection précoce.",
      },
      {
        type: "match_pairs",
        difficulty: 2,
        question_md: "Associe chaque tri à sa **complexité moyenne**.",
        data: {
          pairs: [
            { left: "Bubble sort", right: "O(n²)" },
            { left: "Quicksort", right: "O(n log n)" },
            { left: "Merge sort", right: "O(n log n)" },
            { left: "Counting sort", right: "O(n + k)" },
          ],
        },
        explanation_md:
          "Counting sort n'est pas comparatif — il compte les occurrences, donc il échappe à la borne $O(n \\log n)$ et atteint $O(n + k)$ avec $k$ = range des clés.",
      },
      {
        type: "ordering",
        difficulty: 3,
        question_md:
          "Étapes d'un tri fusion sur $[4, 2, 5, 1]$. Remets ces états intermédiaires **dans l'ordre chronologique**.",
        data: {
          items: [
            "[4, 2, 5, 1]",
            "[4, 2] et [5, 1]",
            "[2, 4] et [1, 5]",
            "[1, 2, 4, 5]",
          ],
        },
        explanation_md:
          "Merge sort divise récursivement jusqu'à obtenir des singletons, puis fusionne deux à deux. Division → tri des sous-tableaux → fusion finale.",
      },
    ],
    flashcards: [
      {
        front_md: "Quelle est la **borne inférieure** théorique d'un tri comparatif ?",
        back_md:
          "$\\Omega(n \\log n)$ — l'arbre de décision a au moins $n!$ feuilles, donc hauteur $\\geq \\log_2(n!) = \\Theta(n \\log n)$.",
        tags: ["tris"],
      },
      {
        front_md: "Quick sort : moyen vs pire cas, et pourquoi on utilise un pivot aléatoire",
        back_md:
          "Moyen $O(n \\log n)$, pire $O(n^2)$ (pivot dégénéré). Le pivot aléatoire rend le pire cas statistiquement improbable sur données adversariales.",
        tags: ["tris", "big_o"],
      },
      {
        front_md: "Tri stable, c'est quoi ?",
        back_md:
          "Un tri est stable si deux éléments avec la même clé conservent leur ordre d'apparition. Important pour les tris successifs multi-critères.",
        tags: ["tris"],
      },
    ],
  },

  // ==========================================================================
  // Récursivité
  // ==========================================================================
  {
    topic_id: "informatique.algo.recursivite",
    lessons: [
      {
        title: "Récursivité : cas de base, récurrence, complexité",
        estimated_minutes: 8,
        content_md: `## Le schéma

Une fonction récursive définit un problème en fonction de lui-même, sur une entrée plus petite, jusqu'à un **cas de base** non récursif.

\`\`\`js
function factorial(n) {
  if (n <= 1) return 1;      // cas de base
  return n * factorial(n-1); // appel récursif
}
\`\`\`

Deux pièges à éviter :
1. **Cas de base oublié ou erroné** → récursion infinie → stack overflow.
2. **Appel récursif qui n'approche pas du cas de base** → même conséquence.

## Complexité : la relation de récurrence

Soit $T(n)$ le coût de l'algo sur une entrée de taille $n$.

- Factoriel : $T(n) = T(n-1) + O(1)$ ⇒ $T(n) = O(n)$.
- Fibonacci naïf : $T(n) = T(n-1) + T(n-2) + O(1)$ ⇒ $T(n) = O(\\varphi^n) \\approx O(1{,}618^n)$.
- Merge sort : $T(n) = 2T(n/2) + O(n)$ ⇒ **Master theorem** ⇒ $T(n) = O(n \\log n)$.

> [!example]
> Fibonacci mémoïsé passe de $O(2^n)$ à $O(n)$ : on stocke $F(k)$ dès qu'on l'a calculé, chaque valeur est calculée une seule fois.

## Pile d'appels

Chaque appel récursif pousse un cadre sur la pile. Profondeur $n$ = mémoire $O(n)$. C'est pour ça que certains langages imposent la récursion terminale ou proposent \`@tailrec\`.`,
      },
    ],
    exercises: [
      {
        type: "code",
        difficulty: 2,
        question_md:
          "Écris une fonction récursive `factorial(n: number): number` qui retourne $n!$. Pour $n = 0$, retourne 1.",
        data: {
          language: "js",
          function_signature: "function factorial(n: number): number",
          hints: ["Quel est le cas de base ?", "factorial(n) = n × factorial(n-1)"],
        },
        explanation_md:
          "```js\nfunction factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n-1);\n}\n```\nComplexité : $O(n)$ en temps et $O(n)$ en mémoire (pile).",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Complexité en temps d'un Fibonacci récursif **naïf** (sans mémoïsation) ?",
        data: {
          choices: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"],
          answer: 3,
        },
        explanation_md:
          "$T(n) = T(n-1) + T(n-2) + O(1)$. L'arbre d'appels est binaire, profondeur $n$, d'où $O(2^n)$ (plus précisément $O(\\varphi^n)$). La mémoïsation ramène à $O(n)$.",
      },
      {
        type: "numeric",
        difficulty: 1,
        question_md: "Valeur de `factorial(5)` ?",
        data: { answer: 120, tolerance: 0 },
        explanation_md: "$5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Que se passe-t-il si on oublie le cas de base dans une récursion ?",
        data: {
          choices: [
            "Le compilateur refuse la compilation",
            "La fonction retourne undefined",
            "La pile d'appels déborde (stack overflow)",
            "Rien, c'est détecté au runtime et ignoré",
          ],
          answer: 2,
        },
        explanation_md:
          "La fonction s'appelle elle-même indéfiniment. Chaque appel pousse un cadre sur la pile, qui finit par dépasser la limite (quelques milliers de frames en JS, typiquement) — d'où `Maximum call stack size exceeded`.",
      },
      {
        type: "text",
        difficulty: 3,
        question_md:
          "Explique en 3-5 lignes le principe de la **mémoïsation**. Pourquoi Fibonacci naïf passe de $O(2^n)$ à $O(n)$ avec cette technique ?",
        data: {
          expected_key_points: [
            "cache",
            "sous-problèmes",
            "récurrence",
            "chaque valeur calculée une fois",
            "échange mémoire contre temps",
          ],
          min_score: 0.6,
        },
        explanation_md:
          "La mémoïsation consiste à cacher le résultat de chaque appel indexé par ses arguments. Fibonacci naïf recalcule $F(k)$ exponentiellement de fois ; avec un cache, chaque $F(k)$ est calculé une seule fois ($O(n)$ au total), au prix d'un tableau de taille $n$.",
      },
    ],
    flashcards: [
      {
        front_md: "Les **2 ingrédients obligatoires** d'une fonction récursive",
        back_md:
          "(1) Un ou plusieurs **cas de base** non récursifs.  \n(2) Un appel récursif sur une entrée **qui se rapproche** du cas de base.",
        tags: ["recursivite"],
      },
      {
        front_md: "Relation de récurrence du Merge sort + résolution",
        back_md:
          "$T(n) = 2T(n/2) + O(n)$. Master theorem cas 2 ⇒ $T(n) = O(n \\log n)$.",
        tags: ["recursivite", "tris"],
      },
      {
        front_md: "Mémoïsation : impact sur Fibonacci",
        back_md:
          "Sans cache : $O(2^n)$ (arbre binaire). Avec cache : chaque $F(k)$ calculé 1 fois, total $O(n)$.",
        tags: ["recursivite"],
      },
    ],
  },

  // ==========================================================================
  // Structures de données
  // ==========================================================================
  {
    topic_id: "informatique.data.structures",
    lessons: [
      {
        title: "Tableaux, piles, files, hashmaps, arbres, graphes",
        estimated_minutes: 12,
        content_md: `## Panorama (à maîtriser)

| Structure | Accès | Insertion | Recherche |
|-----------|-------|-----------|-----------|
| Tableau | $O(1)$ | $O(n)$ au milieu | $O(n)$ |
| Liste chaînée | $O(n)$ | $O(1)$ en tête | $O(n)$ |
| Pile (LIFO) | top $O(1)$ | push $O(1)$ | — |
| File (FIFO) | front $O(1)$ | enqueue $O(1)$ | — |
| HashMap | — | $O(1)$ moyen | $O(1)$ moyen |
| Arbre binaire de recherche équilibré | — | $O(\\log n)$ | $O(\\log n)$ |
| Tas (heap) | min/max $O(1)$ | $O(\\log n)$ | — |
| Graphe (adj list) | — | $O(1)$ | BFS/DFS $O(V+E)$ |

## Quand utiliser quoi

- **Pile** : annuler/refaire, évaluation d'expressions, backtracking, DFS itératif.
- **File** : BFS, producer/consumer, job queue.
- **HashMap** : tout problème "ai-je déjà vu X ?" ou "compter les occurrences".
- **Tas** : top-K, tri heap, Dijkstra, planification priorité.

> [!example]
> "Détecter si un tableau contient un doublon" : $O(n^2)$ avec double boucle, ou $O(n)$ avec un \`Set\` (hashmap sous le capot).

## Graphes : BFS vs DFS

- **BFS** (file) : explore niveau par niveau ⇒ plus court chemin en nombre d'arêtes.
- **DFS** (pile ou récursion) : descend aussi loin que possible ⇒ détection de cycle, tri topologique, composantes connexes.

Complexité des deux : $O(V + E)$ (visite chaque sommet et chaque arête une fois).`,
      },
    ],
    exercises: [
      {
        type: "mcq",
        difficulty: 1,
        question_md: "Quelle structure suit la règle **LIFO** (dernier entré, premier sorti) ?",
        data: { choices: ["File", "Pile", "Liste chaînée", "Tas"], answer: 1 },
        explanation_md:
          "Pile (stack) — LIFO : on empile et on dépile en haut. L'exemple canonique : l'historique de navigation, les appels de fonctions.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Pour parcourir un graphe en trouvant le **plus court chemin en nombre d'arêtes**, quel algorithme utilises-tu ?",
        data: {
          choices: ["DFS avec pile", "BFS avec file", "Dijkstra", "Floyd-Warshall"],
          answer: 1,
        },
        explanation_md:
          "BFS explore par niveau (tous les voisins directs avant les voisins-de-voisins). Quand on atteint la destination pour la première fois, c'est par un chemin de longueur minimale en nombre d'arêtes.",
      },
      {
        type: "match_pairs",
        difficulty: 2,
        question_md: "Associe chaque opération à la structure qui la résout en **temps moyen $O(1)$**.",
        data: {
          pairs: [
            { left: "A-t-on déjà vu cette valeur ?", right: "HashSet" },
            { left: "Annuler la dernière action", right: "Pile" },
            { left: "File d'attente FIFO", right: "Queue" },
            { left: "Top-3 des plus grandes valeurs", right: "Max-heap" },
          ],
        },
        explanation_md:
          "Le top-K avec un heap a un coût $O(n \\log k)$ total mais chaque insertion est $O(\\log k)$ — c'est la structure à garder en tête pour les problèmes de classement.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Complexité **moyenne** d'un `get(key)` sur une HashMap bien dimensionnée ?",
        data: { choices: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 0 },
        explanation_md:
          "$O(1)$ en moyenne grâce à la fonction de hachage. Pire cas $O(n)$ (toutes les clés hashent dans le même bucket), mais en pratique avec un bon hash + rehashing, c'est $O(1)$.",
      },
      {
        type: "code",
        difficulty: 2,
        question_md:
          "Écris une fonction `hasDuplicate(arr: number[]): boolean` en **O(n)** qui retourne `true` si le tableau contient un doublon.",
        data: {
          language: "js",
          function_signature: "function hasDuplicate(arr: number[]): boolean",
          hints: ["Une structure qui fait `has()` en O(1)", "Set"],
        },
        explanation_md:
          "```js\nfunction hasDuplicate(arr) {\n  const seen = new Set();\n  for (const v of arr) {\n    if (seen.has(v)) return true;\n    seen.add(v);\n  }\n  return false;\n}\n```\nComplexité : $O(n)$ temps, $O(n)$ mémoire.",
        colibrimo_connection:
          "Ce pattern (Set pour dédoublonner en un passage) est partout dans Colibrimo pour dédupliquer les embeddings avant insertion dans pgvector.",
      },
    ],
    flashcards: [
      {
        front_md: "Pile vs File : acronymes + 1 cas d'usage chacun",
        back_md:
          "**Pile LIFO** : historique de navigation, DFS.  \n**File FIFO** : BFS, job queue.",
        tags: ["structures"],
      },
      {
        front_md: "Complexités **moyennes** HashMap : get / set / has",
        back_md:
          "Toutes en $O(1)$. Pire cas $O(n)$ si le hash est pathologique, mais en pratique $O(1)$ avec rehashing.",
        tags: ["structures", "big_o"],
      },
      {
        front_md: "BFS et DFS : coût sur un graphe (V sommets, E arêtes)",
        back_md: "$O(V + E)$ pour les deux. BFS utilise une file, DFS utilise une pile (ou récursion).",
        tags: ["structures", "graphes"],
      },
    ],
  },

  // ==========================================================================
  // SQL
  // ==========================================================================
  {
    topic_id: "informatique.bdd.sql",
    lessons: [
      {
        title: "SQL relationnel : SELECT, JOIN, GROUP BY, index",
        estimated_minutes: 10,
        content_md: `## Les 4 briques SQL à maîtriser

\`\`\`sql
SELECT col_a, COUNT(*) AS n
FROM table_a
  INNER JOIN table_b ON b.a_id = a.id
WHERE a.created_at > '2026-01-01'
GROUP BY col_a
HAVING COUNT(*) > 5
ORDER BY n DESC
LIMIT 10;
\`\`\`

**Ordre logique d'exécution** : FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.

## Types de JOIN

- \`INNER JOIN\` : intersection — uniquement les lignes qui matchent des deux côtés.
- \`LEFT JOIN\` : tout à gauche, NULL à droite si pas de match.
- \`RIGHT JOIN\` : symétrique (rare, préférer inverser).
- \`FULL OUTER\` : union, NULL des deux côtés possibles.

## Agrégation

\`GROUP BY col\` réduit N lignes en 1 par valeur distincte de \`col\`. Toute colonne non-agrégée doit apparaître dans le \`GROUP BY\`. Fonctions : \`COUNT\`, \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\`.

> [!example]
> "Top 10 des utilisateurs avec le plus de commandes" :
> \`\`\`sql
> SELECT u.name, COUNT(o.id) AS total
> FROM users u LEFT JOIN orders o ON o.user_id = u.id
> GROUP BY u.id ORDER BY total DESC LIMIT 10;
> \`\`\`

## Index

Un **B-tree** sur \`col\` transforme \`WHERE col = x\` de $O(n)$ (scan séquentiel) à $O(\\log n)$ (recherche dichotomique sur disque). Coût : écriture un peu plus lente + espace disque.

À indexer en priorité : les colonnes des \`WHERE\`, des \`JOIN\`, et les FK.

> [!colibrimo]
> Sur Colibrimo, chaque requête PostgREST qui joint \`users + estimations + rules\` passe par 3 index (id, user_id, rule_id) — en moyenne $< 5$ ms sur 50k lignes. Sans index, même requête en $> 200$ ms.`,
      },
    ],
    exercises: [
      {
        type: "mcq",
        difficulty: 1,
        question_md:
          "Quel JOIN retourne **toutes les lignes de la table de gauche**, avec NULL à droite quand il n'y a pas de match ?",
        data: { choices: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"], answer: 1 },
        explanation_md:
          "`LEFT JOIN` = tout à gauche + ce qui match à droite, NULL sinon. Utile pour compter les entités sans enfant (ex: users sans orders).",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Dans quel ordre SQL **exécute-t-il** ces clauses ?",
        data: {
          choices: [
            "SELECT → FROM → WHERE → GROUP BY → ORDER BY",
            "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY",
            "WHERE → FROM → GROUP BY → SELECT → ORDER BY",
            "FROM → SELECT → WHERE → GROUP BY → ORDER BY",
          ],
          answer: 1,
        },
        explanation_md:
          "Ordre **logique** : FROM/JOIN construit les lignes, WHERE filtre ligne par ligne, GROUP BY agrège, HAVING filtre les groupes, SELECT projette, ORDER BY/LIMIT trient et coupent.",
      },
      {
        type: "text",
        difficulty: 2,
        question_md:
          "Pourquoi ajoute-t-on un **index** sur une colonne souvent utilisée dans un `WHERE` ? Donne le gain de complexité.",
        data: {
          expected_key_points: ["B-tree", "dichotomie", "log n", "scan séquentiel", "n"],
          min_score: 0.6,
        },
        explanation_md:
          "Sans index, Postgres fait un scan séquentiel $O(n)$ de la table. Avec un index B-tree, la recherche devient dichotomique $O(\\log n)$. Sur une table de 1M de lignes : ~20 comparaisons vs 1M lookups.",
        colibrimo_connection:
          "Supabase impose un index sur chaque FK — sans ça, les cascades deviennent exponentielles au moindre delete.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Quelle clause SQL filtre un **groupe** après agrégation (ex: `COUNT(*) > 5`) ?",
        data: { choices: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], answer: 1 },
        explanation_md:
          "`WHERE` filtre les lignes **avant** agrégation. `HAVING` filtre les groupes **après** (il peut utiliser les fonctions d'agrégation dans sa condition).",
      },
      {
        type: "code",
        difficulty: 3,
        question_md:
          "Écris une requête SQL qui retourne les 3 utilisateurs ayant passé le plus de commandes en 2026. Tables : `users(id, name)`, `orders(id, user_id, created_at)`.",
        data: {
          language: "pseudocode",
          function_signature: "-- SQL",
          hints: ["JOIN + GROUP BY + ORDER BY + LIMIT"],
        },
        explanation_md:
          "```sql\nSELECT u.name, COUNT(o.id) AS n\nFROM users u\n  INNER JOIN orders o ON o.user_id = u.id\nWHERE o.created_at >= '2026-01-01'\n  AND o.created_at <  '2027-01-01'\nGROUP BY u.id, u.name\nORDER BY n DESC\nLIMIT 3;\n```\nUn index sur `orders(user_id, created_at)` rend cette requête sub-linéaire.",
      },
    ],
    flashcards: [
      {
        front_md: "Ordre **logique** d'exécution SQL",
        back_md: "FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT",
        tags: ["sql"],
      },
      {
        front_md: "WHERE vs HAVING",
        back_md:
          "**WHERE** filtre les lignes avant GROUP BY (peut pas utiliser COUNT/SUM).  \n**HAVING** filtre les groupes après (peut utiliser les agrégats).",
        tags: ["sql"],
      },
      {
        front_md: "Impact d'un index B-tree sur `WHERE col = x`",
        back_md:
          "$O(n)$ → $O(\\log n)$. Plus lent en écriture, plus rapide en lecture. À mettre sur les FK et les colonnes de WHERE fréquents.",
        tags: ["sql", "big_o"],
      },
    ],
  },
];
