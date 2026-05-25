-- Drop legacy community_interest columns; allow NULL preference jsonb when Autarkeia-managed.
-- Run in Supabase SQL Editor after 20250519120000_community_interest_living_energy_food.sql.

alter table public.community_interest
  drop column if exists community_types,
  drop column if exists home_types;

alter table public.community_interest
  alter column energy_preferences drop not null,
  alter column food_preferences drop not null;

alter table public.community_interest
  alter column energy_preferences drop default,
  alter column food_preferences drop default;
