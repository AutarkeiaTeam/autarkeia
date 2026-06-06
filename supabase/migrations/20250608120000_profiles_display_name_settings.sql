-- Account settings: allow users to update display_name on their own profile.
-- display_name column already exists (20250526130000_profiles_forum_authors.sql).

alter table public.profiles
  drop constraint if exists profiles_display_name_length;

alter table public.profiles
  add constraint profiles_display_name_length
  check (display_name is null or char_length(display_name) <= 50);

drop policy if exists "Users can update own profile display name" on public.profiles;

create policy "Users can update own profile display name"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

comment on column public.profiles.display_name is
  'Optional display name; editable on /account. Max 50 characters.';
