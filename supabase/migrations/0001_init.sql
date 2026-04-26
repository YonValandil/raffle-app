-- =====================================================================
-- Migration 0001 — Initial schema for raffle / tombola MVP
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------

create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  display_name text,
  role         text not null default 'user' check (role in ('user', 'admin')),
  created_at   timestamptz not null default now()
);

create table public.tombolas (
  id                   uuid primary key default gen_random_uuid(),
  title                text not null,
  description          text,
  prize                text not null,
  prize_image_url      text,
  ticket_price_cents   int  not null check (ticket_price_cents > 0),
  max_participants     int  not null check (max_participants > 0),
  max_tickets_per_user int  not null default 10 check (max_tickets_per_user > 0),
  type                 text not null check (type in ('main', 'secondary')),
  status               text not null default 'active'
                            check (status in ('active', 'closed', 'drawn')),
  draw_date            timestamptz not null,
  created_at           timestamptz not null default now()
);

-- One single 'main' tombola can be 'active' at a time (V1 rule).
-- Partial unique index = btree, no extension required.
create unique index one_active_main
  on public.tombolas (type)
  where (type = 'main' and status = 'active');

create table public.participations (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete restrict,
  tombola_id       uuid not null references public.tombolas(id) on delete restrict,
  nb_tickets       int  not null check (nb_tickets > 0),
  amount_cents     int  not null check (amount_cents > 0),
  payment_provider text not null check (payment_provider in ('stripe', 'paypal')),
  payment_id       text not null,
  payment_status   text not null default 'paid'
                        check (payment_status in ('paid', 'refunded', 'pending', 'failed')),
  created_at       timestamptz not null default now(),
  unique (payment_provider, payment_id)   -- webhook idempotency
);
create index participations_tombola_idx on public.participations (tombola_id);
create index participations_user_idx    on public.participations (user_id);

create table public.tirages (
  id                      uuid primary key default gen_random_uuid(),
  tombola_id              uuid not null unique references public.tombolas(id) on delete restrict,
  winner_user_id          uuid not null references auth.users(id),
  winner_participation_id uuid not null references public.participations(id),
  drawn_at                timestamptz not null default now(),
  validated_by_admin      boolean not null default false,
  announced_at            timestamptz
);

-- ---------------------------------------------------------------------
-- Helper: is_admin() — used by RLS policies
-- SECURITY DEFINER so the function can read profiles regardless of caller's RLS.
-- ---------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------
-- Trigger: auto-provision profile on auth.users insert
-- ---------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------

alter table public.profiles       enable row level security;
alter table public.tombolas       enable row level security;
alter table public.participations enable row level security;
alter table public.tirages        enable row level security;

-- profiles
create policy "profiles_select_self_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

-- Role changes are done via the SQL dashboard (admin-only), never via the app.
-- The app must only send { display_name } when updating a profile.
create policy "profiles_update_self"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- tombolas
create policy "tombolas_select_public"
  on public.tombolas for select
  using (true);

create policy "tombolas_admin_write"
  on public.tombolas for all
  using (public.is_admin())
  with check (public.is_admin());

-- participations
-- No INSERT/UPDATE/DELETE policy on purpose: writes go through the webhook
-- using the service_role key, which bypasses RLS.
create policy "participations_select_own_or_admin"
  on public.participations for select
  using (auth.uid() = user_id or public.is_admin());

-- tirages
create policy "tirages_select_announced_or_admin"
  on public.tirages for select
  using (announced_at is not null or public.is_admin());

create policy "tirages_admin_write"
  on public.tirages for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Seed — one active 'main' tombola for development
-- ---------------------------------------------------------------------

insert into public.tombolas (
  title, description, prize, ticket_price_cents,
  max_participants, max_tickets_per_user, type, status, draw_date
) values (
  'Tombola de mai 2026',
  'Première tombola de lancement.',
  'Nintendo Switch 2',
  500,                              -- 5,00 €
  500,
  10,
  'main',
  'active',
  (now() + interval '30 days')
);
