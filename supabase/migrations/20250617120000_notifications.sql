-- Notifications foundation + profile notification preferences.

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  actor_id uuid references auth.users (id) on delete set null,
  subject_type text,
  subject_id text,
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_unread_idx
  on public.notifications (user_id, created_at desc)
  where read_at is null;

create index if not exists notifications_user_all_idx
  on public.notifications (user_id, created_at desc);

create index if not exists notifications_type_idx
  on public.notifications (type);

alter table public.notifications enable row level security;

drop policy if exists "Users read own notifications" on public.notifications;
create policy "Users read own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

comment on table public.notifications is
  'In-app notifications; inserts via service role only. Types: forum_reply, forum_reaction, …';

alter table public.profiles
  add column if not exists notify_email_mode text not null default 'immediate',
  add column if not exists notify_inapp_enabled boolean not null default true,
  add column if not exists notify_forum_replies boolean not null default true,
  add column if not exists notify_forum_reactions boolean not null default true;

do $$
begin
  alter table public.profiles
    add constraint profiles_notify_email_mode_valid
    check (notify_email_mode in ('immediate', 'daily', 'off'));
exception
  when duplicate_object then null;
end $$;

comment on column public.profiles.notify_email_mode is
  'Email delivery: immediate, daily (digest job TBD), or off.';

comment on column public.profiles.notify_inapp_enabled is
  'When false, skip creating in-app notification rows.';

comment on column public.profiles.notify_forum_replies is
  'Notify when someone replies in a thread the user participates in.';

comment on column public.profiles.notify_forum_reactions is
  'Notify when someone reacts to the user''s forum post.';
