-- Profiles table for Stripe subscription state (run in Supabase SQL editor if not using CLI migrations)

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text not null default 'free',
  subscription_plan text,
  subscription_trial_end timestamptz,
  subscription_current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_stripe_customer_id_idx on public.profiles (stripe_customer_id);
create index if not exists profiles_stripe_subscription_id_idx on public.profiles (stripe_subscription_id);

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Subscription fields are updated only via service role (webhooks); no user UPDATE policy.
