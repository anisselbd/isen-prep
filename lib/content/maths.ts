import type { TopicContent } from "./types";

export const MATHS_CONTENT: TopicContent[] = [
  // ==========================================================================
  // Dérivées
  // ==========================================================================
  {
    topic_id: "maths.analyse.derivees",
    lessons: [
      {
        title: "Dérivées : du sens physique aux formules",
        estimated_minutes: 18,
        content_md: `## Pourquoi tu dois maîtriser ça

La dérivée, c'est **l'outil qui répond à la question "ça change comment ?"**. Dès qu'une quantité varie — un courant, une vitesse, un coût, une erreur de modèle — on passe par une dérivée pour la décrire. Sans ça, pas de mécanique, pas de traitement du signal, pas d'optimisation, pas de machine learning. Le jury ISEN sait que c'est la brique de base de tout ce qui suit, donc c'est **le premier truc qu'il va tester**. On va la construire proprement, depuis l'intuition jusqu'aux cas tordus.

> [!note]
> **Ce qu'il faut savoir avant d'attaquer** : tu dois être à l'aise avec la notion de **fonction** $f(x)$ (à chaque $x$ on associe une valeur), les **puissances** ($x^2$, $x^3$, $x^{-1} = 1/x$), l'**exponentielle** $e^x$ et le **logarithme** $\\ln x$ (sa fonction inverse), et les **fonctions trigonométriques** $\\sin$, $\\cos$. La notion de **limite** est utile mais pas indispensable pour ce cours — on va s'en servir uniquement pour la définition, puis on n'y touchera plus.

## L'idée intuitive

Imagine une voiture qui roule. À chaque instant $t$, sa position est $f(t)$. Sa **vitesse à l'instant $t$** est de combien de mètres elle avance **par seconde**, en cet instant précis. Pour la calculer, on prend deux instants très proches $t$ et $t + h$, on regarde la distance parcourue $f(t+h) - f(t)$, on divise par la durée $h$ :

$$\\text{vitesse moyenne entre } t \\text{ et } t+h \\;=\\; \\frac{f(t+h) - f(t)}{h}$$

Plus on choisit $h$ petit, plus cette "vitesse moyenne" se rapproche de la **vitesse instantanée**. Quand on fait tendre $h$ vers 0, on obtient la vitesse exacte à l'instant $t$. **C'est ça, la dérivée.** Sur un graphique, $f'(x)$ c'est la **pente de la tangente** à la courbe au point d'abscisse $x$ : ça dit si la courbe monte (pente positive), descend (pente négative) ou est plate (pente nulle, on est à un sommet ou un creux).

## La définition formelle

$$f'(x) \\;=\\; \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$

On décode chaque morceau :
- **$f(x+h) - f(x)$** : la variation de $f$ quand on avance de $h$ à partir de $x$.
- **$/\\, h$** : on ramène cette variation à "par unité de $x$" (le taux d'accroissement).
- **$\\lim_{h \\to 0}$** : on prend un $h$ infiniment petit, pour ne garder que la pente locale, pas une moyenne sur un intervalle large.

Autres notations que tu vas croiser pour la même chose : $\\dfrac{df}{dx}$ (notation de Leibniz, très utilisée en physique) et $\\dot{f}$ (notation de Newton, pour les dérivations par rapport au temps). $f'(x)$, $\\dfrac{df}{dx}(x)$ et $\\dot f(x)$ désignent tous les trois la même chose.

## Les formules usuelles

Voici le tableau à connaître par cœur. Dans la colonne de droite, tu as le **résultat** ; en-dessous du tableau, une ligne courte pour dire **d'où ça vient**, pour que tu ne retiennes pas une liste arbitraire.

| $f(x)$ | $f'(x)$ |
|--------|---------|
| $k$ (constante) | $0$ |
| $x$ | $1$ |
| $x^n$ (pour $n$ entier ou réel) | $n\\,x^{n-1}$ |
| $\\sqrt{x} = x^{1/2}$ | $\\dfrac{1}{2\\sqrt{x}}$ |
| $1/x = x^{-1}$ | $-1/x^2$ |
| $e^x$ | $e^x$ |
| $\\ln x$ | $1/x$ (pour $x > 0$) |
| $\\sin x$ | $\\cos x$ |
| $\\cos x$ | $-\\sin x$ |
| $\\tan x$ | $1/\\cos^2 x = 1 + \\tan^2 x$ |

**Pourquoi $(x^n)' = n x^{n-1}$ ?** On applique la définition à $f(x) = x^n$ : quand on développe $(x+h)^n$ avec le binôme, le premier terme vaut $x^n$, le deuxième $n x^{n-1} h$, et tous les suivants contiennent $h^2$ ou plus. Donc $f(x+h) - f(x) = n x^{n-1} h + (\\text{termes en } h^2)$. On divise par $h$ et on fait tendre $h$ vers 0 : il ne reste que $n x^{n-1}$.

**Pourquoi $(e^x)' = e^x$ ?** C'est exactement la propriété qui **définit** $e$ : c'est l'unique base pour laquelle la fonction exponentielle est sa propre dérivée. C'est pour ça que $e^x$ est partout en physique : c'est la fonction qui "croît proportionnellement à elle-même".

**Pourquoi $(\\sin x)' = \\cos x$ ?** Géométriquement : sur le cercle trigonométrique, si tu te déplaces d'un petit angle $h$ à partir d'un point, la variation verticale ($\\sin$) est pilotée par la composante horizontale de la tangente, qui vaut $\\cos$.

## Les quatre règles de calcul

Dans 99% des cas tu n'appliques **jamais** la définition avec la limite — tu composes les formules du tableau avec ces 4 règles.

**1. Somme** : $(f + g)' = f' + g'$. La dérivée d'une somme = somme des dérivées. Même chose pour la soustraction.

**2. Constante multiplicative** : $(k \\cdot f)' = k \\cdot f'$. Une constante devant la fonction "sort" de la dérivée sans rien changer.

**3. Produit** : $(f \\cdot g)' = f' \\cdot g + f \\cdot g'$. **Attention**, ce n'est **pas** $f' \\cdot g'$ — c'est le piège classique. Exemple court : $f(x) = x \\cdot \\sin x$, donc $f'(x) = 1 \\cdot \\sin x + x \\cdot \\cos x = \\sin x + x \\cos x$.

**4. Quotient** : $\\left(\\dfrac{f}{g}\\right)' = \\dfrac{f' \\cdot g - f \\cdot g'}{g^2}$. Mnémotechnique : "**Haut' bas moins haut bas'**, sur **bas au carré**" (c'est $f'g - fg'$ sur $g^2$, attention à l'ordre).

**5. Composée (la plus importante pour l'ingé)** : $(f \\circ g)'(x) = f'(g(x)) \\cdot g'(x)$. On la lit : "dérivée de l'extérieur évaluée à l'intérieur, fois la dérivée de l'intérieur". C'est la **chain rule**, celle qu'utilisent tous les algos de deep learning pour rétropropager l'erreur couche par couche.

> [!example]
> **Trois dérivations détaillées, de la plus simple à la plus corsée.**
>
> **(a) Polynôme.** $f(x) = 3x^4 - 5x^2 + 7x - 2$.
> - Terme par terme : $(3x^4)' = 3 \\cdot 4 x^3 = 12 x^3$, $(5x^2)' = 10 x$, $(7x)' = 7$, $(2)' = 0$.
> - Bilan : $f'(x) = 12 x^3 - 10 x + 7$.
>
> **(b) Composée trigonométrique.** $f(x) = \\sin(3x^2)$.
> - On identifie l'**intérieur** : $g(x) = 3x^2$, donc $g'(x) = 6x$.
> - L'**extérieur** est $\\sin$, sa dérivée est $\\cos$.
> - Chain rule : $f'(x) = \\cos(g(x)) \\cdot g'(x) = \\cos(3x^2) \\cdot 6x = 6x \\cos(3x^2)$.
>
> **(c) Produit + composée.** $f(x) = x^2 \\cdot e^{-x}$.
> - On identifie le produit : $u = x^2$, $v = e^{-x}$.
> - $u' = 2x$ (tableau).
> - $v' = e^{-x} \\cdot (-1) = -e^{-x}$ (chain rule avec extérieur $e^y$, intérieur $-x$).
> - Produit : $f'(x) = u'v + uv' = 2x \\cdot e^{-x} + x^2 \\cdot (-e^{-x}) = e^{-x}(2x - x^2) = x(2 - x)e^{-x}$.

> [!warning]
> **Les pièges qui coûtent des points au jury.**
>
> - **Oublier la chain rule** quand il y a une fonction composée. $(\\sin(2x))' = 2\\cos(2x)$, **pas** $\\cos(2x)$. Dès que tu vois "quelque chose autour de $x$", réflexe chain rule.
> - **Dériver le produit comme une somme.** $(fg)' \\ne f'g'$. Si tu écris ça, tu perds le point.
> - **Signe du cosinus dérivé.** $(\\cos x)' = -\\sin x$, pas $+\\sin x$. Le signe moins est systématique.
> - **Condition d'existence du $\\ln$.** $(\\ln x)' = 1/x$ **uniquement pour $x > 0$**. Si la fonction est $\\ln|x|$, la formule reste $1/x$ mais le domaine change.
> - **Simplifier trop tôt.** Avant de dériver $\\dfrac{\\sin x}{x}$, tu ne peux pas "simplifier par $x$" — garde le quotient et applique la règle.

## À quoi ça sert : étudier une fonction

Le plan type d'une étude de fonction est toujours le même.

1. **Calculer $f'(x)$** avec les règles ci-dessus.
2. **Résoudre $f'(x) = 0$** pour trouver les **extrema** candidats (sommets, creux, points d'inflexion horizontaux).
3. **Signer $f'$** sur chaque intervalle : si $f' > 0$, $f$ croît ; si $f' < 0$, $f$ décroît.
4. **Dresser le tableau de variations** avec les signes de $f'$ et les valeurs de $f$ aux points clés.

> [!tip]
> **Truc pour retenir la chain rule** : quand tu vois une fonction "emballée" (quelque chose entre parenthèses, sous un $\\sin$, sous un $e$, etc.), demande-toi toujours : "je dérive **l'emballage**, puis je **multiplie** par la dérivée de **ce qu'il y a dedans**". Ce réflexe à lui seul évite 80% des erreurs.

> [!colibrimo]
> La chain rule, c'est exactement ce que fait la **backpropagation** dans un réseau de neurones (le truc qui entraîne GPT, Gemini et les modèles qu'on utilise sur Colibrimo). Chaque couche est une fonction ; l'erreur finale est une composée de toutes ces fonctions ; pour savoir comment ajuster les poids d'une couche cachée, on applique la chain rule couche par couche en remontant. Comprendre $(f \\circ g)'(x) = f'(g(x)) \\cdot g'(x)$ ici, c'est comprendre **comment un LLM apprend**.`,
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
        title: "Primitives et intégrales : accumuler, mesurer des aires",
        estimated_minutes: 18,
        content_md: `## Pourquoi tu dois maîtriser ça

Si la dérivée répond à "**ça change comment ?**", l'intégrale répond à "**ça fait combien en tout ?**". C'est l'outil qui **accumule**. En physique, c'est comme ça qu'on passe d'une vitesse à une distance, d'une puissance à une énergie, d'un débit à un volume. En probabilités, c'est comme ça qu'on calcule une probabilité à partir d'une densité. En traitement du signal, c'est comme ça qu'on calcule la valeur moyenne d'un courant ou l'énergie d'un signal. Le jury va te tester sur la mécanique (savoir calculer) **et** sur le sens (savoir dire ce que le résultat représente).

> [!note]
> **Ce qu'il faut savoir avant** : les **dérivées** (chapitre précédent) — une intégrale est l'opération inverse, donc maîtriser les formules de dérivation rend les primitives quasi gratuites. Tu dois aussi être à l'aise avec les **fonctions usuelles** ($x^n$, $e^x$, $\\ln x$, $\\sin$, $\\cos$) et savoir ce qu'est une **aire sous une courbe** sur un graphique.

## L'idée intuitive

Tu as une courbe $y = f(x)$ et tu veux calculer l'aire entre cette courbe et l'axe horizontal, entre $x = a$ et $x = b$. Comment faire quand la courbe n'est pas droite ?

**Méthode des rectangles.** Tu découpes l'intervalle $[a, b]$ en plein de petits morceaux de largeur $\\Delta x$. Sur chaque morceau, la courbe est presque plate, donc tu approches l'aire locale par un rectangle de largeur $\\Delta x$ et de hauteur $f(x)$. Tu obtiens $f(x) \\cdot \\Delta x$. Tu fais ça sur tous les morceaux et tu les additionnes.

Quand tu prends des rectangles **infiniment fins** ($\\Delta x \\to 0$, souvent noté $dx$), la somme devient **exacte** et on la note :

$$\\int_a^b f(x)\\,dx$$

Le symbole $\\int$ est un **"S" allongé** : c'est un **S** comme "somme". Le $dx$ est la largeur infinitésimale de chaque petit rectangle. Cette écriture, c'est littéralement "somme de $f(x)$ fois $dx$, quand $x$ varie de $a$ à $b$".

## La définition formelle (théorème fondamental)

Le lien magique entre dérivée et intégrale, c'est le **théorème fondamental de l'analyse** :

$$\\int_a^b f(x)\\,dx \\;=\\; F(b) - F(a) \\quad \\text{où } F \\text{ est une primitive de } f$$

Avec deux vocabulaires à bien distinguer :

- **Primitive** $F$ de $f$ : c'est une fonction **dont la dérivée est $f$**, autrement dit $F'(x) = f(x)$. Il y en a une infinité (elles diffèrent toutes d'une constante), on note ça $F(x) + C$.
- **Intégrale indéfinie** : $\\int f(x)\\,dx = F(x) + C$. C'est la **famille** des primitives (notée sans bornes).
- **Intégrale définie** : $\\int_a^b f(x)\\,dx$. C'est un **nombre** (l'aire), pas une fonction. On n'écrit **jamais** de $+C$ ici.

Le $+C$ disparaît dans $F(b) - F(a)$ parce que $(F(b) + C) - (F(a) + C) = F(b) - F(a)$. Donc pour le calcul, tu peux prendre **n'importe quelle** primitive.

## Les primitives usuelles

Pour les trouver, il suffit de **lire le tableau des dérivées à l'envers**. N'oublie jamais le $+C$ en intégrale indéfinie.

| $f(x)$ | Primitive $F(x)$ (+ $C$ à ajouter) |
|--------|------|
| $k$ (constante) | $k x$ |
| $x^n$ (avec $n \\ne -1$) | $\\dfrac{x^{n+1}}{n+1}$ |
| $1/x$ | $\\ln|x|$ |
| $e^x$ | $e^x$ |
| $e^{ax}$ | $\\dfrac{1}{a} e^{ax}$ |
| $\\sin x$ | $-\\cos x$ |
| $\\cos x$ | $\\sin x$ |
| $1/\\cos^2 x$ | $\\tan x$ |

**Pourquoi $x^n \\to x^{n+1}/(n+1)$ ?** Parce qu'en dérivant $x^{n+1}/(n+1)$ on récupère bien $(n+1) x^n / (n+1) = x^n$. Cas particulier important : si $n = -1$ (donc $f = 1/x$), cette formule **explose** (division par $0$), c'est pour ça que le cas $1/x$ a sa propre ligne avec $\\ln$.

**Règle de linéarité** : $\\int (a f + b g)\\,dx = a \\int f\\,dx + b \\int g\\,dx$. Les constantes sortent, les sommes se découpent — comme pour les dérivées.

## Les deux techniques à connaître

Beaucoup d'intégrales ne se calculent pas directement avec le tableau. Il faut les **transformer** pour se ramener à des primitives connues. Deux outils font 95% du boulot.

### 1. Intégration par parties (IPP)

$$\\int u(x)\\,v'(x)\\,dx \\;=\\; \\big[u(x)\\,v(x)\\big] - \\int u'(x)\\,v(x)\\,dx$$

C'est l'intégrale du produit "à l'envers" : tu choisis **un facteur à dériver** ($u$) et **un facteur à primitiver** ($v'$), tu écris le crochet, tu changes de signe pour la nouvelle intégrale.

**Quand l'utiliser ?** Dès que tu vois un produit de deux types différents : **polynôme × exponentielle**, **polynôme × $\\sin/\\cos$**, **polynôme × $\\ln$**, etc. Tu choisis $u$ = le polynôme ou le $\\ln$ (ça le simplifie en dérivant), et $v'$ = le reste.

### 2. Changement de variable (substitution)

Si tu vois une expression et sa dérivée qui apparaissent ensemble, remplace-la par une nouvelle variable.

Tu poses $u = g(x)$, donc $du = g'(x)\\,dx$. Tu réécris toute l'intégrale en fonction de $u$, tu calcules, puis tu **remets** $g(x)$ à la fin.

**Quand l'utiliser ?** Dès que tu reconnais une fonction composée et sa dérivée, ou que l'expression serait simple si on posait un $u$.

> [!example]
> **Trois calculs complets, du plus basique au plus riche.**
>
> **(a) Primitive directe.** $\\displaystyle \\int (3x^2 - 4x + 5)\\,dx$.
> - Par linéarité : $\\int 3x^2\\,dx - \\int 4x\\,dx + \\int 5\\,dx$.
> - Chacune avec le tableau : $3 \\cdot \\dfrac{x^3}{3} - 4 \\cdot \\dfrac{x^2}{2} + 5x$.
> - Bilan : $x^3 - 2x^2 + 5x + C$.
>
> **(b) Intégrale définie.** $\\displaystyle \\int_0^1 3x^2\\,dx$.
> - Primitive : $F(x) = x^3$.
> - Appliquer les bornes : $F(1) - F(0) = 1^3 - 0^3 = 1$.
> - Bilan : $\\boxed{1}$. **Pas de $+C$** — c'est une valeur numérique.
>
> **(c) IPP.** $\\displaystyle \\int x\\,e^x\\,dx$.
> - Produit polynôme × exponentielle ⇒ IPP.
> - On pose $u = x$ (pour le dériver en $u' = 1$) et $v' = e^x$ (donc $v = e^x$).
> - Formule : $\\int u v' = [u v] - \\int u' v = x e^x - \\int 1 \\cdot e^x\\,dx = x e^x - e^x + C$.
> - Factoriser : $(x - 1) e^x + C$.
>
> **(d) Changement de variable.** $\\displaystyle \\int 2x\\,e^{x^2}\\,dx$.
> - On remarque que $2x$ est la dérivée de $x^2$. ⇒ changement de variable.
> - Poser $u = x^2$, donc $du = 2x\\,dx$. L'intégrale devient $\\int e^u\\,du$.
> - Tableau : $\\int e^u\\,du = e^u + C$.
> - Remettre $u = x^2$ : $e^{x^2} + C$.

> [!warning]
> **Pièges qui font perdre des points.**
>
> - **Oublier le $+C$** en intégrale indéfinie. Le jury le remarque systématiquement. À l'inverse, **ne jamais l'écrire** dans une intégrale définie.
> - **Erreur d'ordre dans l'IPP.** La formule est $\\int u v' = [uv] - \\int u' v$, avec le signe $-$ devant la nouvelle intégrale. Tu notes toujours $u, u', v, v'$ à côté pour ne pas te mélanger.
> - **Mauvais choix pour IPP.** Si tu choisis $u = e^x$ au lieu de $u = x$ dans $\\int x e^x$, tu tombes sur une intégrale plus compliquée qu'au départ. Réflexe : **le polynôme ou le $\\ln$ se dérive**, l'autre se primitive.
> - **Changement de variable mal fait** : oublier de changer $dx$ en $du$ (avec le facteur $g'(x)$), ou oublier de remettre $g(x)$ à la fin.
> - **Signe du $-\\cos x$.** $\\int \\sin x\\,dx = -\\cos x + C$, **pas** $+\\cos x$. (Pour vérifier : $(-\\cos x)' = -(-\\sin x) = \\sin x$. ✓)
> - **Condition sur $\\ln$.** $\\int (1/x)\\,dx = \\ln|x| + C$ sur $\\mathbb{R}^*$. Si on travaille sur $]0, +\\infty[$ on peut écrire $\\ln x$ sans la valeur absolue.

## À quoi ça sert en pratique

- **Géométrie** : $\\int_a^b f(x)\\,dx$ est l'**aire algébrique** entre la courbe et l'axe des $x$ (algébrique = négative si la courbe est sous l'axe). Si $f \\ge 0$, c'est l'aire géométrique.
- **Moyenne** d'une fonction sur $[a, b]$ : $\\bar{f} = \\dfrac{1}{b-a} \\int_a^b f(x)\\,dx$. Utilisé partout en signaux (tension/courant moyen, valeur DC d'un signal).
- **Physique** : distance = $\\int v(t)\\,dt$, énergie = $\\int P(t)\\,dt$, charge = $\\int i(t)\\,dt$. L'intégrale **cumule une grandeur qui coule**.
- **Probabilités** : pour une variable continue, $P(a \\le X \\le b) = \\int_a^b f(x)\\,dx$ où $f$ est la densité.

> [!tip]
> **Réflexe de vérification.** Chaque fois que tu donnes une primitive, **dérive-la mentalement** : tu dois retomber sur la fonction de départ. C'est la check la plus rapide pour éliminer les erreurs de signe ou de coefficient. Exemple : tu proposes $F(x) = (x-1) e^x$ pour $f(x) = x e^x$. Tu dérives : $F'(x) = 1 \\cdot e^x + (x-1) e^x = e^x + (x-1) e^x = x e^x$. ✓

> [!colibrimo]
> Sur Colibrimo, on manipule des scores de similarité entre embeddings (dérivée/intégrale ne sortent pas tellement côté code applicatif). En revanche, **dès que tu touches au tuning de modèles ML**, l'intégrale est partout en background : la "loss" qu'on minimise est une somme/intégrale sur des distributions, et la backprop combine dérivées et intégrales. Comprendre $\\int$ ici, c'est comprendre comment on calcule des **moyennes sur des distributions** sans énumérer tous les points.`,
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
        title: "Vecteurs et matrices : représenter et transformer",
        estimated_minutes: 20,
        content_md: `## Pourquoi tu dois maîtriser ça

Dès que tu veux **représenter des données** (une position dans l'espace, une couleur RGB, un texte compressé, une image, un utilisateur avec plein d'attributs), tu utilises un **vecteur**. Dès que tu veux **transformer** ces données (appliquer une rotation, un zoom, un filtre, passer d'une couche à une autre dans un réseau de neurones), tu utilises une **matrice**. C'est **la** brique de l'algèbre linéaire, et c'est la langue dans laquelle sont écrits : la robotique, le graphisme 3D, le traitement d'images, tout le machine learning moderne (les LLMs sont littéralement des piles de multiplications de matrices), et pgvector pour la recherche sémantique. Le jury sait que tout le cycle ingé repose là-dessus.

> [!note]
> **Ce qu'il faut savoir avant** : les **opérations arithmétiques** de base, la **racine carrée**, la trigonométrie pour le $\\cos$ (qui apparaît dans le produit scalaire), et la notion d'**espace à $n$ dimensions** — même si tu ne peux pas "voir" au-delà de 3D, les règles de calcul restent les mêmes.

## Les vecteurs : l'intuition

Un **vecteur** c'est une **liste ordonnée de nombres**. En maths on note $\\vec{u} = (u_1, u_2, \\ldots, u_n)$, et on dit que $\\vec{u}$ appartient à $\\mathbb{R}^n$ (l'espace à $n$ dimensions). Deux façons équivalentes de voir un vecteur :

- **Une flèche** dans l'espace, partant de l'origine et pointant vers un point. Dans $\\mathbb{R}^2$, $(3, 4)$ c'est la flèche qui part de $(0,0)$ et va vers le point $(3, 4)$.
- **Une donnée structurée**. Un pixel c'est $(R, G, B)$ dans $\\mathbb{R}^3$. Un embedding de phrase c'est 768 nombres dans $\\mathbb{R}^{768}$. Un utilisateur peut être $(\\text{âge}, \\text{CSP}, \\text{ancienneté}, \\ldots)$.

Les deux visions sont utiles : la géométrique pour comprendre les angles et distances, la "donnée" pour comprendre à quoi ça sert dans une vraie application.

## Les opérations sur vecteurs

**Addition** (composante par composante). $\\vec{u} + \\vec{v} = (u_1 + v_1, \\ldots, u_n + v_n)$. Géométriquement : tu mets la flèche $\\vec{v}$ au bout de $\\vec{u}$.

**Multiplication par un scalaire** (= un nombre). $k \\vec{u} = (k u_1, \\ldots, k u_n)$. Géométriquement : tu étires/compresses la flèche par un facteur $k$ (et tu la retournes si $k < 0$).

**Norme** (= longueur) : c'est le théorème de Pythagore généralisé.
$$\\|\\vec{u}\\| = \\sqrt{u_1^2 + u_2^2 + \\ldots + u_n^2}$$
En 2D, $\\|(3, 4)\\| = \\sqrt{9 + 16} = 5$. La norme mesure **"à quel point le vecteur est grand"**.

**Produit scalaire** (le plus important). C'est un nombre (pas un vecteur), calculé ainsi :
$$\\vec{u} \\cdot \\vec{v} \\;=\\; u_1 v_1 + u_2 v_2 + \\ldots + u_n v_n \\;=\\; \\sum_{i=1}^n u_i v_i$$

La formule géométrique **équivalente** (très importante à retenir) est :
$$\\vec{u} \\cdot \\vec{v} = \\|\\vec{u}\\| \\cdot \\|\\vec{v}\\| \\cdot \\cos\\theta$$
où $\\theta$ est l'angle entre les deux vecteurs. **Conséquence capitale** : si $\\vec{u} \\cdot \\vec{v} = 0$, c'est que $\\cos\\theta = 0$, donc les vecteurs sont **perpendiculaires** (orthogonaux). Dès que tu veux savoir si deux vecteurs sont orthogonaux, tu calcules leur produit scalaire et tu vérifies qu'il vaut 0.

## Les matrices : définition et vocabulaire

Une **matrice** $A$ de taille $m \\times n$ est un **tableau rectangulaire** de nombres à $m$ **lignes** et $n$ **colonnes**. On note $a_{ij}$ le coefficient à la ligne $i$, colonne $j$. Exemple :

$$A = \\begin{pmatrix} 2 & 1 & 0 \\\\ 4 & -1 & 3 \\end{pmatrix} \\quad (\\text{taille } 2 \\times 3)$$

L'**ordre est important** : "$m \\times n$" = lignes × colonnes. Cet ordre pilote quelles opérations sont possibles.

Tu peux voir une matrice comme :
- Un **paquet de vecteurs** empilés (chaque ligne ou colonne est un vecteur).
- Une **transformation** qui mange un vecteur et en recrache un autre (rotation, zoom, projection...).

## Les opérations sur matrices

**Addition** : pareil que pour les vecteurs, coefficient par coefficient — **possible uniquement si les deux matrices ont exactement la même taille**.

**Multiplication par un scalaire** : pareil, chaque coefficient est multiplié par le scalaire.

**Produit matriciel** $A B$ : c'est l'opération cruciale, et elle est **asymétrique**. Pour pouvoir la faire, il faut que le **nombre de colonnes de $A$ = nombre de lignes de $B$**. Si $A$ est $m \\times n$ et $B$ est $n \\times p$, le produit $AB$ est de taille $m \\times p$.

Le coefficient $(i, j)$ du produit est le **produit scalaire** de la ligne $i$ de $A$ avec la colonne $j$ de $B$ :

$$(AB)_{ij} \\;=\\; \\sum_{k=1}^n a_{ik}\\,b_{kj}$$

**Règle pratique** pour un produit $2 \\times 2$ : tu parcours ligne par ligne chez $A$, colonne par colonne chez $B$, et tu fais la somme des produits.

$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} e & f \\\\ g & h \\end{pmatrix} = \\begin{pmatrix} ae + bg & af + bh \\\\ ce + dg & cf + dh \\end{pmatrix}$$

**Propriété contre-intuitive** : le produit matriciel **n'est pas commutatif**. En général, $AB \\ne BA$ (parfois même l'un existe et pas l'autre à cause des dimensions).

## Le déterminant et l'inverse (matrices 2×2)

Le **déterminant** d'une matrice carrée 2×2 est un nombre calculé ainsi :

$$\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$$

Ce nombre **dit si la matrice est inversible** (c'est-à-dire si on peut "défaire" la transformation). Deux cas :

- Si $\\det A \\ne 0$ : $A$ est **inversible**, on peut calculer $A^{-1}$ tel que $A A^{-1} = I$ (identité).
- Si $\\det A = 0$ : $A$ est **singulière**, non inversible — elle "écrase" l'espace sur une dimension plus petite, information perdue.

Pour une matrice 2×2 inversible :

$$A^{-1} \\;=\\; \\frac{1}{\\det A} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$

Mnémotechnique : on **échange les coefficients diagonaux** ($a$ et $d$), on **change le signe** des anti-diagonaux ($b$ et $c$), on **divise par le déterminant**.

> [!example]
> **Trois calculs détaillés.**
>
> **(a) Produit scalaire.** $\\vec{u} = (1, 2, 3)$, $\\vec{v} = (4, 5, 6)$.
> - $\\vec{u} \\cdot \\vec{v} = 1 \\cdot 4 + 2 \\cdot 5 + 3 \\cdot 6 = 4 + 10 + 18 = 32$.
>
> **(b) Produit matriciel 2×2.** $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$, $B = \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix}$.
> - Coeff (1,1) : ligne 1 de $A$ · colonne 1 de $B$ = $1 \\cdot 5 + 2 \\cdot 7 = 5 + 14 = 19$.
> - Coeff (1,2) : $1 \\cdot 6 + 2 \\cdot 8 = 6 + 16 = 22$.
> - Coeff (2,1) : $3 \\cdot 5 + 4 \\cdot 7 = 15 + 28 = 43$.
> - Coeff (2,2) : $3 \\cdot 6 + 4 \\cdot 8 = 24 + 32 = 56$.
> - Bilan : $AB = \\begin{pmatrix} 19 & 22 \\\\ 43 & 50 \\end{pmatrix}$.
>
> **(c) Inverse.** $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}$.
> - $\\det A = 2 \\cdot 3 - 1 \\cdot 1 = 6 - 1 = 5$. Comme $\\ne 0$, $A$ est inversible.
> - $A^{-1} = \\dfrac{1}{5} \\begin{pmatrix} 3 & -1 \\\\ -1 & 2 \\end{pmatrix}$.
> - Vérification rapide : $A A^{-1} = \\dfrac{1}{5}\\begin{pmatrix} 2 \\cdot 3 + 1 \\cdot (-1) & 2 \\cdot (-1) + 1 \\cdot 2 \\\\ 1 \\cdot 3 + 3 \\cdot (-1) & 1 \\cdot (-1) + 3 \\cdot 2 \\end{pmatrix} = \\dfrac{1}{5} \\begin{pmatrix} 5 & 0 \\\\ 0 & 5 \\end{pmatrix} = I$. ✓

> [!warning]
> **Pièges classiques.**
>
> - **Dimensions incompatibles** pour le produit. $A$ de $2 \\times 3$ et $B$ de $2 \\times 2$ : $AB$ **impossible** (il faut 3 colonnes en $A$, pas 2). Toujours vérifier l'accord colonnes(A) = lignes(B).
> - **Commuter** le produit. $AB \\ne BA$ en général. Si un énoncé te demande $AB$, calcule $AB$, pas $BA$.
> - **Signe dans l'inverse.** C'est $-b$ et $-c$ qui changent de signe, pas $a$ ni $d$. Prends ton temps pour l'écrire.
> - **Produit scalaire vs produit composante.** $u \\cdot v$ **sommé** donne **un nombre**, alors que $(u_1 v_1, u_2 v_2, \\ldots)$ (produit composante par composante) reste un vecteur. Ne les confonds pas.
> - **Oublier la condition $\\det \\ne 0$** avant d'écrire $A^{-1}$. Si $\\det A = 0$, $A^{-1}$ **n'existe pas**.

## À quoi ça sert en pratique

- **Graphisme / 3D** : une rotation 2D d'angle $\\theta$ est la matrice $\\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$. Multiplier cette matrice par un vecteur point fait tourner le point.
- **ML / LLMs** : chaque couche d'un réseau de neurones est une multiplication matricielle $W \\vec{x} + \\vec{b}$ suivie d'une non-linéarité. Entraîner un modèle = trouver les bonnes matrices $W$.
- **Recherche sémantique** : les embeddings sont des vecteurs ; la similarité entre deux textes se lit dans leur produit scalaire normalisé (= similarité cosinus, prochain chapitre).
- **Résolution de systèmes linéaires** : $A \\vec{x} = \\vec{b}$ se résout avec $\\vec{x} = A^{-1} \\vec{b}$ quand $A$ est inversible.

> [!tip]
> **Vérifier un produit matriciel en 10 secondes.** Avant même de commencer, vérifie **les dimensions** : si $A$ est $m \\times n$ et $B$ est $n \\times p$, le résultat est $m \\times p$. Si ces chiffres ne collent pas, tu t'es planté. Note-les au crayon à côté : "$2 \\times 3 \\,\\cdot\\, 3 \\times 2 \\,=\\, 2 \\times 2$".

> [!colibrimo]
> Sur Colibrimo, les **embeddings** de descriptions de chantiers sont des vecteurs de $\\mathbb{R}^{768}$ (le modèle Gemini sortie 768 dimensions). Chaque recherche de similarité calcule un produit scalaire entre le vecteur requête et chaque vecteur en base — sur **pgvector avec un index HNSW**, c'est fait en $O(\\log n)$ au lieu de $O(n)$. Comprendre vecteurs et produits scalaires ici, c'est comprendre **exactement** comment la recherche fonctionne en back.`,
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
        title: "Similarité cosinus : mesurer à quel point deux vecteurs se ressemblent",
        estimated_minutes: 15,
        content_md: `## Pourquoi tu dois maîtriser ça

Dès que tu veux comparer deux données représentées par des vecteurs — deux phrases, deux images, deux utilisateurs, deux chantiers — il te faut **une règle pour dire "elles se ressemblent combien"**. La similarité cosinus est la règle **numéro 1** utilisée en IA moderne : RAG (Retrieval-Augmented Generation), moteurs de recherche sémantique, systèmes de recommandation, clustering de documents, tout ce qui manipule des **embeddings**. Quand tu demandes à ChatGPT de retrouver un passage dans un document, c'est une similarité cosinus qui est calculée en coulisse. C'est aussi un sujet où le jury peut te demander de calculer à la main sur un petit exemple — et surtout de savoir **pourquoi** on utilise ça plutôt que la distance classique.

> [!note]
> **Ce qu'il faut savoir avant** : le **produit scalaire** et la **norme** d'un vecteur (chapitre vecteurs/matrices). Si $\\vec{u} \\cdot \\vec{v}$ et $\\|\\vec{u}\\|$ ne te parlent pas, reviens d'abord dessus — la similarité cosinus est littéralement une combinaison de ces deux outils.

## L'idée intuitive

Tu as deux flèches qui partent de l'origine. Comment dire à quel point elles pointent **dans la même direction** ?

Une première idée : mesurer **la distance entre leurs extrémités**. Problème : si tu as deux flèches qui pointent exactement dans le même sens mais dont l'une fait 10 fois la taille de l'autre, la distance entre leurs extrémités sera énorme — alors que la **direction** est identique.

La similarité cosinus résout ce problème : elle ne regarde **que l'angle** entre les deux flèches. Si l'angle vaut 0° (même direction), la similarité vaut 1 (maximum). Si l'angle vaut 90° (perpendiculaires), elle vaut 0 (aucun rapport). Si l'angle vaut 180° (directions opposées), elle vaut -1 (opposition totale).

C'est **robuste à la "taille"** des vecteurs. Deux documents, l'un court l'autre long, qui parlent des mêmes sujets dans les mêmes proportions, auront une similarité cosinus élevée même si leurs normes sont très différentes.

## La définition formelle

La similarité cosinus entre deux vecteurs $\\vec{u}$ et $\\vec{v}$ est définie par :

$$\\cos\\theta \\;=\\; \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\cdot \\|\\vec{v}\\|}$$

**D'où ça sort ?** Rappelle-toi la formule géométrique du produit scalaire :
$$\\vec{u} \\cdot \\vec{v} = \\|\\vec{u}\\| \\cdot \\|\\vec{v}\\| \\cdot \\cos\\theta$$
On isole $\\cos\\theta$ en divisant des deux côtés par les normes. La similarité cosinus, c'est **littéralement le $\\cos$ de l'angle**.

**Interprétation des valeurs.**

| Valeur | Angle | Signification |
|--------|-------|---------------|
| $1$ | $0°$ | **Identique** en direction (vecteurs colinéaires même sens) |
| $\\approx 0{,}7$ | $\\approx 45°$ | Fortement similaire |
| $0$ | $90°$ | **Orthogonaux** — aucun rapport |
| $-0{,}7$ | $135°$ | Opposés modérément |
| $-1$ | $180°$ | **Opposition parfaite** (directions inverses) |

En pratique avec des embeddings de texte, les valeurs tournent entre 0 et 1 (rarement négatives), et on considère souvent qu'au-dessus de ~0,7 les textes parlent clairement du même sujet.

## La formule explicite en $\\mathbb{R}^n$

En développant produit scalaire et normes :

$$\\cos\\theta \\;=\\; \\frac{\\sum_{i=1}^n u_i \\, v_i}{\\sqrt{\\sum_{i=1}^n u_i^2} \\cdot \\sqrt{\\sum_{i=1}^n v_i^2}}$$

Le calcul coûte **$O(n)$** (on parcourt les composantes une fois). Sur un embedding en 768 dimensions, c'est 768 multiplications + 2 racines carrées. Très rapide sur un couple ; le problème apparaît quand on veut chercher parmi **des millions** de vecteurs (on verra l'astuce juste en dessous).

## Méthode de calcul (3 étapes)

Pour calculer $\\cos\\theta$ à la main :

1. **Produit scalaire** $\\vec{u} \\cdot \\vec{v}$ : somme des produits composante par composante.
2. **Normes** $\\|\\vec{u}\\|$ et $\\|\\vec{v}\\|$ : racine carrée de la somme des carrés.
3. **Diviser** le produit scalaire par le produit des deux normes.

> [!example]
> **Trois calculs détaillés.**
>
> **(a) 2D simple.** $\\vec{u} = (1, 0)$, $\\vec{v} = (1, 1)$.
> - Produit scalaire : $1 \\cdot 1 + 0 \\cdot 1 = 1$.
> - Normes : $\\|\\vec{u}\\| = \\sqrt{1^2 + 0^2} = 1$, $\\|\\vec{v}\\| = \\sqrt{1^2 + 1^2} = \\sqrt{2}$.
> - Similarité : $\\cos\\theta = \\dfrac{1}{1 \\cdot \\sqrt{2}} = \\dfrac{1}{\\sqrt{2}} \\approx 0{,}707$.
> - Interprétation : angle de 45°. Les flèches partagent partiellement la même direction.
>
> **(b) Orthogonalité.** $\\vec{u} = (1, 0, 0)$, $\\vec{v} = (0, 1, 0)$.
> - Produit scalaire : $1 \\cdot 0 + 0 \\cdot 1 + 0 \\cdot 0 = 0$.
> - Similarité : $\\cos\\theta = 0$ → vecteurs **orthogonaux** (aucun rapport). Pas besoin de calculer les normes, dès que le numérateur vaut 0 c'est fini.
>
> **(c) Cas vecteurs alignés.** $\\vec{u} = (2, 4)$, $\\vec{v} = (1, 2)$.
> - Produit scalaire : $2 \\cdot 1 + 4 \\cdot 2 = 2 + 8 = 10$.
> - Normes : $\\|\\vec{u}\\| = \\sqrt{4 + 16} = \\sqrt{20}$, $\\|\\vec{v}\\| = \\sqrt{1 + 4} = \\sqrt{5}$.
> - Dénominateur : $\\sqrt{20} \\cdot \\sqrt{5} = \\sqrt{100} = 10$.
> - Similarité : $\\cos\\theta = 10 / 10 = 1$. **Direction identique** — normal, $\\vec{u} = 2\\vec{v}$ (l'un est multiple de l'autre).

## L'astuce de la normalisation

Calculer les deux normes à chaque requête, c'est coûteux. L'astuce utilisée en prod dans tous les systèmes de recherche vectorielle : **pré-normaliser** les vecteurs à la norme 1 au moment où on les stocke.

Si $\\|\\vec{u}\\| = 1$ et $\\|\\vec{v}\\| = 1$, alors le dénominateur vaut 1, et la formule devient :

$$\\cos\\theta \\;=\\; \\vec{u} \\cdot \\vec{v}$$

**Un simple produit scalaire**, plus aucune racine carrée. Pour $n$ documents en base, ça évite $n$ calculs de norme à chaque requête — gain énorme sur 1M+ de vecteurs.

Pour normaliser un vecteur à la main : $\\hat{u} = \\vec{u} / \\|\\vec{u}\\|$.

> [!warning]
> **Pièges qui coûtent.**
>
> - **Confondre similarité cosinus et distance cosinus.** La **distance cosinus** vaut $1 - \\cos\\theta$ (elle va de 0 à 2). Une petite distance = grande similarité. Dans certaines lib (scipy, pgvector) l'opérateur renvoie la **distance**, pas la similarité. Lis la doc avant d'interpréter.
> - **Utiliser sur des vecteurs presque nuls.** Si $\\vec{u}$ a une norme très proche de 0, le résultat devient numériquement instable (division par un tout petit nombre). En pratique, on filtre ces vecteurs en amont.
> - **Oublier la normalisation avant $\\langle \\cdot \\rangle$.** Si tu utilises l'opérateur inner-product \`<#>\` de pgvector sans avoir normalisé tes embeddings, tu ne calcules **pas** la similarité cosinus, juste un produit scalaire brut.
> - **Comparer des embeddings de modèles différents.** Les dimensions doivent matcher **et** venir du même modèle (sinon le même mot n'est pas au même endroit dans l'espace). Sinon la similarité n'a aucun sens.
> - **Dimension incorrecte.** Si $\\vec{u} \\in \\mathbb{R}^{768}$ et $\\vec{v} \\in \\mathbb{R}^{512}$, tu ne peux **pas** calculer leur similarité — les composantes ne s'alignent pas.

## À quoi ça sert en pratique

- **Recherche sémantique** : on compare l'embedding de la requête utilisateur à tous les embeddings en base, on renvoie les $k$ plus proches.
- **RAG** (Retrieval-Augmented Generation) : le LLM reçoit les passages les plus similaires à la question pour répondre avec des sources.
- **Clustering de documents** : on groupe les documents dont la similarité mutuelle est au-dessus d'un seuil.
- **Systèmes de recommandation** : "les utilisateurs qui te ressemblent (vecteur similaire) ont aussi aimé X".
- **Détection de doublons / plagiat** : deux textes avec similarité proche de 1 sont probablement des copies.

> [!tip]
> **Raccourci de calcul.** Si on te dit "ces vecteurs sont normalisés" ou "ces embeddings sont L2-normalisés", tu peux sauter le calcul des normes et directement faire le **produit scalaire** — c'est la similarité cosinus. Gain de temps énorme en contrôle.

> [!colibrimo]
> Sur Colibrimo, chaque description de chantier passe dans **Gemini embedding**, qui renvoie un vecteur déjà normalisé de dimension 768. On stocke dans **pgvector** et on utilise l'opérateur \`<#>\` (inner product) qui est plus rapide que \`<->\` (L2 distance). La recherche sémantique de chantiers similaires = **une similarité cosinus**, littéralement ce qu'on vient de voir, exécutée des milliers de fois par jour en prod.`,
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
        title: "Loi normale : la cloche qui décrit presque tout",
        estimated_minutes: 18,
        content_md: `## Pourquoi tu dois maîtriser ça

La loi normale (la fameuse **"courbe en cloche"**) est la distribution la plus importante en probabilités et en statistiques. Elle décrit **naturellement** une foule de phénomènes : la taille des gens, les erreurs de mesure en physique, les scores à un examen, le bruit dans un signal électronique, les variations d'un cours de bourse. Elle est aussi au cœur des **intervalles de confiance** (quand un sondage te dit "55% ± 3%"), des **tests statistiques** (A/B tests, validation clinique), et en ML de l'initialisation des poids d'un réseau de neurones. Le jury peut te demander soit d'utiliser la règle "68 / 95 / 99,7", soit d'expliquer pourquoi cette loi apparaît autant (réponse : le **théorème central limite**).

> [!note]
> **Ce qu'il faut savoir avant** : la notion de **probabilité** d'un événement (valeurs entre 0 et 1), l'idée de **variable aléatoire** ($X$ est un nombre qui peut varier selon l'issue), et surtout **espérance** $E[X]$ (valeur moyenne attendue) et **variance** $\\mathrm{Var}(X)$ / **écart-type** $\\sigma$ (combien $X$ s'écarte en général de sa moyenne). $\\sigma$ est la **racine carrée** de la variance.

## L'idée intuitive

Imagine que tu mesures la taille de 10 000 adultes. Si tu fais un histogramme, tu ne vas **pas** obtenir une forme rectangulaire ou triangulaire : tu vas obtenir une **cloche**, avec la plupart des gens autour de la moyenne, des extrêmes rares des deux côtés, et une décroissance rapide loin du centre. Cette forme est universelle dès qu'on additionne plein de petits effets indépendants (des milliers de gènes pour la taille, de la nutrition à l'adolescence, du sommeil, etc.). C'est **la** loi de la nature pour les phénomènes de ce type.

Deux paramètres pilotent entièrement cette cloche :
- **$\\mu$ (mu)** = l'**espérance**, la **moyenne**, le **centre** de la cloche. C'est où elle est "posée" sur l'axe des $x$.
- **$\\sigma$ (sigma)** = l'**écart-type**, la **largeur** de la cloche. Plus $\\sigma$ est grand, plus la cloche est étalée ; plus $\\sigma$ est petit, plus elle est pointue et resserrée autour de $\\mu$.

On note $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$ pour dire "$X$ suit une loi normale de moyenne $\\mu$ et de variance $\\sigma^2$". Attention : dans la notation, c'est la **variance** $\\sigma^2$, pas l'écart-type, qui apparaît.

## La définition formelle (densité)

La **densité de probabilité** (= la "hauteur" de la cloche au point $x$) est :

$$f(x) \\;=\\; \\frac{1}{\\sigma\\,\\sqrt{2\\pi}} \\, \\exp\\!\\left(-\\,\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)$$

Décomposons ce qui peut faire peur dans cette formule :
- **$(x - \\mu)^2$** : l'écart au carré entre $x$ et le centre. Plus $x$ est loin de $\\mu$, plus ce terme est grand.
- **$\\exp(-\\ldots)$** : on prend l'exponentielle du **négatif** de cet écart — ça donne une décroissance **très** rapide quand on s'éloigne du centre. À 3$\\sigma$, la cloche est déjà quasi plate.
- **$2\\sigma^2$ au dénominateur de l'exposant** : c'est ce qui règle **la vitesse** de décroissance. Si $\\sigma$ est grand, l'exposant reste petit même loin du centre → cloche large. Si $\\sigma$ est petit, l'exposant explose vite → cloche pointue.
- **$\\dfrac{1}{\\sigma \\sqrt{2\\pi}}$** : une **constante de normalisation** pour que l'aire totale sous la cloche vaille exactement 1 (c'est obligatoire pour une densité de probabilité). Tu n'as pas à la retenir par cœur pour un entretien.

**Ce qu'il faut retenir** : $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$ a pour espérance $\\mu$, variance $\\sigma^2$, écart-type $\\sigma$, cloche symétrique autour de $\\mu$.

## La règle **68 / 95 / 99,7**

C'est **la** règle à connaître **par cœur** — elle permet d'estimer très vite des probabilités sans toucher à la formule.

- $P(\\mu - \\sigma \\le X \\le \\mu + \\sigma) \\approx \\mathbf{68\\%}$ — 2/3 des tirages sont à moins d'un écart-type du centre.
- $P(\\mu - 2\\sigma \\le X \\le \\mu + 2\\sigma) \\approx \\mathbf{95\\%}$ — 95% sont à moins de deux écarts-types.
- $P(\\mu - 3\\sigma \\le X \\le \\mu + 3\\sigma) \\approx \\mathbf{99{,}7\\%}$ — dépasser 3$\\sigma$ est ultra-rare (3 chances sur 1000).

**Conséquence pratique** : si une mesure s'écarte de plus de 3$\\sigma$ de la moyenne, c'est **louche** (soit erreur, soit le modèle normal ne s'applique plus).

## La standardisation : passer à la loi normale centrée réduite

Pour calculer une probabilité précise $P(X \\le x)$, on ne s'amuse jamais à intégrer la densité à la main. On **standardise** $X$ pour se ramener à la loi normale **centrée réduite** $\\mathcal{N}(0, 1)$, dont les valeurs sont tabulées (table de $\\Phi$) ou disponibles via une simple fonction \`normalCdf\` en code.

Transformation :
$$Z \\;=\\; \\frac{X - \\mu}{\\sigma}$$

Si $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$, alors $Z \\sim \\mathcal{N}(0, 1)$. On a alors :
$$P(X \\le x) = P\\!\\left(Z \\le \\frac{x - \\mu}{\\sigma}\\right) = \\Phi\\!\\left(\\frac{x - \\mu}{\\sigma}\\right)$$

$\\Phi(z)$ est la **fonction de répartition** de la loi normale centrée réduite. Quelques valeurs à retenir :
- $\\Phi(0) = 0{,}5$ (moitié à gauche, moitié à droite).
- $\\Phi(1) \\approx 0{,}8413$.
- $\\Phi(2) \\approx 0{,}9772$.
- $\\Phi(3) \\approx 0{,}9987$.

> [!example]
> **Trois calculs détaillés.**
>
> **(a) Règle 95% directe.** $X \\sim \\mathcal{N}(170, 10^2)$ (taille en cm). Dans quel intervalle se trouve 95% de la population ?
> - Règle 95% = $\\mu \\pm 2\\sigma$ = $170 \\pm 20$ = $[150, 190]$ cm.
>
> **(b) Standardisation avec table.** QI : $X \\sim \\mathcal{N}(100, 15^2)$. $P(X \\le 115) = \\,?$
> - Standardiser : $z = (115 - 100)/15 = 1$.
> - Lire dans la table : $\\Phi(1) \\approx 0{,}8413$.
> - Conclusion : environ **84%** de la population a un QI inférieur ou égal à 115.
>
> **(c) Intervalle à la main.** $X \\sim \\mathcal{N}(50, 5^2)$. $P(45 \\le X \\le 55) = \\,?$
> - $45$ et $55$ correspondent à $\\mu \\pm \\sigma$ : on applique la règle 68%.
> - Conclusion : **environ 68%**. Pas besoin de table pour ce cas.
>
> **(d) Hors règle, avec deux valeurs.** $X \\sim \\mathcal{N}(0, 1)$. $P(X \\le 1{,}5)$ ?
> - $1{,}5$ n'est pas rond (ni 1, ni 2, ni 3) : on **lit la table** → $\\Phi(1{,}5) \\approx 0{,}9332$. Soit 93%.

## Le théorème central limite (TCL)

Cette loi est partout pour une raison profonde : le **théorème central limite**. Version simple :

**Dès que tu prends la moyenne d'un grand nombre $n$ de mesures indépendantes, la distribution de cette moyenne tend vers une loi normale — quelle que soit la distribution de départ.**

Formellement, si $X_1, \\ldots, X_n$ sont indépendantes, de même loi, de moyenne $\\mu$ et variance $\\sigma^2$ finie, alors quand $n \\to \\infty$ :
$$\\frac{\\bar{X}_n - \\mu}{\\sigma / \\sqrt{n}} \\;\\to\\; \\mathcal{N}(0, 1)$$
où $\\bar{X}_n = (X_1 + \\ldots + X_n)/n$ est la moyenne empirique.

**Implication concrète** : dès qu'un phénomène est le résultat de plein de petites contributions indépendantes (mille gènes pour la taille, mille neurones qui bruitent un signal), sa distribution est **approximativement normale**. Voilà pourquoi cette loi apparaît **partout** en statistiques et en physique.

> [!warning]
> **Pièges fréquents.**
>
> - **Confondre variance et écart-type.** $\\mathcal{N}(\\mu, \\sigma^2)$ utilise la variance dans la notation ; quand on parle de "plus ou moins 2 écarts-types", c'est $2\\sigma$, pas $2\\sigma^2$. Et $\\sigma = \\sqrt{\\sigma^2}$.
> - **Oublier la standardisation.** Pour utiliser la table de $\\Phi$, il faut **obligatoirement** se ramener à $\\mathcal{N}(0,1)$ via $z = (x - \\mu)/\\sigma$. La table ne prend pas $X$ directement.
> - **Confondre $P(X \\le x)$ et $P(X \\ge x)$.** $\\Phi$ donne le cumul **à gauche**. Pour la probabilité à droite, fais $1 - \\Phi(z)$. Pour un intervalle, $\\Phi(z_2) - \\Phi(z_1)$.
> - **Croire que la normalité s'applique partout.** La règle 68/95/99,7 **n'est vraie** que pour des données qui suivent à peu près une loi normale. Appliquée à des temps de réponse, des durées de tâche, ou des revenus, elle donne n'importe quoi — ces distributions sont **asymétriques**.
> - **Confondre $\\sigma^2 = 25$ avec $\\sigma = 25$.** Si la variance est 25, l'écart-type est $\\sqrt{25} = 5$. La différence est énorme sur les intervalles.

## À quoi ça sert en pratique

- **Qualité industrielle** : une pièce est conforme si sa dimension est à moins de $3\\sigma$ de la consigne (méthode **Six Sigma** — 3,4 défauts par million).
- **Intervalles de confiance** sur un sondage : $\\bar{X} \\pm 1{,}96 \\cdot \\sigma/\\sqrt{n}$ encadre la vraie moyenne à 95%.
- **A/B tests** : on modélise la différence entre variantes comme une normale, on décide sur le $z$-score.
- **Initialisation des poids** d'un réseau de neurones (tu tires les poids selon $\\mathcal{N}(0, \\sigma^2)$ avec $\\sigma$ calculé pour éviter que les signaux s'éteignent ou explosent).
- **Détection d'anomalies** : un point au-delà de $3\\sigma$ est suspect, on le flagge.

> [!tip]
> **Réflexe en situation d'entretien.** Dès qu'on te dit "loi normale, $\\mu = \\ldots$, $\\sigma = \\ldots$, quelle est la proba que...", regarde d'abord si les bornes sont à $\\mu \\pm 1\\sigma$, $\\pm 2\\sigma$ ou $\\pm 3\\sigma$. Si oui, tu réponds **sans calcul** avec la règle 68/95/99,7. Sinon, tu standardises et tu lis $\\Phi$.

> [!colibrimo]
> En dev ML / IA, tu vas croiser la loi normale surtout dans **l'initialisation des poids** (Xavier, He, etc.), dans le **bruit gaussien** qu'on ajoute en entraînement pour régulariser, et dans les **statistiques de métriques** quand tu A/B-testes deux versions d'un modèle. Sur Colibrimo, les temps de réponse API ne sont **pas** gaussiens (distribution log-normale, asymétrique) — bien le savoir évite de se planter en dashboards.`,
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
        title: "Bayes : mettre à jour ses croyances quand on observe une info",
        estimated_minutes: 18,
        content_md: `## Pourquoi tu dois maîtriser ça

La formule de Bayes est **l'outil** qui permet de répondre à la question : *"Sachant que j'observe $B$, quelle est vraiment la probabilité de $A$ ?"*. C'est la base des **tests médicaux**, des **filtres anti-spam**, de la **détection de fraude**, des **moteurs de recommandation**, et de tout ce qu'on appelle l'**inférence bayésienne** en ML. Le jury ISEN adore ce sujet parce qu'il révèle deux choses d'un coup : (1) est-ce que tu sais calculer ? (2) est-ce que tu as la **bonne intuition** quand un résultat est contre-intuitif (un test à 99% de fiabilité peut donner des résultats faux 80% du temps, on va voir pourquoi).

> [!note]
> **Ce qu'il faut savoir avant** : les **probabilités de base** ($P(A) \\in [0, 1]$, $P(\\text{univers}) = 1$), les notions d'**événement** et de **complémentaire** $\\bar{A}$ (le contraire de $A$), l'**intersection** $A \\cap B$ ("$A$ **et** $B$") et l'**union** $A \\cup B$ ("$A$ **ou** $B$"). Si ces notations te parlent pas, imagine un **diagramme de Venn** avec deux cercles qui se chevauchent.

## L'idée intuitive

Tu as une **croyance initiale** sur la probabilité d'un événement (appelée **a priori**). Puis tu **observes** quelque chose qui te donne une information. Tu veux **mettre à jour ta croyance** pour tenir compte de cette nouvelle info (appelée **a posteriori**). La formule de Bayes est la règle mathématique exacte pour faire ça.

**Exemple concret.** Tu penses qu'il y a 10% de chance qu'il pleuve demain (a priori). Puis tu vois des nuages noirs (observation). Tu mets à jour : maintenant tu crois qu'il y a 70% de chance qu'il pleuve (a posteriori). Comment passer rigoureusement de 10% à 70% ? Avec Bayes.

C'est aussi le cœur du **raisonnement scientifique** : une hypothèse part avec une probabilité a priori, on recueille des données, on met à jour la probabilité qu'elle soit vraie.

## Les outils : probabilité conditionnelle et indépendance

### Probabilité conditionnelle

$$P(A \\mid B) \\;=\\; \\frac{P(A \\cap B)}{P(B)} \\qquad (P(B) > 0)$$

Ça se lit **"probabilité de $A$ sachant $B$"**. Le trait vertical veut dire "sachant que" (pas "divisé par" — ne confonds pas).

**Intuition** : tu restreins ton univers aux cas où $B$ est vrai, et tu regardes quelle fraction de ces cas a aussi $A$. C'est un **zoom** sur une portion de ton univers de probabilités.

### Indépendance

Deux événements $A$ et $B$ sont **indépendants** si le fait de savoir que $B$ s'est produit ne change pas la probabilité de $A$ :
$$P(A \\mid B) = P(A) \\quad\\Longleftrightarrow\\quad P(A \\cap B) = P(A) \\cdot P(B)$$

**Exemple** : lancer deux dés. Le résultat du premier dé ne dit rien sur le second → indépendants. En revanche, "il pleut" et "j'ai un parapluie" ne sont pas indépendants (voir un parapluie me dit qu'il pleut probablement).

## La formule de Bayes

$$\\boxed{\\,P(A \\mid B) \\;=\\; \\frac{P(B \\mid A) \\cdot P(A)}{P(B)}\\,}$$

**Pourquoi elle est magique.** Souvent, la quantité que tu veux calculer, $P(A \\mid B)$, est difficile à mesurer directement. Mais la quantité inverse, $P(B \\mid A)$, est **facile** à mesurer. Bayes fait le pont entre les deux.

**Exemple médical.** Tu veux $P(\\text{malade} \\mid \\text{test positif})$. Tu ne peux pas la mesurer directement sur plein de gens. En revanche, $P(\\text{test positif} \\mid \\text{malade})$, c'est juste la **sensibilité** du test — mesurable en labo sur des patients déjà diagnostiqués.

**D'où elle vient.** De la définition de la probabilité conditionnelle, écrite deux fois :
- $P(A \\cap B) = P(A \\mid B) \\cdot P(B)$
- $P(A \\cap B) = P(B \\mid A) \\cdot P(A)$

Les deux membres de droite sont égaux. On isole $P(A \\mid B)$ :
$$P(A \\mid B) \\cdot P(B) = P(B \\mid A) \\cdot P(A) \\;\\;\\Rightarrow\\;\\; P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)}$$

## La loi des probabilités totales (pour calculer le dénominateur)

Le dénominateur $P(B)$ n'est souvent pas donné directement. On le reconstruit avec la **loi des probabilités totales** :

$$P(B) \\;=\\; P(B \\mid A) \\cdot P(A) \\;+\\; P(B \\mid \\bar{A}) \\cdot P(\\bar{A})$$

En français : "$B$ peut se produire **soit** quand $A$ est vrai, **soit** quand $A$ est faux". On additionne les deux cas pondérés par leur probabilité. Pratique : ça ne nécessite que **4 chiffres** — la prévalence $P(A)$, son complément $P(\\bar{A}) = 1 - P(A)$, et les deux conditionnelles.

**Formule Bayes "complète" avec la loi des proba totales au dénominateur** :

$$P(A \\mid B) \\;=\\; \\frac{P(B \\mid A) \\cdot P(A)}{P(B \\mid A) \\cdot P(A) + P(B \\mid \\bar{A}) \\cdot P(\\bar{A})}$$

C'est la version à utiliser à 95% du temps.

> [!example]
> **Le test médical (exemple canonique, à connaître par cœur).**
>
> Une maladie touche **1 personne sur 100** ($P(M) = 0{,}01$). Un test détecte correctement les malades dans **99%** des cas ($P(+ \\mid M) = 0{,}99$, **sensibilité**) et donne correctement un négatif chez les non-malades dans **95%** des cas ($P(- \\mid \\bar{M}) = 0{,}95$, **spécificité**, donc $P(+ \\mid \\bar{M}) = 0{,}05$ de **faux positifs**).
>
> **Ton test est positif. Quelle est la probabilité que tu sois réellement malade ?**
>
> Intuition naïve : "le test est fiable à 99%, je suis probablement malade à 99%." **FAUX.** On calcule.
>
> Étape 1 — on cherche $P(M \\mid +)$, on a besoin de $P(+)$.
> $$P(+) = P(+ \\mid M) \\cdot P(M) + P(+ \\mid \\bar{M}) \\cdot P(\\bar{M}) = 0{,}99 \\cdot 0{,}01 + 0{,}05 \\cdot 0{,}99 = 0{,}0099 + 0{,}0495 = 0{,}0594$$
>
> Étape 2 — Bayes.
> $$P(M \\mid +) = \\frac{P(+ \\mid M) \\cdot P(M)}{P(+)} = \\frac{0{,}99 \\cdot 0{,}01}{0{,}0594} \\approx 0{,}167$$
>
> **Conclusion : environ 17% seulement** de chance d'être réellement malade, même avec un test positif à 99% de sensibilité !
>
> **Pourquoi ce résultat contre-intuitif ?** Parce que la maladie est **très rare** (1%). Sur 10 000 personnes : 100 sont malades (dont 99 positifs) et 9 900 sont saines (dont 495 faux positifs). Sur tous les positifs (99 + 495 = 594), seulement 99 sont vraiment malades → 99/594 ≈ 17%. L'a priori ($P(M) = 1\\%$) **écrase** la fiabilité du test.
>
> **Morale** : un test même très fiable **n'est utile que si on a une raison de suspecter la maladie avant le test**. C'est pour ça que les dépistages massifs sur population saine sont souvent contre-productifs.

> [!warning]
> **Pièges classiques — Bayes est le chapitre où on se plante le plus.**
>
> - **Inverser les conditionnelles.** $P(A \\mid B) \\ne P(B \\mid A)$ en général. C'est **LE** piège. Le test est positif à 99% chez les malades n'implique **pas** que 99% des positifs sont malades.
> - **Oublier l'a priori.** La probabilité $P(A)$ (prévalence, fréquence de base) change **tout**. Un test à 99% sur une maladie à 0,01% de prévalence donne presque que des faux positifs.
> - **Confondre $P(A, B)$, $P(A \\cap B)$, $P(A \\mid B)$.** Les deux premières sont la même chose (proba "$A$ et $B$ ensemble"). La troisième est conditionnelle.
> - **Ne pas normaliser.** Si tu ne divises pas par $P(B)$, tu n'as pas une probabilité — ton résultat ne somme pas à 1 sur les hypothèses concurrentes.
> - **Traiter comme indépendants des événements qui ne le sont pas.** Deux tests médicaux consécutifs ne sont pas indépendants (ils ont les mêmes biais). Tu ne peux pas juste multiplier leurs probabilités.
> - **Oublier le complémentaire $\\bar{A}$ dans la loi totale.** Dénominateur incomplet = résultat faux.

## À quoi ça sert en pratique

- **Tests médicaux** (comme ci-dessus) : évaluer le vrai poids d'un résultat positif.
- **Filtres anti-spam** : $P(\\text{spam} \\mid \\text{"viagra" dans le mail})$, combiné sur plein de mots → classifieur **Naive Bayes**.
- **Détection de fraude** : $P(\\text{fraude} \\mid \\text{pattern observé})$ sur les transactions bancaires.
- **Systèmes de recommandation** : $P(\\text{aime film X} \\mid \\text{historique utilisateur})$.
- **Inférence en ML** : les réseaux de neurones bayésiens utilisent Bayes pour apprendre **la distribution** des poids, pas une valeur unique.

> [!tip]
> **Check intuitif avant de rendre une réponse.** Si tu trouves $P(A \\mid B)$ très proche de $P(B \\mid A)$, **méfie-toi** — c'est rare en pratique (ça n'arrive que si $P(A) \\approx P(B)$). Si les prévalences $P(A)$ et $P(B)$ sont très différentes, $P(A \\mid B)$ et $P(B \\mid A)$ peuvent être des ordres de grandeur à part.

> [!colibrimo]
> Sur Colibrimo, on n'utilise pas Bayes en pur texte mais l'intuition derrière est partout dans la **détection d'anomalies** sur les devis : $P(\\text{suspect} \\mid \\text{montant anormal})$ dépend autant de la **base rate** de fraudes que du signal. Et la plupart des modèles de classification (Naive Bayes, régression logistique avec sigmoid) reposent conceptuellement sur cette formule.`,
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
