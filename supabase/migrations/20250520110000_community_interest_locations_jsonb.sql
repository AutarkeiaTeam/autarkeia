-- Migrate preferred_locations from text[] to jsonb location objects.
-- Run in Supabase SQL Editor if you already applied 20250520100000_community_interest.sql.

alter table public.community_interest
  alter column preferred_locations drop default;

alter table public.community_interest
  alter column preferred_locations type jsonb
  using (
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'name',
            loc,
            'country',
            '',
            'region',
            '',
            'coordinates',
            jsonb_build_array(0, 0)
          )
        )
        from unnest(preferred_locations::text[]) as loc
      ),
      '[]'::jsonb
    )
  );

alter table public.community_interest
  alter column preferred_locations set default '[]'::jsonb,
  alter column preferred_locations set not null;
