export type QA = {
  id: string;
  question: string;
  trap: string;
  structure: string;
  example: string;
};

export type QASection = {
  id: string;
  title: string;
  description: string;
  questions: QA[];
};

export type Pitch = {
  id: string;
  duration: string;
  wordCount: number;
  body: string;
  notes: string;
};

export type Pitfall = {
  id: string;
  title: string;
  why: string;
  fix: string;
};

export const QA_SECTIONS: QASection[] = [
  {
    id: "motivation-parcours",
    title: "Motivation & parcours",
    description:
      "Le cœur de l'entretien — pourquoi cette école, pourquoi maintenant, pourquoi toi.",
    questions: [
      {
        id: "pourquoi-inge-maintenant",
        question:
          "Pourquoi un cycle ingé maintenant, après 10 ans hors études et déjà un poste de lead dev ?",
        trap: "Sembler fuir Colibrimo, ou se réfugier derrière « c'est pour le diplôme ».",
        structure:
          "1) constat lucide sur le plafond actuel · 2) ambition technique précise (archi/bas niveau) · 3) preuve d'engagement déjà à l'œuvre.",
        example:
          "Le DWWM m'a ouvert la porte du métier. Aujourd'hui je suis lead dev et je touche à des sujets que j'adore — IA générative, archi, produit. Mais je me heurte à un plafond : sur le marché, « dev fullstack autodidacte » reste lu comme un profil applicatif, et à l'international c'est encore plus marqué. Surtout, j'ai envie de descendre plus bas — système, archi distribuée, fondations math/algo qu'un autodidacte ne reconstruit jamais vraiment seul. Reprendre les études maintenant, c'est aller chercher ce que mon parcours pro ne me donnera pas tout seul. L'app de révision que j'ai construite pour préparer cet entretien est la preuve que je ne fais pas ça pour l'image — j'ai déjà commencé à bosser.",
      },
      {
        id: "pourquoi-isen",
        question: "Pourquoi ISEN spécifiquement ?",
        trap: "Réponse interchangeable qui marcherait pour n'importe quelle école d'ingé.",
        structure: "Trois raisons concrètes : format · ancrage · identité scientifique.",
        example:
          "Trois raisons. Un, le format apprentissage : je continue à produire en entreprise pendant que j'apprends — ça correspond à ma logique d'utilité immédiate de ce que j'apprends. Deux, le campus de Lille me convient géographiquement, et j'ai déjà signé chez ACSSI à proximité — l'écosystème est là, je ne pars pas de zéro. Trois, ISEN est généraliste mais avec une vraie identité numérique/électronique : ça m'ouvre les portes du bas niveau et du système, là où j'ai justement envie de progresser, sans m'enfermer trop tôt sur une dominante.",
      },
      {
        id: "trajectoire-mili-dev-inge",
        question:
          "Vous êtes ex-militaire, puis dev, maintenant ingé en alternance. Comment vous expliquez cette trajectoire ?",
        trap: "Jouer la carte « j'ai cherché ma voie » qui fait dilettante.",
        structure: "Un fil rouge unique → ce que chaque étape construit → continuité, pas zigzag.",
        example:
          "Il y a un fil rouge : la résolution de problèmes sous contrainte. À l'armée, au 1er RCP, c'était la mission, le terrain, l'imprévu — j'y ai appris la rigueur, la décision sous stress, le travail collectif. En me reconvertissant dev, j'ai retrouvé la même mécanique en plus cérébrale : un problème à découper, un système à faire tenir, un bug à isoler. Aujourd'hui en passant ingé, je vais chercher la couche d'en dessous — comprendre POURQUOI les choix d'archi tiennent ou pas, pas juste les implémenter. Ce ne sont pas trois mondes, c'est une même posture qui monte en abstraction.",
      },
      {
        id: "vision-5-10-ans",
        question: "Comment vous voyez-vous dans 5 à 10 ans ?",
        trap: "Réponse trop creuse (« CTO ! ») ou trop vague (« on verra »).",
        structure: "Court terme (3 ans) → moyen (5-7 ans) → long terme (10+).",
        example:
          "À 3 ans, je veux être ingé diplômé, opérationnel sur des sujets bas niveau et archi distribuée que je ne touche pas aujourd'hui. À 5-7 ans, soit tech lead/staff sur des produits complexes, soit cofondateur d'une boîte tech — j'ai déjà l'instinct produit avec Colibrimo, il me manque la profondeur ingé pour porter de l'archi ambitieuse. À 10 ans je n'ai pas de poste précis en tête, mais je veux toujours être en train d'apprendre quelque chose de nouveau — j'aime vraiment ça. Ce qui est sûr, c'est que je veux rester sur du concret, du produit qui sert à des gens.",
      },
      {
        id: "etudes-vs-experience",
        question:
          "Vous êtes déjà opérationnel. Qu'est-ce que les études vont vous apporter de plus ?",
        trap: "Mépriser sa propre exp ou inverse, dénigrer les études.",
        structure: "Ce que la pratique NE donne PAS → ce que l'école seule peut apporter.",
        example:
          "Ce que l'expérience pro donne, c'est savoir livrer, prioriser, débuguer en prod, encadrer. Ce qu'elle ne donne pas — ou très lentement — c'est les fondations formelles : math, algo, archi théorique, électronique, systèmes. En prod on apprend des patterns ; à l'école on apprend des principes. Quand je lis un papier sur les LLM ou que je regarde une archi distribuée complexe, je vois où mes lacunes me bloquent. Le diplôme ingé, c'est pour ne plus avoir à contourner ces sujets — et accessoirement avoir un titre lisible à l'international, parce que DWWM ça parle à personne hors de France.",
      },
    ],
  },
  {
    id: "doute-scientifique",
    title: "Doute scientifique (le vrai test)",
    description:
      "Le jury a déjà signalé un doute sur ton niveau maths/physique — c'est l'angle d'attaque le plus probable.",
    questions: [
      {
        id: "reconnaitre-doute",
        question:
          "Le jury a relevé un doute sur votre niveau scientifique. Qu'en pensez-vous ?",
        trap: "Nier (ça paraît défensif) ou se déprécier (ça inquiète le jury).",
        structure: "Reconnaître honnêtement → contextualiser → présenter le plan.",
        example:
          "Je ne le conteste pas, c'est factuel : je n'ai pas fait de cours de maths ou de physique depuis dix ans. Mais ce n'est pas un manque de capacité, c'est un manque de pratique récente. Je l'ai pris au sérieux : j'ai construit une app de révision personnelle, isen-prep, qui couvre maths, physique, électronique et algo avec leçons longues, exos auto-corrigés et flashcards à répétition espacée. Je l'utilise tous les jours. Ce que je veux vous montrer, c'est moins mon niveau actuel — qui sera ce qu'il est — que ma méthode et mon engagement à combler le gap.",
      },
      {
        id: "methode-rattrapage",
        question: "Concrètement, comment rattrapez-vous le retard maths/physique ?",
        trap: "Lister du contenu sans méthode (« je révise tout »).",
        structure: "Méthode → outils → cadence → critère de succès.",
        example:
          "Méthode : je décompose chaque chapitre en prérequis avant de l'attaquer — par exemple je ne touche pas à l'intégration sans avoir solidifié dérivation et limites avant. Outils : leçons longues écrites avec un assistant IA pour structurer, exos auto-corrigés, flashcards SM-2 pour les définitions et formules clés. Cadence : 2 à 3h par jour en plus de mon job, en révision active — pas de lecture passive, je refais les démos à la main. J'avance par sprints d'une semaine sur un thème, parce que je veux que ça tienne longtemps, pas juste pour l'entretien.",
      },
      {
        id: "calcul-integral",
        question:
          "Si on vous donne un calcul d'intégrale ou une équation différentielle simple, vous la traitez ?",
        trap: "Promettre plus qu'on ne peut tenir, ou se défausser.",
        structure: "Honnêteté sur ce qui est acquis · honnêteté sur ce qui ne l'est pas · posture de bosseur.",
        example:
          "Sur les exos basiques que j'ai déjà retravaillés — intégrales par parties, dérivation classique, équations linéaires d'ordre 1 — oui. Sur des sujets que je n'ai pas encore retouchés, je vais buter, et je préfère vous le dire en face. Ce que je sais faire en revanche, c'est ne pas paniquer face à un sujet inconnu, identifier ce qui me manque, et aller le chercher. C'est une posture que je tiens depuis 10 ans en dev autodidacte — apprendre sous pression.",
      },
      {
        id: "sujet-inconnu",
        question: "Comment réagissez-vous face à un sujet que vous ne maîtrisez pas ?",
        trap: "Cliché « je me forme en ligne », sans exemple.",
        structure: "Exemple concret tiré de l'expé pro, format STAR.",
        example:
          "Exemple récent. Sur Colibrimo on a voulu faire de la recherche sémantique sur des estimations rénovation. Je n'avais jamais touché aux embeddings ni à pgvector. J'ai fait trois choses dans l'ordre : un, lire la doc officielle pour avoir des bases solides ; deux, regarder comment des gens compétents l'avaient implémenté en prod (pas un tuto YouTube, du code de référence) ; trois, prototyper en isolé pour comprendre les pièges avant d'intégrer. En deux semaines on était en prod. C'est ma méthode constante : doc primaire → exemples experts → proto isolé → intégration.",
      },
      {
        id: "tenir-premiere-annee",
        question:
          "La première année va être dure pour vous niveau maths/physique. Comment vous tenez ?",
        trap: "Réponse molle « j'ai l'habitude de bosser ».",
        structure: "Hygiène concrète + filets de sécurité + ancrage parcours.",
        example:
          "Concrètement, j'ai trois choses qui me protègent. Un, je suis discipliné — l'armée pendant 8 ans m'a appris à tenir un effort long sans flancher. Deux, l'alternance chez ACSSI me donne une respiration : quand je sature de maths, je code, et inversement. Trois, je ne resterai pas seul — je vais chercher l'aide des camarades, des profs, et j'utilise les outils IA de manière responsable (pour comprendre, pas pour tricher). Je sais que la première année sera dure, mais « dur » je connais.",
      },
    ],
  },
  {
    id: "alternance-acssi",
    title: "Alternance ACSSI & profil pro",
    description:
      "Ton joker : alternance déjà signée. À valoriser sans en faire trop, et préparer les questions sur le changement de stack.",
    questions: [
      {
        id: "presenter-alternance",
        question: "Présentez votre alternance — ACSSI, votre poste, votre encadrement.",
        trap: "Trop court (paraît qu'on s'en fiche) ou trop flou (paraît qu'on improvise).",
        structure: "Boîte → poste → enjeux techniques → encadrement.",
        example:
          "ACSSI est une ESN avec laquelle je rejoins en septembre comme dev fullstack Java sur des missions clients. Concrètement, c'est un changement de stack pour moi — je viens d'un environnement TypeScript/Next, je vais devoir monter en compétence sur l'écosystème JVM (Spring, Maven/Gradle, JPA). Pour moi c'est un atout : j'aurai vu deux écosystèmes majeurs au lieu d'un seul, et la rigueur typée de Java est un bon complément à l'expérience que j'ai. Côté encadrement, mon maître d'apprentissage sera désigné à mon arrivée, et je serai en lien direct avec un tech lead expérimenté.",
      },
      {
        id: "pourquoi-acssi",
        question: "Pourquoi ACSSI plutôt qu'une autre ESN ou un éditeur ?",
        trap: "Sembler avoir pris la première qui répondait.",
        structure: "Critères de recherche + match concret.",
        example:
          "Je cherchais trois choses. Un, une boîte qui prend l'alternance au sérieux — pas une ressource qu'on case sur un compte client low-cost. Deux, une variété de missions pour ne pas s'enfermer sur une seule techno. Trois, une stack qui m'élargit — Java était voulu, justement parce que je n'en faisais pas. ACSSI cochait les trois cases, le contact humain est passé pendant l'entretien, j'ai signé.",
      },
      {
        id: "lead-vers-junior",
        question: "Vous êtes lead dev aujourd'hui. Vous acceptez de redevenir junior chez ACSSI ?",
        trap: "Faire le faux humble (« je suis prêt à tout réapprendre ») ou le contraire (« je suis déjà expert »).",
        structure: "Réalité du statut · valeur ajoutée · humilité technique.",
        example:
          "Sur le statut administratif d'apprenti, oui clairement, et je l'assume — c'est le cadre. Sur le terrain, je n'arrive pas comme un débutant : 4 ans d'exp dev dont 2 en lead, je sais lire du code, livrer en prod, communiquer avec un PO, encadrer. Je vais me taire sur le périmètre Java pendant que j'apprends, et apporter de la valeur sur tout le reste — méthodologie, archi applicative, qualité, soft skills. C'est l'inverse d'un alternant frais sortant d'un BTS, et je pense qu'ACSSI a vu ça comme un atout, pas un problème.",
      },
      {
        id: "rythme-alternance-etudes",
        question: "Comment vous gérez alternance + études ? Le rythme est dense.",
        trap: "Sous-estimer la charge ou en faire trop (« je ne dors pas »).",
        structure: "Cadre officiel · hygiène quotidienne · signaux d'alerte assumés.",
        example:
          "Le rythme officiel je le connais — alternance école/entreprise selon le calendrier ISEN. Hygiène : blocs de 90 minutes avec pauses, 7h de sommeil non-négociable, écrans coupés une heure avant de dormir. Signaux d'alerte que je m'autorise à voir : sommeil qui dégrade, irritabilité, perte de plaisir au taf. Si l'un des trois s'allume, je redescends la charge — je préfère arbitrer tôt qu'exploser au second semestre. Sur les huit ans à l'armée j'ai appris à gérer la fatigue, c'est un acquis.",
      },
      {
        id: "cas-management",
        question: "Vous avez déjà managé. Racontez un cas de management difficile.",
        trap: "Cas trop léger ou se mettre en héros qui sauve tout.",
        structure: "STAR : situation → tension → action → résultat → leçon.",
        example:
          "Chez Colibrimo, on était trois devs. Un junior avait pris en main une partie sensible — pipeline IA — et avait du mal à livrer dans les délais sans oser le dire. Je l'ai vu sur les commits, pas sur ce qu'il disait en réu. J'ai pris un 1:1 sans le piéger, juste pour comprendre. Il bloquait sur deux sujets précis. On a fait un pair programming d'une heure et demie sur chacun, et surtout j'ai changé le format de notre stand-up pour qu'il soit OK de dire « je galère » sans perdre la face. Résultat : il a livré dans la semaine, et on a évité la crise. Leçon : quand un dev silencieux devient encore plus silencieux, c'est rarement parce que tout va bien.",
      },
    ],
  },
  {
    id: "personnalite",
    title: "Personnalité & comportement",
    description:
      "Questions courantes mais piégeuses. Préparer des exemples concrets, pas des généralités.",
    questions: [
      {
        id: "qualites-defauts",
        question: "Trois qualités, trois défauts.",
        trap: "Faux défauts (« je suis perfectionniste »).",
        structure: "Qualités utiles ingé · vrais défauts · ce que tu fais avec.",
        example:
          "Qualités : endurance — je tiens longtemps sur un sujet sans flancher ; clarté — je mets vite par écrit ce qui est confus ; curiosité large — je ne me ferme pas à un domaine. Défauts : impatience opérationnelle — je veux livrer vite et parfois je dois me forcer à formaliser ; tendance à porter trop sur mes épaules — je délègue avec retard ; rigueur math très perfectible — je le sais, et c'est précisément pour ça que je veux ce diplôme. Sur les deux premiers j'ai des garde-fous ; sur le troisième j'ai un plan d'attaque qui tourne déjà.",
      },
      {
        id: "echec-marquant",
        question: "Un échec marquant, et ce que vous en avez tiré.",
        trap: "Faux échec déguisé en humble brag.",
        structure: "STAR + leçon réinvestie.",
        example:
          "Sur Colibrimo j'ai poussé une refonte d'UI sans assez d'itérations utilisateur — j'avais « le sentiment » que c'était mieux. À la sortie, deux clients power users sont tombés sur des frictions, et un a exprimé qu'il avait perdu confiance en notre stabilité. C'est passé proche d'un churn. J'ai dû reculer sur une partie de la refonte et restaurer des comportements anciens. Leçon : mon instinct produit n'est pas un substitut au feedback utilisateur, surtout en B2B où chaque client compte. Depuis, toute refonte UX passe par trois utilisateurs avant déploiement.",
      },
      {
        id: "projet-fier",
        question: "Un projet dont vous êtes fier.",
        trap: "Étalage technique sans impact lisible.",
        structure: "Pourquoi c'était dur · ce qui a fait la différence · impact mesurable.",
        example:
          "Le module d'estimation IA de Colibrimo. Pourquoi c'était dur : il fallait que des artisans non-tech, en chantier, obtiennent en 30 secondes une estimation crédible à partir de 4 ou 5 photos. La précision technique ne suffit pas — il faut que la sortie soit lisible et défendable face au client. Ce qui a fait la différence, c'est le travail sur la confiance : on explique ce qu'on a vu sur la photo, on cite des références, on précise les marges d'erreur. Impact : on est passés de 5 à plus de 20 clients facturés en quelques mois sur ce module. La fierté c'est moins le ML que d'avoir su faire atterrir un truc complexe en interface simple.",
      },
      {
        id: "stress",
        question: "Comment réagissez-vous au stress ?",
        trap: "Réponse cliché type « je suis cool ».",
        structure: "Ancrage par exemple concret + outils opérationnels.",
        example:
          "Le stress aigu, je l'ai testé à l'armée — au 1er RCP comme tireur d'élite, je devais tenir une concentration longue avec enjeu réel. La leçon que j'en garde : le stress diminue quand on découpe la tâche en actions concrètes immédiates. En dev, quand un incident pète en prod, je passe immédiatement en mode checklist : reproduire, isoler, mitiger, communiquer, fixer, post-mortem. Sur un stress chronique de surcharge, je m'autorise à dire stop avant que ça ne casse. Je connais mes signaux et je ne les ignore pas.",
      },
      {
        id: "passion-tech-hors-job",
        question: "Un sujet tech qui vous passionne en dehors du travail ?",
        trap: "Buzzword (« l'IA générative »).",
        structure: "Sujet précis + ce qui t'attire + comment tu le suis.",
        example:
          "Les architectures de LLM modernes — concrètement comment on est passés des transformers de 2017 aux MoE et aux modèles agentiques d'aujourd'hui. Ce qui m'attire, c'est que ça mélange du math costaud (algèbre linéaire, optimisation), de l'archi distribuée (training sur clusters), et un produit qui change le quotidien de tout le monde. Je suis ça par les papiers sur arXiv, des newsletters spécialisées, et je teste régulièrement les modèles open-source en local pour voir ce qu'ils savent vraiment faire — pas juste lire des annonces marketing.",
      },
    ],
  },
  {
    id: "isen-final",
    title: "ISEN, projets, fin d'entretien",
    description:
      "Connaissance école, projet rêvé, et la question piège « avez-vous des questions ? ».",
    questions: [
      {
        id: "programme-dominante",
        question:
          "Que savez-vous du programme du cycle ingé ISEN, et quelle dominante vous attire ?",
        trap: "Jouer le caméléon ou dire « je verrai sur le moment ».",
        structure: "Tronc commun connu · dominante préférée + raison · ouverture.",
        example:
          "Le cycle ingé ISEN couvre deux ans de tronc commun — math, physique, électronique, info, sciences ingé — avant la spécialisation en 4ème et 5ème année. Sur les dominantes, ce qui m'attire le plus c'est l'IA et la donnée, parce que c'est dans la continuité de ce que je fais en prod et que je veux pouvoir descendre dans les fondations. Cela dit, je ne ferme rien avant les deux ans de tronc commun — c'est aussi ce que j'attends de l'école : me donner la matière pour choisir en connaissance de cause, pas figer mon choix le premier jour.",
      },
      {
        id: "projet-reve",
        question: "Quel projet école rêveriez-vous de mener ?",
        trap: "Trop ambitieux/irréalisable, ou trop conformiste.",
        structure: "Sujet concret + lien parcours + ce que l'école apporte spécifiquement.",
        example:
          "Un projet qui croiserait IA et hardware contraint — par exemple un système de détection embarqué pour repérer une anomalie sur un chantier (un risque de chute, un mur fissuré) à partir d'une caméra peu coûteuse. Lien parcours : ça touche le secteur que je connais avec Colibrimo. Apport école : ça force à descendre du cloud confortable que je connais aujourd'hui vers de l'embarqué et du temps réel — exactement la zone où je veux progresser et que je ne peux pas explorer seul.",
      },
      {
        id: "contacts-isen",
        question: "Vous avez des contacts ISEN ? Vous êtes venu sur le campus ?",
        trap: "Mentir.",
        structure: "Vérité + démarche d'engagement future.",
        example:
          "Honnêtement, je n'ai pas encore d'ancien dans mon réseau direct, mais j'ai consulté la documentation, les retours d'alumni sur LinkedIn, et échangé avec le service admissions. Si j'ai la chance d'être pris, je m'investirai dans la promo et j'aimerais en retour aider les profils en reconversion comme le mien — il y en a, et ils n'ont pas toujours les bons relais.",
      },
      {
        id: "questions-finales",
        question: "Avez-vous des questions ?",
        trap: "Répondre « non », ou poser une question logistique (« quand sont les résultats ? »).",
        structure: "2 à 3 questions qui montrent l'engagement et la curiosité.",
        example:
          "Trois sujets m'intéressent. Un, comment l'école accompagne un alternant qui découvre une stack qu'il ne pratiquait pas — Java pour moi — il y a des supports prévus, ou c'est de l'autonomie ? Deux, est-ce qu'il y a des projets transverses entre alternants pour mutualiser les retours d'expérience client ? Trois, comment se passe le choix de dominante en 3ème année — quels sont les éléments qui aident à décider ?",
      },
      {
        id: "pourquoi-vous",
        question: "Pourquoi vous, et pas un autre profil sur la liste ?",
        trap: "Auto-promotion lourde ou dénigrement implicite des autres.",
        structure: "3 différentiateurs concrets + humilité finale.",
        example:
          "Je ne sais pas qui sont les autres candidats, donc je ne peux pas comparer. Ce que je peux dire de moi : un, j'arrive avec une alternance déjà signée chez ACSSI, ce qui sécurise mon parcours pour vous comme pour l'entreprise. Deux, j'ai 4 ans d'exp dev en prod dont 2 en lead — vous gagnez un alternant qui apporte sur les soft skills dès le premier jour. Trois, j'ai un parcours atypique, militaire-dev-ingé, qui apporte de la diversité à la promo. Si ça correspond au profil que vous cherchez, prenez-moi. Sinon, je respecterai votre décision.",
      },
    ],
  },
];

export const PITCHES: Pitch[] = [
  {
    id: "pitch-1min",
    duration: "1 minute (~150 mots)",
    wordCount: 150,
    body: `Je m'appelle Anisse, 27 ans. Mon parcours tient en trois temps. D'abord 8 ans dans l'armée, au 1er RCP comme tireur d'élite, qui m'ont appris la rigueur, la décision sous pression, le travail collectif. Ensuite je me reconvertis dev — Bac+2 DWWM en 2022, et depuis 4 ans je code en production, dont les 2 dernières années comme lead dev de Colibrimo, un SaaS d'estimation rénovation où je touche à l'IA, l'archi, le produit.

Pourquoi le cycle ingé maintenant : parce que mon plafond comme dev autodidacte est atteint — je veux les fondations scientifiques que mon parcours ne m'a pas données, et un titre lisible à l'international. J'ai signé une alternance chez ACSSI en dev fullstack Java, et j'ai construit une app perso pour rattraper mon niveau scientifique avant la rentrée. Je suis là parce que j'aime apprendre, et parce que j'ai besoin de la profondeur ingé pour la suite.`,
    notes:
      "Format de démarrage classique. Garder le rythme — pas plus d'une respiration entre chaque temps. À tester chrono en main jusqu'à tomber sous les 60 secondes.",
  },
  {
    id: "pitch-2min",
    duration: "2 minutes (~300 mots)",
    wordCount: 300,
    body: `Je m'appelle Anisse Lebadi, 27 ans. Avant de parler du présent, un mot sur d'où je viens — parce que ça explique le reste.

J'ai passé 8 ans dans l'armée, au 1er Régiment de Chasseurs Parachutistes comme tireur d'élite. C'est là que j'ai appris ce qui définit ma manière de travailler aujourd'hui : la rigueur, la décision sous pression, la responsabilité collective. À la sortie, j'avais besoin d'un métier qui demande la même intensité mais sur le plan intellectuel — j'ai choisi le développement.

J'ai passé un Bac+2 DWWM, et depuis 4 ans je suis dev fullstack en production. Les 2 dernières années, je suis lead dev de Colibrimo, un SaaS B2B d'estimation rénovation par IA. Concrètement je conçois l'archi, j'écris du code Next.js et Supabase, je manage 2 devs, je suis en contact direct avec les clients artisans pour faire atterrir des fonctionnalités IA en interfaces simples. J'aime ce que je fais.

Mais j'ai atteint un plafond. Comme dev autodidacte, certains sujets restent flous — math formelles, archi distribuée, électronique, systèmes. Quand je lis un papier sur les LLM ou que je regarde une archi complexe, je sens où mes lacunes me bloquent. Et sur le marché, sans titre ingé, je suis perçu comme « profil applicatif », surtout à l'international.

Le cycle ingé ISEN par apprentissage est la réponse logique : je continue à produire chez ACSSI en alternance, sur une stack Java qui m'élargit techniquement, pendant que je vais chercher les fondations qui me manquent. J'ai déjà commencé — j'ai construit une app perso, isen-prep, qui couvre maths, physique, électronique, algo, et que j'utilise tous les jours.

Je suis là parce que j'aime apprendre, parce que je sais tenir un effort long, et parce que j'ai besoin de la profondeur ingé pour la suite de mon parcours.`,
    notes:
      "Le format le plus utile. Trois temps clairs : passé / présent / pourquoi maintenant. La phrase militaire en accroche capte l'attention sans en faire des tonnes.",
  },
  {
    id: "pitch-5min",
    duration: "5 minutes (~750 mots)",
    wordCount: 750,
    body: `Je m'appelle Anisse Lebadi, j'ai 27 ans. Si vous me donnez 5 minutes, je vais essayer de vous montrer pourquoi mon parcours, qui peut paraître éclectique, suit en réalité une logique très claire — et pourquoi le cycle ingé ISEN par apprentissage est la suite naturelle pour moi.

Premier temps : l'armée. J'y suis entré à 18 ans, j'y suis resté 8 ans, au 1er Régiment de Chasseurs Parachutistes comme tireur d'élite. Ce que j'en retire, ce ne sont pas des anecdotes — c'est une manière de travailler. Concrètement : la rigueur de préparation, la décision rapide sous stress, la responsabilité du collectif, et surtout la capacité à tenir un effort long sans flancher quand le contexte est dur. Quand je dis aujourd'hui « la première année de cycle ingé sera dure », je ne minimise pas — mais « dur » je connais.

Deuxième temps : la reconversion vers le développement. À la sortie, je voulais un métier qui demande la même intensité mais cérébrale. J'ai préparé un Bac+2 DWWM en 2022 — Développeur Web et Web Mobile — et j'ai démarré en stack JavaScript/TypeScript. Depuis 4 ans je suis en production : 2 ans en agence, puis 2 ans comme lead dev de Colibrimo, un SaaS B2B d'estimation rénovation par IA. Là-bas, mon quotidien c'est concevoir des architectures, livrer du code Next.js et Supabase, manager deux devs, et travailler directement avec des artisans non-tech pour leur faire utiliser des fonctionnalités IA complexes — embeddings, RAG, génération structurée. C'est passionnant et c'est aussi là que j'ai compris mes limites.

Troisième temps : pourquoi le cycle ingé maintenant. Trois raisons.

Un : j'ai un plafond comme autodidacte. En prod, on apprend des patterns, mais on apprend rarement les principes — math formelles, théorie des graphes, archi distribuée, électronique, systèmes. Quand je lis un papier sur les LLM ou que je creuse une archi complexe, je vois où mes lacunes me bloquent. Le diplôme ingé, c'est aller chercher ces fondations que mon parcours ne me donnera pas tout seul, sauf en y mettant 10 fois plus d'années.

Deux : la lisibilité du titre. DWWM, sur le marché français, c'est correct mais perçu comme « applicatif ». À l'international, ça ne dit rien à personne. Je me projette sur le long terme — peut-être co-fonder une boîte, peut-être bosser à l'étranger — et un titre ingé enlève une friction structurelle.

Trois : j'aime apprendre. Vraiment. Et le format apprentissage cadre parfaitement avec ma logique d'utilité immédiate de ce que j'apprends.

C'est dans cette logique que j'ai signé une alternance chez ACSSI, ESN, comme dev fullstack Java. Vous remarquerez que c'est un changement de stack pour moi — c'était voulu. Java, c'est l'écosystème JVM, Spring, JPA, des typages stricts, une rigueur que TypeScript imite mais que Java porte historiquement. C'est l'élargissement technique que je veux : sortir de ma zone de confort tout en restant productif. Et l'alternance étant déjà signée avant l'entretien, vous savez que mon parcours est sécurisé pour vous comme pour ACSSI.

Sur le doute scientifique que le jury a relevé sur mon dossier, je veux être honnête : je n'ai pas pratiqué les maths ou la physique depuis dix ans. Je ne le nie pas, je le prends comme un objectif. J'ai construit, en parallèle de mon job actuel, une application personnelle de révision — isen-prep — qui couvre maths, physique, électronique et algo, avec leçons longues, exercices auto-corrigés et flashcards à répétition espacée. Je l'utilise 2 à 3 heures par jour. Ce que je veux montrer, ce n'est pas un niveau parfait — il sera ce qu'il sera le jour J — c'est une méthode et un engagement à tenir l'effort dans la durée.

Pour conclure : militaire, dev, ingé. Trois mondes en apparence, mais le fil rouge est clair pour moi — c'est la résolution de problèmes sous contrainte, qui monte chaque fois en abstraction. Aujourd'hui je veux la couche du dessous, celle où on comprend POURQUOI les choix tiennent et pas juste comment les implémenter. Je suis là parce que j'aime apprendre, parce que je sais tenir un effort long, et parce que je suis convaincu que ce diplôme est la pièce qui me manque pour la suite.

Merci.`,
    notes:
      "Format pour entretien long ou si on te demande explicitement « racontez-moi votre parcours ». À répéter à voix haute plusieurs fois pour le tempo, mais ne JAMAIS le réciter — il sert d'ossature mémorisée, à improviser à partir de.",
  },
];

export const PITFALLS: Pitfall[] = [
  {
    id: "denigrer-dwwm",
    title: "Dénigrer le DWWM",
    why: "Le jury valorise les profils pro. Cracher sur d'où tu viens, c'est dire « j'ai fait n'importe quoi pendant 4 ans ».",
    fix: "« Le DWWM m'a ouvert le métier, j'ai 4 ans d'exp en prod derrière, maintenant je veux la suite. »",
  },
  {
    id: "salaire-en-premier",
    title: "Mettre le salaire/le statut en premier",
    why: "Sonne mercantile, surtout en alternance où le salaire est cadré. Le jury veut entendre des motivations intrinsèques.",
    fix: "Si on te pose la question, parle d'apprentissage et d'évolution avant le chiffre. Le chiffre vient à la fin, sobrement.",
  },
  {
    id: "promettre-cartonner",
    title: "Promettre que tu vas cartonner en maths",
    why: "Tu n'en sais rien, et le jury voit la promesse creuse à 10 km.",
    fix: "« Je vais bosser. Mon objectif premier semestre c'est de valider, pas de briller. »",
  },
  {
    id: "etaler-jargon",
    title: "Étaler du jargon technique",
    why: "Devant un jury mixte (pas que des dev), RAG/embeddings/microservices sans contexte = mur.",
    fix: "Pose chaque terme en une phrase compréhensible, ou évite-le. La maîtrise se voit à la simplicité d'expression, pas à la complexité.",
  },
  {
    id: "denigrer-matiere",
    title: "Dire « les maths j'ai jamais aimé »",
    why: "Red flag absolu pour un cycle ingé. Tu candidates dans une école scientifique.",
    fix: "« Je n'avais pas pratiqué depuis longtemps, je redécouvre, et c'est plus passionnant que je pensais — par exemple… »",
  },
  {
    id: "critiquer-employeur",
    title: "Critiquer Colibrimo, un ancien manager, l'armée",
    why: "Même si t'es saoulé, le jury retient seulement « il parle mal de ses ex-employeurs — il parlera mal de nous ».",
    fix: "Toujours sortir avec respect. « C'était une expérience structurante. Aujourd'hui je vise autre chose. »",
  },
  {
    id: "trop-blaguer",
    title: "Trop blaguer / trop familier",
    why: "Tu peux être détendu, mais le jury reste un jury. La distance respectueuse rassure plus qu'elle ne refroidit.",
    fix: "Une touche d'humour appropriée OK ; le tutoiement, les blagues à répétition, non.",
  },
  {
    id: "telephone",
    title: "Téléphone allumé / vibreur pendant l'entretien",
    why: "Une notification qui vibre = rupture, et signal d'« il a la tête ailleurs ».",
    fix: "Coupé totalement avant d'entrer dans la salle. Pas en silencieux, coupé.",
  },
  {
    id: "pas-de-question",
    title: "Ne pas avoir de question à la fin",
    why: "Signal d'absence d'engagement. Le jury aura toujours le temps pour 2-3 questions.",
    fix: "Préparer 3 questions de fond (cf section ISEN ci-dessus) — sortir une à deux, garder la troisième en réserve.",
  },
  {
    id: "monologue",
    title: "Monologuer sur ton parcours sans laisser de prise",
    why: "Un entretien c'est un dialogue. Si tu déroules 5 minutes sans respirer, le jury décroche et n'a plus envie de creuser.",
    fix: "Phrases courtes, respirations, regards. Quand tu finis un point, marque une pause — laisse-leur la possibilité de rebondir.",
  },
];

export const SCIENTIFIC_GAP_RESPONSE = `Le doute du jury sur mon niveau scientifique est légitime — je n'ai pas pratiqué les maths ou la physique depuis dix ans, et je ne vais pas vous mentir là-dessus.

J'en ai fait un objectif structuré, pas un sujet d'inquiétude. J'ai construit une application personnelle de révision — qui couvre maths, physique, électronique et algorithme — avec leçons longues qui repartent des prérequis, exercices auto-corrigés et flashcards à répétition espacée. Je l'utilise 2 à 3 heures par jour en plus de mon job, en révision active, en refaisant les démonstrations à la main.

Ce que je veux vous montrer aujourd'hui, ce n'est pas un niveau parfait — il sera ce qu'il sera le jour J. C'est une méthode, une cadence, et la capacité à tenir un effort long. Sur ces trois points-là, j'ai des preuves derrière moi : 8 ans à l'armée, 4 ans de dev autodidacte qui livre en prod, et cette app que vous pouvez voir si ça vous intéresse.`;
