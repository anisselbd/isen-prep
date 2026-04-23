import type { TopicContent } from "./types";

export const ELECTRONIQUE_CONTENT: TopicContent[] = [
  // ==========================================================================
  // Portes logiques
  // ==========================================================================
  {
    topic_id: "electronique.num.portes",
    lessons: [
      {
        title: "Portes logiques : AND, OR, NOT, NAND, NOR, XOR",
        estimated_minutes: 7,
        content_md: `## Les 6 portes de base

| Porte | Notation | Équation |
|-------|----------|----------|
| AND | $A \\cdot B$ | 1 ssi les deux à 1 |
| OR | $A + B$ | 1 ssi au moins une à 1 |
| NOT | $\\bar{A}$ | inverse |
| NAND | $\\overline{A \\cdot B}$ | AND inversé |
| NOR | $\\overline{A + B}$ | OR inversé |
| XOR | $A \\oplus B$ | 1 ssi exactement une à 1 |

## Tables de vérité (AND / OR / XOR)

| A | B | A·B | A+B | A⊕B |
|---|---|-----|-----|-----|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 0 |

## Universalité

**NAND** et **NOR** sont chacune *universelle* : on peut construire toutes les autres portes avec uniquement des NAND (ou uniquement des NOR). Raison : $\\overline{A} = A \\uparrow A$ (NAND de $A$ avec lui-même), puis $A \\cdot B = \\overline{\\overline{A \\cdot B}}$, etc.

## En hardware

Chaque porte est un circuit transistorisé (CMOS en général). Un NAND CMOS = 4 transistors. Toute la logique d'un microprocesseur est construite à partir de quelques milliards de ces briques.`,
      },
    ],
    exercises: [
      {
        type: "mcq",
        difficulty: 1,
        question_md: "Que vaut $A \\cdot B$ pour $A = 1, B = 0$ ?",
        data: { choices: ["0", "1", "A", "B"], answer: 0 },
        explanation_md: "AND : 1 si **et seulement si** les deux entrées sont à 1. Ici $B = 0$ ⇒ sortie 0.",
      },
      {
        type: "mcq",
        difficulty: 1,
        question_md: "Que vaut $A \\oplus B$ pour $A = 1, B = 1$ ?",
        data: { choices: ["0", "1", "A", "Indéfini"], answer: 0 },
        explanation_md:
          "XOR (ou exclusif) : 1 si **exactement une** entrée est à 1. Ici les deux sont à 1 ⇒ sortie 0.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md: "Laquelle de ces portes est **universelle** (permet de construire toutes les autres) ?",
        data: { choices: ["AND", "OR", "XOR", "NAND"], answer: 3 },
        explanation_md:
          "NAND (comme NOR) est universelle : $\\overline{A} = A \\uparrow A$, $A \\cdot B = \\overline{A \\uparrow B}$, etc. Toute la logique peut se construire avec une seule type de porte.",
      },
      {
        type: "match_pairs",
        difficulty: 2,
        question_md: "Associe chaque porte à sa table de vérité (colonne sortie pour AB=00,01,10,11).",
        data: {
          pairs: [
            { left: "AND", right: "0,0,0,1" },
            { left: "OR", right: "0,1,1,1" },
            { left: "XOR", right: "0,1,1,0" },
            { left: "NAND", right: "1,1,1,0" },
          ],
        },
        explanation_md:
          "Mémoriser dans l'ordre AB=00,01,10,11. AND : seul 11 donne 1. OR : seul 00 donne 0. XOR : les deux extrêmes 00 et 11 donnent 0. NAND : inverse de AND.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md: "Comment construit-on un inverseur (NOT) avec uniquement des portes NAND ?",
        data: {
          choices: [
            "NAND(A, 1)",
            "NAND(A, A)",
            "NAND(A, 0)",
            "On ne peut pas, il faut un NOR",
          ],
          answer: 1,
        },
        explanation_md:
          "$\\overline{A \\cdot A} = \\overline{A} = \\bar{A}$. On branche $A$ sur les deux entrées du NAND.",
      },
    ],
    flashcards: [
      {
        front_md: "Table de vérité XOR",
        back_md: "Vaut 1 **ssi exactement une** entrée est à 1. AB=00→0, 01→1, 10→1, 11→0.",
        tags: ["portes"],
      },
      {
        front_md: "Portes universelles",
        back_md:
          "**NAND** et **NOR** sont chacune universelle : toute fonction booléenne peut être réalisée avec un seul de ces types de portes.",
        tags: ["portes"],
      },
    ],
  },

  // ==========================================================================
  // Tables de vérité
  // ==========================================================================
  {
    topic_id: "electronique.num.tables_verite",
    lessons: [
      {
        title: "Construire et exploiter une table de vérité",
        estimated_minutes: 6,
        content_md: `## Recette

1. Énumérer toutes les combinaisons des $n$ entrées : $2^n$ lignes.
2. Calculer la sortie pour chaque ligne.
3. Lire les minterms (sortie = 1) pour construire la forme **somme de produits**.

## Exemple : $F = A \\cdot \\bar{B} + B \\cdot C$

| A | B | C | $A\\bar{B}$ | $BC$ | F |
|---|---|---|------|------|---|
| 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 0 | 0 |
| 0 | 1 | 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 0 | 1 |
| 1 | 0 | 1 | 1 | 0 | 1 |
| 1 | 1 | 0 | 0 | 0 | 0 |
| 1 | 1 | 1 | 0 | 1 | 1 |

## De la table à l'équation

**Forme canonique disjonctive** (somme de minterms) :
$$F = \\sum_{lignes\\;F=1} \\text{minterm}$$

Pour l'exemple : $F = \\bar{A}BC + A\\bar{B}\\bar{C} + A\\bar{B}C + ABC$.

## Simplification

Souvent via tableaux de Karnaugh ou algèbre de Boole. L'expression initiale $A\\bar{B} + BC$ est déjà la forme simplifiée — plus compacte que la forme canonique.`,
      },
    ],
    exercises: [
      {
        type: "numeric",
        difficulty: 1,
        question_md: "Combien de lignes dans la table de vérité d'une fonction à 5 entrées ?",
        data: { answer: 32, tolerance: 0 },
        explanation_md: "$2^n = 2^5 = 32$ combinaisons possibles des entrées.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Pour $F = A \\cdot \\bar{B} + B$, que vaut $F$ pour $A = 0, B = 1$ ?",
        data: { choices: ["0", "1", "A", "B"], answer: 1 },
        explanation_md:
          "$A \\cdot \\bar{B} = 0 \\cdot 0 = 0$. $B = 1$. Somme : $0 + 1 = 1$.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Forme canonique disjonctive (somme de minterms) — c'est :",
        data: {
          choices: [
            "La somme des produits de toutes les combinaisons d'entrées",
            "La somme des minterms pour lesquels la sortie vaut 1",
            "Le produit des maxterms pour lesquels la sortie vaut 0",
            "Une forme unique utilisant uniquement des NAND",
          ],
          answer: 1,
        },
        explanation_md:
          "On somme uniquement les minterms correspondant aux lignes où $F = 1$ dans la table de vérité. C'est la forme SOP (Sum Of Products) canonique.",
      },
      {
        type: "numeric",
        difficulty: 2,
        question_md:
          "Pour $F = \\bar{A} + B$, combien de lignes de la table ont $F = 1$ (sur $2^2 = 4$ lignes) ?",
        data: { answer: 3, tolerance: 0 },
        explanation_md:
          "AB=00 : F=1. AB=01 : F=1. AB=10 : F=0. AB=11 : F=1. Trois lignes à 1.",
      },
      {
        type: "mcq",
        difficulty: 3,
        question_md:
          "Fonction $F$ à 3 entrées dont la table de vérité contient 5 lignes à 1. Équivalent le plus compact ?",
        data: {
          choices: [
            "Utiliser la forme SOP (5 minterms)",
            "Utiliser la forme POS (3 maxterms, car 8−5=3)",
            "Les deux donnent la même taille",
            "Rien de tout cela",
          ],
          answer: 1,
        },
        explanation_md:
          "5 lignes à 1 ⇒ 5 minterms (SOP) vs 3 lignes à 0 ⇒ 3 maxterms (POS). Dans ce cas la forme POS est plus compacte. Toujours vérifier les deux.",
      },
    ],
    flashcards: [
      {
        front_md: "Nombre de lignes d'une table de vérité à $n$ entrées",
        back_md: "$2^n$",
        tags: ["table_verite"],
      },
      {
        front_md: "Forme canonique disjonctive (SOP)",
        back_md:
          "Somme des minterms des lignes où $F = 1$. Chaque minterm est le produit de toutes les variables (normales ou complémentées) de cette ligne.",
        tags: ["table_verite"],
      },
    ],
  },

  // ==========================================================================
  // Lois de De Morgan
  // ==========================================================================
  {
    topic_id: "electronique.num.de_morgan",
    lessons: [
      {
        title: "Lois de De Morgan : le pont AND ↔ OR",
        estimated_minutes: 5,
        content_md: `## Les deux lois

$$\\overline{A \\cdot B} = \\bar{A} + \\bar{B}$$

$$\\overline{A + B} = \\bar{A} \\cdot \\bar{B}$$

En mots : **la négation d'un ET est le OU des négations** (et symétriquement).

## Utilité pratique

Transformer des circuits NAND en circuits OR de négations (plus lisibles), ou l'inverse. Essentiel pour simplifier des expressions booléennes.

> [!example]
> Simplifier $\\overline{A \\cdot B} + A$ :
> 1. De Morgan : $= \\bar{A} + \\bar{B} + A$
> 2. Identité $A + \\bar{A} = 1$ : $= 1 + \\bar{B} = 1$.
>
> L'expression vaut toujours 1.

## Généralisation (n variables)

$$\\overline{X_1 \\cdot X_2 \\cdot \\ldots \\cdot X_n} = \\bar{X_1} + \\bar{X_2} + \\ldots + \\bar{X_n}$$

Et symétriquement pour la somme.

## Vérification par table de vérité

Toujours possible : 4 lignes pour 2 variables, on calcule les deux côtés et on compare.

> [!colibrimo]
> Les moteurs de règles (type "expression booléenne sur les filtres") utilisent De Morgan en permanence pour normaliser les requêtes avant exécution. Une requête \`NOT (A AND B)\` est réécrite en \`NOT A OR NOT B\` si l'index sait mieux traiter cette forme.`,
      },
    ],
    exercises: [
      {
        type: "formula",
        difficulty: 1,
        question_md:
          "Donne l'expression équivalente de $\\overline{A + B}$ d'après De Morgan (LaTeX).",
        data: {
          expected_latex: "\\bar{A} \\cdot \\bar{B}",
          equivalent_forms: [
            "\\bar{A}\\bar{B}",
            "\\overline{A} \\cdot \\overline{B}",
            "\\overline{A}\\overline{B}",
            "\\bar{A} \\bar{B}",
            "(\\bar{A})(\\bar{B})",
          ],
        },
        explanation_md: "De Morgan : $\\overline{A + B} = \\bar{A} \\cdot \\bar{B}$.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md: "Que vaut l'expression $\\overline{A \\cdot B} + A$ ?",
        data: { choices: ["$A + B$", "$1$", "$A$", "$\\bar{A} \\cdot B$"], answer: 1 },
        explanation_md:
          "De Morgan : $\\bar{A} + \\bar{B} + A$. $A + \\bar{A} = 1$, donc le tout vaut $1 + \\bar{B} = 1$ (absorption).",
      },
      {
        type: "formula",
        difficulty: 2,
        question_md:
          "Simplifie $\\overline{\\bar{A} \\cdot \\bar{B}}$ (écris en utilisant + et · sans sur-ligne).",
        data: {
          expected_latex: "A + B",
          equivalent_forms: ["A+B", "B + A"],
        },
        explanation_md:
          "De Morgan sur NOR : $\\overline{\\bar{A} \\cdot \\bar{B}} = A + B$. C'est en fait la définition de OR à partir de NOR + inverseurs.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Quelle est la **bonne** réécriture De Morgan de $\\overline{A + B + C}$ ?",
        data: {
          choices: [
            "$\\bar{A} + \\bar{B} + \\bar{C}$",
            "$\\bar{A} \\cdot \\bar{B} \\cdot \\bar{C}$",
            "$A \\cdot B \\cdot C$",
            "$\\overline{A B C}$",
          ],
          answer: 1,
        },
        explanation_md:
          "Généralisation : la négation d'une somme est le produit des négations. $\\overline{A+B+C} = \\bar{A}\\bar{B}\\bar{C}$.",
      },
      {
        type: "text",
        difficulty: 3,
        question_md:
          "Pourquoi les lois de De Morgan sont-elles **cruciales** pour simplifier des circuits NAND-only ou NOR-only ?",
        data: {
          expected_key_points: [
            "universalité",
            "substitution",
            "coût",
            "nombre de transistors",
            "optimisation",
          ],
          min_score: 0.6,
        },
        explanation_md:
          "Les circuits industriels sont souvent faits uniquement de NAND (CMOS) pour minimiser les masques de fabrication. De Morgan permet de passer d'une expression mélangeant AND/OR/NOT à une expression uniquement NAND (ou NOR), simplifiant le layout et réduisant le nombre de transistors.",
      },
    ],
    flashcards: [
      {
        front_md: "Loi de De Morgan — négation d'un produit",
        back_md: "$\\overline{A \\cdot B} = \\bar{A} + \\bar{B}$",
        tags: ["de_morgan"],
      },
      {
        front_md: "Loi de De Morgan — négation d'une somme",
        back_md: "$\\overline{A + B} = \\bar{A} \\cdot \\bar{B}$",
        tags: ["de_morgan"],
      },
    ],
  },

  // ==========================================================================
  // Conversions binaire / hex
  // ==========================================================================
  {
    topic_id: "electronique.num.conversions",
    lessons: [
      {
        title: "Conversions décimal ↔ binaire ↔ hexadécimal",
        estimated_minutes: 7,
        content_md: `## Les 3 bases courantes

- **Décimal** (base 10) : chiffres 0-9
- **Binaire** (base 2) : chiffres 0-1. Unité = **bit**.
- **Hexadécimal** (base 16) : chiffres 0-9 et A-F (A=10, B=11, …, F=15).

## Décimal → Binaire

Divisions successives par 2, lire les restes **de bas en haut**.

> [!example]
> 13 en binaire :
> - 13 / 2 = 6 reste **1**
> - 6 / 2 = 3 reste **0**
> - 3 / 2 = 1 reste **1**
> - 1 / 2 = 0 reste **1**
>
> Résultat : $1101_2$.

## Binaire → Décimal

Somme pondérée : $b_n b_{n-1} \\ldots b_0 = \\sum_{i} b_i \\cdot 2^i$.

> [!example]
> $1101_2 = 1 \\cdot 8 + 1 \\cdot 4 + 0 \\cdot 2 + 1 \\cdot 1 = 13$.

## Binaire ↔ Hexadécimal

4 bits = 1 digit hexa. Groupez le binaire par paquets de 4 à partir de la droite.

| Hex | Bin |
|-----|-----|
| 0 | 0000 |
| 1 | 0001 |
| 2 | 0010 |
| 5 | 0101 |
| A | 1010 |
| F | 1111 |

> [!example]
> $10110101_2 = 1011\\ 0101 = B5_{16}$.

## Hex → Décimal

Somme pondérée sur base 16. $A3_{16} = 10 \\cdot 16 + 3 = 163$.

> [!colibrimo]
> Les couleurs CSS \`#FF5733\` sont trois octets en hexa (R, G, B). $FF = 255$, $57 = 87$, $33 = 51$. Utile quand on manipule des palettes via code.`,
      },
    ],
    exercises: [
      {
        type: "conversion",
        difficulty: 1,
        question_md: "Convertis $13_{10}$ en binaire et hexadécimal.",
        data: {
          source: { base: "decimal", value: "13" },
          targets: ["binary", "hex"],
        },
        explanation_md: "13 / 2 → restes 1,0,1,1 (bas en haut) = 1101₂ = D₁₆.",
      },
      {
        type: "conversion",
        difficulty: 2,
        question_md: "Convertis $A3_{16}$ en décimal et binaire.",
        data: {
          source: { base: "hex", value: "A3" },
          targets: ["decimal", "binary"],
        },
        explanation_md:
          "$A3 = 10 \\cdot 16 + 3 = 163$ en décimal. A=1010, 3=0011 ⇒ 10100011 en binaire.",
        colibrimo_connection:
          "Un octet 0xA3 a 163 valeurs sur 256 — soit ~64 % de saturation dans une composante de couleur CSS.",
      },
      {
        type: "numeric",
        difficulty: 1,
        question_md: "Valeur décimale de $FF_{16}$ ?",
        data: { answer: 255, tolerance: 0 },
        explanation_md: "$F \\cdot 16 + F = 15 \\cdot 16 + 15 = 240 + 15 = 255$.",
      },
      {
        type: "conversion",
        difficulty: 2,
        question_md: "Convertis $10110101_2$ en décimal et hexadécimal.",
        data: {
          source: { base: "binary", value: "10110101" },
          targets: ["decimal", "hex"],
        },
        explanation_md:
          "Par paquets de 4 : 1011 0101 → B5 (hex). En décimal : $1 \\cdot 128 + 0 \\cdot 64 + 1 \\cdot 32 + 1 \\cdot 16 + 0 \\cdot 8 + 1 \\cdot 4 + 0 \\cdot 2 + 1 \\cdot 1 = 181$.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Combien de valeurs distinctes peut-on coder sur 8 bits ?",
        data: { choices: ["$128$", "$255$", "$256$", "$512$"], answer: 2 },
        explanation_md:
          "$2^8 = 256$ valeurs distinctes (0 à 255). La valeur **maximale** est 255, mais il y a 256 valeurs au total.",
      },
    ],
    flashcards: [
      {
        front_md: "1 chiffre hexa = combien de bits ?",
        back_md: "4 bits (un *nibble*). Base 16 = $2^4$. Ex : $A_{16} = 1010_2$.",
        tags: ["conversions"],
      },
      {
        front_md: "Méthode décimal → binaire",
        back_md:
          "Divisions successives par 2, on lit les restes de bas en haut (MSB → LSB).",
        tags: ["conversions"],
      },
      {
        front_md: "Plage d'un entier non signé sur $n$ bits",
        back_md: "De 0 à $2^n - 1$, soit $2^n$ valeurs distinctes.",
        tags: ["conversions"],
      },
    ],
  },

  // ==========================================================================
  // Algèbre de Boole
  // ==========================================================================
  {
    topic_id: "electronique.num.algebre_boole",
    lessons: [
      {
        title: "Algèbre de Boole : lois et simplification",
        estimated_minutes: 8,
        content_md: `## Les 8 lois à connaître

| Loi | AND | OR |
|-----|-----|-----|
| Identité | $A \\cdot 1 = A$ | $A + 0 = A$ |
| Annulation | $A \\cdot 0 = 0$ | $A + 1 = 1$ |
| Idempotence | $A \\cdot A = A$ | $A + A = A$ |
| Complément | $A \\cdot \\bar{A} = 0$ | $A + \\bar{A} = 1$ |

## Commutativité / associativité / distributivité

- $A + B = B + A$, $A \\cdot B = B \\cdot A$
- $(A + B) + C = A + (B + C)$
- $A \\cdot (B + C) = A \\cdot B + A \\cdot C$
- **Dualité** : $A + B \\cdot C = (A + B) \\cdot (A + C)$ (OR se distribue aussi sur AND — différent de l'arithmétique classique !)

## Absorption

- $A + A \\cdot B = A$
- $A \\cdot (A + B) = A$

## De Morgan (rappel)

- $\\overline{A \\cdot B} = \\bar{A} + \\bar{B}$
- $\\overline{A + B} = \\bar{A} \\cdot \\bar{B}$

## Stratégie de simplification

1. Appliquer De Morgan pour ramener les négations vers les variables.
2. Utiliser absorption et complément pour éliminer des termes.
3. Factoriser.

> [!example]
> $F = AB + A\\bar{B}$
> Factorisation : $F = A(B + \\bar{B}) = A \\cdot 1 = A$.

## Tableaux de Karnaugh

Alternative visuelle pour simplifier : on groupe les 1 adjacents en rectangles de taille $2^k$ pour lire directement une forme minimale.`,
      },
    ],
    exercises: [
      {
        type: "formula",
        difficulty: 2,
        question_md: "Simplifie $AB + A\\bar{B}$.",
        data: {
          expected_latex: "A",
          equivalent_forms: ["a"],
        },
        explanation_md:
          "Factorisation : $A(B + \\bar{B}) = A \\cdot 1 = A$.",
      },
      {
        type: "formula",
        difficulty: 2,
        question_md: "Simplifie $A + AB$ (loi d'absorption).",
        data: {
          expected_latex: "A",
          equivalent_forms: ["a"],
        },
        explanation_md:
          "Absorption : $A + AB = A(1 + B) = A \\cdot 1 = A$. $A$ seul absorbe tout ce qui le contient.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Que vaut $A \\cdot \\bar{A}$ ?",
        data: { choices: ["$A$", "$\\bar{A}$", "$0$", "$1$"], answer: 2 },
        explanation_md:
          "$A$ et $\\bar{A}$ ne peuvent pas être simultanément à 1, donc leur AND vaut toujours 0. Loi du complément.",
      },
      {
        type: "mcq",
        difficulty: 3,
        question_md: "Lequel est égal à $(A + B)(A + \\bar{B})$ ?",
        data: {
          choices: ["$A$", "$B$", "$A \\cdot B$", "$A + B$"],
          answer: 0,
        },
        explanation_md:
          "Développer : $AA + A\\bar{B} + BA + B\\bar{B} = A + A\\bar{B} + AB + 0 = A(1 + \\bar{B} + B) = A$.",
      },
      {
        type: "formula",
        difficulty: 3,
        question_md: "Simplifie $\\bar{A}B + A\\bar{B} + AB$.",
        data: {
          expected_latex: "A + B",
          equivalent_forms: ["B + A", "a+b", "b+a"],
        },
        explanation_md:
          "Dédoubler $AB$ : $\\bar{A}B + AB + A\\bar{B} + AB = B(\\bar{A}+A) + A(\\bar{B}+B) = B + A$.",
      },
    ],
    flashcards: [
      {
        front_md: "Loi d'absorption",
        back_md: "$A + A \\cdot B = A$ et $A \\cdot (A + B) = A$",
        tags: ["boole"],
      },
      {
        front_md: "Loi du complément",
        back_md: "$A \\cdot \\bar{A} = 0$ et $A + \\bar{A} = 1$",
        tags: ["boole"],
      },
      {
        front_md: "Particularité de la distributivité booléenne (vs arithmétique)",
        back_md:
          "OR se distribue aussi sur AND : $A + BC = (A+B)(A+C)$. Pas vrai en arithmétique !",
        tags: ["boole"],
      },
    ],
  },
];
