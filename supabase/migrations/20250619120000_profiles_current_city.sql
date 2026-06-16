-- Current city (separate from hometown) + privacy toggle
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS current_city jsonb,
  ADD COLUMN IF NOT EXISTS show_current_city boolean NOT NULL DEFAULT false;
