-- Community preference fields on profiles (canonical) + grouped privacy toggles

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS interested_in_communities boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS community_intent text,
  ADD COLUMN IF NOT EXISTS community_preferred_locations jsonb,
  ADD COLUMN IF NOT EXISTS community_climate_preference text,
  ADD COLUMN IF NOT EXISTS community_distance_from_city text,
  ADD COLUMN IF NOT EXISTS community_investment_capacity text,
  ADD COLUMN IF NOT EXISTS community_investor_type text,
  ADD COLUMN IF NOT EXISTS community_move_timeline text,
  ADD COLUMN IF NOT EXISTS community_living_model text,
  ADD COLUMN IF NOT EXISTS community_energy_ownership text,
  ADD COLUMN IF NOT EXISTS community_energy_preferences jsonb,
  ADD COLUMN IF NOT EXISTS community_food_ownership text,
  ADD COLUMN IF NOT EXISTS community_food_preferences jsonb,
  ADD COLUMN IF NOT EXISTS community_dietary_preference text,
  ADD COLUMN IF NOT EXISTS community_food_products jsonb,
  ADD COLUMN IF NOT EXISTS community_food_frequency text,
  ADD COLUMN IF NOT EXISTS community_notes text,
  ADD COLUMN IF NOT EXISTS show_community_intent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_community_locations boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_community_living_pref boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_community_investment boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_community_food_pref boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_community_timeline boolean NOT NULL DEFAULT false;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_community_intent_valid') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_community_intent_valid
      CHECK (community_intent IS NULL OR community_intent IN ('live', 'buy_food', 'both'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_community_food_frequency_valid') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_community_food_frequency_valid
      CHECK (community_food_frequency IS NULL OR community_food_frequency IN ('Weekly', 'Monthly', 'Yearly'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_community_climate_valid') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_community_climate_valid
      CHECK (
        community_climate_preference IS NULL
        OR community_climate_preference IN ('Mediterranean', 'Temperate', 'Tropical', 'Cold', 'Any')
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_community_distance_valid') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_community_distance_valid
      CHECK (
        community_distance_from_city IS NULL
        OR community_distance_from_city IN ('Within 30min', '30-60min', '1-2 hours', 'Remote is fine')
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_community_investment_valid') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_community_investment_valid
      CHECK (
        community_investment_capacity IS NULL
        OR community_investment_capacity IN (
          'Under €50k', '€50k-€150k', '€150k-€500k', '€500k-€1M', 'Over €1M', 'I want to rent not buy'
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_community_investor_valid') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_community_investor_valid
      CHECK (
        community_investor_type IS NULL
        OR community_investor_type IN (
          'Individual/family', 'Group of friends', 'Small investor group', 'Institutional/fund', 'Not sure yet'
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_community_timeline_valid') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_community_timeline_valid
      CHECK (
        community_move_timeline IS NULL
        OR community_move_timeline IN (
          'As soon as possible', '1-2 years', '3-5 years', '5+ years', 'Just exploring'
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_community_living_model_valid') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_community_living_model_valid
      CHECK (
        community_living_model IS NULL
        OR community_living_model IN ('Single family plot', 'Coliving', 'Communal living')
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_community_energy_ownership_valid') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_community_energy_ownership_valid
      CHECK (
        community_energy_ownership IS NULL
        OR community_energy_ownership IN ('Resident-owned', 'Autarkeia-managed')
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_community_food_ownership_valid') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_community_food_ownership_valid
      CHECK (
        community_food_ownership IS NULL
        OR community_food_ownership IN ('Resident-owned', 'Autarkeia-managed')
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_community_dietary_valid') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_community_dietary_valid
      CHECK (
        community_dietary_preference IS NULL
        OR community_dietary_preference IN (
          'Omnivore-friendly', 'Vegetarian-only', 'Vegan-only', 'No preference'
        )
      );
  END IF;
END $$;

-- Optional pre-flight: find rows that would be nulled during backfill (invalid enum / empty string).
-- Run before the UPDATE below; expect zero rows per column in a healthy dataset.
--
-- SELECT user_id, climate_preference FROM public.community_interest
-- WHERE climate_preference IS NOT NULL AND climate_preference <> ''
--   AND climate_preference NOT IN ('Mediterranean', 'Temperate', 'Tropical', 'Cold', 'Any');
-- (repeat for each constrained column)

-- Backfill: latest community_interest submission per linked user → profile.
-- Approach (a): CASE maps values outside the allowed set (or empty string) → NULL so one bad
-- row cannot abort the entire UPDATE. community_interest only DB-checks intent + food_frequency;
-- other columns may hold legacy/empty values from pre-constraint submissions.
WITH latest_interest AS (
  SELECT DISTINCT ON (user_id)
    user_id,
    intent,
    preferred_locations,
    climate_preference,
    distance_from_city,
    investment_capacity,
    investor_type,
    move_timeline,
    living_model,
    energy_ownership,
    energy_preferences,
    food_ownership,
    food_preferences,
    dietary_preference,
    food_products,
    food_frequency,
    notes
  FROM public.community_interest
  WHERE user_id IS NOT NULL
  ORDER BY user_id, created_at DESC
)
UPDATE public.profiles p
SET
  interested_in_communities = true,
  community_intent = CASE
    WHEN li.intent IN ('live', 'buy_food', 'both') THEN li.intent
    ELSE NULL
  END,
  community_preferred_locations = li.preferred_locations,
  community_climate_preference = CASE
    WHEN li.climate_preference IN ('Mediterranean', 'Temperate', 'Tropical', 'Cold', 'Any')
    THEN li.climate_preference
    ELSE NULL
  END,
  community_distance_from_city = CASE
    WHEN li.distance_from_city IN ('Within 30min', '30-60min', '1-2 hours', 'Remote is fine')
    THEN li.distance_from_city
    ELSE NULL
  END,
  community_investment_capacity = CASE
    WHEN li.investment_capacity IN (
      'Under €50k', '€50k-€150k', '€150k-€500k', '€500k-€1M', 'Over €1M', 'I want to rent not buy'
    ) THEN li.investment_capacity
    ELSE NULL
  END,
  community_investor_type = CASE
    WHEN li.investor_type IN (
      'Individual/family', 'Group of friends', 'Small investor group', 'Institutional/fund', 'Not sure yet'
    ) THEN li.investor_type
    ELSE NULL
  END,
  community_move_timeline = CASE
    WHEN li.move_timeline IN (
      'As soon as possible', '1-2 years', '3-5 years', '5+ years', 'Just exploring'
    ) THEN li.move_timeline
    ELSE NULL
  END,
  community_living_model = CASE
    WHEN li.living_model IN ('Single family plot', 'Coliving', 'Communal living')
    THEN li.living_model
    ELSE NULL
  END,
  community_energy_ownership = CASE
    WHEN li.energy_ownership IN ('Resident-owned', 'Autarkeia-managed')
    THEN li.energy_ownership
    ELSE NULL
  END,
  community_energy_preferences = li.energy_preferences,
  community_food_ownership = CASE
    WHEN li.food_ownership IN ('Resident-owned', 'Autarkeia-managed')
    THEN li.food_ownership
    ELSE NULL
  END,
  community_food_preferences = li.food_preferences,
  community_dietary_preference = CASE
    WHEN li.dietary_preference IN (
      'Omnivore-friendly', 'Vegetarian-only', 'Vegan-only', 'No preference'
    ) THEN li.dietary_preference
    ELSE NULL
  END,
  community_food_products = li.food_products,
  community_food_frequency = CASE
    WHEN li.food_frequency IN ('Weekly', 'Monthly', 'Yearly') THEN li.food_frequency
    ELSE NULL
  END,
  community_notes = NULLIF(TRIM(li.notes), '')
FROM latest_interest li
WHERE p.id = li.user_id;
