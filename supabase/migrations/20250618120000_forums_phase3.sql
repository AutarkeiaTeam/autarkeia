-- Forums Phase 3: @-mentions, reports, pin/lock.

-- @-mentions
create table if not exists public.forums_mentions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forums_posts (id) on delete cascade,
  mentioned_user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, mentioned_user_id)
);

create index if not exists forums_mentions_user_idx
  on public.forums_mentions (mentioned_user_id);

alter table public.forums_mentions enable row level security;

drop policy if exists "Mentions are publicly readable" on public.forums_mentions;
create policy "Mentions are publicly readable"
  on public.forums_mentions for select
  using (true);

drop policy if exists "Authors can create mentions for their posts" on public.forums_mentions;
create policy "Authors can create mentions for their posts"
  on public.forums_mentions for insert
  with check (
    auth.uid() is not null
    and exists (
      select 1 from public.forums_posts p
      where p.id = post_id and p.author_id::uuid = auth.uid()
    )
  );

alter table public.profiles
  add column if not exists notify_forum_mentions boolean not null default true;

comment on column public.profiles.notify_forum_mentions is
  'Notify when someone @-mentions the user in a forum post.';

-- Post reports
create table if not exists public.forums_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forums_posts (id) on delete cascade,
  reporter_id uuid not null references auth.users (id) on delete cascade,
  reason text not null,
  note text,
  resolved_at timestamptz,
  resolved_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (post_id, reporter_id)
);

create index if not exists forums_reports_unresolved_idx
  on public.forums_reports (created_at desc)
  where resolved_at is null;

alter table public.forums_reports enable row level security;

drop policy if exists "Admins read all reports" on public.forums_reports;
create policy "Admins read all reports"
  on public.forums_reports for select
  using (public.is_forum_admin());

drop policy if exists "Authenticated users can create reports" on public.forums_reports;
create policy "Authenticated users can create reports"
  on public.forums_reports for insert
  with check (auth.uid() = reporter_id);

drop policy if exists "Admins can resolve reports" on public.forums_reports;
create policy "Admins can resolve reports"
  on public.forums_reports for update
  using (public.is_forum_admin())
  with check (public.is_forum_admin());

do $$
begin
  alter table public.forums_reports
    add constraint forums_reports_reason_valid
    check (reason in ('spam', 'harassment', 'off_topic', 'misinformation', 'other'));
exception
  when duplicate_object then null;
end $$;

-- Pin / lock threads
alter table public.forums_threads
  add column if not exists pinned boolean not null default false,
  add column if not exists locked boolean not null default false,
  add column if not exists pinned_at timestamptz,
  add column if not exists locked_at timestamptz;

comment on column public.forums_threads.pinned is 'When true, thread stays at top of category list.';
comment on column public.forums_threads.locked is 'When true, only admins can post new replies.';
