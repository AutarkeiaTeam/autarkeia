-- Forums Phase 2: reactions + thread view tracking.

create table if not exists public.forums_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forums_posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique (post_id, user_id, emoji)
);

create index if not exists forums_reactions_post_idx
  on public.forums_reactions (post_id);

do $$
begin
  alter table public.forums_reactions
    add constraint forums_reactions_emoji_valid
    check (emoji in ('👍', '❤️', '🙏', '💡', '🔥'));
exception
  when duplicate_object then null;
end $$;

alter table public.forums_reactions enable row level security;

drop policy if exists "Reactions are publicly readable" on public.forums_reactions;
create policy "Reactions are publicly readable"
  on public.forums_reactions for select
  using (true);

drop policy if exists "Authenticated users can add reactions" on public.forums_reactions;
create policy "Authenticated users can add reactions"
  on public.forums_reactions for insert
  with check (auth.uid() is not null and user_id = auth.uid());

drop policy if exists "Users can remove own reactions" on public.forums_reactions;
create policy "Users can remove own reactions"
  on public.forums_reactions for delete
  using (auth.uid() is not null and user_id = auth.uid());

comment on table public.forums_reactions is
  'Emoji reactions on forum posts; toggle via unique (post_id, user_id, emoji).';

create table if not exists public.forums_thread_views (
  user_id uuid not null references auth.users (id) on delete cascade,
  thread_id uuid not null references public.forums_threads (id) on delete cascade,
  last_viewed_at timestamptz not null default now(),
  primary key (user_id, thread_id)
);

create index if not exists forums_thread_views_user_idx
  on public.forums_thread_views (user_id);

alter table public.forums_thread_views enable row level security;

drop policy if exists "Users read own thread views" on public.forums_thread_views;
create policy "Users read own thread views"
  on public.forums_thread_views for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own thread views" on public.forums_thread_views;
create policy "Users insert own thread views"
  on public.forums_thread_views for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own thread views" on public.forums_thread_views;
create policy "Users update own thread views"
  on public.forums_thread_views for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

comment on table public.forums_thread_views is
  'Per-user last viewed timestamp for unread thread indicators on /forums.';
