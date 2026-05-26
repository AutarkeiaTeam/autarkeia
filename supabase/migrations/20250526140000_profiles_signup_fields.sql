-- Signup profile fields (first/last name, age, location) on public.profiles.

alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists age integer,
  add column if not exists location text;

alter table public.profiles
  drop constraint if exists profiles_age_non_negative;

alter table public.profiles
  add constraint profiles_age_non_negative check (age is null or age >= 0);

comment on column public.profiles.first_name is 'From signup form or OAuth given_name / full_name split.';
comment on column public.profiles.last_name is 'From signup form or OAuth family_name / full_name split.';
comment on column public.profiles.age is 'Optional age from email signup user_metadata.';
comment on column public.profiles.location is 'Optional location from signup user_metadata.';

-- Backfill from auth.users.raw_user_meta_data (run once in SQL editor).
update public.profiles p
set
  email = coalesce(p.email, u.email),
  first_name = coalesce(
    nullif(trim(p.first_name), ''),
    nullif(trim(u.raw_user_meta_data->>'first_name'), '')
  ),
  last_name = coalesce(
    nullif(trim(p.last_name), ''),
    nullif(trim(u.raw_user_meta_data->>'last_name'), '')
  ),
  age = coalesce(
    p.age,
    case
      when (u.raw_user_meta_data->>'age') ~ '^[0-9]+$' then (u.raw_user_meta_data->>'age')::integer
      else null
    end
  ),
  location = coalesce(
    nullif(trim(p.location), ''),
    nullif(trim(u.raw_user_meta_data->>'location'), '')
  )
from auth.users u
where p.id = u.id;

-- Google / OAuth: given_name + family_name when first/last still empty.
update public.profiles p
set
  first_name = coalesce(nullif(trim(p.first_name), ''), nullif(trim(u.raw_user_meta_data->>'given_name'), '')),
  last_name = coalesce(nullif(trim(p.last_name), ''), nullif(trim(u.raw_user_meta_data->>'family_name'), ''))
from auth.users u
where p.id = u.id
  and (nullif(trim(p.first_name), '') is null or nullif(trim(p.last_name), '') is null);

-- OAuth full_name / name when still missing (split on first space).
update public.profiles p
set
  first_name = coalesce(
    nullif(trim(p.first_name), ''),
    nullif(split_part(coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'), ' ', 1), '')
  ),
  last_name = coalesce(
    nullif(trim(p.last_name), ''),
    nullif(
      trim(
        substring(
          coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name')
          from position(' ' in coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ' ')) + 1
        )
      ),
      ''
    )
  )
from auth.users u
where p.id = u.id
  and nullif(trim(p.first_name), '') is null
  and coalesce(nullif(trim(u.raw_user_meta_data->>'full_name'), ''), nullif(trim(u.raw_user_meta_data->>'name'), '')) is not null
  and position(' ' in coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', '')) > 0;
