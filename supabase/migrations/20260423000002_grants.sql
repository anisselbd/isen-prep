-- =============================================================================
-- Fix: grant basic privileges on public.* to Supabase roles.
-- Supabase's default privileges didn't auto-apply to tables created via
-- `supabase db push` from the bare migration — we got REFERENCES/TRIGGER/TRUNCATE
-- but no SELECT/INSERT/UPDATE/DELETE, so RLS policies never got evaluated
-- (permission denied before RLS check).
--
-- Security: RLS is still the gate. These grants are required BEFORE RLS kicks in;
-- policies then filter what each role can actually see or modify.
-- =============================================================================

grant usage on schema public to anon, authenticated, service_role;

grant all on all tables    in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines  in schema public to anon, authenticated, service_role;

-- Ensure future tables created in this schema inherit the same grants.
alter default privileges for role postgres in schema public
  grant all on tables to anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  grant all on sequences to anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  grant all on routines to anon, authenticated, service_role;
