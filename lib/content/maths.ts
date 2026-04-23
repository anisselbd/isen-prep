import type { TopicContent } from "./types";

export const MATHS_CONTENT: TopicContent[] = [
  // ==========================================================================
  // Dérivées
  // ==========================================================================
  {
    topic_id: "maths.analyse.derivees",
    lessons: [
      {
        title: "Dérivées : formules usuelles et composée",
        estimated_minutes: 8,
        content_md: `## Définition opérationnelle

La dérivée $f'(x)$ mesure la **pente de la tangente** à $f$ en $x$ :

$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$

## Formules à connaître

| $f(x)$ | $f'(x)$ |
|--------|---------|
| $x^n$ | $n\\,x^{n-1}$ |
| $e^x$ | $e^x$ |
| $\\ln x$ | $1/x$ |
| $\\sin x$ | $\\cos x$ |
| $\\cos x$ | $-\\sin x$ |
| $\\tan x$ | $1 + \\tan^2 x = 1/\\cos^2 x$ |

## Règles

- **Somme** : $(f+g)' = f' + g'$
- **Produit** : $(fg)' = f'g + fg'$
- **Quotient** : $(f/g)' = (f'g - fg')/g^2$
- **Composée** (chain rule) : $(f \\circ g)'(x) = f'(g(x)) \\cdot g'(x)$

> [!example]
> $f(x) = \\sin(3x^2)$ :
> - $u = 3x^2$, $u' = 6x$
> - $(\\sin u)' = \\cos(u) \\cdot u' = 6x \\cos(3x^2)$

## Étude de fonction

Pour étudier $f$ : calculer $f'$, résoudre $f'(x) = 0$ pour trouver les extrema, signer $f'$ pour les variations.

> [!colibrimo]
> Les dérivées partielles ont exactement la même mécanique — on les verra dans les algos de gradient descent qu'on utilise pour tuner les modèles. Comprendre $f'$ ici, c'est comprendre comment un LLM apprend.`,
      },
    ],
    exercises: [
      {
        type: "numeric",
        difficulty: 1,
        question_md: "Dérivée de $f(x) = x^2 + 3x$ en $x = 2$ ?",
        data: { answer: 7, tolerance: 0 },
        explanation_md: "$f'(x) = 2x + 3$, donc $f'(2) = 4 + 3 = 7$.",
      },
      {
        type: "formula",
        difficulty: 2,
        question_md: "Donne la dérivée de $f(x) = x^3 - 2x^2 + 5$ (LaTeX).",
        data: {
          expected_latex: "3x^2 - 4x",
          equivalent_forms: ["3x^{2} - 4x", "3x^2-4x", "-4x + 3x^2"],
        },
        explanation_md:
          "Dérivée terme à terme : $(x^3)' = 3x^2$, $(2x^2)' = 4x$, $(5)' = 0$. Donc $f'(x) = 3x^2 - 4x$.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md: "Dérivée de $f(x) = \\sin(2x)$ ?",
        data: {
          choices: ["$\\cos(2x)$", "$2\\cos(2x)$", "$-\\cos(2x)$", "$\\sin(2x)/2$"],
          answer: 1,
        },
        explanation_md:
          "Règle de la chaîne : $(\\sin u)' = \\cos(u) \\cdot u'$ avec $u = 2x$, $u' = 2$. Résultat : $2 \\cos(2x)$.",
      },
      {
        type: "formula",
        difficulty: 3,
        question_md:
          "Dérivée du produit $f(x) = x^2 \\cdot e^x$ ? Donne une forme factorisée.",
        data: {
          expected_latex: "(2x + x^2)e^x",
          equivalent_forms: [
            "(x^2 + 2x)e^x",
            "x(x+2)e^x",
            "2xe^x + x^2 e^x",
            "e^x(x^2 + 2x)",
            "e^x(2x + x^2)",
          ],
        },
        explanation_md:
          "$(uv)' = u'v + uv'$ avec $u=x^2, v=e^x$ : $f'(x) = 2x \\cdot e^x + x^2 \\cdot e^x = e^x(2x + x^2) = x(x+2)e^x$.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md: "Pour quelle valeur de $x$ la fonction $f(x) = x^2 - 4x + 1$ est-elle minimale ?",
        data: { choices: ["$x = 0$", "$x = 1$", "$x = 2$", "$x = 4$"], answer: 2 },
        explanation_md:
          "$f'(x) = 2x - 4 = 0 \\Rightarrow x = 2$. La dérivée seconde $f''(x) = 2 > 0$ confirme un minimum.",
      },
    ],
    flashcards: [
      {
        front_md: "Règle de la chaîne (composée) : $(f \\circ g)'(x) = ?$",
        back_md: "$f'(g(x)) \\cdot g'(x)$",
        tags: ["derivees"],
      },
      {
        front_md: "Dérivée de $\\ln x$, $e^x$, $\\sin x$, $\\cos x$",
        back_md:
          "$(\\ln x)' = 1/x$ · $(e^x)' = e^x$ · $(\\sin x)' = \\cos x$ · $(\\cos x)' = -\\sin x$",
        tags: ["derivees"],
      },
      {
        front_md: "Formule de la dérivée d'un produit",
        back_md: "$(fg)' = f'g + fg'$",
        tags: ["derivees"],
      },
    ],
  },

  // ==========================================================================
  // Primitives et intégrales
  // ==========================================================================
  {
    topic_id: "maths.analyse.integrales",
    lessons: [
      {
        title: "Primitives et intégrales : les réflexes",
        estimated_minutes: 9,
        content_md: `## Primitive vs intégrale

Une **primitive** $F$ de $f$ vérifie $F'(x) = f(x)$. Les primitives diffèrent d'une constante : $F(x) + C$.

L'**intégrale définie** $\\int_a^b f(x)\\,dx = F(b) - F(a)$ — théorème fondamental de l'analyse.

## Primitives usuelles (ajoute $+C$)

| $f(x)$ | $F(x)$ |
|--------|--------|
| $x^n$ ($n \\neq -1$) | $x^{n+1}/(n+1)$ |
| $1/x$ | $\\ln|x|$ |
| $e^x$ | $e^x$ |
| $\\sin x$ | $-\\cos x$ |
| $\\cos x$ | $\\sin x$ |

## Deux techniques à connaître

**Intégration par parties** : $\\int u\\,v' = [uv] - \\int u'\\,v$.

> [!example]
> $\\int x e^x\\,dx$ avec $u=x, v'=e^x$ : $= xe^x - \\int e^x = (x-1)e^x + C$.

**Changement de variable** : poser $u = g(x)$, $du = g'(x)\\,dx$.

> [!example]
> $\\int 2x\\,e^{x^2}\\,dx$ avec $u = x^2$ : $= \\int e^u\\,du = e^{x^2} + C$.

## Interprétation géométrique

$\\int_a^b f(x)\\,dx$ = aire algébrique entre la courbe $y = f(x)$ et l'axe des abscisses sur $[a,b]$. Si $f \\geq 0$, c'est l'aire géométrique.`,
      },
    ],
    exercises: [
      {
        type: "formula",
        difficulty: 1,
        question_md: "Donne **une** primitive de $f(x) = 2x + 1$.",
        data: {
          expected_latex: "x^2 + x + C",
          equivalent_forms: ["x^{2} + x + C", "x^2+x+C", "x^2 + x"],
        },
        explanation_md:
          "Primitive terme à terme : $(x^2)' = 2x$, $(x)' = 1$. Donc $F(x) = x^2 + x + C$.",
      },
      {
        type: "numeric",
        difficulty: 2,
        question_md: "Valeur de $\\int_0^1 3x^2\\,dx$ ?",
        data: { answer: 1, tolerance: 0 },
        explanation_md:
          "Primitive : $F(x) = x^3$. $\\int_0^1 3x^2\\,dx = [x^3]_0^1 = 1 - 0 = 1$.",
      },
      {
        type: "formula",
        difficulty: 2,
        question_md: "Primitive de $f(x) = 1/x$ (pour $x > 0$) ?",
        data: {
          expected_latex: "\\ln(x) + C",
          equivalent_forms: ["\\ln x + C", "\\ln|x| + C", "ln(x) + C"],
        },
        explanation_md: "C'est la primitive canonique. Sur $\\mathbb{R}^*$, on écrit $\\ln|x| + C$.",
      },
      {
        type: "numeric",
        difficulty: 3,
        question_md: "Valeur exacte de $\\int_1^e \\frac{1}{x}\\,dx$ ?",
        data: { answer: 1, tolerance: 0.0001 },
        explanation_md: "$[\\ln x]_1^e = \\ln e - \\ln 1 = 1 - 0 = 1$.",
      },
      {
        type: "mcq",
        difficulty: 3,
        question_md: "Quelle technique utilises-tu pour calculer $\\int x e^x \\, dx$ ?",
        data: {
          choices: [
            "Primitive directe (formule usuelle)",
            "Changement de variable",
            "Intégration par parties",
            "Décomposition en éléments simples",
          ],
          answer: 2,
        },
        explanation_md:
          "Produit d'un polynôme × exponentielle ⇒ **IPP** avec $u=x, v'=e^x$. Résultat : $(x-1)e^x + C$.",
      },
    ],
    flashcards: [
      {
        front_md: "Primitive de $x^n$ ($n \\neq -1$)",
        back_md: "$\\frac{x^{n+1}}{n+1} + C$",
        tags: ["integrales"],
      },
      {
        front_md: "Formule d'intégration par parties",
        back_md: "$\\int u\\,v' = [uv] - \\int u'\\,v$",
        tags: ["integrales"],
      },
      {
        front_md: "Que donne $\\int_a^b f(x)\\,dx$ géométriquement si $f \\geq 0$ ?",
        back_md: "L'aire géométrique entre la courbe $y = f(x)$ et l'axe des abscisses sur $[a,b]$.",
        tags: ["integrales"],
      },
    ],
  },

  // ==========================================================================
  // Vecteurs et matrices
  // ==========================================================================
  {
    topic_id: "maths.algebre.vecteurs_matrices",
    lessons: [
      {
        title: "Vecteurs et matrices : opérations, produit, déterminant",
        estimated_minutes: 10,
        content_md: `## Vecteurs

Un vecteur $\\vec{u} \\in \\mathbb{R}^n$ est un n-uplet $(u_1, \\ldots, u_n)$.

- **Somme** : composante par composante.
- **Produit scalaire** : $\\vec{u} \\cdot \\vec{v} = \\sum u_i v_i$. Proprité : $\\vec{u} \\cdot \\vec{v} = \\|u\\|\\|v\\|\\cos\\theta$.
- **Norme** : $\\|\\vec{u}\\| = \\sqrt{u_1^2 + \\ldots + u_n^2}$.

## Matrices

$A$ de taille $m \\times n$ : $m$ lignes, $n$ colonnes.

**Produit $AB$** (possible si $A$ est $m \\times n$ et $B$ est $n \\times p$) :
$$(AB)_{ij} = \\sum_{k=1}^n a_{ik} b_{kj}$$

Résultat de taille $m \\times p$. **Non commutatif** en général : $AB \\neq BA$.

## Déterminant (2×2)

$$\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$$

Si $\\det A = 0$, $A$ n'est **pas inversible** (matrice singulière).

## Inverse (2×2)

$$A^{-1} = \\frac{1}{\\det A} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$

> [!example]
> $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}$. $\\det A = 6 - 1 = 5$. $A^{-1} = \\frac{1}{5}\\begin{pmatrix} 3 & -1 \\\\ -1 & 2 \\end{pmatrix}$.

> [!colibrimo]
> Les embeddings Colibrimo sont des vecteurs de $\\mathbb{R}^{768}$. Chaque recherche de similarité calcule un produit scalaire entre le vecteur requête et chaque vecteur en base — sur pgvector avec un index HNSW, en $O(\\log n)$ au lieu de $O(n)$.`,
      },
    ],
    exercises: [
      {
        type: "numeric",
        difficulty: 1,
        question_md:
          "Produit scalaire $\\vec{u} \\cdot \\vec{v}$ pour $\\vec{u} = (1, 2, 3)$ et $\\vec{v} = (4, 5, 6)$ ?",
        data: { answer: 32, tolerance: 0 },
        explanation_md: "$1 \\times 4 + 2 \\times 5 + 3 \\times 6 = 4 + 10 + 18 = 32$.",
      },
      {
        type: "numeric",
        difficulty: 2,
        question_md:
          "$\\det(A)$ pour $A = \\begin{pmatrix} 3 & 4 \\\\ 2 & 1 \\end{pmatrix}$ ?",
        data: { answer: -5, tolerance: 0 },
        explanation_md: "$\\det A = 3 \\times 1 - 4 \\times 2 = 3 - 8 = -5$.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Si $A$ est $3 \\times 4$ et $B$ est $4 \\times 2$, quelle est la taille de $AB$ ?",
        data: { choices: ["3 × 2", "4 × 4", "3 × 4", "Impossible"], answer: 0 },
        explanation_md:
          "$A_{m \\times n} \\cdot B_{n \\times p} \\to (AB)_{m \\times p}$. Ici : $3 \\times 4 \\cdot 4 \\times 2 \\to 3 \\times 2$. La dimension intérieure (4) doit correspondre.",
      },
      {
        type: "numeric",
        difficulty: 2,
        question_md:
          "Norme euclidienne $\\|\\vec{u}\\|$ pour $\\vec{u} = (3, 4)$ ?",
        data: { answer: 5, tolerance: 0 },
        explanation_md: "$\\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$. Classique triangle rectangle 3-4-5.",
      },
      {
        type: "mcq",
        difficulty: 3,
        question_md:
          "Comment reconnaît-on qu'une matrice carrée $A$ n'est **pas inversible** ?",
        data: {
          choices: [
            "Son produit scalaire est nul",
            "Son déterminant est nul",
            "Sa trace est nulle",
            "Ses colonnes sont toutes positives",
          ],
          answer: 1,
        },
        explanation_md:
          "$A^{-1}$ existe $\\iff \\det A \\neq 0$. Une matrice de déterminant nul est dite **singulière** : ses colonnes sont linéairement dépendantes.",
      },
    ],
    flashcards: [
      {
        front_md: "Produit scalaire $\\vec{u} \\cdot \\vec{v}$ : formule + interprétation",
        back_md:
          "$\\sum u_i v_i = \\|u\\|\\|v\\|\\cos\\theta$. Nul ⇒ vecteurs orthogonaux.",
        tags: ["vecteurs"],
      },
      {
        front_md: "Déterminant 2×2",
        back_md: "$\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$",
        tags: ["matrices"],
      },
      {
        front_md: "Produit $A \\cdot B$ : condition sur les tailles ?",
        back_md: "$(m \\times n) \\cdot (n \\times p) \\to (m \\times p)$. Dimension intérieure doit matcher.",
        tags: ["matrices"],
      },
    ],
  },

  // ==========================================================================
  // Similarité cosinus
  // ==========================================================================
  {
    topic_id: "maths.algebre.similarite_cosinus",
    lessons: [
      {
        title: "Similarité cosinus : mesurer la proximité de deux vecteurs",
        estimated_minutes: 7,
        content_md: `## Définition

$$\\cos(\\theta) = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\|\\|\\vec{v}\\|}$$

Vaut **1** si $\\vec{u}$ et $\\vec{v}$ pointent dans le même sens, **0** si orthogonaux, **-1** si opposés.

## Pourquoi pas la distance euclidienne ?

La similarité cosinus ignore la **norme** : seule la **direction** compte. Deux embeddings qui encodent "chat" et "félin" peuvent avoir des normes très différentes mais une direction quasi identique.

## Formule développée en $\\mathbb{R}^n$

$$\\cos(\\theta) = \\frac{\\sum_{i=1}^n u_i v_i}{\\sqrt{\\sum u_i^2} \\cdot \\sqrt{\\sum v_i^2}}$$

Coût : $O(n)$ pour un couple.

> [!example]
> $\\vec{u} = (1, 0)$, $\\vec{v} = (1, 1)$.
> $\\vec{u} \\cdot \\vec{v} = 1$. $\\|\\vec{u}\\| = 1$, $\\|\\vec{v}\\| = \\sqrt{2}$.
> $\\cos\\theta = 1/\\sqrt{2} \\approx 0{,}707$. Angle = 45°.

## En pratique : normaliser en amont

Si on pré-normalise les vecteurs ($\\|\\vec{u}\\| = 1$), la similarité cosinus se réduit à un simple **produit scalaire** — gain de calcul considérable quand on index des millions de vecteurs.

> [!colibrimo]
> Sur Colibrimo, chaque embedding généré par Gemini est normalisé avant insertion dans pgvector. Ça accélère les requêtes de similarité et permet d'utiliser l'opérateur \`<#>\` (inner product) au lieu de \`<->\` (L2).`,
      },
    ],
    exercises: [
      {
        type: "numeric",
        difficulty: 2,
        question_md:
          "Similarité cosinus entre $\\vec{u} = (1, 0, 0)$ et $\\vec{v} = (1, 1, 0)$ ?",
        data: { answer: 0.7071, tolerance: 0.01 },
        explanation_md:
          "$\\vec{u}\\cdot\\vec{v} = 1$. $\\|\\vec{u}\\| = 1$, $\\|\\vec{v}\\| = \\sqrt{2}$. $\\cos = 1/\\sqrt{2} \\approx 0{,}7071$.",
      },
      {
        type: "mcq",
        difficulty: 1,
        question_md: "Que vaut la similarité cosinus entre deux vecteurs orthogonaux ?",
        data: { choices: ["-1", "0", "1", "Indéfini"], answer: 1 },
        explanation_md: "Orthogonaux ⇒ produit scalaire nul ⇒ cosinus = 0.",
      },
      {
        type: "numeric",
        difficulty: 1,
        question_md:
          "Similarité cosinus entre $\\vec{u} = (3, 4)$ et $\\vec{v} = (3, 4)$ ?",
        data: { answer: 1, tolerance: 0.001 },
        explanation_md: "Vecteurs identiques ⇒ angle 0 ⇒ $\\cos 0 = 1$.",
      },
      {
        type: "mcq",
        difficulty: 3,
        question_md:
          "Pourquoi préfère-t-on souvent la **similarité cosinus** à la **distance euclidienne** pour comparer des embeddings ?",
        data: {
          choices: [
            "Elle est toujours plus rapide à calculer",
            "Elle ignore la magnitude des vecteurs (seule la direction compte)",
            "Elle est invariante par translation",
            "Elle ne nécessite pas de produit scalaire",
          ],
          answer: 1,
        },
        explanation_md:
          "Les embeddings encodent le sens via la direction du vecteur. Deux textes similaires peuvent avoir des normes différentes (longueur de texte) mais des directions proches. Le cosinus isole cette direction.",
        colibrimo_connection:
          "Sur Colibrimo c'est pour ça qu'on normalise les embeddings : on veut comparer le *sens* de la requête et des documents, pas leur taille.",
      },
      {
        type: "numeric",
        difficulty: 3,
        question_md:
          "Si $\\|\\vec{u}\\| = \\|\\vec{v}\\| = 1$ et $\\vec{u} \\cdot \\vec{v} = 0{,}8$, quelle est la similarité cosinus ?",
        data: { answer: 0.8, tolerance: 0.001 },
        explanation_md:
          "Quand les vecteurs sont normalisés, $\\cos\\theta = \\vec{u} \\cdot \\vec{v}$ directement. C'est pour ça qu'on normalise en amont.",
      },
    ],
    flashcards: [
      {
        front_md: "Formule similarité cosinus",
        back_md:
          "$\\cos\\theta = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\|\\vec{v}\\|}$",
        tags: ["cosinus", "embeddings"],
      },
      {
        front_md: "Pourquoi normaliser les embeddings avant un index pgvector ?",
        back_md:
          "Pré-normaliser ⇒ cosinus = produit scalaire ⇒ utilisation de l'opérateur `<#>` plus rapide qu'un calcul L2.",
        tags: ["cosinus", "embeddings"],
      },
    ],
  },

  // ==========================================================================
  // Loi normale
  // ==========================================================================
  {
    topic_id: "maths.proba.loi_normale",
    lessons: [
      {
        title: "Loi normale : $\\mathcal{N}(\\mu, \\sigma^2)$",
        estimated_minutes: 8,
        content_md: `## Densité

$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} \\exp\\!\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)$$

**$\\mu$** = espérance (centre de la cloche), **$\\sigma$** = écart-type (largeur).

## Propriétés à retenir

- $E[X] = \\mu$, $\\mathrm{Var}(X) = \\sigma^2$
- Symétrique autour de $\\mu$
- **Règle 68 / 95 / 99,7** :
  - $P(|X-\\mu| \\leq \\sigma) \\approx 68\\%$
  - $P(|X-\\mu| \\leq 2\\sigma) \\approx 95\\%$
  - $P(|X-\\mu| \\leq 3\\sigma) \\approx 99{,}7\\%$

## Standardisation

Si $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$, alors $Z = (X - \\mu)/\\sigma \\sim \\mathcal{N}(0, 1)$ (loi normale **centrée réduite**).

On peut ainsi calculer $P(X \\leq x) = \\Phi((x - \\mu)/\\sigma)$ à partir de la table de $\\Phi$.

> [!example]
> $X \\sim \\mathcal{N}(100, 15^2)$ (QI). $P(X \\leq 115) = P(Z \\leq 1) = \\Phi(1) \\approx 0{,}8413$. Donc 84% de la population a un QI $\\leq 115$.

## Théorème central limite (TCL)

Si $X_1, \\ldots, X_n$ i.i.d. de moyenne $\\mu$ et variance $\\sigma^2 < \\infty$, alors
$$\\frac{\\bar{X}_n - \\mu}{\\sigma/\\sqrt{n}} \\xrightarrow{n \\to \\infty} \\mathcal{N}(0,1)$$

⇒ justifie l'omniprésence de la loi normale en statistiques.`,
      },
    ],
    exercises: [
      {
        type: "mcq",
        difficulty: 1,
        question_md:
          "Pour $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$, quelle proportion environ se trouve dans $[\\mu - 2\\sigma, \\mu + 2\\sigma]$ ?",
        data: {
          choices: ["50 %", "68 %", "95 %", "99,7 %"],
          answer: 2,
        },
        explanation_md:
          "Règle 68/95/99,7 : 2 écarts-types couvrent environ 95 % de la distribution.",
      },
      {
        type: "numeric",
        difficulty: 2,
        question_md:
          "Si $X \\sim \\mathcal{N}(50, 4^2)$ et $x = 58$, que vaut la variable centrée réduite $Z$ ?",
        data: { answer: 2, tolerance: 0 },
        explanation_md: "$Z = (x - \\mu)/\\sigma = (58 - 50)/4 = 2$.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "$X \\sim \\mathcal{N}(0, 1)$. Que vaut environ $P(X \\leq 0)$ ?",
        data: { choices: ["0,25", "0,50", "0,68", "0,84"], answer: 1 },
        explanation_md:
          "La loi normale centrée est symétrique autour de 0 ⇒ $P(X \\leq 0) = 0{,}5$.",
      },
      {
        type: "numeric",
        difficulty: 3,
        question_md:
          "$X \\sim \\mathcal{N}(0, 1)$. Approximation de $P(-1 \\leq X \\leq 1)$ (en pourcentage) ?",
        data: { answer: 68, tolerance: 1 },
        explanation_md:
          "Règle 68/95/99,7 : un écart-type ⇒ environ 68 %.",
      },
      {
        type: "text",
        difficulty: 3,
        question_md:
          "Énonce en 2-3 lignes le théorème central limite (TCL) et explique pourquoi il justifie l'omniprésence de la loi normale en statistiques.",
        data: {
          expected_key_points: [
            "moyenne empirique",
            "convergence",
            "loi normale",
            "variance finie",
            "i.i.d.",
          ],
          min_score: 0.6,
        },
        explanation_md:
          "Le TCL dit que la moyenne empirique de $n$ variables i.i.d. de variance finie tend vers une loi normale quand $n \\to \\infty$. Donc dès qu'on moyenne un grand nombre d'observations (mesures, erreurs, sondages…), la distribution résultante est approximativement gaussienne — d'où son omniprésence.",
      },
    ],
    flashcards: [
      {
        front_md: "Règle 68 / 95 / 99,7",
        back_md:
          "Pour $\\mathcal{N}(\\mu, \\sigma^2)$ : 68 % dans $[\\mu \\pm \\sigma]$, 95 % dans $[\\mu \\pm 2\\sigma]$, 99,7 % dans $[\\mu \\pm 3\\sigma]$.",
        tags: ["proba", "normale"],
      },
      {
        front_md: "Standardisation d'une loi normale",
        back_md:
          "$X \\sim \\mathcal{N}(\\mu, \\sigma^2) \\Rightarrow Z = (X - \\mu)/\\sigma \\sim \\mathcal{N}(0, 1)$",
        tags: ["normale"],
      },
      {
        front_md: "Énoncé TCL (à l'oral)",
        back_md:
          "Moyenne empirique de $n$ v.a. i.i.d. (variance finie) tend vers une normale centrée sur $\\mu$ et d'écart-type $\\sigma/\\sqrt{n}$.",
        tags: ["normale", "proba"],
      },
    ],
  },

  // ==========================================================================
  // Probabilités conditionnelles & Bayes
  // ==========================================================================
  {
    topic_id: "maths.proba.bayes",
    lessons: [
      {
        title: "Probabilités conditionnelles et formule de Bayes",
        estimated_minutes: 7,
        content_md: `## Probabilité conditionnelle

$$P(A | B) = \\frac{P(A \\cap B)}{P(B)} \\quad (P(B) > 0)$$

Se lit "la probabilité de $A$ **sachant** $B$".

## Indépendance

$A$ et $B$ **indépendants** $\\iff P(A \\cap B) = P(A) \\cdot P(B) \\iff P(A|B) = P(A)$.

## Formule de Bayes

$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$$

Elle permet d'**inverser le conditionnement** : passer de $P(B|A)$ (facile à mesurer) à $P(A|B)$ (ce qu'on veut).

## Loi des probabilités totales

Si $(A_i)$ forment une partition de l'univers,
$$P(B) = \\sum_i P(B|A_i) \\cdot P(A_i)$$

Utile au dénominateur de Bayes.

> [!example]
> Test médical. $P(\\text{malade}) = 1\\%$. Test sensible ($P(+|M) = 99\\%$) et spécifique ($P(-|\\bar{M}) = 95\\%$). Que vaut $P(M|+)$ ?
>
> $P(+) = 0{,}99 \\times 0{,}01 + 0{,}05 \\times 0{,}99 = 0{,}0594$.
> $P(M|+) = \\frac{0{,}99 \\times 0{,}01}{0{,}0594} \\approx 0{,}167$ **= 17 %**.
>
> Contre-intuitif : un test positif n'implique PAS 99 % de chance d'être malade.`,
      },
    ],
    exercises: [
      {
        type: "numeric",
        difficulty: 2,
        question_md:
          "On tire une carte au hasard d'un jeu de 52. $P(\\text{roi} | \\text{figure})$ ?",
        data: { answer: 0.333, tolerance: 0.01 },
        explanation_md:
          "12 figures (roi/dame/valet × 4). Sachant qu'on a une figure, probabilité que ce soit un roi : $4/12 = 1/3 \\approx 0{,}333$.",
      },
      {
        type: "mcq",
        difficulty: 1,
        question_md: "$A$ et $B$ sont indépendants. Laquelle est vraie ?",
        data: {
          choices: [
            "$P(A|B) = P(B|A)$",
            "$P(A \\cap B) = P(A) \\cdot P(B)$",
            "$P(A \\cup B) = P(A) + P(B)$",
            "$P(A) = P(B)$",
          ],
          answer: 1,
        },
        explanation_md:
          "C'est la définition même de l'indépendance : $P(A \\cap B) = P(A) \\cdot P(B)$.",
      },
      {
        type: "numeric",
        difficulty: 3,
        question_md:
          "$P(M) = 0{,}01$, $P(+|M) = 0{,}99$, $P(+|\\bar{M}) = 0{,}05$. Que vaut $P(M|+)$ ? (Donne une valeur entre 0 et 1.)",
        data: { answer: 0.167, tolerance: 0.005 },
        explanation_md:
          "Bayes : $P(M|+) = \\frac{0{,}99 \\times 0{,}01}{0{,}99 \\times 0{,}01 + 0{,}05 \\times 0{,}99} = \\frac{0{,}0099}{0{,}0594} \\approx 0{,}167$.",
      },
      {
        type: "formula",
        difficulty: 2,
        question_md: "Formule de Bayes — exprime $P(A|B)$ en fonction de $P(B|A)$, $P(A)$, $P(B)$.",
        data: {
          expected_latex: "\\frac{P(B|A) P(A)}{P(B)}",
          equivalent_forms: [
            "\\frac{P(B|A)P(A)}{P(B)}",
            "P(B|A) \\cdot P(A) / P(B)",
            "P(B|A)P(A)/P(B)",
          ],
        },
        explanation_md:
          "$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$. Le dénominateur $P(B)$ se développe souvent par la formule des probabilités totales.",
      },
      {
        type: "text",
        difficulty: 3,
        question_md:
          "Pourquoi, dans l'exemple du test médical avec sensibilité 99 % sur une maladie rare (1 %), la probabilité d'être réellement malade sachant un test positif n'est-elle pas 99 % ?",
        data: {
          expected_key_points: [
            "prévalence",
            "faux positifs",
            "maladie rare",
            "Bayes",
            "base rate",
          ],
          min_score: 0.6,
        },
        explanation_md:
          "Parce que la **prévalence** (1 %) pondère le résultat. Même avec une sensibilité de 99 %, la population saine est 99 fois plus nombreuse que la population malade, donc le nombre absolu de faux positifs est comparable au nombre de vrais positifs. C'est la base rate fallacy — classique pour piéger un candidat.",
      },
    ],
    flashcards: [
      {
        front_md: "Formule de Bayes",
        back_md: "$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$",
        tags: ["bayes"],
      },
      {
        front_md: "A et B indépendants : caractérisation",
        back_md: "$P(A \\cap B) = P(A) \\cdot P(B)$, ou de façon équivalente $P(A|B) = P(A)$.",
        tags: ["proba", "bayes"],
      },
      {
        front_md: "Piège du test médical (base rate fallacy) — en une phrase",
        back_md:
          "Sur une maladie rare, même un test très sensible génère plus de faux positifs que de vrais positifs, donc $P(\\text{malade}|+)$ reste faible.",
        tags: ["bayes"],
      },
    ],
  },
];
