-- =====================================================================
-- Migration 0003 — Public stats RPC
--
-- The marketing landing page displays "X participants / Y tickets" for the
-- active tombola, including for unauthenticated visitors. We cannot grant
-- SELECT on participations to anon (rows contain user_id, payment_id, etc.),
-- so we expose ONLY the aggregates via a SECURITY DEFINER function.
--
-- The function runs with the owner's privileges, bypassing RLS for the
-- aggregate computation, while never exposing individual rows.
-- `set search_path = public` mitigates search-path injection.
-- =====================================================================

create or replace function public.get_tombola_stats(p_tombola_id uuid)
returns table (total_participants int, total_tickets int)
language sql
stable
security definer
set search_path = public
as $$
  select
    count(distinct user_id)::int          as total_participants,
    coalesce(sum(nb_tickets), 0)::int     as total_tickets
  from public.participations
  where tombola_id     = p_tombola_id
    and payment_status = 'paid';
$$;

-- SECURITY DEFINER hardening:
-- 1. Pin the owner explicitly so the function runs with `postgres` privileges
--    (not whoever happens to be the role applying the migration).
-- 2. Postgres grants EXECUTE to PUBLIC by default — revoke that, then grant
--    to the exact roles we want. Defense in depth.
alter function  public.get_tombola_stats(uuid) owner to postgres;
revoke all      on function public.get_tombola_stats(uuid) from public;
grant execute   on function public.get_tombola_stats(uuid) to anon, authenticated;
