import type { TopicContent } from "./types";

export const PHYSIQUE_CONTENT: TopicContent[] = [
  // ==========================================================================
  // Loi d'Ohm
  // ==========================================================================
  {
    topic_id: "physique.elec.ohm",
    lessons: [
      {
        title: "Loi d'Ohm : $U = R \\cdot I$",
        estimated_minutes: 6,
        content_md: `## L'équation

Dans un conducteur ohmique :
$$U = R \\cdot I$$

- $U$ : tension aux bornes du dipôle, en **volts** (V)
- $I$ : intensité du courant, en **ampères** (A)
- $R$ : résistance, en **ohms** (Ω)

## Puissance dissipée

$$P = U \\cdot I = R \\cdot I^2 = \\frac{U^2}{R}$$

en **watts** (W). Ces 3 formes sont équivalentes — choisis celle qui élimine l'inconnue.

## Convention récepteur

Dans un récepteur (résistance, moteur…), $U$ et $I$ sont dans le **même sens**. La puissance $UI$ est alors **reçue** (>0).

> [!example]
> Une résistance $R = 220\\,\\Omega$ traversée par $I = 50\\,\\text{mA}$ :
> - $U = 220 \\times 0{,}05 = 11\\,\\text{V}$
> - $P = 220 \\times (0{,}05)^2 = 0{,}55\\,\\text{W}$ — compatible avec une 1/4 W.

## Ordre de grandeur à l'ISEN

| Objet | Résistance typique |
|-------|-------------------|
| Fil de cuivre 1 m | $\\sim 0{,}01\\,\\Omega$ |
| LED (en fonction) | $\\sim 100\\,\\Omega$ équivalent |
| Résistance d'appoint | 220 Ω à 10 kΩ |
| Thermistance NTC | 1 kΩ à 100 kΩ |`,
      },
    ],
    exercises: [
      {
        type: "numeric",
        difficulty: 1,
        question_md:
          "Tension $U$ aux bornes d'une résistance de $R = 1\\,\\text{k}\\Omega$ traversée par $I = 20\\,\\text{mA}$ ?",
        data: { answer: 20, tolerance: 0, unit: "V" },
        explanation_md: "$U = R \\cdot I = 1000 \\times 0{,}02 = 20\\,\\text{V}$.",
      },
      {
        type: "numeric",
        difficulty: 2,
        question_md:
          "Puissance dissipée dans une résistance $R = 100\\,\\Omega$ sous $U = 12\\,\\text{V}$ ?",
        data: { answer: 1.44, tolerance: 0.01, unit: "W" },
        explanation_md: "$P = U^2/R = 144/100 = 1{,}44\\,\\text{W}$.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Une LED a besoin de $I = 20\\,\\text{mA}$ sous une tension $V_{\\text{LED}} = 2\\,\\text{V}$. Alimentation = $5\\,\\text{V}$. Quelle résistance de limitation choisir (valeur normalisée la plus proche) ?",
        data: {
          choices: ["$100\\,\\Omega$", "$150\\,\\Omega$", "$1\\,\\text{k}\\Omega$", "$10\\,\\text{k}\\Omega$"],
          answer: 1,
        },
        explanation_md:
          "$U_R = 5 - 2 = 3\\,\\text{V}$. $R = U_R/I = 3/0{,}02 = 150\\,\\Omega$. Valeur normalisée : 150 Ω.",
      },
      {
        type: "numeric",
        difficulty: 2,
        question_md:
          "Intensité $I$ dans une résistance $R = 4{,}7\\,\\text{k}\\Omega$ sous $U = 9\\,\\text{V}$ (en mA) ?",
        data: { answer: 1.915, tolerance: 0.01, unit: "mA" },
        explanation_md: "$I = U/R = 9/4700 \\approx 1{,}915\\,\\text{mA}$.",
      },
      {
        type: "text",
        difficulty: 2,
        question_md:
          "Une résistance de 1/4 W est-elle adaptée pour dissiper 0,5 W sous 10 V ? Justifie.",
        data: {
          expected_key_points: ["calcul", "0,25 W max", "risque", "surchauffe", "non"],
          min_score: 0.6,
        },
        explanation_md:
          "La puissance nominale 1/4 W = 0,25 W est la limite thermique. Sous 10 V dans une charge qui dissipe 0,5 W, on dépasse donc de 2× : risque de surchauffe voire de destruction. Il faut une résistance 1 W (marge) ou augmenter R pour limiter le courant.",
      },
    ],
    flashcards: [
      {
        front_md: "Loi d'Ohm + unités",
        back_md:
          "$U = R \\cdot I$. $U$ en V, $R$ en Ω, $I$ en A.",
        tags: ["ohm"],
      },
      {
        front_md: "Puissance dissipée dans une résistance — 3 formes",
        back_md: "$P = UI = RI^2 = U^2/R$",
        tags: ["ohm", "puissance"],
      },
      {
        front_md: "Comment dimensionner une résistance de limitation pour une LED ?",
        back_md:
          "$R = (V_{alim} - V_{LED})/I_{LED}$ puis vérifier $P = (V_{alim} - V_{LED})^2/R < P_{max}$.",
        tags: ["ohm", "led"],
      },
    ],
  },

  // ==========================================================================
  // Lois de Kirchhoff
  // ==========================================================================
  {
    topic_id: "physique.elec.kirchhoff",
    lessons: [
      {
        title: "Lois de Kirchhoff : nœuds et mailles",
        estimated_minutes: 7,
        content_md: `## Loi des nœuds (KCL)

La somme algébrique des courants **entrant** dans un nœud égale la somme des courants **sortant** :
$$\\sum I_{\\text{entrant}} = \\sum I_{\\text{sortant}}$$

Conservation de la charge : rien ne s'accumule dans un fil.

## Loi des mailles (KVL)

La somme algébrique des tensions sur une maille fermée vaut zéro :
$$\\sum U_i = 0$$

Conservation de l'énergie : en faisant un tour complet, on revient au même potentiel.

## Convention de signe

Dans une maille :
- Tension **positive** si on la parcourt dans le sens de la flèche.
- **Négative** si on la parcourt à contre-sens.

> [!example]
> Un générateur $E = 12\\,\\text{V}$ en série avec deux résistances $R_1 = 100\\,\\Omega$ et $R_2 = 200\\,\\Omega$.
>
> Loi des mailles : $E - R_1 I - R_2 I = 0$ ⇒ $I = E / (R_1 + R_2) = 12 / 300 = 40\\,\\text{mA}$.

## Dualité

- Loi des nœuds = conservation de la **charge** (Q).
- Loi des mailles = conservation de l'**énergie** (U).`,
      },
    ],
    exercises: [
      {
        type: "numeric",
        difficulty: 1,
        question_md:
          "À un nœud arrivent $I_1 = 3\\,\\text{A}$ et $I_2 = 2\\,\\text{A}$, et en sortent $I_3$ et $I_4 = 1{,}5\\,\\text{A}$. Que vaut $I_3$ (en A) ?",
        data: { answer: 3.5, tolerance: 0, unit: "A" },
        explanation_md:
          "KCL : $I_1 + I_2 = I_3 + I_4$ ⇒ $3 + 2 = I_3 + 1{,}5$ ⇒ $I_3 = 3{,}5\\,\\text{A}$.",
      },
      {
        type: "numeric",
        difficulty: 2,
        question_md:
          "Générateur $E = 9\\,\\text{V}$ en série avec $R_1 = 100\\,\\Omega$, $R_2 = 200\\,\\Omega$, $R_3 = 150\\,\\Omega$. Courant de boucle $I$ (en mA) ?",
        data: { answer: 20, tolerance: 0.5, unit: "mA" },
        explanation_md:
          "KVL : $E = (R_1+R_2+R_3) I = 450 I$ ⇒ $I = 9/450 = 20\\,\\text{mA}$.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md: "Que traduit la **loi des mailles** de Kirchhoff ?",
        data: {
          choices: [
            "La conservation de la charge",
            "La conservation de l'énergie",
            "La loi d'Ohm généralisée",
            "Le principe de superposition",
          ],
          answer: 1,
        },
        explanation_md:
          "Sur une boucle fermée, la somme des tensions = 0, ce qui traduit qu'en revenant au point de départ on a la même énergie potentielle.",
      },
      {
        type: "numeric",
        difficulty: 3,
        question_md:
          "Dans le circuit : $E = 10\\,\\text{V}$, $R_1 = 2\\,\\Omega$ en série avec un parallèle $R_2 = 3\\,\\Omega$ et $R_3 = 6\\,\\Omega$. Courant total (en A) ?",
        data: { answer: 2.5, tolerance: 0.05, unit: "A" },
        explanation_md:
          "Parallèle : $R_{23} = (3 \\times 6)/(3+6) = 2\\,\\Omega$. Total série : $R_{eq} = 2 + 2 = 4\\,\\Omega$. $I = E/R_{eq} = 10/4 = 2{,}5\\,\\text{A}$.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Quel principe physique la loi des nœuds exprime-t-elle ?",
        data: {
          choices: [
            "Conservation de l'énergie",
            "Conservation de la charge",
            "Loi d'Ohm",
            "Principe de Pauli",
          ],
          answer: 1,
        },
        explanation_md:
          "Pas d'accumulation de charge dans un fil ⇒ tout ce qui entre doit sortir. C'est une forme locale de la conservation de la charge.",
      },
    ],
    flashcards: [
      {
        front_md: "Loi des nœuds (KCL)",
        back_md:
          "Somme des courants entrants = somme des courants sortants à chaque nœud. Traduit la **conservation de la charge**.",
        tags: ["kirchhoff"],
      },
      {
        front_md: "Loi des mailles (KVL)",
        back_md:
          "Somme algébrique des tensions sur une maille fermée = 0. Traduit la **conservation de l'énergie**.",
        tags: ["kirchhoff"],
      },
    ],
  },

  // ==========================================================================
  // Associations de résistances
  // ==========================================================================
  {
    topic_id: "physique.elec.assoc_resistances",
    lessons: [
      {
        title: "Résistances série et parallèle",
        estimated_minutes: 7,
        content_md: `## En série

Résistances parcourues par **le même courant**. Additionnent :
$$R_{eq} = R_1 + R_2 + \\ldots + R_n$$

## En parallèle

Résistances soumises à **la même tension**. Conductances s'additionnent :
$$\\frac{1}{R_{eq}} = \\frac{1}{R_1} + \\ldots + \\frac{1}{R_n}$$

Cas à **deux résistances** en parallèle :
$$R_{eq} = \\frac{R_1 R_2}{R_1 + R_2}$$

> [!example]
> $R_1 = 100\\,\\Omega$ en parallèle avec $R_2 = 200\\,\\Omega$ :
> $R_{eq} = (100 \\times 200) / 300 \\approx 66{,}7\\,\\Omega$.
> Remarque : $R_{eq}$ est toujours **inférieure** à la plus petite des deux.

## Pont diviseur de tension

Deux résistances $R_1, R_2$ en série entre $U$ et la masse. Tension intermédiaire :
$$U_{R_2} = U \\cdot \\frac{R_2}{R_1 + R_2}$$

Utilisé pour créer une tension de référence, lire une thermistance, etc.

## Pont diviseur de courant

Deux résistances $R_1, R_2$ en parallèle :
$$I_{R_1} = I_{\\text{total}} \\cdot \\frac{R_2}{R_1 + R_2}$$

Le courant se **divise à l'inverse** des résistances : plus $R_1$ est petite, plus $I_{R_1}$ est grand.`,
      },
    ],
    exercises: [
      {
        type: "circuit",
        difficulty: 1,
        question_md:
          "Résistance équivalente de $R_1 = 100\\,\\Omega$ et $R_2 = 220\\,\\Omega$ en **série** ?",
        data: {
          components: [
            { type: "R", label: "R1", value: 100 },
            { type: "R", label: "R2", value: 220 },
          ],
          configuration: "series",
          question: "R_eq",
          answer: 320,
          tolerance: 0,
        },
        explanation_md: "Série : $R_{eq} = R_1 + R_2 = 100 + 220 = 320\\,\\Omega$.",
      },
      {
        type: "circuit",
        difficulty: 2,
        question_md:
          "Résistance équivalente de $R_1 = 100\\,\\Omega$ et $R_2 = 200\\,\\Omega$ en **parallèle** ?",
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
          "Parallèle : $R_{eq} = (R_1 R_2)/(R_1+R_2) = 20000/300 \\approx 66{,}67\\,\\Omega$.",
      },
      {
        type: "circuit",
        difficulty: 2,
        question_md: "$R_1 = R_2 = R_3 = 300\\,\\Omega$ tous en parallèle. $R_{eq}$ ?",
        data: {
          components: [
            { type: "R", label: "R1", value: 300 },
            { type: "R", label: "R2", value: 300 },
            { type: "R", label: "R3", value: 300 },
          ],
          configuration: "parallel",
          question: "R_eq",
          answer: 100,
          tolerance: 0.5,
        },
        explanation_md:
          "$n$ résistances identiques en parallèle : $R_{eq} = R/n = 300/3 = 100\\,\\Omega$.",
      },
      {
        type: "numeric",
        difficulty: 2,
        question_md:
          "Pont diviseur de tension : $U = 12\\,\\text{V}$, $R_1 = 1\\,\\text{k}\\Omega$, $R_2 = 2\\,\\text{k}\\Omega$. Quelle tension aux bornes de $R_2$ (en V) ?",
        data: { answer: 8, tolerance: 0, unit: "V" },
        explanation_md:
          "$U_{R_2} = U \\cdot R_2/(R_1+R_2) = 12 \\cdot 2/3 = 8\\,\\text{V}$.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Deux résistances en parallèle : que vaut toujours $R_{eq}$ par rapport à chacune ?",
        data: {
          choices: [
            "Plus grande que les deux",
            "Plus petite que la plus petite des deux",
            "Égale à la moyenne arithmétique",
            "Dépend du courant",
          ],
          answer: 1,
        },
        explanation_md:
          "En parallèle, on ajoute des **conductances** ⇒ la conductance augmente ⇒ la résistance diminue. $R_{eq} < \\min(R_1, R_2)$.",
      },
    ],
    flashcards: [
      {
        front_md: "Résistances en série et en parallèle : formules",
        back_md:
          "Série : $R_{eq} = R_1 + R_2$.  \nParallèle (2 résistances) : $R_{eq} = \\frac{R_1 R_2}{R_1 + R_2}$.",
        tags: ["resistances"],
      },
      {
        front_md: "Pont diviseur de tension",
        back_md: "$U_{R_2} = U \\cdot \\frac{R_2}{R_1 + R_2}$",
        tags: ["resistances"],
      },
    ],
  },

  // ==========================================================================
  // RC transitoire
  // ==========================================================================
  {
    topic_id: "physique.elec.rc_transitoire",
    lessons: [
      {
        title: "Circuit RC transitoire : charge et décharge",
        estimated_minutes: 9,
        content_md: `## Le circuit

Source $E$, résistance $R$, condensateur $C$ en série. Interrupteur ouvert ⇒ fermé à $t=0$.

## Constante de temps

$$\\tau = R \\cdot C$$

en secondes. Sur un graphique, c'est l'**abscisse de l'intersection** entre la tangente à l'origine et l'asymptote.

## Charge : $u_C(t)$

$$u_C(t) = E \\left(1 - e^{-t/\\tau}\\right)$$

- $t = 0$ : $u_C = 0$
- $t = \\tau$ : $u_C \\approx 0{,}63 E$
- $t = 3\\tau$ : $u_C \\approx 0{,}95 E$
- $t = 5\\tau$ : $u_C \\approx 0{,}993 E$ (considéré comme régime permanent)

## Décharge : $u_C(t)$

Si on court-circuite $R$ sur un condo chargé à $U_0$ :
$$u_C(t) = U_0 \\, e^{-t/\\tau}$$

## Équation différentielle

KVL sur la maille de charge :
$$E = R\\,i + u_C, \\quad i = C \\frac{du_C}{dt}$$
$$\\Rightarrow \\tau \\frac{du_C}{dt} + u_C = E$$

Solution générale : $u_C(t) = E + K e^{-t/\\tau}$. CI $u_C(0) = 0 \\Rightarrow K = -E$.

> [!example]
> $R = 10\\,\\text{k}\\Omega$, $C = 100\\,\\mu\\text{F}$. $\\tau = R C = 10^4 \\times 10^{-4} = 1\\,\\text{s}$. Au bout de 3 s, le condo est chargé à ~95 %.

> [!colibrimo]
> Les filtres RC sont partout dans les circuits d'anti-rebond de boutons — le micro-contrôleur lit un signal propre grâce à un passe-bas simple.`,
      },
    ],
    exercises: [
      {
        type: "numeric",
        difficulty: 1,
        question_md:
          "Constante de temps pour $R = 1\\,\\text{k}\\Omega$ et $C = 1\\,\\mu\\text{F}$ (en ms) ?",
        data: { answer: 1, tolerance: 0, unit: "ms" },
        explanation_md:
          "$\\tau = RC = 10^3 \\times 10^{-6} = 10^{-3}\\,\\text{s} = 1\\,\\text{ms}$.",
      },
      {
        type: "numeric",
        difficulty: 2,
        question_md:
          "Après $t = \\tau$, à quel pourcentage de $E$ est chargé un condensateur en charge RC (en %) ?",
        data: { answer: 63, tolerance: 1, unit: "%" },
        explanation_md:
          "$u_C(\\tau) = E(1 - e^{-1}) = E(1 - 0{,}368) \\approx 0{,}632 E$ ≈ 63 %.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Au bout de combien de $\\tau$ considère-t-on que le régime permanent est atteint ?",
        data: { choices: ["1 τ", "2 τ", "3 τ", "5 τ"], answer: 3 },
        explanation_md:
          "Convention : $5\\tau$. $u_C(5\\tau) = E(1 - e^{-5}) \\approx 0{,}993 E$ — l'écart à $E$ est inférieur à 1 %.",
      },
      {
        type: "numeric",
        difficulty: 3,
        question_md:
          "Condensateur chargé à $U_0 = 12\\,\\text{V}$. On le court-circuite via $R = 10\\,\\text{k}\\Omega$, $C = 1\\,\\mu\\text{F}$. Tension après $t = 20\\,\\text{ms}$ (en V) ?",
        data: { answer: 1.62, tolerance: 0.1, unit: "V" },
        explanation_md:
          "$\\tau = 10^4 \\times 10^{-6} = 10\\,\\text{ms}$. $u_C(20\\text{ ms}) = 12 \\cdot e^{-2} \\approx 12 \\times 0{,}135 \\approx 1{,}62\\,\\text{V}$.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Comment doubler la constante de temps d'un circuit RC sans changer $R$ ?",
        data: {
          choices: [
            "Diviser $C$ par 2",
            "Multiplier $C$ par 2",
            "Doubler la tension source",
            "Ajouter une résistance en parallèle",
          ],
          answer: 1,
        },
        explanation_md:
          "$\\tau = RC$, donc doubler $C$ double $\\tau$. Ajouter une résistance en **parallèle** réduirait $R$ ⇒ $\\tau$ baisserait.",
      },
    ],
    flashcards: [
      {
        front_md: "Constante de temps d'un RC",
        back_md: "$\\tau = R \\cdot C$. Unités SI : Ω × F = s.",
        tags: ["rc"],
      },
      {
        front_md: "Pourcentages à retenir pour la charge RC : 1τ, 3τ, 5τ",
        back_md: "1τ ≈ 63 %, 3τ ≈ 95 %, 5τ ≈ 99,3 % (considéré plein).",
        tags: ["rc"],
      },
      {
        front_md: "Loi de décharge d'un condensateur via R",
        back_md: "$u_C(t) = U_0 \\, e^{-t/\\tau}$",
        tags: ["rc"],
      },
    ],
  },

  // ==========================================================================
  // Shannon-Nyquist
  // ==========================================================================
  {
    topic_id: "physique.signaux.shannon",
    lessons: [
      {
        title: "Théorème de Shannon-Nyquist : échantillonner sans perte",
        estimated_minutes: 7,
        content_md: `## L'énoncé

Pour reconstruire **parfaitement** un signal de fréquence maximale $f_{\\max}$ à partir de ses échantillons, la fréquence d'échantillonnage $f_e$ doit vérifier :
$$f_e > 2 \\, f_{\\max}$$

La borne $2 f_{\\max}$ s'appelle la **fréquence de Nyquist**.

## Repliement de spectre (aliasing)

Si $f_e \\leq 2 f_{\\max}$, les fréquences au-dessus de $f_e/2$ se **replient** sur celles d'en-dessous — un signal à 15 kHz échantillonné à 20 kHz apparaît comme s'il était à 5 kHz. Impossible de distinguer les deux sans information supplémentaire.

## Parades

1. **Filtre anti-repliement** (passe-bas analogique) avant l'échantillonnage, coupant tout au-dessus de $f_e/2$.
2. **Sur-échantillonner** : $f_e$ bien au-dessus de $2 f_{\\max}$ pour laisser de la marge.

## Ordres de grandeur

| Application | $f_{\\max}$ | $f_e$ usuel |
|-------------|-----------|-------------|
| Téléphonie (voix) | 3,4 kHz | 8 kHz |
| CD audio | 20 kHz | 44,1 kHz |
| Audio pro | 20 kHz | 48 ou 96 kHz |

> [!example]
> Un signal musical contient des fréquences jusqu'à 18 kHz. Fréquence d'échantillonnage minimale théorique : 36 kHz. En pratique, 44,1 kHz (CD) laisse une marge pour le filtre anti-repliement.`,
      },
    ],
    exercises: [
      {
        type: "numeric",
        difficulty: 1,
        question_md:
          "Fréquence d'échantillonnage **minimale** théorique pour un signal dont la composante la plus haute est à $f_{\\max} = 8\\,\\text{kHz}$ (en kHz) ?",
        data: { answer: 16, tolerance: 0, unit: "kHz" },
        explanation_md:
          "Critère de Shannon : $f_e > 2 f_{\\max} = 16\\,\\text{kHz}$. La borne stricte est **strictement supérieure**, mais 16 kHz est le minimum théorique.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "Un signal de 15 kHz échantillonné à 20 kHz est interprété comme un signal de quelle fréquence apparente ?",
        data: { choices: ["15 kHz", "10 kHz", "5 kHz", "1 kHz"], answer: 2 },
        explanation_md:
          "Repliement : $|f - f_e| = |15 - 20| = 5\\,\\text{kHz}$. Le signal à 15 kHz est indistinguable d'un signal à 5 kHz après échantillonnage.",
      },
      {
        type: "mcq",
        difficulty: 2,
        question_md:
          "À quoi sert un **filtre anti-repliement** avant l'étape d'échantillonnage ?",
        data: {
          choices: [
            "Amplifier le signal",
            "Éliminer les fréquences > fe/2 avant échantillonnage",
            "Ajuster la phase du signal",
            "Compenser la quantification",
          ],
          answer: 1,
        },
        explanation_md:
          "C'est un **passe-bas analogique** qui supprime tout ce qui dépasse $f_e/2$ avant l'échantillonnage, évitant ainsi le repliement.",
      },
      {
        type: "numeric",
        difficulty: 2,
        question_md:
          "Pour un signal audio avec $f_{\\max} = 22{,}05\\,\\text{kHz}$, quelle est la fréquence de Nyquist (en kHz) ?",
        data: { answer: 44.1, tolerance: 0.1, unit: "kHz" },
        explanation_md:
          "Fréquence de Nyquist = $2 \\times f_{\\max} = 2 \\times 22{,}05 = 44{,}1\\,\\text{kHz}$. C'est pour ça que le standard CD échantillonne à 44,1 kHz.",
      },
      {
        type: "text",
        difficulty: 3,
        question_md:
          "Pourquoi choisit-on souvent $f_e$ nettement supérieure à $2 f_{\\max}$ plutôt que d'être juste au-dessus de la borne de Shannon ?",
        data: {
          expected_key_points: [
            "filtre anti-repliement",
            "pente raide",
            "marge",
            "sur-échantillonnage",
            "qualité",
          ],
          min_score: 0.6,
        },
        explanation_md:
          "Un filtre passe-bas réel ne coupe pas verticalement à $f_e/2$ : il a une pente. Plus $f_e$ est élevée, plus on a de marge entre la bande utile et la coupure ⇒ filtre plus simple et moins déformant. Le sur-échantillonnage permet aussi un gain en SNR après filtrage numérique.",
      },
    ],
    flashcards: [
      {
        front_md: "Critère de Shannon",
        back_md: "$f_e > 2 \\, f_{\\max}$ pour reconstruire un signal sans perte.",
        tags: ["shannon"],
      },
      {
        front_md: "Repliement de spectre (aliasing)",
        back_md:
          "Si $f_e \\leq 2 f_{\\max}$, les fréquences > $f_e/2$ se replient sur le spectre utile. Parade : filtre passe-bas analogique avant échantillonnage.",
        tags: ["shannon"],
      },
    ],
  },
];
