-- Restructure community_interest living / energy / food fields (idempotent).
-- Safe when production never had food_interests, or energy_preferences is text[] / jsonb / missing.
-- Run in Supabase SQL Editor after 20250520100000 and 20250520110000 migrations.

-- 1. New scalar fields
alter table public.community_interest
  add column if not exists living_model text default '',
  add column if not exists energy_ownership text default '',
  add column if not exists food_ownership text default '',
  add column if not exists dietary_preference text default '';

-- 2. energy_preferences: text[] → jsonb (skip if already jsonb)
do $$
begin
  if exists (
    select 1
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = 'community_interest'
      and c.column_name = 'energy_preferences'
      and c.data_type = 'ARRAY'
  )
  and not exists (
    select 1
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = 'community_interest'
      and c.column_name = 'energy_preferences_legacy'
  ) then
    alter table public.community_interest
      rename column energy_preferences to energy_preferences_legacy;
  end if;

  if not exists (
    select 1
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = 'community_interest'
      and c.column_name = 'energy_preferences'
      and c.udt_name = 'jsonb'
  ) then
    alter table public.community_interest
      add column energy_preferences jsonb not null default '[]'::jsonb;
  end if;

  if exists (
    select 1
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = 'community_interest'
      and c.column_name = 'energy_preferences_legacy'
  ) then
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

    alter table public.community_interest
      drop column if exists energy_preferences_legacy;
  end if;
end $$;

-- 3. food: food_interests (text[]) or food_preferences (text[]) → food_preferences jsonb
do $$
begin
  if exists (
    select 1
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = 'community_interest'
      and c.column_name = 'food_interests'
      and c.data_type = 'ARRAY'
  )
  and not exists (
    select 1
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = 'community_interest'
      and c.column_name = 'food_interests_legacy'
  ) then
    alter table public.community_interest
      rename column food_interests to food_interests_legacy;
  end if;

  if exists (
    select 1
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = 'community_interest'
      and c.column_name = 'food_preferences'
      and c.data_type = 'ARRAY'
  )
  and not exists (
    select 1
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = 'community_interest'
      and c.column_name = 'food_preferences_legacy'
  ) then
    alter table public.community_interest
      rename column food_preferences to food_preferences_legacy;
  end if;

  if not exists (
    select 1
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = 'community_interest'
      and c.column_name = 'food_preferences'
      and c.udt_name = 'jsonb'
  ) then
    alter table public.community_interest
      add column food_preferences jsonb not null default '[]'::jsonb;
  end if;

  if exists (
    select 1
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = 'community_interest'
      and c.column_name = 'food_interests_legacy'
  ) then
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
      drop column if exists food_interests_legacy;
  end if;

  if exists (
    select 1
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = 'community_interest'
      and c.column_name = 'food_preferences_legacy'
  ) then
    update public.community_interest
    set
      food_preferences = coalesce(
        (
          select jsonb_agg(to_jsonb(v))
          from unnest(food_preferences_legacy) as v
        ),
        '[]'::jsonb
      )
    where cardinality(coalesce(food_preferences_legacy, '{}')) > 0;

    alter table public.community_interest
      drop column if exists food_preferences_legacy;
  end if;
end $$;
