-- Add intent + food buyer fields for community interest submissions.

alter table public.community_interest
  add column if not exists intent text,
  add column if not exists food_products jsonb,
  add column if not exists food_frequency text;

alter table public.community_interest
  alter column living_model drop not null,
  alter column energy_ownership drop not null,
  alter column food_ownership drop not null,
  alter column dietary_preference drop not null,
  alter column climate_preference drop not null,
  alter column distance_from_city drop not null,
  alter column investment_capacity drop not null,
  alter column investor_type drop not null,
  alter column move_timeline drop not null;

alter table public.community_interest
  alter column energy_preferences drop not null,
  alter column food_preferences drop not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'community_interest_intent_check'
  ) then
    alter table public.community_interest
      add constraint community_interest_intent_check
      check (intent in ('live', 'buy_food', 'both'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'community_interest_food_frequency_check'
  ) then
    alter table public.community_interest
      add constraint community_interest_food_frequency_check
      check (food_frequency is null or food_frequency in ('Weekly', 'Monthly', 'Yearly'));
  end if;
end $$;

update public.community_interest
set intent = coalesce(intent, 'live')
where intent is null;

alter table public.community_interest
  alter column intent set not null;

create index if not exists community_interest_intent_idx
  on public.community_interest (intent);
