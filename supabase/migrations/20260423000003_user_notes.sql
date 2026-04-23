-- =============================================================================
-- ISEN PREP — User notes per topic
-- Markdown notes that each user can take on a given topic page.
-- =============================================================================

create table public.user_notes (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  topic_id    text not null references public.topics(id)   on delete cascade,
  content_md  text not null default '',
  updated_at  timestamptz not null default now(),
  primary key (user_id, topic_id)
);

create index user_notes_user_idx on public.user_notes(user_id);

alter table public.user_notes enable row level security;

create policy "owner user_notes"
  on public.user_notes
  for all
  to authenticated
  using      (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.user_notes to authenticated;
