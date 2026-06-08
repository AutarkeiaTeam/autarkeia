-- Version forums schema (tables exist in production) and add RLS.
-- Categories are app constants (lib/forums-shared.ts), not a DB table.

-- Remove unused forums_categories if it was created manually.
drop table if exists public.forums_categories cascade;

create table if not exists public.forums_threads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  author_id text not null,
  category text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.forums_posts (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.forums_threads (id) on delete cascade,
  author_id text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists forums_threads_category_updated_idx
  on public.forums_threads (category, updated_at desc);

create index if not exists forums_threads_author_id_idx
  on public.forums_threads (author_id);

create index if not exists forums_posts_thread_id_created_idx
  on public.forums_posts (thread_id, created_at asc);

create index if not exists forums_posts_author_id_idx
  on public.forums_posts (author_id);

comment on table public.forums_threads is
  'Forum threads; category ids match lib/forums-shared.ts constants (no forums_categories table).';

comment on table public.forums_posts is
  'Replies within a forum thread; author_id is auth user uuid stored as text.';

comment on column public.forums_threads.author_id is
  'Auth user id (uuid as text). No FK to auth.users; lib/delete-account.ts cleans up on account deletion.';

comment on column public.forums_posts.author_id is
  'Auth user id (uuid as text). No FK to auth.users; lib/delete-account.ts cleans up on account deletion.';

-- Ensure updated_at exists on posts (idempotent with earlier migration).
alter table public.forums_posts
  add column if not exists updated_at timestamptz;

update public.forums_posts
set updated_at = coalesce(updated_at, created_at, now())
where updated_at is null;

alter table public.forums_posts
  alter column updated_at set default now();

create or replace function public.is_forum_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

comment on function public.is_forum_admin() is
  'True when the current user has profiles.is_admin; used by forums RLS.';

alter table public.forums_threads enable row level security;
alter table public.forums_posts enable row level security;

-- forums_threads policies
drop policy if exists "Forums threads are publicly readable" on public.forums_threads;
create policy "Forums threads are publicly readable"
  on public.forums_threads for select
  using (true);

drop policy if exists "Authenticated users can create forum threads" on public.forums_threads;
create policy "Authenticated users can create forum threads"
  on public.forums_threads for insert
  with check (
    auth.uid() is not null
    and author_id::uuid = auth.uid()
  );

drop policy if exists "Authors and admins can update forum threads" on public.forums_threads;
create policy "Authors and admins can update forum threads"
  on public.forums_threads for update
  using (
    auth.uid() is not null
    and (author_id::uuid = auth.uid() or public.is_forum_admin())
  )
  with check (
    auth.uid() is not null
    and (author_id::uuid = auth.uid() or public.is_forum_admin())
  );

drop policy if exists "Authors and admins can delete forum threads" on public.forums_threads;
create policy "Authors and admins can delete forum threads"
  on public.forums_threads for delete
  using (
    auth.uid() is not null
    and (author_id::uuid = auth.uid() or public.is_forum_admin())
  );

-- forums_posts policies
drop policy if exists "Forum posts are publicly readable" on public.forums_posts;
create policy "Forum posts are publicly readable"
  on public.forums_posts for select
  using (true);

drop policy if exists "Authenticated users can create forum posts" on public.forums_posts;
create policy "Authenticated users can create forum posts"
  on public.forums_posts for insert
  with check (
    auth.uid() is not null
    and author_id::uuid = auth.uid()
  );

drop policy if exists "Authors and admins can update forum posts" on public.forums_posts;
create policy "Authors and admins can update forum posts"
  on public.forums_posts for update
  using (
    auth.uid() is not null
    and (author_id::uuid = auth.uid() or public.is_forum_admin())
  )
  with check (
    auth.uid() is not null
    and (author_id::uuid = auth.uid() or public.is_forum_admin())
  );

drop policy if exists "Authors and admins can delete forum posts" on public.forums_posts;
create policy "Authors and admins can delete forum posts"
  on public.forums_posts for delete
  using (
    auth.uid() is not null
    and (author_id::uuid = auth.uid() or public.is_forum_admin())
  );
