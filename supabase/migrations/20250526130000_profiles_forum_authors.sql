-- Forum author display: email on profiles (display_name reserved for a future settings UI).

alter table public.profiles
  add column if not exists email text,
  add column if not exists display_name text;

comment on column public.profiles.email is 'Synced from auth.users for display in forums and emails.';
comment on column public.profiles.display_name is 'Optional public name; falls back to email in forums when null.';

-- Backfill email from auth.users for existing profiles (run once in SQL editor).
-- update public.profiles p
-- set email = u.email
-- from auth.users u
-- where p.id = u.id and (p.email is null or p.email = '');
