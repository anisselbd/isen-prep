import type { TopicContent } from "./types";

export const ELECTRONIQUE_CONTENT: TopicContent[] = [
  // ==========================================================================
  // Portes logiques
  // ==========================================================================
  {
    topic_id: "electronique.num.portes",
    lessons: [
      {
        title: "Portes logiques : les briques de tout circuit numérique",
        estimated_minutes: 14,
        content_md: `## Pourquoi tu dois maîtriser ça

**Absolument tout** ce qui est numérique — ton ordinateur, ton smartphone, une box internet, une puce d'identification, une IA — est construit à partir de **portes logiques** combinées entre elles. Un processeur moderne contient **des dizaines de milliards** de portes. Les comprendre, c'est comprendre la brique élémentaire du monde numérique. Le jury ISEN va te tester sur les six portes de base, leurs tables de vérité, et probablement te faire combiner deux portes pour produire une fonction donnée. Sans cette maîtrise, pas d'archi machine, pas de VHDL, pas de programmation bas niveau.

> [!note]
> **Ce qu'il faut savoir avant** : deux valeurs seulement, **0** et **1** (bit = binary digit). Le 0 représente **faux** (ou "pas de courant", ou "0 V") ; le 1 représente **vrai** (ou "courant", ou "5 V" ou "3,3 V" selon la famille logique). Aucune valeur intermédiaire autorisée — c'est ce qui rend le numérique robuste au bruit comparé à l'analogique.

## L'idée intuitive

Une porte logique, c'est une **mini-fonction** à 1 ou 2 entrées (qui valent 0 ou 1) et 1 sortie (qui vaut 0 ou 1 aussi). Elle calcule une règle fixe, genre "la sortie est 1 **si et seulement si** les deux entrées sont 1". Chaque porte est donc une **règle booléenne** réalisée physiquement par quelques transistors.

En empilant des millions de ces petites boîtes les unes à la suite des autres, on construit des opérateurs plus complexes : un **additionneur** (qui ajoute deux nombres binaires), un **multiplexeur** (qui choisit une entrée parmi plusieurs), un **registre** (qui mémorise un bit). Puis des **ALU**, des **caches**, des **processeurs**. Toute cette hiérarchie part de 6 petites portes que tu vas apprendre maintenant.

## Les six portes de base

### NOT (inverseur)

Une seule entrée. Sortie = inverse de l'entrée. Notation : $\\bar{A}$ ou $\\lnot A$.

| $A$ | $\\bar{A}$ |
|-----|-----------|
| 0 | 1 |
| 1 | 0 |

### AND (ET logique)

Sortie = 1 **si et seulement si les deux entrées sont 1**. Notation : $A \\cdot B$ (le point du "et" logique, à ne pas confondre avec la multiplication — mais étonnamment, en binaire, c'est **pareil** : $0 \\cdot 0 = 0$, $0 \\cdot 1 = 0$, $1 \\cdot 1 = 1$).

| $A$ | $B$ | $A \\cdot B$ |
|-----|-----|-------------|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | **1** |

### OR (OU logique)

Sortie = 1 **si au moins une entrée est 1**. Notation : $A + B$.

| $A$ | $B$ | $A + B$ |
|-----|-----|---------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

Attention : c'est un "ou inclusif" (1 ou 1 = 1, pas 2).

### XOR (OU exclusif)

Sortie = 1 **si exactement une entrée est 1** (pas les deux). Notation : $A \\oplus B$.

| $A$ | $B$ | $A \\oplus B$ |
|-----|-----|---------------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | **0** |

C'est le "ou" du langage courant ("fromage ou dessert" sous-entend un choix, pas les deux). Très utilisé en crypto, parité, additionneurs binaires.

### NAND (NOT AND)

Sortie = **inverse** de AND. Notation : $\\overline{A \\cdot B}$.

| $A$ | $B$ | $\\overline{A \\cdot B}$ |
|-----|-----|-------------------------|
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | **0** |

### NOR (NOT OR)

Sortie = **inverse** de OR. Notation : $\\overline{A + B}$.

| $A$ | $B$ | $\\overline{A + B}$ |
|-----|-----|---------------------|
| 0 | 0 | **1** |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 0 |

## L'universalité de NAND (et NOR)

Propriété **cruciale** à connaître : la porte **NAND** (ou **NOR**) est **universelle** — on peut construire n'importe quelle autre porte en utilisant **uniquement** des NAND (ou uniquement des NOR).

**Exemple pour le NOT :** $\\overline{A} = \\overline{A \\cdot A} = $ NAND$(A, A)$ (on connecte $A$ sur les deux entrées d'un NAND).

**Exemple pour le AND** : $A \\cdot B = \\overline{\\overline{A \\cdot B}} = $ NOT(NAND$(A, B)$) $= $ NAND(NAND$(A, B)$, NAND$(A, B)$).

**Pourquoi c'est utile** : dans une fonderie de puces, on n'imprime **qu'un seul type de porte** (souvent NAND) et on en fait des millions. Ça simplifie énormément la production, ça ne coûte que 4 transistors par NAND en techno CMOS.

> [!example]
> **Trois exercices-type.**
>
> **(a) Calcul direct.** $A = 1$, $B = 0$. Que vaut $A \\cdot B$, $A + B$, $A \\oplus B$ ?
> - $A \\cdot B = 1 \\cdot 0 = 0$.
> - $A + B = 1 + 0 = 1$.
> - $A \\oplus B = 1 \\oplus 0 = 1$ (exactement une entrée à 1).
>
> **(b) Sortie d'un NAND.** $A = 1$, $B = 1$.
> - $A \\cdot B = 1$ ; NAND = NOT(AND) = NOT($1$) = **0**.
>
> **(c) Composer deux portes.** On veut $Y = \\overline{A} \\cdot B$ (A NOT puis AND). Donne la sortie pour $A = 0, B = 1$.
> - $\\overline{A} = \\overline{0} = 1$.
> - $\\overline{A} \\cdot B = 1 \\cdot 1 = 1$.
> - Donc $Y = 1$.
>
> **(d) Décomposer AND en NAND.** Construis AND en utilisant seulement des NAND.
> - Rappel : NAND$(A, B) = \\overline{A \\cdot B}$. Donc pour inverser ce résultat et retrouver $A \\cdot B$, on applique NOT via NAND(X, X).
> - Étape 1 : $X = $ NAND$(A, B) = \\overline{A \\cdot B}$.
> - Étape 2 : NAND$(X, X) = \\overline{X \\cdot X} = \\overline{X} = \\overline{\\overline{A \\cdot B}} = A \\cdot B$. ✓
> - Conclusion : $A \\cdot B = $ NAND(NAND$(A, B)$, NAND$(A, B)$).

> [!warning]
> **Pièges fréquents.**
>
> - **Confondre OR et XOR** dans la vie courante. "Fromage ou dessert" du menu = XOR (un seul). "Je veux un café ou un thé" en disant oui aux deux = OR. En logique numérique, $A + B$ (OR) vaut 1 quand les deux sont à 1 ; XOR vaut 0 dans ce cas.
> - **Oublier le "tilde" du NOT** quand on écrit à la main — $\\bar{A}$ (barre au-dessus) change totalement l'équation. Tu peux aussi noter $A'$ (apostrophe) ou $\\lnot A$.
> - **Mélanger notations AND** : $A \\cdot B$, $A \\wedge B$, $AB$ (juxtaposition) sont trois écritures équivalentes. En équations, le $\\cdot$ est souvent omis comme en maths ($AB$ = $A$ AND $B$).
> - **Confondre "logique" et "arithmétique"**. En logique booléenne, $1 + 1 = 1$ (OR). En arithmétique binaire, $1 + 1 = 10$ (binaire 2). **Contexte important** — savoir dans quel régime on est.
> - **Porte à 3 entrées**. Certaines portes existent en version à 3 ou 4 entrées (AND à 3 entrées = 1 ssi les 3 sont à 1). La table a alors $2^3 = 8$ lignes, pas 4.

## À quoi ça sert en pratique

- **Construction d'additionneurs** : un "demi-additionneur" = XOR (somme) + AND (retenue).
- **Multiplexeurs et démultiplexeurs** : sélectionner une entrée parmi plusieurs selon des bits de sélection — que des AND + OR + NOT.
- **Décodeurs d'adresses** (mémoire, I/O) : ensemble de portes AND pour activer une cellule précise.
- **Cryptographie symétrique** : le XOR est la brique de base des chiffrements par flux (one-time pad, RC4).
- **CPU** : chaque instruction (ADD, AND, OR, SHIFT) est réalisée physiquement par des combinaisons de portes dans l'ALU.

> [!tip]
> **Mémo visuel.** AND = un **"et"** (tous les deux doivent être vrais). OR = un **"ou"** large (au moins un). XOR = "ou exclusif" (un seul, pas les deux). NAND = **Not AND**. NOR = **Not OR**. Si tu connais AND, OR et NOT, les trois autres sont des dérivées, pas besoin de mémoriser séparément.

> [!colibrimo]
> En pur soft, tu utilises AND (\`&&\`) et OR (\`||\`) tous les jours — la **même** logique booléenne, exprimée en TypeScript. Le XOR (\`^\` sur entiers en JS) sert pour le **bitmasking**, les **feature flags**, et la crypto côté service. Comprendre les portes physiques te donne un modèle mental propre pour raisonner sur les ***flags*** et les combinaisons de conditions complexes dans ton code.`,
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
        title: "Tables de vérité : lister tous les cas pour spécifier une fonction",
        estimated_minutes: 14,
        content_md: `## Pourquoi tu dois maîtriser ça

Une **table de vérité** est la façon **la plus claire et exhaustive** de décrire une fonction logique. Elle liste **tous les cas possibles** d'entrées et la sortie associée. C'est l'outil qu'utilisent les électroniciens pour **spécifier** un circuit avant de le concevoir, et qu'utilisent les informaticiens pour **vérifier** qu'une expression booléenne est correcte. Le jury te demandera systématiquement de (1) construire une table de vérité à partir d'une équation, ou (2) extraire une équation à partir d'une table. C'est un exercice mécanique, ce qui signifie : **aucune excuse pour se planter** — tu gagnes des points automatiquement si tu connais la méthode.

> [!note]
> **Ce qu'il faut savoir avant** : les **portes logiques** de base (AND, OR, NOT, XOR, chapitre précédent). Tu dois être à l'aise avec les notations $\\bar{A}$ (NOT A), $A \\cdot B$ (AND), $A + B$ (OR). La notion de **combinaison d'entrées** (pour $n$ entrées, il y a $2^n$ combinaisons possibles).

## L'idée intuitive

Une fonction logique avec $n$ entrées et 1 sortie est comme une **boîte noire** : pour chaque combinaison d'entrées, elle renvoie 0 ou 1. Puisqu'il n'y a que deux valeurs par entrée, le nombre total de combinaisons à lister est **fini** : $2^n$.

- 1 entrée → 2 combinaisons (0 et 1).
- 2 entrées → 4 combinaisons.
- 3 entrées → 8 combinaisons.
- 4 entrées → 16 combinaisons.

La table de vérité est juste **le tableau exhaustif** de toutes ces combinaisons, avec la sortie associée à chaque ligne.

Contrairement à une équation qui peut cacher des subtilités (signes, priorités), la table est **sans ambiguïté** : on lit directement la valeur de sortie pour chaque entrée. C'est **la représentation de référence** d'une fonction booléenne.

## Méthode : construire une table de vérité à partir d'une équation

1. **Compter les entrées.** Dans l'équation, repère toutes les lettres distinctes ($A$, $B$, $C$...). Ça te donne $n$, et la table aura $2^n$ lignes.
2. **Créer les colonnes.** Une colonne par entrée, puis une colonne par sous-expression intermédiaire si l'équation est complexe, puis la colonne finale pour la sortie $F$.
3. **Lister les combinaisons.** Convention standard : on compte en binaire de 0 à $2^n - 1$. Pour 3 entrées $A, B, C$, on écrit $000, 001, 010, 011, 100, 101, 110, 111$. L'entrée la plus à gauche est le bit de **poids fort**.
4. **Calculer ligne par ligne.** Pour chaque ligne, applique l'équation avec les valeurs d'entrée.
5. **Relire et vérifier** les cas extrêmes (tout à 0, tout à 1) : la sortie est-elle cohérente avec ce qu'on attendait ?

### Exemple complet : $F = A \\cdot \\bar{B} + B \\cdot C$

Trois entrées ($A$, $B$, $C$), donc $2^3 = 8$ lignes.

| $A$ | $B$ | $C$ | $A \\cdot \\bar{B}$ | $B \\cdot C$ | $F$ |
|-----|-----|-----|--------------------|--------------|-----|
| 0 | 0 | 0 | 0 | 0 | **0** |
| 0 | 0 | 1 | 0 | 0 | **0** |
| 0 | 1 | 0 | 0 | 0 | **0** |
| 0 | 1 | 1 | 0 | 1 | **1** |
| 1 | 0 | 0 | 1 | 0 | **1** |
| 1 | 0 | 1 | 1 | 0 | **1** |
| 1 | 1 | 0 | 0 | 0 | **0** |
| 1 | 1 | 1 | 0 | 1 | **1** |

**Détail ligne par ligne** pour les cas intéressants :
- Ligne $A=0, B=1, C=1$ : $A \\cdot \\bar{B} = 0 \\cdot 0 = 0$. $B \\cdot C = 1 \\cdot 1 = 1$. Somme : $0 + 1 = 1$.
- Ligne $A=1, B=0, C=0$ : $A \\cdot \\bar{B} = 1 \\cdot 1 = 1$. $B \\cdot C = 0$. Somme : $1 + 0 = 1$.
- Ligne $A=1, B=1, C=0$ : $A \\cdot \\bar{B} = 1 \\cdot 0 = 0$. $B \\cdot C = 1 \\cdot 0 = 0$. Somme : $0$. Sortie à 0 donc.

## Méthode inverse : construire une équation à partir d'une table

Si on te donne une table et tu dois écrire l'équation, utilise la **forme canonique disjonctive** (somme de minterms, en abrégé **SOP** = Sum of Products).

**Définition d'un minterm.** Pour une ligne donnée de la table, le minterm est le **produit (AND)** des entrées, où chaque entrée apparaît **normale** (si elle vaut 1) ou **complémentée** (si elle vaut 0). Exemple pour $A=1, B=0, C=1$ : minterm $= A \\cdot \\bar{B} \\cdot C$.

**Règle.** $F$ = la **somme (OR)** des minterms correspondant aux lignes où $F = 1$.

**Application à l'exemple précédent.** Les lignes où $F = 1$ sont :
- $A=0, B=1, C=1$ → minterm $\\bar{A} B C$
- $A=1, B=0, C=0$ → minterm $A \\bar{B} \\bar{C}$
- $A=1, B=0, C=1$ → minterm $A \\bar{B} C$
- $A=1, B=1, C=1$ → minterm $A B C$

Donc la forme canonique disjonctive est :
$$F = \\bar{A} B C + A \\bar{B} \\bar{C} + A \\bar{B} C + A B C$$

Cette équation **donne exactement la même table** que $F = A \\bar{B} + BC$, mais elle est **plus longue**. On peut la simplifier (Karnaugh, algèbre de Boole — chapitres suivants).

> [!example]
> **Trois exercices typiques.**
>
> **(a) Évaluer une expression.** $F = A \\cdot \\bar{B} + B$ pour $A = 0, B = 1$.
> - $A \\cdot \\bar{B} = 0 \\cdot \\bar{1} = 0 \\cdot 0 = 0$.
> - $B = 1$.
> - Somme OR : $0 + 1 = 1$. Donc $F = 1$.
>
> **(b) Nombre de lignes.** Fonction à 5 entrées ?
> - $2^5 = 32$ lignes.
>
> **(c) Construire une équation à partir d'une table.**
> Table donnée : $F(A,B)$ avec $F = 1$ pour $(A,B) \\in \\{(0,1), (1,0)\\}$ et $F = 0$ ailleurs.
> - Minterm pour $(0, 1)$ : $\\bar{A} \\cdot B$.
> - Minterm pour $(1, 0)$ : $A \\cdot \\bar{B}$.
> - Équation : $F = \\bar{A} B + A \\bar{B}$.
> - Reconnaissance : c'est **exactement** XOR ! $F = A \\oplus B$.

> [!warning]
> **Pièges classiques.**
>
> - **Se tromper sur le nombre de lignes.** $2^n$, pas $2n$. Avec 4 entrées, c'est 16 lignes, pas 8.
> - **Oublier l'ordre des bits.** Par convention, on liste en binaire croissant : 000, 001, 010, 011... Ne pas mettre $C$ à gauche si tu as annoncé "A, B, C" en-têtes.
> - **Confondre minterm et maxterm.** **Minterm** = produit où chaque variable apparaît (AND), on prend les lignes $F = 1$ et on fait une **somme**. **Maxterm** = somme (OR), on prend les lignes $F = 0$ et on fait un **produit**. Les deux formes sont valides, choisis minterms par défaut (plus intuitif).
> - **Oublier la négation $\\bar{}$.** Dans un minterm, une entrée qui vaut 0 dans la ligne apparaît avec la barre : $A=0 \\to \\bar{A}$. Beaucoup oublient cette barre et écrivent juste $A$.
> - **Se fatiguer à vérifier 100% de la table.** Réflexe : vérifie deux lignes au hasard à la fin. Si elles matchent, tu as probablement bien fait.

## À quoi ça sert en pratique

- **Spécifier un circuit** avant de le concevoir : l'ingé définit le comportement attendu par une table, puis la décompose en portes.
- **Prouver l'équivalence** de deux expressions : si deux équations ont la même table, elles sont logiquement identiques (utile pour simplifier).
- **Tester exhaustivement** une logique : une table sert de **oracle** pour vérifier qu'un circuit réel (ou un code) produit la bonne sortie.
- **Conception de systèmes combinatoires** : additionneurs, décodeurs, multiplexeurs — tous partent d'une table de vérité.
- **Vérification formelle** en soft : les outils de model checking explorent les tables de vérité de fonctions booléennes pour prouver des propriétés.

> [!tip]
> **Méthode express.** Pour une fonction à 2 ou 3 entrées, tu peux dresser la table de vérité **de tête** en 30 secondes. Entraîne-toi sur des expressions simples ($A + \\bar{B}$, $A \\oplus B \\oplus C$, etc.) jusqu'à ce que ça devienne un réflexe. En jury, c'est un gain de points immédiat.

> [!colibrimo]
> Les tables de vérité sont l'équivalent bas niveau des **tests unitaires** exhaustifs : "pour chaque cas possible, voici la sortie attendue". Sur Colibrimo, quand on spécifie le comportement d'une règle métier (ex : "un chantier est éligible si statut=actif ET au moins 3 devis validés OU contrat signé"), écrire mentalement la table de vérité évite les bugs de priorité d'opérateurs logiques dans le code.`,
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
        title: "Lois de De Morgan : distribuer la négation à travers AND et OR",
        estimated_minutes: 13,
        content_md: `## Pourquoi tu dois maîtriser ça

Les lois de De Morgan sont **deux identités** qui permettent de transformer une expression booléenne en une forme équivalente mais **plus pratique**. Elles sont **utilisées en permanence** pour : (1) **simplifier** des équations complexes, (2) **traduire** un circuit fait de NAND en circuit OR+NOT (et réciproquement), (3) **réécrire une condition** négative en forme positive dans du code. C'est la deuxième loi la plus utilisée après les identités de base (AND, OR, NOT). Le jury adore faire un exercice "simplifie $\\overline{A \\cdot B} + A$" où la bonne réponse s'obtient avec De Morgan en 3 lignes. Refuse-la, et tu peines 10 minutes.

> [!note]
> **Ce qu'il faut savoir avant** : les **portes logiques** (AND, OR, NOT) et leurs **tables de vérité**. Tu dois être à l'aise avec la notation $\\bar{A}$ et les parenthèses qui délimitent une négation "globale" vs "locale". Savoir qu'en logique, **deux expressions sont équivalentes si elles ont la même table de vérité**.

## L'idée intuitive

Tu as une phrase en français du type : *"Ce n'est pas vrai que j'aime le café **ET** le thé."* Qu'est-ce que ça veut dire concrètement ? Réfléchis bien : ça **ne** veut **pas** dire "je n'aime **ni** le café **ni** le thé". Ça veut dire "il y en a au moins un que je n'aime pas" — soit pas le café, soit pas le thé (soit les deux). En logique :

$$\\text{NON}(\\text{aime café ET aime thé}) \\;=\\; \\text{N'aime pas café OU n'aime pas thé}$$

C'est **exactement** la première loi de De Morgan. De même, *"Je n'aime ni café ni thé"* ("ni...ni" = NOR) est équivalent à *"Je n'aime pas le café ET je n'aime pas le thé"* :

$$\\text{NON}(\\text{aime café OU aime thé}) \\;=\\; \\text{N'aime pas café ET n'aime pas thé}$$

C'est la deuxième loi. En français courant, on les applique déjà sans le savoir — De Morgan c'est juste la **version formelle** de ces intuitions.

## Les deux lois (formellement)

### Loi 1 : négation d'un AND

$$\\boxed{\\;\\overline{A \\cdot B} \\;=\\; \\bar{A} + \\bar{B}\\;}$$

**En mots** : "la négation d'un ET devient le OU des négations".

### Loi 2 : négation d'un OR

$$\\boxed{\\;\\overline{A + B} \\;=\\; \\bar{A} \\cdot \\bar{B}\\;}$$

**En mots** : "la négation d'un OU devient le ET des négations".

**Mnémotechnique** : "La barre **casse** le symbole, qui **se retourne**". La barre au-dessus de $A \\cdot B$ se "casse" en deux barres séparées (au-dessus de $A$ et au-dessus de $B$), et le $\\cdot$ devient $+$ (ou inversement).

## Vérification par table de vérité

Si un jour tu doutes, vérifie avec une table. Pour la loi 1 :

| $A$ | $B$ | $A \\cdot B$ | $\\overline{A \\cdot B}$ | $\\bar{A}$ | $\\bar{B}$ | $\\bar{A} + \\bar{B}$ |
|-----|-----|-------------|--------------------------|-----------|-----------|----------------------|
| 0 | 0 | 0 | **1** | 1 | 1 | **1** |
| 0 | 1 | 0 | **1** | 1 | 0 | **1** |
| 1 | 0 | 0 | **1** | 0 | 1 | **1** |
| 1 | 1 | 1 | **0** | 0 | 0 | **0** |

Les colonnes $\\overline{A \\cdot B}$ et $\\bar{A} + \\bar{B}$ sont **identiques** sur les 4 lignes — les deux expressions sont équivalentes.

## Généralisation à $n$ variables

Les lois s'étendent à autant d'entrées que tu veux :

$$\\overline{X_1 \\cdot X_2 \\cdots X_n} \\;=\\; \\bar{X_1} + \\bar{X_2} + \\cdots + \\bar{X_n}$$

$$\\overline{X_1 + X_2 + \\cdots + X_n} \\;=\\; \\bar{X_1} \\cdot \\bar{X_2} \\cdots \\bar{X_n}$$

**Règle pratique** : quand tu as une barre au-dessus d'une expression longue, tu peux la **faire pénétrer** en **inversant tous les opérateurs** et en **barrant chaque variable individuellement**.

## Usage : simplifier des expressions

De Morgan est souvent **l'étape d'ouverture** d'une simplification. Une fois la négation distribuée, d'autres identités de l'algèbre de Boole prennent le relais (notamment $A + \\bar{A} = 1$ et $A + 1 = 1$).

> [!example]
> **Trois transformations détaillées.**
>
> **(a) Application directe.** Donne l'équivalent de $\\overline{A + B}$.
> - De Morgan loi 2 : $\\overline{A + B} = \\bar{A} \\cdot \\bar{B}$.
>
> **(b) Simplification.** Simplifie $\\overline{A \\cdot B} + A$.
> - Loi 1 sur $\\overline{A \\cdot B}$ : $= \\bar{A} + \\bar{B} + A$.
> - Réorganiser : $= (A + \\bar{A}) + \\bar{B}$.
> - Identité $A + \\bar{A} = 1$ : $= 1 + \\bar{B}$.
> - Identité $1 + X = 1$ (absorption) : $= 1$.
> - **L'expression vaut 1 pour toutes les entrées** — autrement dit, c'est une **tautologie**.
>
> **(c) Double négation.** Simplifie $\\overline{\\overline{A + B}}$.
> - Loi 2 : $\\overline{A + B} = \\bar{A} \\cdot \\bar{B}$, donc $\\overline{\\overline{A + B}} = \\overline{\\bar{A} \\cdot \\bar{B}}$.
> - Loi 1 : $\\overline{\\bar{A} \\cdot \\bar{B}} = \\overline{\\bar{A}} + \\overline{\\bar{B}} = A + B$.
> - Ou plus court : **double négation** = identité. $\\overline{\\overline{X}} = X$. Donc $\\overline{\\overline{A + B}} = A + B$ directement.
>
> **(d) Transformation d'un NAND en OR de négations.** On veut implémenter $F = \\bar{A} + \\bar{B} + \\bar{C}$ avec une seule porte. D'après De Morgan :
> - $\\bar{A} + \\bar{B} + \\bar{C} = \\overline{A \\cdot B \\cdot C}$.
> - Donc $F$ s'obtient avec **une seule porte NAND à 3 entrées**, bien plus compacte que trois NOT suivis d'un OR.

> [!warning]
> **Pièges typiques.**
>
> - **Oublier d'inverser les opérateurs.** La barre **change** le AND en OR (et vice-versa). Si tu écris $\\overline{A \\cdot B} = \\bar{A} \\cdot \\bar{B}$ (en gardant le $\\cdot$), tu as **faux**. La barre casse **et** retourne le symbole.
> - **Faire De Morgan "à moitié".** Soit tu appliques la barre à **tous** les termes, soit à aucun. Écrire $\\overline{A \\cdot B + C} = \\bar{A} \\cdot \\bar{B} + \\bar{C}$ est faux — il faut aussi inverser le + externe, donc réappliquer : $\\overline{A \\cdot B + C} = \\overline{A \\cdot B} \\cdot \\bar{C} = (\\bar{A} + \\bar{B}) \\cdot \\bar{C}$.
> - **Confondre avec la distributivité.** $A \\cdot (B + C) = A B + AC$ est la distributivité, pas De Morgan. De Morgan ne s'active **que** quand il y a une **barre** qui englobe.
> - **Penser que $\\overline{A + B} = \\bar{A} + \\bar{B}$.** Non ! C'est la loi 2 qui dit le contraire : $\\overline{A + B} = \\bar{A} \\cdot \\bar{B}$. Le OU devient un ET sous la barre. Si tu gardes le même opérateur, tu t'es trompé.
> - **Ignorer les parenthèses.** $\\overline{A \\cdot B} + C$ ≠ $\\overline{A \\cdot B + C}$. La première est "(NOT AB) OR C", la seconde est "NOT (AB OR C)". La barre doit **couvrir** exactement ce sur quoi elle s'applique.

## À quoi ça sert en pratique

- **Simplifier des circuits** avant d'aller au matériel — moins de portes = moins de transistors = moins de surface silicium.
- **Transformer NAND ↔ OR de négations** : certaines technos intégrées ne fabriquent que des NAND, on convertit toutes les portes en NAND via De Morgan.
- **Réécrire des conditions en code**. \`if (!(user.isLoggedIn && user.isActive))\` devient \`if (!user.isLoggedIn || !user.isActive)\` — souvent **plus lisible**, et le compilateur ne voit pas de différence.
- **Requêtes SQL / filtres**. \`NOT (status = 'active' AND amount > 100)\` → \`status != 'active' OR amount <= 100\`. L'optimiseur peut mieux utiliser ses index sur la seconde forme.
- **Preuves formelles** : De Morgan est utilisé dans les solvers SAT et les outils de model checking pour normaliser les formules.

> [!tip]
> **Règle en or.** Quand tu vois **une barre longue** au-dessus d'une expression, ton premier réflexe doit être "je la fais pénétrer avec De Morgan". Ça simplifie 90% du temps, car les barres individuelles se combinent mieux avec les autres identités que les barres globales.

> [!colibrimo]
> Les **moteurs de règles** (filtres de recherche, règles d'éligibilité sur Colibrimo) utilisent De Morgan en arrière-plan pour **normaliser** les requêtes. Une règle métier comme "exclure les chantiers NON (actif ET validé)" est réécrite en "exclure les chantiers inactifs OU non validés", ce qui permet à l'optimiseur SQL d'attaquer chaque condition séparément avec un index spécifique.`,
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
        title: "Conversions : décimal ↔ binaire ↔ hexadécimal",
        estimated_minutes: 14,
        content_md: `## Pourquoi tu dois maîtriser ça

Un ordinateur ne "pense" qu'en **binaire** (0 et 1). Les humains raisonnent en **décimal** (base 10). Les ingés électroniciens et devs bas niveau utilisent énormément l'**hexadécimal** (base 16), parce qu'il compresse le binaire par 4 et se lit facilement (\`0xFF\` est plus rapide à lire que \`11111111\`). Savoir **naviguer entre ces trois bases** est **indispensable** dès que tu touches à : les adresses mémoire, les codes couleurs RGB (#FF5733), les masques de bits, les MAC addresses, les IPs en hexa pour IPv6, le debug d'un µC. Le jury ISEN te posera au minimum une conversion (souvent décimal → binaire), et attendra que tu connaisses les trois bases.

> [!note]
> **Ce qu'il faut savoir avant** : les **puissances de 2** de 0 à 10 par cœur ($2^0 = 1$, $2^1 = 2$, $2^2 = 4$, $2^3 = 8$, $2^4 = 16$, $2^5 = 32$, $2^6 = 64$, $2^7 = 128$, $2^8 = 256$, $2^9 = 512$, $2^{10} = 1024$). Idéalement aussi $2^{16} = 65\\,536$ et $2^{32} \\approx 4{,}3 \\cdot 10^9$. Et la notion de **position d'un chiffre** dans un nombre (en décimal, 237 = $2 \\cdot 100 + 3 \\cdot 10 + 7 \\cdot 1$).

## L'idée intuitive

Dans n'importe quelle base $b$, un nombre est la **somme pondérée** des chiffres par des puissances de $b$.

**En décimal (base 10)** : $237 = 2 \\cdot 10^2 + 3 \\cdot 10^1 + 7 \\cdot 10^0$. Chaque position, de droite à gauche, vaut $\\times 10$ de plus.

**En binaire (base 2)** : $1101_2 = 1 \\cdot 2^3 + 1 \\cdot 2^2 + 0 \\cdot 2^1 + 1 \\cdot 2^0 = 8 + 4 + 0 + 1 = 13$. Chaque position, de droite à gauche, vaut $\\times 2$ de plus.

**En hexadécimal (base 16)** : chiffres 0-9 puis A-F (A=10, B=11, ..., F=15). $A3_{16} = 10 \\cdot 16 + 3 = 163$. Chaque position vaut $\\times 16$ de plus.

**Tout est la même mécanique**, seule la base change. Une fois que tu as ce modèle mental, les conversions sont juste du calcul.

## Les trois bases

| Base | Chiffres utilisés | Exemple | Suffixe courant |
|------|-------------------|---------|-----------------|
| Décimale (10) | 0 1 2 3 4 5 6 7 8 9 | 237 | (aucun) ou $_{10}$ |
| Binaire (2) | 0 1 | 11101101 | $_2$ ou \`0b\` préfixe |
| Hexadécimale (16) | 0 1 2 3 4 5 6 7 8 9 A B C D E F | ED | $_{16}$ ou \`0x\` préfixe |

**Correspondances à connaître par cœur** (elles reviennent constamment) :

| Décimal | Binaire (4 bits) | Hexa |
|---------|-------------------|------|
| 0 | 0000 | 0 |
| 1 | 0001 | 1 |
| 2 | 0010 | 2 |
| 3 | 0011 | 3 |
| 4 | 0100 | 4 |
| 5 | 0101 | 5 |
| 6 | 0110 | 6 |
| 7 | 0111 | 7 |
| 8 | 1000 | 8 |
| 9 | 1001 | 9 |
| 10 | 1010 | **A** |
| 11 | 1011 | **B** |
| 12 | 1100 | **C** |
| 13 | 1101 | **D** |
| 14 | 1110 | **E** |
| 15 | 1111 | **F** |

## Décimal → Binaire (division successive)

**Méthode** : diviser par 2, noter le **reste** (qui vaut 0 ou 1), recommencer avec le quotient. Le nombre binaire se lit **de bas en haut** (ou : dernier reste = bit de poids fort).

**Exemple : 13 en binaire.**
- $13 \\div 2 = 6$ reste **1**.
- $6 \\div 2 = 3$ reste **0**.
- $3 \\div 2 = 1$ reste **1**.
- $1 \\div 2 = 0$ reste **1**.
- Lu de bas en haut : $1101_2$.

**Méthode alternative (soustraction)** : soustraire les puissances de 2 les plus grandes qui rentrent. Pour 13 : 13 ≥ 8 → bit 8=1, reste 5. 5 ≥ 4 → bit 4=1, reste 1. 1 < 2 → bit 2=0. 1 ≥ 1 → bit 1=1, reste 0. Donc $13 = 1101_2$.

## Binaire → Décimal (somme pondérée)

**Méthode** : additionner les puissances de 2 là où le bit vaut 1.

**Exemple : $1101_2$ en décimal.**
- Bit de poids fort à gauche. Positions (de droite à gauche) : $2^0 = 1$, $2^1 = 2$, $2^2 = 4$, $2^3 = 8$.
- $1101_2 = 1 \\cdot 8 + 1 \\cdot 4 + 0 \\cdot 2 + 1 \\cdot 1 = 8 + 4 + 1 = 13$.

## Binaire → Hexadécimal (par groupes de 4)

**Méthode (ultra-rapide)** : grouper les bits **par 4 à partir de la droite**, convertir chaque groupe avec le tableau ci-dessus.

**Exemple : $10110101_2$ en hexa.**
- Groupes de 4 : $1011\\ 0101$.
- $1011_2 = 11 = $ **B** (table).
- $0101_2 = 5$ (table).
- Résultat : $B5_{16}$.

**Si le nombre de bits n'est pas multiple de 4** : complète à gauche par des 0. Exemple : $10101_2 \\to 0001\\ 0101 \\to 15_{16}$.

## Hexadécimal → Binaire (inverse)

**Méthode** : chaque chiffre hexa devient 4 bits.

**Exemple : $2F3_{16}$ en binaire.**
- $2 = 0010$, $F = 1111$, $3 = 0011$.
- $2F3_{16} = 0010\\ 1111\\ 0011 = 001011110011_2$.

## Hexadécimal → Décimal (somme pondérée)

**Méthode** : additionner chaque chiffre × puissance de 16.

**Exemple : $A3_{16}$ en décimal.**
- $A = 10$, $3 = 3$.
- $A3_{16} = 10 \\cdot 16^1 + 3 \\cdot 16^0 = 160 + 3 = 163$.

**Exemple : $FF_{16}$ en décimal** (archi-classique, à connaître).
- $F \\cdot 16 + F = 15 \\cdot 16 + 15 = 240 + 15 = 255$.
- $FF_{16} = 255_{10}$ = **un octet max** (8 bits tous à 1).

## Décimal → Hexadécimal

**Méthode** : diviser par 16 successivement, lire les restes de bas en haut.

**Exemple : 163 en hexa.**
- $163 \\div 16 = 10$ reste **3**.
- $10 \\div 16 = 0$ reste **10** = **A**.
- Lu de bas en haut : **A3**.

**Alternative via binaire** : convertir en binaire, puis grouper par 4.

> [!example]
> **Trois conversions détaillées.**
>
> **(a) Décimal → binaire.** $50_{10}$ ?
> - $50 / 2 = 25$ reste **0**.
> - $25 / 2 = 12$ reste **1**.
> - $12 / 2 = 6$ reste **0**.
> - $6 / 2 = 3$ reste **0**.
> - $3 / 2 = 1$ reste **1**.
> - $1 / 2 = 0$ reste **1**.
> - Lu de bas en haut : $110010_2$.
> - Vérif : $32 + 16 + 2 = 50$ ✓.
>
> **(b) Binaire → hexa.** $11100010_2$ ?
> - Groupes de 4 depuis la droite : $1110\\ 0010$.
> - $1110 = 14 = $ **E**, $0010 = 2$.
> - Résultat : $E2_{16}$.
>
> **(c) Hexa → décimal.** $2B_{16}$ ?
> - $B = 11$. $2B = 2 \\cdot 16 + 11 = 32 + 11 = 43$.

> [!warning]
> **Pièges classiques.**
>
> - **Lire les restes dans le mauvais sens.** En décimal → binaire, le **premier reste** est le **bit de poids faible** (droite), le **dernier reste** est le **bit de poids fort** (gauche). On lit **de bas en haut**.
> - **Oublier la correspondance A-F.** A=10, B=11, C=12, D=13, E=14, F=15. Ça doit devenir un réflexe.
> - **Grouper par 4 dans le mauvais sens.** En binaire → hexa, on groupe **à partir de la droite**, pas de la gauche. Sinon le résultat est faux.
> - **Confondre $2^n$ et $n^2$.** $2^8 = 256$, pas 64. $10^2 = 100$, pas $2^{10}$.
> - **Oublier le suffixe / préfixe.** En code, $0xFF$ (C/Python/JS) vaut 255, mais $FF$ sans préfixe peut être interprété comme un identifiant textuel, pas un nombre.

## À quoi ça sert en pratique

- **Adresses mémoire** : 0x7FFE1234 (hexa = compact), immédiatement convertible en 32 bits binaires par groupes.
- **Couleurs RGB** : \`#FF5733\` = RGB(255, 87, 51). Chaque composante est un octet (8 bits = 2 chiffres hexa).
- **Masques de bits** (flags, permissions) : \`0x0F\` = 00001111, active les 4 bits de poids faible.
- **Nombre max** représentable sur $n$ bits : $2^n - 1$. Octet : $2^8 - 1 = 255 = \\text{FF}_{16}$. Entier 32 bits non signé : $2^{32} - 1 \\approx 4{,}29 \\cdot 10^9$.
- **Calcul de tailles mémoire** : 1 kB = $2^{10}$ = 1024 octets. 1 MB = $2^{20}$. 1 GB = $2^{30}$.

> [!tip]
> **Mémo visuel.** Associe mentalement :
> - 1 octet = 8 bits = 2 chiffres hexa = 0 à 255 = 0x00 à 0xFF.
> - Mot de 16 bits = 4 chiffres hexa = 0 à 65 535 = 0x0000 à 0xFFFF.
> - Mot de 32 bits = 8 chiffres hexa = 0 à ~4 milliards.
>
> Ces trois correspondances couvrent 95% de ce dont tu as besoin en tête.

> [!colibrimo]
> Tu utilises les conversions **tous les jours** en dev : couleurs CSS (\`#FF5733\`), adresses IP (IPv6 en hexa), masques de bits dans les permissions / feature flags, debug de buffers binaires, tokens JWT encodés en base64 (qui est une base 64, même logique). Maîtriser ça te fait gagner du temps sur tout ce qui touche au bas niveau.`,
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
        title: "Algèbre de Boole : simplifier des équations logiques",
        estimated_minutes: 15,
        content_md: `## Pourquoi tu dois maîtriser ça

Une équation booléenne brute (issue d'une table de vérité par exemple) peut être **très longue**. Chaque opérateur supplémentaire, c'est une porte de plus dans le circuit → plus de transistors → plus de surface silicium → plus de consommation. **Simplifier** une expression pour arriver à sa forme minimale est **un savoir-faire économique fondamental** en conception numérique. L'algèbre de Boole te donne les **règles** pour faire ça. Le jury pose des exercices du type "simplifie $A + AB$" où la bonne réponse est $A$ (loi d'absorption) — et il te teste sur la **connaissance des lois** et ta **rapidité** à les reconnaître. C'est aussi utile en soft : simplifier une condition \`if\` complexe avant de la coder.

> [!note]
> **Ce qu'il faut savoir avant** : les **portes logiques** (AND, OR, NOT), les **tables de vérité**, et les **lois de De Morgan** (chapitres précédents). L'algèbre de Boole est bâti dessus et les utilise continuellement.

## L'idée intuitive

L'algèbre de Boole, c'est comme l'algèbre "normale" (celle qu'on fait sur les nombres réels), **mais avec deux particularités** :

1. Les variables ne prennent que **deux valeurs** : 0 ou 1.
2. Les opérations sont **AND** ($\\cdot$), **OR** ($+$) et **NOT** ($\\bar{}$), pas les + − × / classiques.

Le génie de Boole (1854) a été de montrer que ces opérations suivent **des règles** analogues à l'algèbre classique (commutativité, associativité, distributivité), **mais avec des lois supplémentaires spécifiques au 0/1** qui permettent des simplifications spectaculaires. Par exemple : $A + A = A$ (en algèbre normale, ce serait $2A$). Ou $A + \\bar{A} = 1$ (en algèbre normale, ça n'a pas d'analogue direct).

Ces règles te permettent de **transformer** une expression en une autre équivalente mais **plus courte**, jusqu'à atteindre une forme "minimale".

## Les 12 lois à connaître

### Identités de base (éléments neutres et absorbants)

| Loi | Pour le AND | Pour le OR |
|-----|-------------|-------------|
| Identité | $A \\cdot 1 = A$ | $A + 0 = A$ |
| Annulation | $A \\cdot 0 = 0$ | $A + 1 = 1$ |
| Idempotence | $A \\cdot A = A$ | $A + A = A$ |
| Complément | $A \\cdot \\bar{A} = 0$ | $A + \\bar{A} = 1$ |

**Lecture pratique** : "$A \\cdot 1 = A$" se lit "un AND avec 1 ne change rien à A". "$A + 1 = 1$" : un OR avec 1 sature à 1. "$A + \\bar{A} = 1$" est la plus utilisée — **une variable OR sa négation vaut toujours 1** (une des deux est forcément vraie, c'est tautologique).

### Commutativité, associativité, distributivité

- **Commutativité** : $A + B = B + A$ et $A \\cdot B = B \\cdot A$. L'ordre ne compte pas.
- **Associativité** : $(A + B) + C = A + (B + C)$, idem pour AND. Les parenthèses se déplacent.
- **Distributivité du AND sur le OR** : $A \\cdot (B + C) = A B + A C$. Classique, comme en algèbre normale.
- **Distributivité du OR sur le AND** (spécifique au booléen !) : $A + (B \\cdot C) = (A + B) \\cdot (A + C)$. **Attention** : en maths normales ce n'est pas vrai. En Boole, si. C'est la dualité parfaite AND/OR.

### Lois d'absorption

$$A + A \\cdot B = A$$

$$A \\cdot (A + B) = A$$

**Intuition** : "j'ai $A$ seul **ou** $A$ avec $B$. Dans les deux cas où c'est vrai, $A$ est vrai, donc ça se résume à $A$." Ces lois **absorbent** un terme complet.

### De Morgan (rappel)

$$\\overline{A \\cdot B} = \\bar{A} + \\bar{B} \\qquad \\overline{A + B} = \\bar{A} \\cdot \\bar{B}$$

## Stratégie de simplification (ordre à suivre)

Quand tu te retrouves face à une expression à simplifier :

1. **Appliquer De Morgan** pour faire pénétrer toutes les négations jusqu'aux variables. But : ne plus avoir de barre "longue" au-dessus d'un groupe.
2. **Regrouper les termes identiques** (idempotence, complément). Parfois ça en élimine toute une partie.
3. **Factoriser** (distributivité à l'envers) pour mettre en évidence des termes comme $B + \\bar{B} = 1$.
4. **Appliquer l'absorption** quand tu vois un $A + AB$ ou $A (A + B)$.
5. **Utiliser $+ 1 = 1$ ou $\\cdot 0 = 0$** pour supprimer des sous-expressions devenues constantes.

Ce n'est **pas** linéaire : parfois tu dois tester 2-3 pistes. La pratique fait le réflexe.

> [!example]
> **Quatre simplifications détaillées.**
>
> **(a) Factorisation + complément.** $F = AB + A\\bar{B}$.
> - Factoriser $A$ : $F = A(B + \\bar{B})$.
> - $B + \\bar{B} = 1$ : $F = A \\cdot 1 = A$.
> - **Conclusion** : $F = A$. **L'expression dépendait que de $A$**, $B$ était cosmétique.
>
> **(b) Absorption directe.** $F = A + AB$.
> - Absorption : $A + AB = A$. Point.
> - Vérif table : $(A=0, B=0) \\to 0$, $(A=0, B=1) \\to 0$, $(A=1, B=0) \\to 1$, $(A=1, B=1) \\to 1$. Oui, $F = A$ donne la même table.
>
> **(c) De Morgan + absorption.** $F = \\overline{A \\cdot B} + A$.
> - De Morgan : $F = \\bar{A} + \\bar{B} + A$.
> - Regrouper : $F = (A + \\bar{A}) + \\bar{B} = 1 + \\bar{B} = 1$.
> - **Conclusion** : $F = 1$ pour toutes entrées. C'est une **tautologie**.
>
> **(d) Consensus (plus avancé).** $F = AB + \\bar{A}C + BC$.
> - Le terme $BC$ est **redondant** ("consensus" entre les deux premiers). On peut le virer directement.
> - Démonstration : $BC = BC \\cdot (A + \\bar{A}) = ABC + \\bar{A}BC$. Le premier est absorbé par $AB$ ($AB + ABC = AB$) et le second par $\\bar{A}C$. Donc $BC$ disparaît.
> - **Conclusion** : $F = AB + \\bar{A}C$.

## Les tableaux de Karnaugh (alternative visuelle)

Pour des expressions à **2, 3 ou 4 variables**, on peut utiliser une méthode graphique appelée **tableau de Karnaugh**. On y range la table de vérité dans une **grille 2D** organisée pour que deux cases adjacentes diffèrent d'**un seul bit**. On cherche alors à grouper les 1 en **rectangles de taille $2^k$** (1, 2, 4, 8 cases). Chaque rectangle devient un terme de l'expression minimale.

**Idée** : regrouper les 1 visuellement **remplace** beaucoup d'application de lois. C'est plus rapide pour les expressions à 3-4 variables. Au-delà, on utilise des algos (méthode de Quine-McCluskey) ou des outils automatisés.

On ne fait pas la méthode complète ici (elle est visuelle et demande un support graphique), mais **sache qu'elle existe** et que c'est la méthode préférée en TP quand l'algèbre de Boole devient longue.

> [!warning]
> **Pièges classiques.**
>
> - **Oublier la dualité AND/OR.** $A + BC = (A+B)(A+C)$ en Boole. En algèbre classique, ce n'est **pas** vrai. Ne transporte pas tes réflexes de maths normales.
> - **Confondre idempotence et commutativité.** $A + A = A$ (idempotence) ; $A + B = B + A$ (commutativité). Ce ne sont pas les mêmes lois.
> - **Utiliser l'absorption dans le mauvais sens.** $A + AB = A$ (oui). Mais $A + B \\cdot C \\ne A$ en général — le $A$ n'absorbe **pas** $BC$ s'il n'est pas **facteur** du terme adjacent.
> - **Démultiplier à outrance.** Parfois, il vaut mieux **factoriser** que distribuer. Si tu distribues $A(B + C) = AB + AC$, tu passes d'une expression à 3 opérateurs à une de 4. Dans l'autre sens (factorisation), tu simplifies.
> - **Oublier que l'objectif est la forme minimale.** Il n'y a **pas une seule** forme correcte. Deux expressions équivalentes peuvent toutes les deux être "simplifiées" — prends la plus courte. Et souvent il y a **plusieurs** formes minimales équivalentes (ex : $A \\bar{B} + \\bar{A} B$ et $A \\oplus B$ ont la même valeur, et sont à 2 termes chacune).
> - **Confondre $A \\cdot \\bar{A}$ et $A + \\bar{A}$.** Le premier vaut **0** (une variable ne peut pas être simultanément vraie et fausse). Le second vaut **1** (l'une ou l'autre est forcément vraie). Les deux ensemble forment l'axiome du **tiers exclu** et de la **non-contradiction**.

## À quoi ça sert en pratique

- **Minimiser des circuits** en conception numérique (VHDL, FPGA) : moins de portes = plus rapide + moins cher.
- **Simplifier des conditions en code** : \`if (a && b) || (a && !b)\` se réduit à \`if (a)\`. Moins d'opérateurs = plus lisible + moins de bugs.
- **Optimisation de requêtes SQL** : réécrire des \`WHERE\` complexes en formes canoniques que l'optimiseur exécute mieux.
- **Moteurs de règles métier** : normaliser les expressions avant évaluation.
- **Vérification formelle** : les outils (SAT solvers, model checkers) convertissent tout en formes normales booléennes pour raisonner dessus.

> [!tip]
> **Règle d'or.** Avant de simplifier une expression longue, **construis d'abord sa table de vérité**. Tu verras immédiatement si elle vaut une constante (tautologie $F = 1$ ou contradiction $F = 0$), si elle ne dépend que d'une ou deux variables, ou si elle correspond à une fonction connue (XOR, somme binaire, etc.). Souvent la simplification devient évidente **en regardant la table**.

> [!colibrimo]
> L'algèbre de Boole est **exactement** ce que tu appliques en code quand tu simplifies un gros \`if/else\`. Sur Colibrimo, les **conditions d'éligibilité** d'un chantier sont souvent complexes ("actif **et** validé **ou** (historique clean **et** pas de litige en cours) **et** pas dépassé date butoir..."). Les normaliser mentalement avec les lois de Boole évite les bugs et les couvertures incomplètes. Et si tu touches un jour au tuning de règles ML, comprendre la forme normale conjonctive / disjonctive est la base des **arbres de décision**.`,
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
