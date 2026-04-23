# ISEN PREP

Application de révision pour rattraper le programme CIR de **Junia ISEN** en 7 jours : cours, exercices adaptatifs, flashcards SM-2, examen blanc et simulation d'entretien par IA.

## Stack

- **Next.js 16** (App Router, `proxy.ts`) + **React 19** + **TypeScript** strict
- **Supabase** — auth magic link, Postgres, RLS
- **Tailwind v4** + **shadcn** (base-nova) + **Base UI** primitives
- **Gemini 2.5 Flash** — génération d'exercices, grading texte/code, simulation d'entretien
- **KaTeX** pour les formules
- **Vitest** — 83 tests sur la logique métier (grading, SM-2, mastery)

## Fonctionnalités

- Dashboard avec countdown entretien, heatmap de maîtrise, points faibles, flashcards dues
- Navigation par matière → topic avec leçon markdown + KaTeX
- Pratique adaptative (10 exos, ±1 difficulté selon perf), 9 types d'exercices
- Flashcards SM-2 avec qualité 0-5
- Examen blanc 30 questions / 45 min, stratifié par matière
- Entretien simulé (jury Gemini, 10 tours + feedback final)
- Révision ciblée (3 topics les plus faibles)
- PWA installable, dark mode, raccourcis clavier chord (`?` pour voir la liste)

## Développement local

### Prérequis

- Node 20+
- Compte Supabase (projet créé, migrations appliquées)
- Clé API Gemini (optionnelle — l'app fonctionne sans, les features IA sont désactivées)

### Install

```bash
git clone https://github.com/anisselbd/isen-prep.git
cd isen-prep
npm install
cp .env.example .env.local
# Renseigner les variables dans .env.local (voir plus bas)
npm run dev
```

Ouvre http://localhost:3000.

### Variables d'environnement

| Variable | Où la trouver |
|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → **Project URL** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → **anon public** |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → **service_role** (⚠️ jamais exposer côté client) |
| `GOOGLE_GEMINI_API_KEY` | https://aistudio.google.com/apikey |

### Base de données

Les migrations sont dans `supabase/migrations/`. Pour les appliquer sur un nouveau projet Supabase :

```bash
SUPABASE_ACCESS_TOKEN="<personal-access-token>" \
  npx supabase db push -p '<mot-de-passe-postgres>'
```

### Seed pédagogique

21 leçons + 105 exercices + 56 flashcards sur les 21 topics CIR :

```bash
npx tsx --env-file=.env.local scripts/seed.ts
```

Idempotent — relancer le script supprime puis réinsère par topic.

### Scripts utiles

```bash
npm run dev        # dev server
npm run build      # build prod
npm run start      # start prod
npm run lint       # eslint
npm run test       # vitest (83 tests)
npm run typecheck  # tsc --noEmit
npm run icons      # regénère les PNG PWA depuis public/icons/icon.svg
```

## Déploiement Vercel

### Premier déploiement

1. Créer le projet (lie le repo GitHub automatiquement) :

   ```bash
   vercel login
   vercel link --yes --project isen-prep
   ```

2. Pousser les 4 variables d'env en production :

   ```bash
   # Pour chaque variable du tableau ci-dessus :
   printf "%s" "$VALUE" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
   # (idem pour les 3 autres)
   ```

3. Déployer :

   ```bash
   vercel --prod --yes
   ```

Les pushes ultérieurs sur `main` redéploient automatiquement via l'intégration GitHub.

### Config Supabase à ajuster après deploy

Dashboard Supabase → Auth → URL Configuration :

- **Site URL** : `https://<ton-domaine>.vercel.app`
- **Redirect URLs** : ajouter `https://<ton-domaine>.vercel.app/**` (garder aussi `http://localhost:3000/auth/callback` pour le dev)

Sans ça, le magic link en prod redirige vers localhost.

## Architecture

```
app/
├── (app)/          → routes protégées (dashboard, subjects, exam, …)
├── api/gemini/     → 3 endpoints : generate-exercise, grade-answer, interview-turn
├── auth/           → callback + error pour le magic link
└── login/          → page publique

components/
├── app-shell/      → sidebar, topbar, mobile nav
├── exercise/       → 9 types d'exercices + grading client
├── flashcard/      → flip 3D + boutons qualité SM-2
├── keyboard/       → raccourcis globaux + help modal
├── lesson/         → renderer markdown + KaTeX + callouts
└── ui/             → shadcn

lib/
├── exercise/       → grading, shuffle, types
├── flashcards/     → SM-2, due computation
├── gemini/         → client, prompts, schemas
├── mastery/        → running mean
└── supabase/       → server/client/middleware

scripts/
├── seed.ts           → contenu pédagogique
└── generate-icons.ts → PNG PWA depuis SVG

supabase/migrations/  → schema + RLS + triggers
```

### Décisions notables

- **Proxy Next 16** — `proxy.ts` à la racine (l'ancien `middleware.ts` est déprécié)
- **Grading** — toujours recalculé server-side dans `recordAttempt`, la DB est la source de vérité
- **Second-pass IA** — les exos texte/code tombent en `pending_ai` si le grading local échoue, puis `/api/gemini/grade-answer` prend le relais
- **Writes sur content-tables** — via `createServiceRoleClient()`, les RLS sont en lecture seule pour les users
- **Gemini optionnel** — `lib/env.ts` vérifie la présence de la clé, les routes renvoient 503 si absente
