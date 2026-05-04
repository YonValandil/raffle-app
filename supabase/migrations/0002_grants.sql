-- =====================================================================
-- Migration 0002 — Grants for anon / authenticated roles
--
-- Postgres evaluates GRANT before RLS. Without GRANT, queries fail with
-- error 42501 (insufficient_privilege) even if a permissive RLS policy
-- like "tombolas_select_public" would otherwise allow them.
--
-- service_role bypasses RLS and already has full permissions — no grant
-- needed for the webhook code path.
-- =====================================================================

grant usage on schema public to anon, authenticated;

-- tombolas: public read, admin writes (filtered by RLS).
grant select                         on public.tombolas       to anon, authenticated;
grant insert, update, delete         on public.tombolas       to authenticated;

-- profiles: own profile only (filtered by RLS). Anon has no access.
grant select, update                 on public.profiles       to authenticated;

-- participations: own rows only (filtered by RLS). Writes happen via the
-- Stripe webhook using service_role, never from a logged-in client session.
grant select                         on public.participations to authenticated;

-- tirages: announced draws are public, others restricted to admin (RLS).
grant select                         on public.tirages        to anon, authenticated;
grant insert, update, delete         on public.tirages        to authenticated;
