-- =============================================================================
-- ISEN PREP — Gemini call log (per-user rate limiting)
-- Append-only log used to enforce a sliding 60s window before hitting Google.
-- Only service_role accesses this table; never exposed to the authenticated
-- role since it would leak per-user usage to the client.
-- =============================================================================

create table public.gemini_call_log (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  called_at  timestamptz not null default now()
);

create index gemini_call_log_user_window_idx
  on public.gemini_call_log (user_id, called_at desc);

alter table public.gemini_call_log enable row level security;
-- No policies: only service_role (which bypasses RLS) reads/writes this table.
