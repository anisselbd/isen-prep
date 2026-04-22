-- =============================================================================
-- ISEN PREP — Initial schema
-- Tables, enums, RLS policies, auto-profile trigger, CIR reference data.
-- Idempotent for reference data (ON CONFLICT DO UPDATE).
-- =============================================================================

-- 1. Extensions --------------------------------------------------------------
create extension if not exists "pgcrypto";

-- 2. Content tables (public-read for authenticated, writes via service_role) -

create table public.subjects (
  id          text primary key,
  name        text not null,
  description text,
  color       text,
  icon        text,
  order_index int not null default 0
);

create table public.topics (
  id             text primary key,
  subject_id     text not null references public.subjects(id) on delete cascade,
  name           text not null,
  description    text,
  difficulty     int  not null default 1 check (difficulty between 1 and 5),
  cir_importance int  not null default 3 check (cir_importance between 1 and 5),
  order_index    int  not null default 0
);
create index topics_subject_idx on public.topics(subject_id);

create table public.lessons (
  id                uuid primary key default gen_random_uuid(),
  topic_id          text not null references public.topics(id) on delete cascade,
  title             text not null,
  content_md        text not null,
  estimated_minutes int  not null default 10,
  order_index       int  not null default 0,
  created_at        timestamptz not null default now()
);
create index lessons_topic_idx on public.lessons(topic_id);

create type public.exercise_type as enum (
  'mcq','numeric','formula','text','code','circuit','conversion','ordering','match_pairs'
);

create table public.exercises (
  id                   uuid primary key default gen_random_uuid(),
  topic_id             text not null references public.topics(id) on delete cascade,
  type                 public.exercise_type not null,
  difficulty           int  not null default 2 check (difficulty between 1 and 5),
  question_md          text not null,
  data                 jsonb not null,
  explanation_md       text,
  colibrimo_connection text,
  created_by           text not null default 'seed' check (created_by in ('seed','gemini')),
  created_at           timestamptz not null default now()
);
create index exercises_topic_idx on public.exercises(topic_id);
create index exercises_topic_type_idx on public.exercises(topic_id, type);

create table public.flashcards (
  id       uuid primary key default gen_random_uuid(),
  topic_id text not null references public.topics(id) on delete cascade,
  front_md text not null,
  back_md  text not null,
  tags     text[] not null default '{}'::text[]
);
create index flashcards_topic_idx on public.flashcards(topic_id);

-- 3. User-owned tables -------------------------------------------------------

create table public.profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  created_at            timestamptz not null default now(),
  display_name          text,
  target_interview_date date
);

create table public.attempts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  exercise_id  uuid not null references public.exercises(id) on delete cascade,
  answer       jsonb not null,
  is_correct   boolean not null,
  score        float not null default 0 check (score between 0 and 1),
  time_seconds int,
  created_at   timestamptz not null default now()
);
create index attempts_user_idx on public.attempts(user_id);
create index attempts_user_created_idx on public.attempts(user_id, created_at desc);

create table public.mastery (
  user_id      uuid not null references public.profiles(id) on delete cascade,
  topic_id     text not null references public.topics(id) on delete cascade,
  score        float not null default 0 check (score between 0 and 1),
  confidence   int   not null default 0,
  last_updated timestamptz not null default now(),
  primary key (user_id, topic_id)
);

create table public.review_states (
  user_id          uuid  not null references public.profiles(id) on delete cascade,
  flashcard_id     uuid  not null references public.flashcards(id) on delete cascade,
  repetitions      int   not null default 0,
  easiness         float not null default 2.5,
  interval_days    int   not null default 0,
  next_review_at   timestamptz not null default now(),
  last_reviewed_at timestamptz,
  primary key (user_id, flashcard_id)
);
create index review_states_user_due_idx on public.review_states(user_id, next_review_at);

create table public.interview_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  started_at  timestamptz not null default now(),
  ended_at    timestamptz,
  transcript  jsonb,
  feedback_md text,
  score       float check (score is null or (score between 0 and 1))
);
create index interview_sessions_user_idx on public.interview_sessions(user_id, started_at desc);

-- 4. Row Level Security ------------------------------------------------------

alter table public.subjects    enable row level security;
alter table public.topics      enable row level security;
alter table public.lessons     enable row level security;
alter table public.exercises   enable row level security;
alter table public.flashcards  enable row level security;

create policy "authenticated read subjects"   on public.subjects   for select to authenticated using (true);
create policy "authenticated read topics"     on public.topics     for select to authenticated using (true);
create policy "authenticated read lessons"    on public.lessons    for select to authenticated using (true);
create policy "authenticated read exercises"  on public.exercises  for select to authenticated using (true);
create policy "authenticated read flashcards" on public.flashcards for select to authenticated using (true);

alter table public.profiles           enable row level security;
alter table public.attempts           enable row level security;
alter table public.mastery            enable row level security;
alter table public.review_states      enable row level security;
alter table public.interview_sessions enable row level security;

create policy "owner profile"    on public.profiles           for all to authenticated using (auth.uid() = id)      with check (auth.uid() = id);
create policy "owner attempts"   on public.attempts           for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner mastery"    on public.mastery            for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner reviews"    on public.review_states      for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner interviews" on public.interview_sessions for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 5. Auto-create profile on signup ------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. Reference data: subjects + CIR-priority topics -------------------------

insert into public.subjects (id, name, description, color, icon, order_index) values
  ('maths',        'Mathématiques', 'Analyse, algèbre linéaire, probabilités',            '#4F46E5', 'Sigma',        1),
  ('physique',     'Physique',      'Mécanique, électrocinétique, ondes',                 '#7C3AED', 'Atom',         2),
  ('electronique', 'Électronique',  'Analogique, numérique, signaux',                     '#EA580C', 'CircuitBoard', 3),
  ('informatique', 'Informatique',  'Algorithmique, langages, bases de données, réseaux', '#059669', 'Code',         4)
on conflict (id) do update set
  name = excluded.name, description = excluded.description,
  color = excluded.color, icon = excluded.icon, order_index = excluded.order_index;

insert into public.topics (id, subject_id, name, description, difficulty, cir_importance, order_index) values
  -- Mathématiques
  ('maths.analyse.derivees',           'maths', 'Dérivées',                     'Formules usuelles, dérivée d''une composée, études de fonction', 2, 5, 1),
  ('maths.analyse.integrales',         'maths', 'Primitives et intégrales',     'Primitives usuelles, IPP, changement de variable',              3, 5, 2),
  ('maths.algebre.vecteurs_matrices',  'maths', 'Vecteurs et matrices',         'Opérations, produit matriciel, déterminant, inverse',           3, 5, 3),
  ('maths.algebre.similarite_cosinus', 'maths', 'Similarité cosinus',           'Produit scalaire, norme, embeddings',                           2, 4, 4),
  ('maths.proba.loi_normale',          'maths', 'Loi normale',                  'Espérance, variance, TCL, table standard',                      3, 4, 5),
  ('maths.proba.bayes',                'maths', 'Probabilités conditionnelles', 'Formule de Bayes, indépendance',                                3, 4, 6),

  -- Physique
  ('physique.elec.ohm',               'physique', 'Loi d''Ohm',                   'U = RI, puissance, applications',                    1, 5, 1),
  ('physique.elec.kirchhoff',         'physique', 'Lois de Kirchhoff',            'Loi des nœuds, loi des mailles',                     2, 5, 2),
  ('physique.elec.assoc_resistances', 'physique', 'Résistances série / parallèle','Associations, diviseur de tension',                  2, 5, 3),
  ('physique.elec.rc_transitoire',    'physique', 'Régime transitoire RC',        'Charge / décharge condensateur, constante τ = RC',   3, 4, 4),
  ('physique.signaux.shannon',        'physique', 'Shannon-Nyquist',              'Échantillonnage, critère de Shannon',                3, 4, 5),

  -- Électronique
  ('electronique.num.portes',        'electronique', 'Portes logiques',              'AND, OR, NOT, NAND, NOR, XOR',       1, 5, 1),
  ('electronique.num.tables_verite', 'electronique', 'Tables de vérité',             'Construction, vérification',         1, 5, 2),
  ('electronique.num.de_morgan',     'electronique', 'Lois de De Morgan',            'NOT(A AND B) = NOT A OR NOT B',      2, 5, 3),
  ('electronique.num.conversions',   'electronique', 'Conversions binaire / hexa',   'Décimal ↔ binaire ↔ hexadécimal',    2, 5, 4),
  ('electronique.num.algebre_boole', 'electronique', 'Algèbre de Boole',             'Simplification, Karnaugh',           3, 5, 5),

  -- Informatique
  ('informatique.algo.big_o',       'informatique', 'Complexité Big O',        'O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ)',            2, 5, 1),
  ('informatique.algo.tris',        'informatique', 'Algorithmes de tri',      'Bubble, insertion, quick, merge, heap',                      3, 5, 2),
  ('informatique.algo.recursivite', 'informatique', 'Récursivité',             'Cas de base, récurrence, complexité récursive',              3, 5, 3),
  ('informatique.data.structures',  'informatique', 'Structures de données',   'Tableaux, listes, piles, files, hashmaps, arbres, graphes',  3, 5, 4),
  ('informatique.bdd.sql',          'informatique', 'SQL',                     'SELECT, JOIN, GROUP BY, index',                              2, 5, 5),
  ('informatique.reseaux.dns',      'informatique', 'DNS (SPF, DKIM, DMARC)',  'Records DNS, sécurité email',                                3, 4, 6)
on conflict (id) do update set
  subject_id = excluded.subject_id, name = excluded.name,
  description = excluded.description, difficulty = excluded.difficulty,
  cir_importance = excluded.cir_importance, order_index = excluded.order_index;
