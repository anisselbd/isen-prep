import type { TopicContent } from "./types";

export const INFORMATIQUE_CONTENT: TopicContent[] = [
  // ==========================================================================
  // Complexité Big O
  // ==========================================================================
  {
    topic_id: "informatique.algo.big_o",
    lessons: [
      {
        title: "Complexité Big O : mesurer la rapidité d'un algo",
        estimated_minutes: 15,
        content_md: `## Pourquoi tu dois maîtriser ça

Deux algos qui font la même chose peuvent avoir des performances **radicalement** différentes — de quelques millisecondes à plusieurs heures pour les mêmes données. La **notation Big O** est le vocabulaire commun utilisé par tous les ingés pour dire : "cet algo met $X$ fois plus de temps quand on lui donne $n$ fois plus de données". C'est **la question numéro 1** en entretien technique (dev, DS, ingé) : "quelle est la complexité ?". Tu dois savoir (1) **reconnaître** la complexité d'un code que tu lis, (2) **choisir** le bon algo selon la taille des données, et (3) **expliquer** pourquoi tel choix (hashmap vs tableau trié, récursif vs itératif). Le jury ISEN te demandera au moins une fois de classer des complexités par rapidité.

> [!note]
> **Ce qu'il faut savoir avant** : la notion d'**algorithme** (une suite d'étapes pour résoudre un problème) et de **boucle** / **itération**. Tu dois aussi avoir une intuition de ce qu'est un **tableau** et le coût d'y accéder (par indice = immédiat, par recherche = coûteux). La **fonction logarithme** $\\log n$ : c'est l'**inverse de l'exponentielle**, ça croît très lentement ($\\log_2 1000 \\approx 10$, $\\log_2 10^6 \\approx 20$).

## L'idée intuitive

Tu lances un algorithme sur un tableau de 10 éléments : ça prend 1 ms. Tu le relances sur 100 éléments : ça prend 100 ms ? 10 ms ? 10 secondes ? La **Big O** répond à cette question.

Pour un algo en $O(n)$ (linéaire) : doubler les données = doubler le temps. 10× plus de données = 10× plus de temps.

Pour un algo en $O(n^2)$ (quadratique) : doubler les données = **quadrupler** le temps. 10× plus de données = **100×** plus de temps. Explose rapidement.

Pour un algo en $O(\\log n)$ (logarithmique) : doubler les données = **quelques étapes de plus** seulement. Passer de 1 000 à 1 000 000 = +10 étapes. Hyper rapide.

Pour $O(2^n)$ (exponentiel) : **chaque unité** ajoutée **double** le temps. Ingérable au-delà de $n = 40$-50.

La Big O te dit **en quel régime tu te trouves**. Passer d'un algo en $O(n^2)$ à un algo en $O(n \\log n)$ sur 1 million d'éléments, c'est passer de **plusieurs heures** à **moins d'une seconde**. C'est critique.

## La définition formelle (version pragmatique)

On écrit $f(n) = O(g(n))$ si, **quand $n$ devient grand**, le coût $f$ grossit au plus comme $g$, **à une constante près**. On **ignore** :
- Les **constantes multiplicatives** ($3n = O(n)$, pas $O(3n)$).
- Les **termes d'ordre inférieur** ($5n^2 + 100n + 42 = O(n^2)$).

**Intuition** : on ne s'intéresse qu'au **terme dominant** (celui qui finit par écraser tous les autres quand $n$ est très grand). Un $100 \\cdot n^2$ finit toujours par être plus grand qu'un $n^3 / 1000$ pour des $n$ assez grands, donc on garde $n^3$ seul.

**Attention** : Big O est une **borne supérieure asymptotique**. Ça ne dit pas "l'algo prend exactement ce temps", juste "il ne dépassera pas en ordre de grandeur, quand $n$ est grand".

## La hiérarchie à retenir par cœur

De la **plus rapide** à la **plus lente** :

$$O(1) \\;<\\; O(\\log n) \\;<\\; O(n) \\;<\\; O(n \\log n) \\;<\\; O(n^2) \\;<\\; O(n^3) \\;<\\; O(2^n) \\;<\\; O(n!)$$

**Visualisation pour $n = 100$** (ordre de grandeur en "unités de temps") :

| Complexité | Nom courant | $n = 100$ | Algo typique |
|------------|--------------|-----------|---------------|
| $O(1)$ | Constant | 1 | Accès à une hashmap, push/pop pile |
| $O(\\log n)$ | Logarithmique | ~7 | Recherche dichotomique |
| $O(n)$ | Linéaire | 100 | Parcours de tableau, recherche linéaire |
| $O(n \\log n)$ | Quasi-linéaire | ~700 | Tris rapides (merge, quick, heap) |
| $O(n^2)$ | Quadratique | 10 000 | Tris naïfs (bulle, insertion), boucles imbriquées |
| $O(n^3)$ | Cubique | 10⁶ | Produit de matrices naïf |
| $O(2^n)$ | Exponentiel | ~10³⁰ | Sous-ensembles, Fibonacci récursif naïf |
| $O(n!)$ | Factoriel | ~10¹⁵⁷ | Voyageur de commerce brute-force |

**Règle pratique** : jusqu'à $n \\approx 10^6$, $O(n \\log n)$ tourne en secondes. $O(n^2)$ devient lent au-delà de $n \\approx 10^4$. $O(2^n)$ devient impossible au-delà de $n \\approx 30$.

## Comment analyser un code

### Cas simple : boucle unique

\`\`\`js
for (let i = 0; i < n; i++) { doSomething(); }
\`\`\`

$n$ itérations × coût constant par itération → $O(n)$.

### Boucle imbriquée (double)

\`\`\`js
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) { doSomething(); }
}
\`\`\`

$n \\times n = n^2$ itérations → $O(n^2)$.

### Dichotomie (division par 2)

\`\`\`js
while (low <= high) {
  const mid = (low + high) / 2;
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) low = mid + 1; else high = mid - 1;
}
\`\`\`

Chaque tour divise l'espace de recherche par 2. Nombre de tours = $\\log_2 n$ → $O(\\log n)$.

### Produit de complexités

Une boucle qui contient une dichotomie : $n$ × $\\log n$ → $O(n \\log n)$.

## Règles de combinaison

- **Séquence** : deux blocs $O(f) + O(g) = O(\\max(f, g))$. On garde le dominant.
- **Imbrication** : une boucle en $O(f)$ contenant une boucle en $O(g)$ = $O(f \\cdot g)$.
- **Appels récursifs** : cas spécial traité au chapitre récursivité (Master theorem).

> [!example]
> **Quatre analyses.**
>
> **(a) Recherche dans un tableau trié.** Dichotomie. On divise par 2 à chaque tour → $O(\\log n)$.
>
> **(b) Parcours d'une matrice $n \\times n$.** Deux boucles imbriquées → $O(n^2)$.
>
> **(c) Algo qui trie puis cherche.** Tri en $O(n \\log n)$, puis dichotomie en $O(\\log n)$. Total : $O(n \\log n) + O(\\log n) = O(n \\log n)$ (on garde le dominant).
>
> **(d) Fibonacci récursif naïf.**
> \`\`\`js
> function fib(n) {
>   if (n <= 1) return n;
>   return fib(n-1) + fib(n-2);
> }
> \`\`\`
> Chaque appel en fait 2, sur $n - 1$ et $n - 2$. L'arbre d'appels a environ $2^n$ nœuds → $O(2^n)$. Pour $n = 40$ déjà très lent (~10⁹ opérations).

> [!warning]
> **Pièges classiques.**
>
> - **Ignorer que $\\log$ sans base est par défaut en base 2 en info** (et en $e$ en maths pures). En Big O, la base ne change rien (différence constante), on écrit $O(\\log n)$ sans préciser.
> - **Confondre $O(\\log n)$ et $O(n \\log n)$.** Dichotomie simple = $\\log n$. Tri merge = $n \\log n$ (on fait $n$ choses, chacune impliquant du $\\log n$). Différent.
> - **Oublier le cas pire vs moyen.** Quicksort en **moyenne** $O(n \\log n)$ mais **pire cas** $O(n^2)$ (tableau déjà trié avec pivot naïf). Big O seul souvent sous-entend pire cas, mais précise si on te demande.
> - **Compter les constantes.** $3n = O(n)$, pas $O(3n)$. La constante est absorbée.
> - **Additionner les complexités dans une séquence.** $O(n) + O(n^2) \\ne O(n + n^2)$ comme écriture finale — simplifie en $O(n^2)$, le terme dominant mange tout.
> - **Oublier la complexité mémoire.** Big O parle **aussi** de RAM, pas que de temps. Un algo récursif peut être $O(n)$ en temps mais $O(n)$ en mémoire (pile d'appels). Précise les deux en entretien.

## À quoi ça sert en pratique

- **Dimensionner** : choisir un algo selon la taille attendue des données. Pour 100 éléments, $O(n^2)$ passe ; pour 100 millions, non.
- **Choisir une structure de données** : hashmap ($O(1)$ accès) vs liste ($O(n)$ recherche) vs arbre équilibré ($O(\\log n)$).
- **Évaluer les API tierces** : une API paginée en $O(n)$ par page peut devenir $O(n^2)$ si tu la boucles naïvement.
- **Optimiser** : remplacer un double-for par une hashmap lookup fait passer de $O(n^2)$ à $O(n)$ — gain énorme sur des gros datasets.
- **Estimer un coût cloud** : une query SQL sans index = $O(n)$ sur chaque ligne = facture AWS multipliée par 100.

> [!tip]
> **Réflexe "dimensions de données"** : avant d'écrire un algo, demande-toi combien de données tu vas traiter. < 1000 éléments : peu importe, $O(n^2)$ passe. 10k-100k : vise $O(n \\log n)$. Millions : il te faut $O(n)$ ou $O(n \\log n)$. Milliards : $O(\\log n)$ obligatoire, ou tu payes un GPU. Le Big O te dit **dès le début** si ton algo va scaler ou mourir.

> [!colibrimo]
> Sur Colibrimo, une recherche HNSW sur pgvector pour 100 000 embeddings tourne en ~$O(\\log n)$ (structure d'index sophistiquée). C'est ce qui rend le RAG utilisable en prod. Une brute-force ($O(n)$ avec comparaison à chaque vecteur) serait inexploitable au-delà de quelques milliers. Comprendre Big O ici = savoir choisir **l'index qui rend ton API utilisable à l'échelle**.`,
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
        title: "Algorithmes de tri : les 5 à connaître et pourquoi",
        estimated_minutes: 15,
        content_md: `## Pourquoi tu dois maîtriser ça

Le tri, c'est **l'opération la plus commune** en algo, et en même temps **le terrain d'illustration** parfait pour comparer des stratégies algorithmiques. Le jury ISEN va te demander soit (1) d'expliquer comment fonctionne tel ou tel tri (bubble, insertion, quicksort, merge), soit (2) de donner leur complexité et de dire **quand** on utilise lequel. Savoir que "trier 1 million d'entiers en 3 minutes ou en 1 seconde dépend uniquement de l'algo choisi" est un argument frappant. En plus, comprendre les tris te donne deux concepts **transférables** à tout le reste : **diviser pour régner** (découper, résoudre, recombiner) et **invariant de boucle** (ce qui est vrai à chaque itération).

> [!note]
> **Ce qu'il faut savoir avant** : la **complexité Big O** (chapitre précédent) — tu dois être à l'aise avec $O(n^2)$, $O(n \\log n)$, et savoir que la deuxième est **beaucoup** plus rapide pour des gros $n$. Tu dois aussi savoir ce qu'est un **tableau**, un **indice**, et une **comparaison** ("est-ce que $a < b$ ?").

## L'idée intuitive

Tu as un tableau désordonné de nombres, tu veux le ranger du plus petit au plus grand. Il existe plein de façons de faire — certaines **intuitives mais lentes**, d'autres **clever mais rapides**. Les cinq tris à connaître se classent en deux familles :

**Famille "intuitive mais $O(n^2)$"** : bubble sort, insertion sort, selection sort. On procède "case par case", en comparant deux voisins à la fois. Simple à coder, simple à comprendre, mais **trop lent** au-delà de quelques milliers d'éléments.

**Famille "diviser pour régner, $O(n \\log n)$"** : quicksort, merge sort, heap sort. On **découpe** le problème en deux moitiés, on trie chacune **récursivement**, on **recombine**. Moins intuitif mais **beaucoup plus rapide**.

**Règle pratique** : en prod, on utilise **toujours** un algo $O(n \\log n)$. Les tris $O(n^2)$ sont vus en cours comme **briques pédagogiques** et pour comprendre le gap de performance. \`Array.sort\` en JS, \`sorted()\` en Python, etc. sont tous des variantes de Timsort ou introsort ($O(n \\log n)$).

## Tableau récapitulatif à connaître

| Algo | Moyen | Pire | Stable | In-place | Stratégie |
|------|-------|------|--------|----------|-----------|
| Bubble sort | $O(n^2)$ | $O(n^2)$ | ✓ | ✓ | Échanges voisins |
| Insertion sort | $O(n^2)$ | $O(n^2)$ | ✓ | ✓ | Insérer un à un |
| Selection sort | $O(n^2)$ | $O(n^2)$ | ✗ | ✓ | Chercher le min, placer |
| Quicksort | $O(n \\log n)$ | $O(n^2)$ | ✗ | ✓ | Diviser / pivot |
| Merge sort | $O(n \\log n)$ | $O(n \\log n)$ | ✓ | ✗ ($O(n)$ mém) | Diviser / fusionner |
| Heap sort | $O(n \\log n)$ | $O(n \\log n)$ | ✗ | ✓ | Tas binaire |

**Vocabulaire :**
- **Stable** : préserve l'ordre relatif des éléments **égaux**. Important quand on trie sur plusieurs clés successives (trier par date **puis** par nom — un tri instable peut casser l'ordre de date).
- **In-place** : modifie le tableau sur place, mémoire $O(1)$ supplémentaire. Merge sort a besoin d'$O(n)$ de RAM en plus.

## Les 5 algos, un par un

### Bubble sort (à bulles)

On parcourt le tableau et on **compare chaque paire de voisins** : si $a[i] > a[i+1]$, on les échange. On recommence tant qu'il y a eu des échanges.

**Idée visuelle** : les gros éléments "remontent" comme des bulles vers la fin du tableau. À chaque passe, le plus grand trouve sa place à droite.

**Complexité** : $O(n^2)$ dans tous les cas (bien que des variantes avec flag le font en $O(n)$ sur un tableau déjà trié).

### Insertion sort

On maintient un **préfixe trié** du tableau. À chaque itération, on prend l'élément suivant et on l'**insère à sa place** dans le préfixe en le faisant "remonter" jusqu'à sa position correcte.

**Exemple** : trier $[3, 1, 4, 1, 5]$.
- Début : $[3 \\mid 1, 4, 1, 5]$ (préfixe trié = $[3]$).
- Insérer 1 dans $[3]$ → $[1, 3 \\mid 4, 1, 5]$.
- Insérer 4 dans $[1, 3]$ → $[1, 3, 4 \\mid 1, 5]$ (déjà en place).
- Insérer 1 dans $[1, 3, 4]$ → $[1, 1, 3, 4 \\mid 5]$.
- Insérer 5 dans $[1, 1, 3, 4]$ → $[1, 1, 3, 4, 5]$. Trié.

**Intérêt** : très **rapide sur des tableaux déjà quasi triés** ($O(n)$ dans le meilleur cas). C'est pour ça que Timsort (tri hybride de Python / Java / JS) l'utilise sur les petits blocs.

### Selection sort

On cherche le **minimum** du tableau, on l'**échange** avec l'élément en position 0. On recommence sur le sous-tableau $[1..n-1]$, et ainsi de suite.

**Simple à comprendre, peu efficace en pratique.** Rarement utilisé — mais pédagogiquement clair pour expliquer "chercher le min".

### Quicksort

**Diviser pour régner.** On choisit un **pivot** (élément au hasard ou médian). On partitionne le tableau : tout ce qui est **inférieur au pivot** va à gauche, tout ce qui est **supérieur** va à droite. On recommence récursivement sur les deux sous-tableaux.

**Exemple.** Tableau $[3, 7, 1, 8, 4]$, pivot = 3.
- Partition : $[1 \\mid 3 \\mid 7, 8, 4]$.
- Récursion gauche sur $[1]$ (déjà trié).
- Récursion droite sur $[7, 8, 4]$, pivot = 7 → $[4 \\mid 7 \\mid 8]$ → tri de $[4]$ et $[8]$ triviaux.
- Résultat : $[1, 3, 4, 7, 8]$.

**Complexité** : $O(n \\log n)$ en moyenne (arbre équilibré). $O(n^2)$ en **pire cas** si le pivot est systématiquement le min ou le max (ex : tableau déjà trié avec pivot = premier élément). En pratique, on **choisit le pivot au hasard** ou on utilise la **médiane de trois** pour éviter ce cas.

### Merge sort

**Diviser pour régner**, mais différent. On **coupe** le tableau en deux moitiés, on les trie **récursivement**, puis on **fusionne** les deux moitiés triées en parcourant chacune en parallèle.

**La fusion est $O(n)$** (parcours linéaire des deux moitiés). L'arbre récursif a $\\log n$ niveaux, chaque niveau coûte $O(n)$ total → $O(n \\log n)$ dans tous les cas (pas de pire cas en $O(n^2)$).

**Inconvénient** : nécessite un **buffer de taille $n$** pour la fusion → coût mémoire $O(n)$, pas in-place.

### Heap sort

Utilise une **structure de données appelée "tas" (heap)**, qui permet d'extraire le max en $O(\\log n)$. On insère tout dans le tas ($O(n)$), puis on extrait le max $n$ fois ($n \\cdot \\log n$). Total : $O(n \\log n)$ garanti.

**Avantage** : in-place, pire cas $O(n \\log n)$. **Inconvénient** : non stable, et plus lent en constante que quicksort en pratique.

## La borne inférieure $O(n \\log n)$

Un résultat **théorique important** : **aucun algo de tri basé sur des comparaisons** ne peut faire mieux que $O(n \\log n)$.

**Pourquoi ?** Pour trier $n$ éléments, il faut pouvoir distinguer les $n!$ permutations possibles. Un algo à comparaisons fonctionne comme un **arbre de décision binaire** (chaque comparaison = un nœud avec 2 branches). Pour avoir $n!$ feuilles, l'arbre doit avoir une profondeur d'au moins $\\log_2(n!) = \\Theta(n \\log n)$. Cette profondeur = nombre min de comparaisons dans le pire cas.

**Exceptions non-comparatives** : **counting sort**, **radix sort** peuvent atteindre $O(n)$ — mais ils ne s'appliquent qu'à des entiers dans une plage connue.

> [!example]
> **Choix de l'algo selon la situation.**
>
> - **Petit tableau (n < 20)** : insertion sort. Plus rapide en pratique que quicksort grâce à la faible constante.
> - **Tableau quasi-trié** : insertion sort ($O(n)$ dans ce cas).
> - **Gros tableau, RAM limitée** : quicksort ou heap sort (in-place).
> - **Tri stable requis** : merge sort ou insertion sort.
> - **Tri externe (données > RAM)** : merge sort adapté (on fusionne des fichiers triés).
> - **Par défaut dans un langage mainstream** : utilise \`Array.sort\` / \`sorted()\` — c'est déjà optimisé (Timsort, introsort).

> [!warning]
> **Pièges en entretien.**
>
> - **Dire que quicksort est toujours $O(n \\log n)$.** Non — **moyenne** $O(n \\log n)$, **pire cas** $O(n^2)$. Précise.
> - **Confondre stable et in-place.** Ce sont **deux propriétés indépendantes**. Merge sort est stable mais pas in-place. Heap sort est in-place mais pas stable.
> - **Sous-estimer l'importance de la stabilité.** Si tu tries par date puis par nom avec un tri instable, tu perds l'ordre de date. En pratique quotidienne ça compte.
> - **Penser que le meilleur algo en théorie est le meilleur en pratique.** Pour $n < 100$, un insertion sort simple **bat** un quicksort naïf (moins d'overhead). C'est pour ça que les langages mainstream utilisent des **hybrides** (Timsort, introsort).
> - **Oublier la mémoire.** Merge sort $O(n)$ RAM supplémentaire peut être prohibitif sur embarqué ou gros datasets.

## À quoi ça sert en pratique

- **\`Array.sort\`, \`sorted\`, ORDER BY SQL** : tout utilise un tri $O(n \\log n)$ en coulisses.
- **Préparation de données** : trier avant de faire une binary search, déduper, paginer.
- **Moteurs de recommandation** : trier des résultats par score.
- **Gestion de files de priorité** : un tas binaire = la structure de base d'un scheduler.
- **Algorithmes géographiques** : tri par coordonnée pour construire des R-trees ou des KD-trees.

> [!tip]
> **Tu ne réimplémentes presque jamais un tri** en prod — utilise la fonction du langage, elle est super optimisée. Mais **comprendre les tris** t'aide à : (1) lire le code algo pointu sans paniquer, (2) choisir la bonne structure de données (souvent une file de priorité = tas), (3) reconnaître quand un tri inutile te ralentit (ex : \`list.sort().first()\` = $O(n \\log n)$ alors qu'un simple \`min\` = $O(n)$).

> [!colibrimo]
> En pur soft, tu triries rarement à la main. **Mais** des choix clés dans Colibrimo reposent dessus : quand on veut afficher "les 10 chantiers les plus pertinents" (après calcul de score de similarité), on utilise \`ORDER BY score LIMIT 10\` — SQL fait un tri partiel optimisé. Si on lâchait sans LIMIT, le tri serait $O(n \\log n)$ sur toute la base — coûteux. Savoir **quand** un tri s'active te permet d'écrire des requêtes rapides.`,
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
        title: "Récursivité : définir un algo en fonction de lui-même",
        estimated_minutes: 14,
        content_md: `## Pourquoi tu dois maîtriser ça

La **récursivité** est une technique fondamentale pour attaquer les problèmes qui ont une **structure répétitive à plusieurs échelles** : parcours d'arbre, recherche dans une hiérarchie, division d'un problème en sous-problèmes identiques. Elle apparaît partout : parser un JSON, scanner un système de fichiers, résoudre un sudoku, trier un tableau (quicksort, merge sort). Le jury ISEN va te faire écrire une fonction récursive simple (factorielle, somme, Fibonacci) et surtout **tester ta capacité à identifier le cas de base** — c'est **LA** compétence à avoir. Comprendre la récursivité, c'est aussi comprendre pourquoi certains algos "reviennent sur leurs pas" (backtracking) et pourquoi une pile d'appels peut exploser si on n'y fait pas attention.

> [!note]
> **Ce qu'il faut savoir avant** : les **fonctions** et la notion d'**appel de fonction**. La **complexité Big O** pour analyser le coût. Les **tableaux** (on récurse souvent sur eux). Une notion intuitive de **fonction mathématique définie par récurrence** ($u_n = u_{n-1} + 2$) — la version algorithmique, c'est la même idée.

## L'idée intuitive

Une fonction **récursive** est une fonction qui **s'appelle elle-même**, sur une entrée **plus petite**, jusqu'à atteindre un **cas trivial** qu'elle sait résoudre directement.

**Analogie** : les **poupées russes**. Pour ouvrir la plus grande, tu l'ouvres et tu te retrouves avec une plus petite. Tu l'ouvres à son tour, et ainsi de suite, jusqu'à tomber sur la **plus petite qui ne s'ouvre pas** — ton cas de base. Puis, en remontant, chaque étape "fait quelque chose" avec le résultat de l'étape plus petite.

**Deux ingrédients obligatoires** dans toute fonction récursive :

1. **Un cas de base** : une entrée suffisamment petite pour que la fonction donne la réponse **sans se rappeler elle-même**. Sans ça, la fonction s'appelle à l'infini → **stack overflow**.
2. **Un appel récursif qui diminue** : chaque appel doit se rapprocher du cas de base. Sinon, même problème.

## Exemple canonique : la factorielle

$$n! = n \\times (n-1) \\times (n-2) \\times \\ldots \\times 2 \\times 1$$

Observation clé : $n! = n \\times (n-1)!$. Donc on peut définir $n!$ **en fonction** de $(n-1)!$. C'est la récurrence.

\`\`\`js
function factorial(n) {
  if (n <= 1) return 1;          // cas de base
  return n * factorial(n - 1);   // appel récursif, entrée plus petite
}
\`\`\`

**Comment ça s'exécute pour $n = 3$ ?**
- \`factorial(3)\` appelle \`factorial(2)\` puis multiplie par 3.
- \`factorial(2)\` appelle \`factorial(1)\` puis multiplie par 2.
- \`factorial(1)\` **cas de base** : renvoie 1.
- Retour vers \`factorial(2)\` : $2 \\times 1 = 2$.
- Retour vers \`factorial(3)\` : $3 \\times 2 = 6$. ✓

La fonction "**déploie**" ses appels jusqu'au cas de base, puis "**replie**" en combinant les résultats.

## La pile d'appels

**Chaque appel de fonction** consomme de la **mémoire** : le langage stocke l'état de la fonction appelante (variables locales, position de retour) dans un **cadre de pile** (stack frame). Avec une récursion de profondeur $n$, tu as $n$ cadres empilés.

- Factorielle($n$) profondeur = $n$ → mémoire $O(n)$.
- Si $n$ devient trop grand (typiquement quelques dizaines de milliers en JS/Python), **stack overflow**.

**Conséquence pratique** : pour des profondeurs très grandes, mieux vaut passer à une **version itérative** (avec une boucle) ou utiliser la **récursion terminale** si le langage l'optimise (rare en JS/Python, commun en Scala/Haskell).

## L'analyse de complexité : la relation de récurrence

Pour évaluer la complexité $T(n)$ d'un algo récursif, on écrit une **équation de récurrence** qui exprime le coût total en fonction du coût sur des entrées plus petites.

### Cas 1 : un seul appel

**Factorielle.** Chaque appel fait un appel récursif sur $n-1$, plus un travail en $O(1)$ (multiplication).
$$T(n) = T(n-1) + O(1)$$
En déroulant : $T(n) = T(n-1) + 1 = T(n-2) + 2 = \\ldots = T(0) + n = O(n)$.

### Cas 2 : deux appels avec la même taille / 2

**Merge sort.** On appelle 2 fois la fonction sur des moitiés, plus un travail $O(n)$ pour fusionner.
$$T(n) = 2\\,T(n/2) + O(n)$$
**Master theorem** (à connaître) : $T(n) = O(n \\log n)$.

### Cas 3 : deux appels qui se chevauchent (disaster)

**Fibonacci naïf.** $F(n) = F(n-1) + F(n-2)$.
$$T(n) = T(n-1) + T(n-2) + O(1)$$
L'arbre d'appels est un arbre binaire de profondeur $n$. Nombre de nœuds ≈ $\\varphi^n \\approx 1{,}618^n$ → **$O(2^n)$, exponentielle**.

Pour $n = 40$, Fibonacci récursif naïf prend déjà plusieurs secondes. Pour $n = 50$, quelques minutes. Pour $n = 100$, **temps de l'âge de l'univers**. C'est exactement l'anti-exemple à connaître — **la solution** s'appelle la **mémoïsation**.

## La mémoïsation (optimisation clé)

On stocke les résultats des appels déjà faits dans une **table** (hashmap), pour ne jamais les recalculer.

\`\`\`js
const memo = new Map();
function fib(n) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);    // évite recalcul
  const result = fib(n - 1) + fib(n - 2);
  memo.set(n, result);
  return result;
}
\`\`\`

**Gain** : chaque $F(k)$ calculé **une seule fois**, soit $n$ calculs. Complexité passée de $O(2^n)$ à $O(n)$. Pour Fibonacci de 100, c'est **instantané**.

## Itératif vs récursif

Tout algo récursif peut être **converti en itératif** (avec une boucle + une pile explicite si besoin). L'inverse n'est pas toujours aussi simple.

**Quand préférer récursif** :
- Problème **naturellement récursif** (arbres, graphes).
- Code **plus clair** (merge sort, DFS).

**Quand préférer itératif** :
- Profondeur potentielle très grande (risque stack overflow).
- Performance critique (overhead des appels de fonction).

> [!example]
> **Trois récursions classiques.**
>
> **(a) Factorielle.**
> \`\`\`js
> function factorial(n) {
>   if (n <= 1) return 1;
>   return n * factorial(n - 1);
> }
> \`\`\`
> Cas de base : $n \\le 1$. Complexité $O(n)$. Mémoire $O(n)$ (pile).
>
> **(b) Somme d'un tableau.**
> \`\`\`js
> function sum(arr, i = 0) {
>   if (i === arr.length) return 0;   // cas de base
>   return arr[i] + sum(arr, i + 1);
> }
> \`\`\`
> Cas de base : indice hors tableau. Décroissance : $i + 1$ approche la fin.
>
> **(c) Parcours d'un arbre (DFS).**
> \`\`\`js
> function dfs(node, visit) {
>   if (!node) return;                // cas de base
>   visit(node);
>   for (const child of node.children) dfs(child, visit);
> }
> \`\`\`
> Cas de base : nœud vide. Chaque appel consomme un niveau de l'arbre.

> [!warning]
> **Pièges classiques.**
>
> - **Oublier le cas de base.** La fonction s'appelle à l'infini → **stack overflow**. En JS, limite ~10k appels selon le moteur. Tjrs avoir un \`if\` de sortie au début.
> - **Cas de base mal formulé.** \`if (n === 1)\` fonctionne pour \`factorial(5)\` mais crashe pour \`factorial(0)\` (n passe à 0, puis -1, ...). Préfère toujours \`if (n <= 1)\`.
> - **Appel récursif qui ne décroît pas.** \`factorial(n)\` appelle \`factorial(n)\` → boucle infinie. Vérifie que **chaque appel** réduit strictement le problème.
> - **Ignorer la complexité exponentielle.** Fibonacci récursif naïf sur n = 50 = **votre ordi bloqué**. Une récursion qui fait **plusieurs appels** sur des tailles **proches** = souvent $O(2^n)$. Soupçonne et vérifie.
> - **Profondeur trop grande.** 100 000 appels récursifs ≈ stack overflow garanti en JS. Passe à l'itératif ou utilise une pile manuelle.
> - **Modifier un état global partagé sans précaution.** Si la récursion modifie une variable externe (counter global), les appels peuvent se marcher dessus.

## À quoi ça sert en pratique

- **Parcours d'arbres et graphes** (DFS, backtracking, sudoku, parseurs).
- **Algorithmes diviser pour régner** (merge sort, quicksort, recherche dichotomique).
- **Programmation dynamique** : récursivité + mémoïsation = DP top-down.
- **Traitement de structures récursives** : JSON, HTML, système de fichiers, commentaires hiérarchiques.
- **Machine à expressions** : évaluer une expression mathématique parsée en arbre.

> [!tip]
> **Réflexe de débug.** Devant une récursion qui bug, imprime les **entrées à chaque appel** (\`console.log(n)\`). Si tu vois la même valeur réapparaître → boucle infinie, cas de base manquant. Si tu vois des centaines de lignes pour $n = 10$ → tu fais des appels redondants, il te faut la mémoïsation.

> [!colibrimo]
> Les **structures de commentaires hiérarchiques** (un thread avec réponses imbriquées) se traitent récursivement : pour compter tous les descendants, tu appelles \`countDescendants(comment)\` qui somme 1 + la récursion sur chaque enfant. De même, **parser une AST** (arbre de syntaxe abstraite) en TS, **sérialiser un objet profond** en JSON — récursion partout. Et tu as **déjà** implémenté de la récursivité sans le savoir quand tu utilises \`.map()\` ou \`reduce\` dans des structures imbriquées.`,
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
        title: "Structures de données : choisir la bonne boîte pour tes données",
        estimated_minutes: 16,
        content_md: `## Pourquoi tu dois maîtriser ça

Une bonne structure de données transforme un algorithme $O(n^2)$ en $O(n)$, ou permet une recherche instantanée dans un million d'éléments. **Le choix de la structure est souvent plus important que l'algorithme lui-même**. En entretien, on te demande régulièrement "avec quelle structure ferais-tu ça ?" — et la bonne réponse fait toute la différence. En prod, utiliser un tableau quand il fallait une hashmap peut multiplier ta facture cloud par 100. Tu dois connaître les **6 structures de base** : tableau, liste chaînée, pile, file, hashmap, arbre — et savoir quand utiliser laquelle.

> [!note]
> **Ce qu'il faut savoir avant** : la **complexité Big O** (pour comparer les opérations), la notion de **variable** qui pointe vers une valeur (concept de référence). Idéalement tu as déjà utilisé des **tableaux** et des **dictionnaires** (\`Map\` / objet) dans un langage de programmation.

## L'idée intuitive

Une **structure de données** est une façon d'**organiser** des valeurs en mémoire pour que **certaines opérations soient rapides**. Chaque structure optimise des opérations au détriment d'autres. **Pas de structure universelle** : tu choisis selon ce dont ton algo a besoin (beaucoup d'insertions ? beaucoup de recherches ? ordre important ?).

**Analogie du rangement d'une bibliothèque.**
- **Tableau** = étagère numérotée. Pour récupérer le livre en position 42, tu y vas direct. Pour insérer un livre au milieu, il faut décaler tous les suivants (coûteux).
- **Liste chaînée** = chaque livre a une flèche vers le suivant. Insérer au milieu = juste changer 2 flèches. Chercher = parcourir tout.
- **Hashmap** = tu ranges chaque livre dans le tiroir correspondant à son titre (via une fonction de hachage). Trouver un livre = un seul tiroir à ouvrir. Pas d'ordre naturel entre les livres.
- **Arbre** = hiérarchie (genre → sous-genre → auteur → titre). Recherche rapide et ordre préservé.
- **Pile** = pile de livres sur un bureau. Tu ne peux poser / prendre que celui du dessus.
- **File** = queue à la boulangerie. Premier arrivé, premier servi.

## Tableau récapitulatif (à connaître par cœur)

| Structure | Accès par indice | Insertion | Suppression | Recherche par valeur |
|-----------|------------------|-----------|-------------|----------------------|
| **Tableau** | $O(1)$ | $O(n)$ (shift) | $O(n)$ (shift) | $O(n)$ (ou $O(\\log n)$ si trié) |
| **Liste chaînée** | $O(n)$ | $O(1)$ en tête | $O(1)$ si on a le nœud | $O(n)$ |
| **Pile** (LIFO) | top $O(1)$ | push $O(1)$ | pop $O(1)$ | — |
| **File** (FIFO) | front $O(1)$ | enqueue $O(1)$ | dequeue $O(1)$ | — |
| **HashMap** | clé $O(1)$ moyen | $O(1)$ moyen | $O(1)$ moyen | $O(1)$ moyen |
| **Arbre BST équilibré** | — | $O(\\log n)$ | $O(\\log n)$ | $O(\\log n)$ |
| **Tas (heap)** | min/max $O(1)$ | $O(\\log n)$ | $O(\\log n)$ (du min/max) | — |

**Pas de structure miracle** : la hashmap gagne en accès/insertion/recherche mais **perd l'ordre**. L'arbre préserve l'ordre mais est plus lent ($\\log n$ vs $O(1)$). Le tableau est rapide en accès mais lent en insertion. Chacun a son rôle.

## Les 6 structures, une par une

### 1. Tableau (array, list en Python, \`[]\` en JS)

Une suite contigüe de cases mémoire. Accès par indice **instantané** : l'adresse de la case $i$ est \`base + i × taille\`. En revanche, **insérer ou supprimer au milieu** oblige à **décaler** tous les éléments suivants → $O(n)$.

**Utilise un tableau quand** : tu connais la position des éléments (indexation) ; tu parcours souvent mais modifies peu ; tu veux trier.

### 2. Liste chaînée (linked list)

Chaque élément est un **nœud** qui contient sa valeur **et un pointeur vers le suivant**. Insérer / supprimer au milieu est $O(1)$ **si tu as déjà le nœud**, mais l'accès par indice est $O(n)$ (tu dois traverser la chaîne).

**Utilise une liste chaînée quand** : tu fais beaucoup d'insertions/suppressions au milieu ; tu n'as pas besoin d'accès par indice ; tu construis une pile ou une file simple.

**En pratique en dev moderne** : on utilise rarement les listes chaînées directement. Les arrays dynamiques modernes (Vec en Rust, \`ArrayList\` en Java) sont souvent plus performants à cause de la **cache CPU**.

### 3. Pile (stack, LIFO)

**Last In, First Out**. On ajoute et on enlève du **même côté** (le "top").

\`\`\`js
const stack = [];
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.pop()); // 3
console.log(stack.pop()); // 2
\`\`\`

**Usages** : historique undo/redo ; évaluation d'expressions (calculettes RPN, compilateurs) ; parcours en profondeur (DFS) ; pile d'appels de fonctions (c'est exactement ça en interne !).

### 4. File (queue, FIFO)

**First In, First Out**. On ajoute d'un côté (enqueue), on retire de l'autre (dequeue).

**Usages** : file d'attente ; job queues (Redis, RabbitMQ) ; parcours en largeur (BFS) ; producteur-consommateur.

### 5. HashMap (dictionary, \`Map\` en JS, \`dict\` en Python)

Associe des **clés** à des **valeurs**, avec **accès $O(1)$ en moyenne**. Fonctionnement : la clé passe dans une **fonction de hachage** qui donne un indice dans un tableau interne ; on lit/écrit directement à cet indice.

**Trade-off** : les clés n'ont **pas d'ordre** garanti ; le pire cas est $O(n)$ si plein de clés collisionnent (mais c'est très rare avec un bon hash).

**Usages ultra-fréquents** :
- "Compter les occurrences" : \`map[word] = (map[word] ?? 0) + 1\`.
- "Ai-je déjà vu X ?" : Set (hashmap sans valeur).
- "Index" : associer un ID à un objet.
- **Transforme presque tout $O(n^2)$ en $O(n)$**.

### 6. Arbre (tree)

Une **hiérarchie** : un nœud racine, ses enfants, leurs enfants, etc. **Arbre binaire de recherche (BST)** : chaque nœud a ≤ 2 enfants, le gauche est plus petit, le droit plus grand. Si équilibré (AVL, Red-Black), les opérations sont $O(\\log n)$.

**Usages** : filesystem, DOM HTML, moteurs de règles, recherches ordonnées.

**Tas (heap)** : arbre binaire spécial où chaque parent est ≤ (ou ≥) ses enfants. Permet de récupérer le min/max en $O(1)$ et de gérer des **files de priorité**.

## Les algorithmes de graphes (DFS et BFS)

Un graphe = nœuds + arêtes. Deux algos fondamentaux :

**DFS (Depth-First Search, parcours en profondeur)**. On descend **aussi loin que possible** avant de revenir en arrière. Utilise une **pile** (ou la récursion).
- Détection de cycle.
- Tri topologique (dépendances).
- Composantes connexes.

**BFS (Breadth-First Search, parcours en largeur)**. On explore **niveau par niveau**, tous les voisins directs avant les voisins-de-voisins. Utilise une **file**.
- **Plus court chemin** en nombre d'arêtes.
- Propagation (ex : "trouve toutes les pages à 2 clics").

Complexité des deux : $O(V + E)$ ($V$ = nb de sommets, $E$ = nb d'arêtes).

> [!example]
> **Quatre applications typiques.**
>
> **(a) Détecter les doublons dans un tableau.**
> - Naïf : double boucle $O(n^2)$.
> - Avec Set : parcours simple, $O(n)$.
> \`\`\`js
> const seen = new Set();
> for (const x of arr) { if (seen.has(x)) return true; seen.add(x); }
> return false;
> \`\`\`
>
> **(b) Compter les occurrences de chaque mot.**
> \`\`\`js
> const counts = new Map();
> for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);
> \`\`\`
> $O(n)$ total.
>
> **(c) Historique undo/redo.** Deux piles : \`undoStack\` et \`redoStack\`. Action → push dans undo. Undo → pop de undo + push dans redo. Redo → l'inverse.
>
> **(d) File d'impression.** Une file (queue) FIFO : le premier envoyé imprime en premier.

> [!warning]
> **Pièges classiques.**
>
> - **Utiliser un tableau pour faire "ai-je déjà vu ?".** Recherche $O(n)$ par vérification. Si on fait ça $n$ fois = $O(n^2)$. Une **Set** fait ça en $O(n)$ total.
> - **Oublier le \`break\` après avoir trouvé.** Si tu parcours un tableau en recherche et que tu continues après avoir trouvé, tu gaspilles ou tu te plantes.
> - **Confondre liste chaînée et tableau en termes de perf.** Dans la plupart des langages modernes, les arrays dynamiques sont plus rapides que les linked lists à cause du cache CPU (localité mémoire). Utilise la linked list seulement si tu as une raison précise.
> - **Hashmap avec clés mutables.** Si une clé est un objet dont tu modifies les propriétés après l'avoir mise dans la map, le hash change → tu ne la retrouves plus. Règle : **clés immuables**.
> - **Tas pour trouver le min de tout un tableau.** Construire un tas puis \`pop\` le min est $O(n + \\log n)$, alors qu'un simple \`min(arr)\` est $O(n)$. Le tas sert quand tu as **des insertions dynamiques** et tu veux le min/max **à tout moment**.
> - **BFS vs DFS mal choisi.** Pour "plus court chemin en nb d'arêtes" → **BFS**. Pour "détection de cycle" → DFS. Les deux font $O(V+E)$ donc pareille vitesse.

## À quoi ça sert en pratique

- **Compter / dédupliquer** : Set / HashMap.
- **File d'attente / job queue** : Queue (Redis, RabbitMQ, SQS AWS).
- **Undo/Redo** : deux Stacks.
- **Index DB** : arbres B+ ($O(\\log n)$ garanti, persistant sur disque).
- **Cache LRU** : HashMap + doubly-linked list.
- **Planification par priorité** : tas / heap (OS, schedulers).
- **Parcourir un DOM HTML, un JSON, un FS** : arbre + DFS/BFS.
- **Trouver tous les amis-d'amis d'un utilisateur** : graphe + BFS.

> [!tip]
> **Méthode en entretien.** Devant un problème, pose-toi **5 secondes** : "est-ce que j'ai besoin de **ordre** (→ tableau ou arbre), **accès clé** (→ hashmap), **dernier/premier** (→ pile/file), **min/max dynamique** (→ tas) ?" La réponse donne la structure. L'algo en découle naturellement.

> [!colibrimo]
> Sur Colibrimo, les **principales structures** sont : **hashmap** (cache utilisateur, déduplication d'emails), **queue** (jobs d'analyse IA, envois de notifications), **arbre** (hiérarchie de commentaires sur un chantier), **graphe** (relations entre chantiers/fournisseurs/entreprises, avec BFS pour "tous les contacts à 2 niveaux"). Et **toute BDD** utilise des arbres B+ pour ses index. Comprendre ces structures, c'est comprendre pourquoi telle requête est rapide ou lente.`,
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
        title: "SQL relationnel : interroger une base de données",
        estimated_minutes: 17,
        content_md: `## Pourquoi tu dois maîtriser ça

SQL est le **langage universel** pour interroger des bases de données relationnelles (Postgres, MySQL, SQLite, MS SQL Server, Oracle — tous parlent SQL avec des variantes mineures). **Chaque application que tu verras** en entreprise utilise du SQL, directement ou via un ORM. Le jury ISEN sait que SQL est **la compétence data qui ne vieillit pas** — inventé dans les années 70, toujours central 55 ans plus tard. Tu dois être capable de (1) lire un \`SELECT\` avec JOIN et agrégation, (2) écrire une requête pour un besoin métier simple, (3) expliquer ce qu'est un **index** et pourquoi c'est critique en prod. Sans SQL, pas d'ingé data, pas de back-end sérieux.

> [!note]
> **Ce qu'il faut savoir avant** : la notion de **table** (comme un tableau Excel avec colonnes et lignes), **ligne** (= enregistrement = row), **colonne** (= attribut), **clé primaire** (identifiant unique d'une ligne). La notion de **relation** entre deux tables via une **clé étrangère** (foreign key) — ex : une table \`orders\` avec une colonne \`user_id\` qui référence \`users.id\`.

## L'idée intuitive

Une base relationnelle, c'est plusieurs **tables** qui se **lient** entre elles via des **clés étrangères**.

**Exemple :** un site e-commerce.
- Table \`users\` : \`id\`, \`name\`, \`email\`.
- Table \`orders\` : \`id\`, \`user_id\`, \`amount\`, \`created_at\`.

Les commandes référencent l'utilisateur qui les a passées. Pour répondre à "combien chaque utilisateur a-t-il passé de commandes ?", on va **joindre** les deux tables sur \`orders.user_id = users.id\` puis **agréger** par utilisateur.

SQL décrit **quoi** tu veux (de façon déclarative), pas **comment** aller le chercher. Le moteur de base de données optimise le "comment" avec un **plan d'exécution** qui utilise notamment les **index**.

## La structure d'un SELECT complet

\`\`\`sql
SELECT u.name, COUNT(o.id) AS total_orders
FROM users u
  INNER JOIN orders o ON o.user_id = u.id
WHERE o.created_at > '2026-01-01'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY total_orders DESC
LIMIT 10;
\`\`\`

Cette requête répond à : "donne-moi les 10 utilisateurs qui ont passé plus de 5 commandes depuis 2026, triés du plus grand nombre de commandes au plus petit".

### Les clauses à connaître

- **\`SELECT\`** : quelles colonnes on veut dans le résultat.
- **\`FROM\`** : de quelles tables on part.
- **\`JOIN ... ON ...\`** : comment on lie les tables.
- **\`WHERE\`** : filtrer les lignes **avant** agrégation (sur une ligne individuelle).
- **\`GROUP BY\`** : regrouper les lignes par valeur d'une ou plusieurs colonnes.
- **\`HAVING\`** : filtrer les groupes **après** agrégation (sur le résultat de COUNT/SUM...).
- **\`ORDER BY\`** : trier le résultat.
- **\`LIMIT\`** : n'en garder que les N premiers.

### L'ordre logique d'exécution (différent de l'ordre d'écriture !)

$$\\text{FROM / JOIN} \\to \\text{WHERE} \\to \\text{GROUP BY} \\to \\text{HAVING} \\to \\text{SELECT} \\to \\text{ORDER BY} \\to \\text{LIMIT}$$

**C'est important** de comprendre cet ordre pour éviter des bugs. Par exemple, tu ne peux **pas** référencer dans un \`WHERE\` un alias défini dans le \`SELECT\`, parce que le \`WHERE\` s'exécute **avant** le \`SELECT\`.

## Les types de JOIN

Un **JOIN** combine des lignes de deux tables selon une **condition de liaison** (l'ON).

### INNER JOIN (intersection)

Garde **uniquement** les lignes qui ont une correspondance des deux côtés.
\`\`\`sql
SELECT u.name, o.amount
FROM users u INNER JOIN orders o ON o.user_id = u.id;
\`\`\`
Un utilisateur sans commande n'apparaît **pas**. Une commande sans user valide (improbable) non plus.

### LEFT JOIN (tout à gauche)

Garde **toutes** les lignes de la table de gauche, et ce qui matche à droite (NULL si rien).
\`\`\`sql
SELECT u.name, COUNT(o.id) AS n
FROM users u LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id;
\`\`\`
Les utilisateurs **sans commandes** apparaissent avec \`n = 0\`. Utile pour détecter les absents.

### RIGHT JOIN / FULL OUTER

Moins utilisés. \`RIGHT JOIN\` = symétrique du LEFT (utilise \`LEFT JOIN\` en inversant les tables à la place). \`FULL OUTER JOIN\` = union, NULL des deux côtés si rien ne matche.

## L'agrégation : GROUP BY et HAVING

**\`GROUP BY col\`** transforme plusieurs lignes en **une ligne par valeur distincte** de \`col\`. Dans le SELECT, tu peux alors utiliser des **fonctions d'agrégation** :

| Fonction | Signification |
|----------|---------------|
| \`COUNT(*)\` ou \`COUNT(col)\` | Nombre de lignes (ou de valeurs non-NULL) |
| \`SUM(col)\` | Somme |
| \`AVG(col)\` | Moyenne |
| \`MIN(col)\`, \`MAX(col)\` | Min/max |

**Règle d'or** : toute colonne du \`SELECT\` qui n'est **pas** dans une fonction d'agrégation **doit** être dans le \`GROUP BY\`. Sinon, erreur ou résultat indéterminé.

**\`HAVING\`** filtre les groupes **après** agrégation. Analogue du WHERE mais sur les résultats de \`COUNT\`, \`SUM\`, etc. Exemple : \`HAVING COUNT(*) > 5\` = ne garde que les groupes avec plus de 5 lignes.

## Les index : le game changer

**Sans index**, \`WHERE col = X\` fait un **scan complet** de la table → $O(n)$. Sur 10 millions de lignes, ça peut prendre plusieurs secondes.

**Avec un index** sur \`col\` (structure B-tree sur disque), la même requête devient $O(\\log n)$ → quelques millisecondes, même sur des milliards de lignes.

**Règle pratique** : **indexer** les colonnes utilisées dans :
- Les \`WHERE\` fréquents.
- Les \`JOIN ... ON col = ...\`.
- Les \`ORDER BY col LIMIT N\` (petit).
- Les **clés étrangères** (systématiquement).

**Coût** : un index est **une structure supplémentaire** sur disque (quelques % de la taille de la table) qui doit être **mise à jour** à chaque INSERT/UPDATE/DELETE. Trop d'index = ralentissement des écritures. Trouver le bon équilibre est un art.

> [!example]
> **Quatre requêtes typiques.**
>
> **(a) Recherche simple avec filtre.**
> \`\`\`sql
> SELECT * FROM users WHERE email = 'alice@example.com';
> \`\`\`
> Avec index sur \`email\` : $O(\\log n)$.
>
> **(b) Agrégation avec GROUP BY.**
> \`\`\`sql
> SELECT country, COUNT(*) AS n_users FROM users GROUP BY country;
> \`\`\`
> Compte les utilisateurs par pays.
>
> **(c) JOIN + LEFT JOIN + HAVING.**
> \`\`\`sql
> SELECT u.name, COUNT(o.id) AS n
> FROM users u LEFT JOIN orders o ON o.user_id = u.id
> GROUP BY u.id, u.name
> HAVING COUNT(o.id) = 0;
> \`\`\`
> Utilisateurs **sans aucune commande**. Le LEFT JOIN fait apparaître \`n = 0\` pour ceux-là.
>
> **(d) Top-10 trié.**
> \`\`\`sql
> SELECT u.name, SUM(o.amount) AS total
> FROM users u INNER JOIN orders o ON o.user_id = u.id
> WHERE o.created_at > '2026-01-01'
> GROUP BY u.id, u.name
> ORDER BY total DESC
> LIMIT 10;
> \`\`\`
> Top 10 acheteurs depuis 2026.

> [!warning]
> **Pièges fréquents.**
>
> - **Oublier un \`JOIN\` implicite** = produit cartésien (toutes les paires possibles). Si tables $n$ et $m$ lignes : résultat $n \\times m$. Catastrophique en prod.
> - **Utiliser \`WHERE\` au lieu de \`HAVING\`.** Le WHERE filtre **avant** l'agrégation, le HAVING **après**. \`WHERE COUNT(*) > 5\` ne marche pas (le COUNT n'est pas encore calculé).
> - **\`SELECT *\`** en prod = récupère toutes les colonnes, dont parfois des BLOBs énormes. Liste explicitement les colonnes utiles.
> - **Ne pas indexer les clés étrangères.** Un \`LEFT JOIN\` sur une FK non indexée = scan complet de la table jointe. Ralentissement × 100 facile.
> - **Faire un N+1.** Dans du code, boucler sur $n$ résultats et faire une requête par item = $n+1$ requêtes. Préfère un JOIN ou un IN.
> - **Oublier \`GROUP BY\`** quand il faut. \`SELECT country, COUNT(*) FROM users\` sans GROUP BY renvoie une seule ligne avec le total global — pas par pays.
> - **Confondre COUNT(*) et COUNT(col).** \`COUNT(*)\` compte toutes les lignes. \`COUNT(col)\` compte les lignes où \`col\` n'est **pas NULL**.

## À quoi ça sert en pratique

- **Back-end web** : chaque app moderne stocke son état dans une DB relationnelle, interrogée en SQL.
- **Analytics** : dashboards, reporting, BI — tout passe par SQL (Metabase, Tableau, etc.).
- **Data engineering** : préparer des datasets, dédupliquer, joindre des sources.
- **Migration de données** : \`UPDATE\` / \`INSERT ... SELECT\` pour convertir des schémas.
- **Audit / compliance** : requêtes de vérification sur des millions de lignes.

> [!tip]
> **Règle "toujours préciser ses JOINs".** N'utilise **jamais** un JOIN sans ON (produit cartésien). N'écris **jamais** \`SELECT *\` en prod sans raison. Et devant une requête lente, exécute \`EXPLAIN\` pour voir le plan d'exécution — tu verras immédiatement si un scan séquentiel pourrait être remplacé par un index scan.

> [!colibrimo]
> Sur Colibrimo, **Postgres** (via Supabase) est au cœur du back-end. Chaque requête de l'app passe par un SELECT avec 1-3 JOINs et un WHERE sur un user_id. On indexe toutes les FK et les colonnes de filtre fréquent. **Résultat** : requêtes sub-10ms sur 500k lignes, même en prod. Comprendre SQL + index ici = comprendre **pourquoi l'app est rapide** ou pourquoi elle peut dégénérer.`,
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
