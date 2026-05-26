-- Forum moderation: admins can delete any thread or post.

alter table public.profiles
  add column if not exists is_admin boolean not null default false;

comment on column public.profiles.is_admin is 'When true, user may delete any forum thread or post. Set manually in Table Editor.';
