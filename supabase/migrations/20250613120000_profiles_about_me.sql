-- About me profile fields + per-field privacy toggles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS hometown jsonb,
  ADD COLUMN IF NOT EXISTS languages text[],
  ADD COLUMN IF NOT EXISTS skills text[],
  ADD COLUMN IF NOT EXISTS prep_goal text,
  ADD COLUMN IF NOT EXISTS years_preparing text,
  ADD COLUMN IF NOT EXISTS household_adults smallint,
  ADD COLUMN IF NOT EXISTS household_children smallint,
  ADD COLUMN IF NOT EXISTS household_pets boolean,
  ADD COLUMN IF NOT EXISTS household_special_needs text[],
  ADD COLUMN IF NOT EXISTS show_hometown boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_languages boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_skills boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_prep_goal boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_years_preparing boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_household boolean NOT NULL DEFAULT false;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_prep_goal_valid') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_prep_goal_valid
      CHECK (prep_goal IS NULL OR prep_goal IN ('emergency_ready','self_sufficient','off_grid','community_building','all'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_years_preparing_valid') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_years_preparing_valid
      CHECK (years_preparing IS NULL OR years_preparing IN ('just_starting','lt_1','1_3','3_5','5_10','10_plus'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_household_counts') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_household_counts
      CHECK (
        (household_adults IS NULL OR (household_adults BETWEEN 0 AND 10))
        AND (household_children IS NULL OR (household_children BETWEEN 0 AND 10))
      );
  END IF;
END $$;
