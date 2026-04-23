import type { TopicContent } from "./types";

export const PHYSIQUE_CONTENT: TopicContent[] = [
  // ==========================================================================
  // Loi d'Ohm
  // ==========================================================================
  {
    topic_id: "physique.elec.ohm",
    lessons: [
      {
        title: "Loi d'Ohm : la relation U = R·I qui gouverne tout circuit",
        estimated_minutes: 16,
        content_md: `## Pourquoi tu dois maîtriser ça

La loi d'Ohm est **la première équation** de l'électricité, et elle est utilisée dans **100%** des circuits que tu vas rencontrer en école d'ingé. Elle lie trois grandeurs — **tension**, **courant**, **résistance** — que tu retrouves partout : dans ton chargeur de téléphone, dans une LED, dans un capteur, dans un moteur. Le jury ISEN va tester deux choses : (1) est-ce que tu connais la formule **et** les unités (piège classique : confondre mA et A), et (2) est-ce que tu sais l'appliquer pour **dimensionner** un composant (ex : quelle résistance pour qu'une LED ne crame pas ?). Sans ça, tu ne peux pas démarrer l'électronique analogique ni la numérique.

> [!note]
> **Ce qu'il faut savoir avant** : les **trois grandeurs électriques de base** — la **tension** $U$ (en volts V, la "pression électrique" entre deux points), le **courant** $I$ (en ampères A, la quantité d'électricité qui passe par seconde), et la **résistance** $R$ (en ohms Ω, "ce qui freine le courant"). Tu dois aussi maîtriser les **puissances de 10** : 1 mA = $10^{-3}$ A, 1 kΩ = $10^3$ Ω, 1 MΩ = $10^6$ Ω.

## L'idée intuitive

Imagine l'électricité comme **de l'eau qui coule dans un tuyau**.
- La **tension** $U$, c'est la **pression** à l'entrée (différence de hauteur du réservoir).
- Le **courant** $I$, c'est le **débit** qui sort (litres par seconde).
- La **résistance** $R$, c'est **la largeur du tuyau** : plus il est étroit, moins il laisse passer d'eau pour une même pression.

La loi d'Ohm dit : **le débit est proportionnel à la pression, et inversement proportionnel à l'étroitesse du tuyau**. Plus de pression → plus de courant. Plus de résistance → moins de courant. C'est aussi simple que ça.

## La définition formelle

$$\\boxed{\\;U \\;=\\; R \\cdot I\\;}$$

Avec les trois grandeurs et leurs unités à connaître **par cœur** :

| Grandeur | Symbole | Unité | Abréviation |
|----------|---------|-------|-------------|
| Tension | $U$ | Volt | V |
| Courant (intensité) | $I$ | Ampère | A |
| Résistance | $R$ | Ohm | Ω |

La formule peut se **réarranger** selon ce qu'on cherche :
- **Tension** : $U = R \\cdot I$
- **Courant** : $I = \\dfrac{U}{R}$
- **Résistance** : $R = \\dfrac{U}{I}$

**Astuce du triangle** : dessine un triangle avec $U$ en haut, $R$ et $I$ en bas. Masque la grandeur que tu cherches avec le doigt, les deux autres te donnent la formule (côte à côte = multiplication, superposées = division). Utile quand tu oublies l'organisation de la formule sous stress.

## La puissance dissipée

Toute résistance traversée par un courant **dissipe de la puissance** sous forme de chaleur (c'est pour ça qu'un ordinateur chauffe, qu'un grille-pain grille). La formule de base :

$$P = U \\cdot I$$

avec $P$ en **watts** (W). En combinant avec la loi d'Ohm, on obtient **trois formes équivalentes** :

$$P \\;=\\; U \\cdot I \\;=\\; R \\cdot I^2 \\;=\\; \\frac{U^2}{R}$$

**Comment choisir la bonne forme** : utilise celle qui **contient les grandeurs que tu connais déjà** et qui **n'a pas besoin de l'inconnue**. Si tu as $R$ et $I$, utilise $R I^2$. Si tu as $U$ et $R$, utilise $U^2/R$. Si tu as $U$ et $I$, utilise $U I$.

## La convention récepteur (important pour éviter les erreurs de signe)

Quand tu dessines un schéma, il faut choisir une **convention** pour indiquer dans quel sens tu considères la tension et le courant. Pour un **récepteur** (une résistance, un moteur, une LED — bref, tout composant qui **consomme** de la puissance) :

- La flèche de $U$ et la flèche de $I$ vont **dans des sens opposés** par rapport au composant (ou formulé autrement : $U$ est orienté **contre** le sens du courant).
- Avec cette convention, $P = UI > 0$ **signifie que le composant reçoit** de la puissance. Résultat positif = ça chauffe, logique.

Pour un **générateur** (pile, alim, batterie quand elle débite), c'est la **convention générateur** : $U$ et $I$ dans le même sens, $P = UI > 0$ signifie qu'il **fournit** de la puissance.

Tu oublieras parfois, mais dès que tu retombes sur une puissance **négative**, ça veut dire "je me suis trompé de convention" — tu inverses mentalement et c'est bon.

> [!example]
> **Trois calculs détaillés du plus bête au plus pratique.**
>
> **(a) Calcul direct.** Résistance $R = 1\\,\\text{k}\\Omega$, courant $I = 20\\,\\text{mA}$. Quelle tension $U$ ?
> - Convertir en unités SI : $R = 1000\\,\\Omega$, $I = 0{,}02\\,\\text{A}$.
> - Appliquer : $U = R \\cdot I = 1000 \\times 0{,}02 = 20\\,\\text{V}$.
>
> **(b) Puissance dissipée.** Résistance $R = 100\\,\\Omega$ sous tension $U = 12\\,\\text{V}$. Quelle puissance ?
> - Je connais $U$ et $R$, je cherche $P$ ⇒ formule $P = U^2/R$ (la plus directe).
> - $P = 12^2 / 100 = 144 / 100 = 1{,}44\\,\\text{W}$.
> - Vérification cohérence : à 12 V et 100 Ω, $I = 0{,}12\\,\\text{A}$. $P = U I = 12 \\times 0{,}12 = 1{,}44\\,\\text{W}$. ✓
>
> **(c) Dimensionnement d'une LED.** Tu as une LED (tension de fonctionnement $U_{LED} = 2\\,\\text{V}$, courant nominal $I = 10\\,\\text{mA}$) que tu veux alimenter depuis une pile de 9 V. Quelle résistance de protection $R$ mettre en série ?
> - La pile fournit 9 V, la LED en "consomme" 2 V. La résistance doit **absorber** la différence : $U_R = 9 - 2 = 7\\,\\text{V}$.
> - Dans une série, le même courant traverse tout : $I = 10\\,\\text{mA} = 0{,}01\\,\\text{A}$.
> - Ohm sur $R$ : $R = U_R / I = 7 / 0{,}01 = 700\\,\\Omega$.
> - Valeur normalisée la plus proche : **680 Ω** ou **820 Ω** (proche en E12). Prendre 820 Ω pour être sûr de ne pas surintensifier.

## Ordres de grandeur à retenir

| Objet | Résistance typique |
|-------|---------------------|
| Fil de cuivre de 1 m (section 1 mm²) | $\\approx 0{,}02\\,\\Omega$ (négligeable) |
| Résistance d'appoint (LED, filtres) | 100 Ω à 10 kΩ |
| Entrée ampli op (impédance d'entrée) | 1 MΩ à 1 GΩ |
| Thermistance NTC | 1 kΩ à 100 kΩ |
| Corps humain (peau sèche) | ~ 100 kΩ |
| Corps humain (peau mouillée) | ~ 1 kΩ |

Ces ordres de grandeur permettent de **repérer une erreur de calcul** : si tu trouves 5 MΩ pour une LED, t'as un facteur 10 000 qui cloche.

> [!warning]
> **Pièges qui font perdre des points au jury.**
>
> - **Oublier de convertir mA en A** (ou mV en V, kΩ en Ω). Par défaut, tu calcules en unités SI (V, A, Ω, W). Si tu mélanges mA et Ω en laissant mA tel quel, tu obtiens du V incorrect. Réflexe : **convertir tout en SI avant de calculer**.
> - **Confondre tension et courant.** $U = R \\cdot I$, pas $I = R \\cdot U$ ni $R = U \\cdot I$. L'unité te sauve : [V] = [Ω] · [A]. Si ça matche pas, t'as inversé.
> - **Dimensionnement aux limites.** Si tu calcules une puissance dissipée qui dépasse la puissance nominale de ta résistance (1/4 W typique), elle **crame**. Vérifie **toujours** $P_{dissipée} < P_{max}$.
> - **Loi d'Ohm sur un composant non-ohmique.** La loi d'Ohm **ne s'applique pas** aux diodes (LED, diodes de redressement), aux transistors, aux bobines en régime transitoire. Elle ne vaut **que** pour des résistances (ou composants à comportement linéaire en tension/courant).
> - **Signe négatif sur $P$ ignoré.** Si ton calcul donne $P < 0$, tu t'es probablement trompé d'orientation de flèche dans la convention — refais le dessin.

## À quoi ça sert en pratique

- **Dimensionnement** d'une résistance de protection pour LED, un diviseur de tension, un pull-up/pull-down.
- **Calcul d'alimentation** : combien faut-il de courant à 5 V pour alimenter telle charge de 250 Ω ?
- **Sécurité** : calculer le courant qui traverserait quelqu'un en contact avec une tension (la peau humide + 230 V = courant mortel).
- **Thermique** : calculer la puissance dissipée pour dimensionner un radiateur / un boîtier.
- **Base de Kirchhoff** (prochaine leçon) : tout ce chapitre s'appuie sur Ohm appliqué à chaque résistance du circuit.

> [!tip]
> **Réflexe unités.** Avant d'écrire un chiffre, **note toujours l'unité** à côté. "V", "A", "Ω", "W". Si tu travailles en mA et Ω, multiplie le résultat par $10^{-3}$ — ou convertis d'abord, c'est plus sûr. Cette discipline, c'est 80% des points sauvés sur un contrôle.

> [!colibrimo]
> En pur soft, tu ne croises pas Ohm directement. Mais en IoT / embarqué (capteurs connectés, domotique), dès qu'il y a un capteur analogique ou une LED à piloter depuis un Raspberry Pi ou un ESP32, Ohm revient. Sur Colibrimo, si on intègre un jour un capteur pour estimer l'usure d'un outil électroportatif, ce sera la première équation à dégainer.`,
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
        title: "Kirchhoff : résoudre un circuit avec les nœuds et les mailles",
        estimated_minutes: 16,
        content_md: `## Pourquoi tu dois maîtriser ça

La loi d'Ohm s'applique à **une** résistance. Dès que tu as plusieurs composants branchés ensemble (ce qui est le cas de 99% des vrais circuits), tu ne peux plus te contenter de Ohm seul — tu as besoin de **règles pour gérer un réseau entier**. Ces règles, c'est Kirchhoff : deux lois, **KCL** (nœuds) et **KVL** (mailles), qui permettent de calculer n'importe quelle tension ou courant dans un circuit aussi compliqué soit-il. C'est **la base** de tout TP d'électronique, et le jury ISEN **teste systématiquement** : on te donne un schéma avec 2-3 résistances et un générateur, et tu dois trouver les courants ou les tensions. Sans Kirchhoff, tu coules au premier TP.

> [!note]
> **Ce qu'il faut savoir avant** : la **loi d'Ohm** ($U = RI$, chapitre précédent), le vocabulaire **nœud** (= point de jonction où au moins 3 fils se rencontrent), **branche** (= portion de circuit entre deux nœuds), **maille** (= boucle fermée dans le circuit). Tu dois aussi savoir **orienter des flèches** de courant et de tension sur un schéma.

## L'idée intuitive

Deux lois, deux principes de conservation.

**Loi des nœuds (KCL, Kirchhoff Current Law)** — conservation de la **matière**. L'électricité, c'est des charges qui se déplacent. À un nœud, autant il en arrive, autant il en repart : **rien ne s'accumule**. C'est comme un carrefour d'eau avec 3 tuyaux : ce qui entre doit sortir.

**Loi des mailles (KVL, Kirchhoff Voltage Law)** — conservation de l'**énergie**. La tension représente l'énergie par charge. Quand tu parcours une boucle fermée et que tu reviens au point de départ, tu dois avoir **autant "gagné"** que **"perdu"** en tension — sinon tu aurais trouvé une machine à mouvement perpétuel. Concrètement : les générateurs **montent** le potentiel, les résistances **baissent** le potentiel, et sur un tour complet les deux s'équilibrent.

Avec ces deux lois + Ohm pour chaque résistance, tu peux résoudre **n'importe quel circuit** (même sans outil).

## Loi des nœuds (KCL)

À chaque **nœud** d'un circuit, la **somme algébrique des courants vaut zéro** :

$$\\sum_{k} \\varepsilon_k \\, I_k \\;=\\; 0$$

où $\\varepsilon_k = +1$ si $I_k$ est orienté **vers** le nœud et $-1$ si $I_k$ s'en éloigne. Version plus intuitive :

$$\\sum I_{\\text{entrant}} \\;=\\; \\sum I_{\\text{sortant}}$$

**Exemple mini.** À un nœud arrivent $I_1$ et $I_2$, en sortent $I_3$. Alors $I_1 + I_2 = I_3$.

## Loi des mailles (KVL)

Sur toute **maille** (boucle fermée) du circuit, la **somme algébrique des tensions vaut zéro** :

$$\\sum_{k} \\varepsilon_k \\, U_k \\;=\\; 0$$

**Convention de signe** pour $\\varepsilon_k$. Tu choisis un **sens de parcours** de la maille (horaire ou anti-horaire, peu importe). Pour chaque tension rencontrée :
- Si tu parcours **dans le sens de la flèche** de $U$ → signe **+**.
- Si tu parcours **à contre-sens** de la flèche de $U$ → signe **−**.

Tout le monde utilise la même convention de fléchage : **flèche de $U$ orientée de la borne $-$ vers la borne $+$** (générateur) ou **flèche de $U$ orientée de l'entrée du courant vers la sortie** (résistance en convention récepteur).

**Vue schématique d'une boucle simple** (générateur + deux résistances en série) :

\`\`\`mermaid
graph LR
  E["Générateur E"] -->|"I →"| R1["Résistance R1"]
  R1 -->|"I →"| R2["Résistance R2"]
  R2 -->|"I →"| E
\`\`\`

Le courant $I$ circule **dans le même sens** partout dans la boucle (KCL trivial, un seul courant). La KVL sur ce tour complet donne $E = R_1 I + R_2 I$.

## Méthode de résolution (à appliquer mécaniquement)

1. **Dessiner** le schéma, orienter toutes les flèches (tensions et courants). Nommer les courants qu'on cherche ($I_1$, $I_2$, ...).
2. **Écrire les lois des nœuds** : une équation par nœud indépendant (s'il y a $n$ nœuds, $n-1$ équations indépendantes).
3. **Écrire les lois des mailles** : une équation par maille indépendante.
4. **Relier tensions et courants par Ohm** : pour chaque résistance, $U_R = R \\cdot I_R$.
5. **Résoudre le système** d'équations linéaires obtenu (souvent 2 ou 3 inconnues pour un circuit de TP).

**Cas pratique ultra-courant** : une seule boucle (générateur + résistances en série). La KCL ne dit rien (un seul courant circule). La KVL donne immédiatement l'équation : $E = \\sum R_k I$.

> [!example]
> **Trois résolutions progressives.**
>
> **(a) Une boucle simple.** Générateur $E = 12\\,\\text{V}$, deux résistances en série $R_1 = 100\\,\\Omega$, $R_2 = 200\\,\\Omega$. Courant $I$ dans la boucle ?
> - Un seul courant $I$ circule (boucle unique).
> - KVL en parcourant la boucle dans le sens du courant : $E - R_1 I - R_2 I = 0$.
>   - Le $+E$ car on parcourt le générateur de la borne $-$ vers la borne $+$.
>   - Les $-R_k I$ car dans une résistance en convention récepteur, $U_{R_k}$ est orienté contre $I$ vu de notre sens de parcours (on "chute").
> - D'où : $I = \\dfrac{E}{R_1 + R_2} = \\dfrac{12}{300} = 0{,}04\\,\\text{A} = 40\\,\\text{mA}$.
>
> **(b) Trois résistances en série.** $E = 9\\,\\text{V}$, $R_1 = 100$, $R_2 = 200$, $R_3 = 150\\,\\Omega$.
> - KVL : $E = (R_1 + R_2 + R_3) I = 450\\,I$.
> - $I = 9 / 450 = 0{,}02\\,\\text{A} = 20\\,\\text{mA}$.
>
> **(c) Application KCL à un nœud.** À un nœud arrivent $I_1 = 3\\,\\text{A}$ et $I_2 = 2\\,\\text{A}$, en sortent $I_3$ et $I_4 = 1{,}5\\,\\text{A}$.
> - KCL : $I_1 + I_2 = I_3 + I_4$.
> - $3 + 2 = I_3 + 1{,}5 \\Rightarrow I_3 = 3{,}5\\,\\text{A}$.

> [!warning]
> **Pièges typiques.**
>
> - **Ne pas orienter les flèches avant de commencer.** Si tu n'as pas fléché les tensions et courants, tu ne sais pas quel signe mettre. Fais-le **avant** d'écrire la moindre équation. Si à la fin le signe est négatif, ça veut juste dire "le courant va dans l'autre sens" — pas d'erreur, juste changement de convention.
> - **Confondre $+E$ et $-E$ dans la KVL.** $E$ est **positif** quand on parcourt de $-$ vers $+$ (on "monte" en potentiel). Beaucoup d'élèves oublient le sens — relis ta flèche.
> - **Compter une maille non indépendante.** Dans un circuit à 3 mailles, seule 2 sont indépendantes. Si tu écris la 3e, tu as une équation redondante (pas faux, mais inutile). Règle pratique : dessine des boucles qui **ne se recouvrent pas**.
> - **Oublier qu'un courant peut être négatif**. C'est OK — ça veut dire que tu as deviné le sens à l'envers au départ. La physique est respectée.
> - **Utiliser KCL sur un point qui n'est pas un vrai nœud.** Deux fils en série ne forment pas un nœud (il n'y a pas 3 fils qui se rencontrent). Le courant y est évidemment le même avant et après.

## À quoi ça sert en pratique

- **Analyse de circuits** : calculer les courants et tensions dans n'importe quel circuit passif.
- **Dimensionnement** : vérifier qu'aucune résistance ne dépasse sa puissance max, que la pile tient le coup, etc.
- **Diagnostic de panne** : comparer les tensions mesurées au voltmètre avec les prédictions de KVL.
- **Simulation** : LTspice, SPICE, Multisim — tous ces outils résolvent Kirchhoff en arrière-plan.
- **Équations de noeuds** = base théorique de la méthode des **potentiels nodaux** (résolution matricielle pour gros circuits).

> [!tip]
> **Méthode "un seul courant de boucle" pour gagner du temps.** Si ton circuit est une seule boucle (pas de nœuds à 3 fils), tu peux directement écrire $E = \\sum R_k \\cdot I$ sans passer par les équations explicites. C'est ce qu'on appelle un **diviseur de tension** à 2 résistances (formule $U_R = U_{tot} \\cdot R / (R_{tot})$, voir chapitre suivant).

> [!colibrimo]
> En pur dev, Kirchhoff n'apparaît pas — mais les **lois de conservation** (masse, énergie, charge) que tu as abordées ici sont la matrice conceptuelle de beaucoup de systèmes distribués. Les **systèmes de compensation financière** entre utilisateurs, les **algorithmes de load balancing**, ou même les **queues de messages**, reposent sur "ce qui entre doit être égal à ce qui sort, rien ne se perd". L'intuition Kirchhoff t'aide à modéliser ces systèmes.`,
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
        title: "Associations de résistances : série, parallèle, diviseurs",
        estimated_minutes: 15,
        content_md: `## Pourquoi tu dois maîtriser ça

Dans la vraie vie, on n'a jamais exactement la résistance qu'on veut — il faut **combiner** celles qu'on a pour obtenir la valeur cible. Et surtout, face à un circuit complexe, tu peux le **simplifier** en remplaçant des paquets de résistances par leur équivalent unique, jusqu'à te ramener à un circuit à une seule résistance que tu résous en 3 secondes. Ce réflexe de **simplification par équivalence** est **le** savoir-faire de base en analyse de circuit. En plus, les formules de **diviseur de tension** et **diviseur de courant** reviennent **à chaque TP** (polarisation de capteurs, adaptation d'impédance, alimentation de référence). Le jury te fera dessiner un circuit avec deux résistances et demandera la tension au milieu — si tu connais le diviseur, tu réponds en 10 secondes.

> [!note]
> **Ce qu'il faut savoir avant** : la **loi d'Ohm** ($U = RI$) et les **lois de Kirchhoff** (KCL et KVL). Si tu vois **nœud** et **maille** comme du chinois, reviens d'abord sur le chapitre Kirchhoff.

## L'idée intuitive

Deux façons de brancher deux résistances ensemble.

**En série** : tu les mets **l'une derrière l'autre**, en ligne. Le même courant les traverse toutes les deux, l'une après l'autre. Analogie tuyauterie : deux tuyaux étroits mis bout à bout → c'est encore plus dur pour l'eau de passer.

**En parallèle** : tu les branches **côte à côte**, aux mêmes deux points. Le courant se **divise** entre les deux chemins. Analogie : deux tuyaux côte à côte → l'eau a plus de sections de passage, ça coule mieux.

Ces deux cas donnent des règles d'équivalence opposées : en série, les résistances s'**additionnent** (c'est plus résistant au total) ; en parallèle, c'est leurs **inverses** qui s'additionnent (c'est moins résistant que chacune individuellement).

## Résistances en série

Quand $n$ résistances sont parcourues par le **même courant** (branchées en ligne, sans dérivation), la résistance équivalente est :

$$\\boxed{\\;R_{\\text{eq}} \\;=\\; R_1 + R_2 + \\ldots + R_n\\;}$$

**D'où ça vient** : la tension totale aux bornes de la série est la somme des tensions individuelles ($U = U_1 + U_2 + \\ldots$, par KVL). Chaque $U_k = R_k I$ (Ohm, même $I$ pour toutes). Donc $U = (R_1 + \\ldots + R_n) I$, ce qui donne $R_{\\text{eq}} = R_1 + \\ldots + R_n$.

**Propriété à retenir** : $R_{\\text{eq}}$ en série est **toujours supérieure** à la plus grande des résistances associées.

## Résistances en parallèle

Quand $n$ résistances sont soumises à la **même tension** (branchées aux deux mêmes nœuds), la résistance équivalente est définie par :

$$\\frac{1}{R_{\\text{eq}}} \\;=\\; \\frac{1}{R_1} + \\frac{1}{R_2} + \\ldots + \\frac{1}{R_n}$$

Cas particulier **à deux résistances** (formule produit/somme, à connaître par cœur) :

$$\\boxed{\\;R_{\\text{eq}} \\;=\\; \\frac{R_1 \\cdot R_2}{R_1 + R_2}\\;}$$

**D'où ça vient** : le courant total se partage entre les deux branches ($I = I_1 + I_2$, par KCL). Chaque $I_k = U / R_k$ (Ohm, même $U$). Donc $I = U/R_1 + U/R_2 = U(1/R_1 + 1/R_2)$, d'où la formule.

**Propriété à retenir** : $R_{\\text{eq}}$ en parallèle est **toujours inférieure** à la plus petite des résistances associées. Cas extrême : deux résistances **égales** en parallèle → $R_{\\text{eq}} = R/2$ (moitié moins).

## Le diviseur de tension (DTV)

Le cas **le plus fréquent** en électronique, à connaître **par cœur**.

Schéma : un générateur $U$ alimente deux résistances $R_1$ et $R_2$ en série. On veut la tension **aux bornes de $R_2$**, notée $U_2$.

$$\\boxed{\\;U_2 \\;=\\; U \\cdot \\frac{R_2}{R_1 + R_2}\\;}$$

**Intuition** : la tension totale se partage **proportionnellement** aux résistances. Si $R_2$ fait 30% du total, elle prend 30% de la tension. Cas extrêmes :
- $R_2 \\gg R_1$ → $U_2 \\approx U$ (quasi toute la tension sur $R_2$).
- $R_2 \\ll R_1$ → $U_2 \\approx 0$ (quasi toute la tension sur $R_1$).

**Usage** : créer une **tension de référence** à partir d'une tension d'alimentation plus grande ; lire une **thermistance** (sa résistance varie avec la température, le diviseur transforme cette variation en tension mesurable par un ADC) ; polariser une entrée de transistor.

## Le diviseur de courant (DTC)

Cas **dual** : deux résistances $R_1$ et $R_2$ en **parallèle**, un courant total $I$ rentre. Comment se partage-t-il ?

$$\\boxed{\\;I_1 \\;=\\; I \\cdot \\frac{R_2}{R_1 + R_2} \\qquad I_2 \\;=\\; I \\cdot \\frac{R_1}{R_1 + R_2}\\;}$$

**Attention** : dans le diviseur de **courant**, c'est **la résistance de l'AUTRE** branche qui apparaît au numérateur (pas celle du courant qu'on cherche). Le courant se divise **à l'inverse** des résistances — logique, c'est la branche **la moins résistante** qui prend le plus de courant.

> [!example]
> **Trois situations détaillées.**
>
> **(a) Série simple.** $R_1 = 100\\,\\Omega$ et $R_2 = 220\\,\\Omega$ en série.
> - $R_{\\text{eq}} = 100 + 220 = 320\\,\\Omega$. Point.
>
> **(b) Parallèle simple.** $R_1 = 100\\,\\Omega$, $R_2 = 200\\,\\Omega$ en parallèle.
> - Formule produit/somme : $R_{\\text{eq}} = \\dfrac{100 \\cdot 200}{100 + 200} = \\dfrac{20\\,000}{300} \\approx 66{,}7\\,\\Omega$.
> - Check : inférieure à 100 Ω (la plus petite), ✓.
>
> **(c) Diviseur de tension pour lire une thermistance.** Tu as une alim $U = 5\\,\\text{V}$. La thermistance NTC vaut $R_T = 10\\,\\text{k}\\Omega$ à température ambiante, tu la mets en série avec une résistance fixe $R = 10\\,\\text{k}\\Omega$, et tu lis la tension au milieu.
> - Formule DTV : $U_{\\text{lue}} = 5 \\cdot \\dfrac{R_T}{R + R_T} = 5 \\cdot \\dfrac{10}{10 + 10} = 2{,}5\\,\\text{V}$ à température ambiante.
> - Si $R_T$ baisse (température monte) à 5 kΩ : $U = 5 \\cdot 5 / 15 \\approx 1{,}67\\,\\text{V}$. Tu détectes la hausse.
>
> **(d) Circuit mixte.** $R_1 = 10\\,\\Omega$ en série avec (deux résistances $R_2 = R_3 = 20\\,\\Omega$ en parallèle). Résistance totale ?
> - D'abord le bloc parallèle : $R_{23} = 20 \\cdot 20 / 40 = 10\\,\\Omega$.
> - Puis la série : $R_{\\text{tot}} = R_1 + R_{23} = 10 + 10 = 20\\,\\Omega$.
> - **Méthode générale** : **commence par les sous-blocs internes**, remplace par leur équivalent, continue jusqu'à un seul bloc.

> [!warning]
> **Pièges typiques.**
>
> - **Inverser série et parallèle.** La série **additionne** les résistances (et la même $I$ traverse) ; le parallèle additionne les **inverses** (et le même $U$ aux bornes). Réflexe : demande-toi d'abord "est-ce que c'est le même courant qui passe par les deux ?" → série. "Est-ce que les deux ont la même tension à leurs bornes ?" → parallèle.
> - **Numérateur inversé dans le diviseur de courant.** $I_1 = I \\cdot R_2 / (R_1 + R_2)$, pas $I \\cdot R_1 / (R_1 + R_2)$. C'est **la résistance de l'autre** qui apparaît. Pour mémoriser : "le courant va majoritairement dans la petite résistance, donc au numérateur de $I_1$ on met la grande — ce qui est $R_2$ si $R_2 > R_1$".
> - **Oublier que pour la formule produit/somme, il faut exactement 2 résistances.** Pour 3 résistances en parallèle, passe par la formule générale des inverses (ne fais pas la formule produit/somme deux fois de suite sans calculer à chaque étape).
> - **Confondre courant de branche et courant total.** Dans un diviseur, le $I$ qui apparaît au numérateur du DTC est le **courant total** qui entre dans le nœud, pas le courant dans une branche spécifique.
> - **Ne pas dessiner le schéma.** Au brouillon, dessine toujours le circuit avant de calculer. Identifier "qui est en série, qui est en parallèle" est impossible sans visuel.

## À quoi ça sert en pratique

- **Simplifier un circuit** pour le ramener à une seule maille avant de résoudre.
- **Dimensionner un diviseur de tension** pour lire un capteur analogique avec un ADC.
- **Créer une tension de référence** stable à partir d'une alim principale.
- **Mesurer un courant** (shunt : résistance faible en série, on lit la tension à ses bornes, diviseur indirect).
- **Limiter un courant** via une résistance série (cf. dimensionnement LED du chapitre Ohm).

> [!tip]
> **Méthode en 2 étapes pour les gros circuits.** (1) Identifie le **bloc le plus imbriqué** (deux résistances clairement en parallèle, ou en série sans rien au milieu). (2) Remplace-le par un équivalent unique. Répète. En 3-4 itérations, tu ramènes n'importe quel circuit mixte à une seule résistance. C'est **la** compétence qui distingue un étudiant qui galère d'un qui décroche l'exercice en 1 minute.

> [!colibrimo]
> En pur soft, tu ne croises pas ces formules. **Mais** la logique de **simplification par équivalence** (remplacer un sous-système complexe par son résumé) est **exactement** ce qu'on fait dans le code : une fonction qui encapsule plusieurs opérations, un microservice qui expose une API simple pour plein de logique interne. L'habitude mentale "je remplace ce bloc complexe par sa signature équivalente" est la même en circuits et en archi logicielle.`,
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
        title: "Circuit RC en régime transitoire : charge et décharge",
        estimated_minutes: 18,
        content_md: `## Pourquoi tu dois maîtriser ça

Dès qu'il y a un **condensateur** dans un circuit, la tension ne peut pas changer **instantanément** — elle met du temps. Ce "temps de transit" est régi par un régime appelé **transitoire**, dont la loi est exponentielle. C'est une des notions les plus utiles en électronique : ça explique pourquoi ton flash photo met quelques secondes à se recharger, pourquoi les filtres audio coupent les graves ou les aigus, pourquoi on met un condensateur de découplage à côté de chaque puce numérique, comment fonctionne un **anti-rebond** de bouton, comment un **timer 555** cadence des signaux. Le jury va te demander la **constante de temps** $\\tau$ et te faire raisonner sur **combien de temps après** on peut considérer que c'est "chargé" ou "stable". Sans ça, tu ne comprends pas les schémas d'électronique analogique.

> [!note]
> **Ce qu'il faut savoir avant** : la **loi d'Ohm**, les **lois de Kirchhoff**, et la notion de **condensateur** : un composant qui **stocke de la charge électrique** $Q$ proportionnellement à la tension à ses bornes ($Q = C \\cdot U$, avec $C$ en **farads** F, la capacité). Un condensateur ne laisse **pas** passer le courant continu à long terme — quand il est chargé, il se comporte comme un **circuit ouvert**. Tu dois aussi connaître la fonction **exponentielle** $e^{-x}$ (décroissante de 1 vers 0 quand $x$ croît).

## L'idée intuitive

Imagine un seau (le condensateur) qu'on remplit depuis un robinet (la source de tension) à travers un **tuyau étroit** (la résistance $R$). Quand le seau est vide, l'eau coule vite — la différence de niveau avec le robinet est grande. À mesure que le seau se remplit, le niveau monte et la différence de "pression" diminue, donc le débit aussi. Le seau se remplit **vite au début, puis de plus en plus lentement**. Il n'atteint théoriquement jamais "100% plein" mathématiquement, mais en pratique, au bout d'un certain temps il est quasi plein.

C'est **exactement** ce que fait un condensateur en charge : $u_C(t)$ monte vite au début, puis approche asymptotiquement la tension source $E$. Pour la décharge, c'est symétrique : le seau plein qui se vide à travers le tuyau, vite au début puis de plus en plus lentement.

Deux éléments pilotent la vitesse de ce phénomène : la **résistance** $R$ (l'étroitesse du tuyau) et la **capacité** $C$ (la taille du seau). Grande résistance = lent. Gros seau = lent aussi. La combinaison des deux donne la **constante de temps** $\\tau$.

## La constante de temps $\\tau$

$$\\boxed{\\;\\tau \\;=\\; R \\cdot C\\;}$$

Unité : en **secondes** (quand $R$ est en ohms et $C$ en farads). C'est **la** grandeur à calculer en premier pour tout circuit RC.

**Ordres de grandeur typiques** :
- $R = 1\\,\\text{k}\\Omega$, $C = 1\\,\\mu\\text{F} = 10^{-6}\\,\\text{F}$ → $\\tau = 10^3 \\cdot 10^{-6} = 10^{-3}\\,\\text{s} = 1\\,\\text{ms}$.
- $R = 10\\,\\text{k}\\Omega$, $C = 100\\,\\mu\\text{F}$ → $\\tau = 10^4 \\cdot 10^{-4} = 1\\,\\text{s}$.
- $R = 1\\,\\text{M}\\Omega$, $C = 1\\,\\mu\\text{F}$ → $\\tau = 10^6 \\cdot 10^{-6} = 1\\,\\text{s}$.

**Interprétation graphique** : sur la courbe $u_C(t)$ de charge, $\\tau$ est l'abscisse où la **tangente à l'origine** croise l'**asymptote** ($u_C = E$). C'est aussi le temps où $u_C$ atteint **63%** de sa valeur finale.

## Charge d'un condensateur (de 0 à E)

Tu pars avec un condensateur déchargé ($u_C(0) = 0$), et à $t = 0$ tu fermes l'interrupteur. La tension évolue selon :

$$\\boxed{\\;u_C(t) \\;=\\; E \\cdot \\left(1 - e^{-t/\\tau}\\right)\\;}$$

**Valeurs-clés à mémoriser** (elles reviennent constamment) :

| $t$ | $u_C(t)$ | Interprétation |
|-----|----------|----------------|
| $0$ | $0$ | Condensateur vide |
| $\\tau$ | $\\approx 0{,}63 \\cdot E$ (63%) | Définition même de $\\tau$ |
| $3\\tau$ | $\\approx 0{,}95 \\cdot E$ (95%) | "Quasi plein" |
| $5\\tau$ | $\\approx 0{,}993 \\cdot E$ (99,3%) | **Régime permanent** considéré atteint |
| $\\infty$ | $E$ | Plein (mathématiquement à la limite) |

La **règle d'or** qu'utilisent tous les électroniciens : au bout de **$5\\tau$**, on considère que c'est **chargé**. Ce critère sert à dimensionner tous les filtres et les timers.

## Décharge d'un condensateur (de $U_0$ à 0)

Tu as un condensateur chargé à $U_0$, et à $t = 0$ tu le relies à une résistance (la source a disparu ou a été court-circuitée). La tension décroît :

$$\\boxed{\\;u_C(t) \\;=\\; U_0 \\cdot e^{-t/\\tau}\\;}$$

**Valeurs-clés** (symétriques de la charge) :

| $t$ | $u_C(t)$ | Interprétation |
|-----|----------|----------------|
| $0$ | $U_0$ | Pleinement chargé |
| $\\tau$ | $\\approx 0{,}37 \\cdot U_0$ (37%) | Décharge à 37% |
| $3\\tau$ | $\\approx 0{,}05 \\cdot U_0$ (5%) | Quasi déchargé |
| $5\\tau$ | $\\approx 0{,}007 \\cdot U_0$ | Considéré comme déchargé |

## D'où viennent les formules (équation différentielle)

Tu n'es pas obligé de retenir la démo, mais la comprendre une fois aide à ne jamais confondre charge et décharge.

La KVL sur le circuit de charge donne : $E = R \\cdot i + u_C$, où $i$ est le courant qui arrive au condensateur.

Le condensateur stocke la charge : $Q = C \\cdot u_C$, donc $i = dQ/dt = C \\cdot du_C/dt$.

En substituant : $E = RC \\cdot \\dfrac{du_C}{dt} + u_C$, soit :
$$\\tau \\, \\frac{du_C}{dt} + u_C \\;=\\; E$$

C'est une **équation différentielle linéaire du 1er ordre**. Solution générale :
$$u_C(t) \\;=\\; E + K \\cdot e^{-t/\\tau}$$

avec $K$ une constante fixée par la **condition initiale**. Si $u_C(0) = 0$, alors $K = -E$, donc $u_C(t) = E(1 - e^{-t/\\tau})$ — la formule de charge. Pour la décharge, l'équation devient $\\tau du_C/dt + u_C = 0$ (plus de $E$), dont la solution est $u_C(t) = U_0 e^{-t/\\tau}$.

> [!example]
> **Trois calculs concrets.**
>
> **(a) Constante de temps.** $R = 1\\,\\text{k}\\Omega$, $C = 1\\,\\mu\\text{F}$.
> - $\\tau = R \\cdot C = 10^3 \\cdot 10^{-6} = 10^{-3}\\,\\text{s} = 1\\,\\text{ms}$.
> - Régime permanent : $5\\tau = 5\\,\\text{ms}$.
>
> **(b) Tension à $t = \\tau$.** $E = 10\\,\\text{V}$, même $\\tau = 1\\,\\text{ms}$.
> - $u_C(\\tau) = 10 \\cdot (1 - e^{-1}) = 10 \\cdot (1 - 0{,}368) \\approx 6{,}32\\,\\text{V}$. Soit **63%** de $E$, comme attendu.
>
> **(c) Temps pour atteindre 50% de $E$.** On cherche $t$ tel que $u_C(t) = E/2$.
> - $E/2 = E(1 - e^{-t/\\tau})$ ⇒ $1/2 = 1 - e^{-t/\\tau}$ ⇒ $e^{-t/\\tau} = 1/2$.
> - Passer au $\\ln$ : $-t/\\tau = \\ln(1/2) = -\\ln 2$ ⇒ $t = \\tau \\cdot \\ln 2 \\approx 0{,}693 \\, \\tau$.
> - Donc la moitié de la charge est atteinte à **0,693 $\\tau$**, pas à $\\tau$ (qui correspond à 63%). Ce sont **deux choses différentes**, faut pas les confondre.
>
> **(d) Dimensionnement d'un anti-rebond.** Tu veux que le bouton soit "vu" comme appuyé seulement s'il reste appuyé plus de 10 ms (pour éviter les rebonds mécaniques parasites). Il faut que $u_C$ monte assez haut en 10 ms. Tu choisis $\\tau = 5\\,\\text{ms}$ (pour que $u_C$ dépasse 0,86 $E$ en 10 ms, seuil logique TTL). Avec $C = 1\\,\\mu\\text{F}$ (valeur courante), il faut $R = \\tau / C = 5\\,\\text{ms} / 1\\,\\mu\\text{F} = 5\\,\\text{k}\\Omega$.

> [!warning]
> **Pièges classiques.**
>
> - **Confondre charge et décharge.** Charge : $u_C$ **monte** de 0 à $E$, formule $E(1 - e^{-t/\\tau})$. Décharge : $u_C$ **descend** de $U_0$ à 0, formule $U_0 \\cdot e^{-t/\\tau}$. Fais le dessin mental avant de choisir.
> - **Erreur d'unités sur $\\tau$.** $R$ en ohms × $C$ en farads = seconde. Si tu travailles en kΩ et µF, le produit est en ms (se compense). Mais si tu mélanges (kΩ et F), tu te plantes d'un facteur 1000. **Toujours convertir en unités SI** avant de multiplier.
> - **Confondre 63% et 50%.** À $t = \\tau$, $u_C = 63\\%$ de $E$ (définition du $\\tau$), **pas 50%**. À 50%, c'est $t = \\tau \\ln 2 \\approx 0{,}69 \\tau$.
> - **Oublier que le condensateur bloque le continu**. En régime permanent (après $5\\tau$), aucun courant ne passe plus dans un circuit RC pur — le condensateur est plein, il s'oppose au courant.
> - **Condition initiale oubliée.** La formule change selon $u_C(0)$. Si le condensateur n'était pas totalement déchargé au départ, la formule de charge devient $u_C(t) = E + (U_0 - E) e^{-t/\\tau}$, où $U_0$ est la valeur initiale.

## À quoi ça sert en pratique

- **Filtres** RC passe-bas et passe-haut : le cœur du traitement analogique de signaux audio (casque, égaliseur).
- **Timers et oscillateurs** : le 555, les circuits de cadencement d'un µC, les générateurs d'impulsions.
- **Anti-rebond** de boutons : on filtre les rebonds mécaniques (<10 ms) qui génèrent de faux appuis.
- **Condensateur de découplage** : à côté de chaque puce numérique, un petit condensateur "lisse" les variations rapides d'alimentation.
- **Flash photo** : on charge lentement un gros condo haute tension, et on le décharge d'un coup dans l'ampoule.

> [!tip]
> **Règle rapide à retenir.** Devant n'importe quel circuit RC, **calcule $\\tau$ en premier**, puis raisonne en multiples de $\\tau$ (1, 3, 5). 95% de ce qu'on te demandera en entretien se résout avec les correspondances $\\tau \\to 63\\%$, $3\\tau \\to 95\\%$, $5\\tau \\to$ régime permanent.

> [!colibrimo]
> En pur soft, tu croises la constante de temps RC... presque jamais. **Mais** l'intuition "la grandeur $X$ évolue exponentiellement vers son équilibre avec un temps caractéristique $\\tau$" revient **partout** : les **caches** qui se remplissent, les **buffers** qui se vident, les **compteurs de rate limiting** qui se régénèrent, les algorithmes d'**exploration-exploitation**. Même un LLM en "reasoning": l'attention s'atténue exponentiellement avec la distance entre tokens (rotary embeddings). Comprendre $\\tau = RC$ te donne un modèle mental pour dimensionner **n'importe quel système à relaxation**.`,
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
        title: "Shannon-Nyquist : convertir un signal analogique en numérique sans perte",
        estimated_minutes: 16,
        content_md: `## Pourquoi tu dois maîtriser ça

Tout ce qui vient du monde réel est **analogique** : une voix, une musique, un capteur de température, un ECG. Pour traiter ces signaux par ordinateur, on doit les **numériser** — prendre des "photos" du signal à intervalles réguliers, c'est l'**échantillonnage**. Le théorème de Shannon-Nyquist répond à **la** question critique : **à quelle vitesse faut-il prendre ces photos pour ne rien perdre ?** La réponse est : au minimum **deux fois** la fréquence la plus élevée du signal. C'est pour ça que le CD audio échantillonne à 44,1 kHz (pour capter jusqu'à ~20 kHz, la limite de l'oreille humaine). Le jury adore ce théorème parce qu'il mélange élégamment maths, physique et informatique — c'est LA frontière entre analogique et numérique.

> [!note]
> **Ce qu'il faut savoir avant** : la notion de **fréquence** $f$ (en **hertz** Hz, = 1 période par seconde) ; un signal peut contenir plusieurs fréquences (une note de piano contient sa fondamentale + des harmoniques). L'idée qu'un signal peut être **décomposé en somme de sinusoïdes** (analyse de Fourier — on ne fait pas la théorie ici, juste l'utiliser). La notion d'**échantillonner** = prendre la valeur du signal à des instants réguliers $t_0, t_1, t_2, \\ldots$ séparés d'une période $T_e = 1/f_e$.

## L'idée intuitive

Tu regardes les aiguilles d'une pendule, **mais** tu ne les regardes qu'une fois toutes les secondes (tu clignes très vite entre chaque observation). Peux-tu savoir à quelle vitesse elles tournent ?

- Si l'aiguille fait **un quart de tour par seconde** (elle tourne lentement), oui : entre deux regards tu la vois bouger un peu, tu estimes la vitesse.
- Si elle fait **un tour complet par seconde**, tu vois la même aiguille à chaque clin d'œil — tu crois qu'elle **ne tourne pas du tout**. Illusion.
- Si elle fait **un tour et quart par seconde**, tu crois qu'elle tourne lentement en sens inverse — **illusion opposée**.

C'est exactement le problème de **l'aliasing** (repliement de spectre). Si tu ne regardes pas assez souvent, tu confonds des signaux rapides avec des signaux lents. Le théorème de Shannon dit : pour être sûr de ne pas se faire piéger, il faut regarder **au moins deux fois** par tour de la plus rapide des aiguilles.

## L'énoncé formel du théorème

Soit un signal $s(t)$ dont toutes les fréquences sont inférieures à $f_{\\max}$ (on dit qu'il est à **bande limitée**). Pour pouvoir le **reconstruire parfaitement** à partir de ses échantillons, il faut que la fréquence d'échantillonnage $f_e$ satisfasse :

$$\\boxed{\\;f_e \\;>\\; 2 \\, f_{\\max}\\;}$$

La borne $2 f_{\\max}$ s'appelle la **fréquence de Nyquist**. C'est **le débit minimum** d'échantillonnage théorique. En dessous, on perd de l'information de façon **irréversible** — même l'ingé le plus malin ne pourra pas reconstruire le signal original.

**Vocabulaire associé :**
- $f_e$ (fréquence d'échantillonnage, sample rate) en Hz.
- $T_e = 1/f_e$ (période d'échantillonnage) en secondes.
- $f_e/2$ (**la demi-fréquence d'échantillonnage**, aussi appelée fréquence de Nyquist quand on désigne la borne haute du spectre "récupérable") : toutes les fréquences du signal doivent être **sous** cette ligne.

## L'aliasing (repliement de spectre)

Si $f_e$ est **trop basse**, les fréquences du signal au-dessus de $f_e/2$ ne disparaissent **pas** — elles se **replient** sur des fréquences plus basses. Une fréquence $f$ apparente dans les échantillons devient $|f - f_e|$ ou $|f - 2f_e|$, etc. Le signal "fake" est indistinguable d'un signal réel à cette fréquence fantôme. C'est **irréversible** : une fois les échantillons pris, on ne peut plus séparer les deux contributions.

**Formule du repliement** : si un signal à fréquence $f$ est échantillonné à $f_e$ et que $f > f_e/2$, la fréquence apparente vaut :
$$f_{\\text{apparent}} = |f - f_e| \\quad (\\text{si } f \\text{ est proche de } f_e)$$

**Exemple de piège** : signal à 15 kHz échantillonné à 20 kHz (donc $f_e/2 = 10$ kHz, le signal est au-dessus). Apparent : $|15 - 20| = 5$ kHz. Le signal à 15 kHz **se fait passer** pour un signal à 5 kHz dans les données numériques. Tu ne pourras **jamais** les distinguer en analysant seulement les échantillons.

## Les parades

1. **Filtre anti-repliement** (anti-aliasing filter) : un **passe-bas analogique** placé **avant** l'étage d'échantillonnage. Il coupe tout ce qui dépasse $f_e/2$ avant même qu'on échantillonne. Indispensable dans toute chaîne d'acquisition (ADC) pro.
2. **Suréchantillonner** : prendre $f_e$ **bien au-dessus** de $2 f_{\\max}$, pour laisser une marge dans laquelle le filtre anti-repliement peut opérer sans atténuer les fréquences utiles. C'est pour ça que le CD audio est à 44,1 kHz alors que l'oreille humaine plafonne à ~20 kHz (facteur 2,2 au lieu de 2).
3. **Oversampling + decimation** en numérique : échantillonner à 4× ou 8× le Nyquist puis filtrer/décimer en numérique. Simplifie le filtre analogique (plus besoin qu'il coupe pile à $f_e/2$).

## Ordres de grandeur à retenir

| Application | $f_{\\max}$ (bande utile) | $f_e$ standard | Ratio |
|-------------|--------------------------|-----------------|-------|
| Téléphonie fixe (voix) | 3,4 kHz | 8 kHz | 2,35 |
| CD audio | ~20 kHz | 44,1 kHz | 2,2 |
| Audio pro (studio) | 20 kHz | 48 ou 96 kHz | 2,4 à 4,8 |
| ECG médical | ~150 Hz | 500 Hz | ~3,3 |
| Vidéo HD (luma) | ~6 MHz | 13,5 MHz | 2,25 |

Une règle pratique : on prend **entre 2,2 et 3×** $f_{\\max}$ pour avoir une marge. 4× est confortable. 2× pile est théorique mais pas faisable en vrai (on ne peut pas construire de filtre parfait).

> [!example]
> **Trois applications détaillées.**
>
> **(a) Calcul minimum théorique.** Un signal dont la composante la plus haute est à $f_{\\max} = 8\\,\\text{kHz}$.
> - Critère Shannon : $f_e > 2 \\cdot 8 = 16\\,\\text{kHz}$.
> - Minimum théorique : 16 kHz (strictement supérieur).
> - En pratique on prendra **~20 kHz** pour avoir une marge de filtre.
>
> **(b) Repliement concret.** Signal à 15 kHz échantillonné à 20 kHz.
> - $f_e/2 = 10\\,\\text{kHz}$ → 15 kHz est **au-dessus** → aliasing.
> - Fréquence apparente : $|15 - 20| = 5\\,\\text{kHz}$. L'ordi "voit" du 5 kHz, pas du 15 kHz.
>
> **(c) Chaîne audio CD complète.** Musique contenant jusqu'à 18 kHz.
> - Shannon minimum : 36 kHz.
> - Standard CD : 44,1 kHz (marge de ~10% pour laisser le filtre anti-repliement couper proprement entre 18 et 22,05 kHz).
> - Donc un CD peut théoriquement représenter des signaux jusqu'à $44{,}1 / 2 = 22{,}05\\,\\text{kHz}$, au-delà de l'audition humaine.
>
> **(d) Dimensionnement capteur IoT.** Un capteur de vibration industriel produit des signaux jusqu'à 2 kHz.
> - Minimum : $f_e = 4\\,\\text{kHz}$.
> - Avec filtre anti-repliement correct : 8 kHz est un choix prudent.
> - Si ton microcontrôleur peut échantillonner à 10 kHz, tu es tranquille et tu peux appliquer des algos FFT qui demandent de l'over-sampling.

> [!warning]
> **Pièges classiques.**
>
> - **Échantillonner pile à $2 f_{\\max}$.** Le théorème dit **strictement supérieur** ($f_e > 2 f_{\\max}$), pas $\\ge$. À la borne, deux points par période ne suffisent **pas** à reconstruire une sinusoïde (imagine des points à chaque passage à zéro — ça pourrait être n'importe quelle amplitude).
> - **Croire qu'un filtre numérique peut réparer le repliement.** Une fois que l'aliasing a eu lieu à l'échantillonnage, **aucun** traitement numérique ne peut le retirer. Il faut un filtre **analogique** avant l'ADC. C'est irréversible.
> - **Oublier que le signal doit être à bande limitée.** Le théorème s'applique aux signaux dont le spectre est borné. Un signal contenant une discontinuité (saut brutal, créneau parfait) a un spectre qui s'étend à l'infini — il n'est **pas** strictement reconstructible à partir d'échantillons, quelle que soit la fréquence choisie.
> - **Confondre "signal à 10 kHz" et "signal de bande 0 à 10 kHz".** Pour un signal pur (sinusoïde à 10 kHz), tu as besoin de $f_e > 20$ kHz. Pour un signal qui contient **toutes les fréquences entre 0 et 10 kHz** (comme la voix), c'est **aussi** $f_e > 20$ kHz (ce qui compte c'est $f_{\\max}$).
> - **Mélanger Hz et rad/s.** Le théorème est énoncé en Hz. Si tu travailles en rad/s ($\\omega$), les formules changent d'un facteur $2\\pi$.

## À quoi ça sert en pratique

- **Audio** : pourquoi un CD est à 44,1 kHz, et pas à 20 kHz (pour capter 20 kHz sans aliasing).
- **Télécoms** : dimensionner la bande passante d'un canal pour transmettre $B$ Hz d'info utile.
- **Instrumentation** : choisir la fréquence d'échantillonnage d'un ADC en fonction de la bande des capteurs.
- **Traitement d'images** : la résolution pixel = échantillonnage spatial ; le moiré est l'aliasing visuel qu'on voit sur les tissus fins.
- **Musique électronique** : savoir pourquoi certains effets (saturation, distorsion) génèrent des harmoniques qu'il faut filtrer avant de sampler.

> [!tip]
> **Réflexe en entretien.** Dès qu'on te pose une question sur "la plus petite $f_e$ possible" ou "pourquoi on choisit $f_e$ comme ça", le réponse est **toujours** en rapport avec **$2 \\times f_{\\max}$**. Donne la formule, le nom "Nyquist", et mentionne qu'en pratique on prend 2,2 à 3× pour laisser de la place au filtre. Trois phrases, dix points gagnés.

> [!colibrimo]
> L'intuition Shannon apparaît **partout** en data engineering. Le **polling** d'une API est un échantillonnage — si tu regardes la valeur toutes les 5 min mais qu'elle change toutes les minutes, tu loupes les transitions. Le **monitoring** de métriques avec une granularité trop lâche masque des anomalies. Le **rate limiting** basé sur un compteur qui rafraîchit trop lentement peut se faire piéger par des rafales. Dès que tu "échantillonnes" une grandeur continue (taux de requêtes, latence, usage mémoire), la question devient : **quelle est la fréquence maximale des variations que je veux capter** ? Puis tu doubles au minimum.`,
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
