import type { ExerciseType } from "@/types/database";

// ---------------------------------------------------------------------------
// Shared candidate context — keeps Gemini responses calibrated to the user
// (27 yo former military, lead dev of Colibrimo IA SaaS, targeting Junia ISEN
// CIR admission 2026). The "Connexion Colibrimo" field in generated exercises
// is only meaningful with this context in the prompt.
// ---------------------------------------------------------------------------

export const CANDIDATE_CONTEXT = `
Contexte du candidat :
- Anisse Lebadi, 27 ans, ancien militaire (1er RCP, sniper), reconverti développeur.
- Lead dev de Colibrimo (SaaS B2B d'estimation de rénovation, stack Next.js 14 App Router / TypeScript / Supabase / pgvector / Gemini API).
- Il prépare l'entretien d'admission de Junia ISEN (cycle ingénieur alternance CI1, rentrée septembre 2026).
- Le jury a validé sa motivation mais a exprimé un doute sur son niveau scientifique. Il rattrape le programme CIR (Informatique et Réseaux) en 7 jours.
`.trim();

// ---------------------------------------------------------------------------
// generate-exercise
// ---------------------------------------------------------------------------

const TYPE_INSTRUCTIONS: Record<ExerciseType, string> = {
  mcq: "Exercice à choix multiples (MCQ). 4 propositions, 1 seule bonne réponse. Le champ answer est l'index 0-based de la bonne proposition.",
  numeric:
    "Exercice numérique : la réponse attendue est un nombre. Fixe une tolérance absolue appropriée (0 si la réponse doit être exacte). Précise l'unité si applicable.",
  formula:
    "Exercice de formule en LaTeX. expected_latex est la forme canonique (sans \\,\\! ni espaces inutiles). equivalent_forms liste 2-3 réécritures strictement équivalentes (ex : x^{2} vs x^2).",
  text: "Réponse libre courte (3-6 lignes). expected_key_points liste les points clés que la réponse doit mentionner. min_score = 0.6.",
  code: "Exercice de code. Langue js ou python. function_signature au format TypeScript (ex: 'function max(arr: number[]): number'). hints 1-3 indices.",
  circuit:
    "Exercice d'électrocinétique. 2-3 résistances série ou parallèle, calcule R_eq. answer en ohms, tolerance 0.5 ou moins.",
  conversion:
    "Conversion entre bases. source fournit une valeur dans une base (decimal/binary/hex), targets liste les bases dans lesquelles le candidat doit convertir.",
  ordering:
    "Remettre des éléments dans l'ordre. items contient 4-6 éléments DANS LEUR ORDRE CORRECT (le frontend les mélangera au rendu).",
  match_pairs:
    "Associer gauche-droite. 3-5 pairs, chaque pair {left, right} contient des chaînes courtes et non ambiguës.",
};

export function buildGenerateExercisePrompt(args: {
  topic_id: string;
  topic_name: string;
  topic_description: string | null;
  subject_name: string;
  difficulty: number; // 1..5
  type: ExerciseType;
}): string {
  return `Tu es un professeur préparant un étudiant à l'entrée en cycle ingénieur ISEN (CIR).

${CANDIDATE_CONTEXT}

Génère UN exercice unique pour ce sujet précis.

Matière : ${args.subject_name}
Topic : ${args.topic_name} (${args.topic_id})
Description : ${args.topic_description ?? "—"}
Niveau de difficulté : ${args.difficulty}/5
Type d'exercice : ${args.type}

Consigne spécifique au type : ${TYPE_INSTRUCTIONS[args.type]}

Règles strictes :
- Rédige l'énoncé (question_md) en français, clair et précis. KaTeX autorisé (inline : $x^2$, bloc : $$...$$).
- L'explication (explanation_md) en français, ré-explique le raisonnement étape par étape. Quelqu'un qui a trouvé la mauvaise réponse doit pouvoir corriger sa mécompréhension en la lisant.
- Si un lien pertinent existe avec Colibrimo (embeddings, RAG, Next.js, Supabase, pgvector, cycle de déploiement Vercel, etc.), remplis colibrimo_connection avec 1-2 phrases. Sinon, chaîne vide — pas de lien artificiel.
- Respecte strictement le schéma JSON demandé.`;
}

// ---------------------------------------------------------------------------
// grade-answer
// ---------------------------------------------------------------------------

export function buildGradeAnswerPrompt(args: {
  type: ExerciseType;
  question_md: string;
  data: unknown;
  user_answer: unknown;
}): string {
  return `Tu es un correcteur pédagogique pour le programme ISEN CIR.

${CANDIDATE_CONTEXT}

Corrige la réponse du candidat à l'exercice ci-dessous.

Type d'exercice : ${args.type}
Énoncé : ${args.question_md}
Données attendues : ${JSON.stringify(args.data)}
Réponse du candidat : ${JSON.stringify(args.user_answer)}

Évalue :
1. score entre 0 et 1 (0.5 pour une réponse partielle correcte mais incomplète).
2. is_correct = true si score ≥ 0.6.
3. feedback_md : 2-4 lignes en français. Souligne ce qui est juste, ce qui manque ou est faux, et donne UNE piste concrète de progression.

Sois exigeant mais bienveillant. Jamais condescendant.`;
}

// ---------------------------------------------------------------------------
// interview-turn
// ---------------------------------------------------------------------------

export function buildInterviewSystemPrompt(args: { turnsRemaining: number }): string {
  return `Tu es un membre du jury d'admission pour l'école d'ingénieurs Junia ISEN (cycle ingénieur alternance CI1).

${CANDIDATE_CONTEXT}

Ton rôle : tester le niveau scientifique du candidat sur le programme CIR (mathématiques, physique, électronique, informatique) tout en évaluant sa maturité et sa capacité d'apprentissage.

Règles de conduite :
- Alterne entre : (a) questions de motivation et projection, (b) questions techniques précises, (c) mises en difficulté bienveillantes ("comment réagis-tu face à un concept que tu ne maîtrises pas ?").
- UNE seule question à la fois. Ton message se termine toujours par une question ou une invitation à développer.
- Écoute ce qu'il répond avant d'enchaîner. Rebondis sur le contenu de sa réponse précédente.
- Langue : français soutenu mais naturel. Tu le vouvoies.
- Exigeant sur le fond, bienveillant dans la forme. Pas de condescendance.

Il reste environ ${args.turnsRemaining} tour(s) avant la conclusion.

Quand done=true :
- Rédige le feedback final (feedback_md) en Markdown : 3 sections "Points forts", "Points à travailler", "Conseils concrets". Chaque section 2-4 puces.
- Attribue un score 0..1 qui reflète la solidité globale (scientifique + motivation + maturité).

Quand done=false :
- message contient uniquement ta prochaine réplique (1-3 phrases + une question).
- feedback_md : chaîne vide. score : 0.`;
}

export type InterviewMessage = {
  role: "user" | "jury";
  content: string;
};

export function formatInterviewHistory(history: InterviewMessage[]): string {
  return history
    .map((m) => `${m.role === "jury" ? "JURY" : "CANDIDAT"} : ${m.content}`)
    .join("\n\n");
}

// ---------------------------------------------------------------------------
// coach-plan — personalized study plan
// ---------------------------------------------------------------------------

type CoachStatsInput = {
  days_until_interview: number | null;
  due_flashcards: number;
  total_attempts_week: number;
  topics: Array<{
    topic_id: string;
    topic_name: string;
    subject_name: string;
    mastery_pct: number;
    attempts: number;
    cir_importance: number;
  }>;
};

export function buildCoachPlanPrompt(stats: CoachStatsInput): string {
  const topicsList = stats.topics
    .map(
      (t) =>
        `- [${t.subject_name}] ${t.topic_name} (id=${t.topic_id}) — maîtrise ${t.mastery_pct}% sur ${t.attempts} tentatives, importance CIR ${t.cir_importance}/5`,
    )
    .join("\n");

  const urgency =
    stats.days_until_interview === null
      ? "Date d'entretien non définie — raisonne sur ~7 jours par défaut."
      : stats.days_until_interview <= 0
        ? "Entretien déjà passé ou aujourd'hui."
        : `J-${stats.days_until_interview} avant l'entretien.`;

  return `Tu es un coach pédagogique qui produit un plan d'étude personnalisé.

${CANDIDATE_CONTEXT}

Urgence : ${urgency}
Activité semaine passée : ${stats.total_attempts_week} tentatives d'exercices.
Flashcards dues aujourd'hui : ${stats.due_flashcards}.

État de maîtrise par topic (21 topics CIR) :
${topicsList}

Produis un plan d'étude JSON strict avec 3 parties :

1. summary : 2-3 phrases sur l'état actuel (points forts, lacunes).
2. today_focus : 2-3 topics prioritaires pour aujourd'hui. Critères pour prioriser :
   - topic avec mastery_pct faible ET cir_importance haute > mastery_pct faible seul
   - topic non encore abordé (attempts = 0) si importance CIR ≥ 4
   - varie les matières (pas 3 maths d'affilée)
   - action adaptée : "lesson" si attempts = 0, "practice" si déjà vu mais mastery < 70%, "flashcards" si des cartes sont dues
3. week_strategy : markdown, ~100-150 mots, plan stratégique sur les jours restants. Mentionne l'ordre d'attaque des matières et un objectif quotidien réaliste (exos, leçons, flashcards).

Règles :
- Utilise EXACTEMENT les topic_id fournis (ex: maths.analyse.derivees).
- today_focus : entre 2 et 3 items max. Pas plus.
- Ton direct, tutoiement, pas de blabla motivationnel creux.
- Si urgence forte (J-1, J-2), priorise révision / flashcards / exos plutôt que nouvelles leçons.`;
}
