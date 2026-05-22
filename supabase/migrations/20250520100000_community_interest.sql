  -- Community interest registrations (run in Supabase SQL Editor)

  create table if not exists public.community_interest (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users (id) on delete set null,
    full_name text not null,
    email text not null,
    country text not null,
    city_region text not null,
    age_range text not null,
    household_type text not null,
    preferred_locations jsonb not null default '[]'::jsonb,
    climate_preference text not null,
    distance_from_city text not null,
    community_types text[] not null default '{}',
    home_types text[] not null default '{}',
    investment_capacity text not null,
    investor_type text not null,
    energy_preferences text[] not null default '{}',
    food_interests text[] not null default '{}',
    move_timeline text not null,
    notes text,
    created_at timestamptz not null default now()
  );

  create index if not exists community_interest_email_idx on public.community_interest (email);
  create index if not exists community_interest_user_id_idx on public.community_interest (user_id);
  create index if not exists community_interest_created_at_idx on public.community_interest (created_at desc);

  alter table public.community_interest enable row level security;

  -- No SELECT policy: only service role can read submissions.

  drop policy if exists "Users insert own community interest" on public.community_interest;
  create policy "Users insert own community interest"
    on public.community_interest
    for insert
    to authenticated
    with check (auth.uid() = user_id and user_id is not null);
