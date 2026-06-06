-- Usernames and public profile privacy controls.

alter table public.profiles
  add column if not exists username text;

create unique index if not exists profiles_username_unique_idx
  on public.profiles (lower(username));

do $$
begin
  alter table public.profiles
    add constraint profiles_username_format
    check (username is null or username ~ '^[a-z0-9_]{3,30}$');
exception
  when duplicate_object then null;
end $$;

alter table public.profiles
  add column if not exists profile_public boolean not null default false,
  add column if not exists show_quiz_scores boolean not null default false,
  add column if not exists show_country boolean not null default false;

comment on column public.profiles.username is
  'Unique public handle for /profile/[username]. Lowercase a-z, 0-9, underscore; 3-30 chars.';

comment on column public.profiles.profile_public is
  'When true, /profile/[username] shows the public profile page.';

comment on column public.profiles.show_quiz_scores is
  'When profile is public, show quiz section (placeholder until server-side quiz persistence).';

comment on column public.profiles.show_country is
  'When profile is public, show country from community interest if available.';
