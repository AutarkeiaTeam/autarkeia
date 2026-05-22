-- Restructure community_interest living / energy / food fields.
-- Run in Supabase SQL Editor after 20250520100000 and 20250520110000 migrations.

alter table public.community_interest
  add column if not exists living_model text default '',
  add column if not exists energy_ownership text default '',
  add column if not exists food_ownership text default '',
  add column if not exists dietary_preference text default '';

alter table public.community_interest
  rename column energy_preferences to energy_preferences_legacy;

alter table public.community_interest
  rename column food_interests to food_interests_legacy;

alter table public.community_interest
  add column if not exists energy_preferences jsonb not null default '[]'::jsonb,
  add column if not exists food_preferences jsonb not null default '[]'::jsonb;

update public.community_interest
set
  energy_preferences = coalesce(
    (
      select jsonb_agg(to_jsonb(v))
      from unnest(energy_preferences_legacy) as v
    ),
    '[]'::jsonb
  )
where cardinality(coalesce(energy_preferences_legacy, '{}')) > 0;

update public.community_interest
set
  food_preferences = coalesce(
    (
      select jsonb_agg(to_jsonb(v))
      from unnest(food_interests_legacy) as v
    ),
    '[]'::jsonb
  )
where cardinality(coalesce(food_interests_legacy, '{}')) > 0;

alter table public.community_interest
  drop column if exists energy_preferences_legacy,
  drop column if exists food_interests_legacy;
