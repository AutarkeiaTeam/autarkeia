-- Ensure forums_posts tracks edits via updated_at.

alter table public.forums_posts
  add column if not exists updated_at timestamptz;

update public.forums_posts
set updated_at = coalesce(updated_at, created_at, now())
where updated_at is null;

alter table public.forums_posts
  alter column updated_at set default now();

comment on column public.forums_posts.updated_at is 'Set on create and on content edit; used for (edited) label.';
