-- Live news pipeline: Google News RSS → Claude Haiku → public read

create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  source_url text unique not null,
  source_name text,
  published_at timestamptz not null,
  fetched_at timestamptz not null default now(),
  title_en text not null,
  title_es text not null,
  summary_en text not null,
  summary_es text not null,
  why_matters_en text not null,
  why_matters_es text not null,
  category text not null,
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  topic_query text,
  created_at timestamptz default now()
);

create index if not exists news_articles_published_idx
  on public.news_articles (published_at desc);

create index if not exists news_articles_category_idx
  on public.news_articles (category);

comment on table public.news_articles is 'AI-curated world news for /news; synced daily from Google News RSS.';

create table if not exists public.news_feed_sync (
  id uuid primary key default gen_random_uuid(),
  run_at timestamptz not null default now(),
  articles_fetched int not null,
  articles_added int not null,
  articles_skipped int not null,
  errors jsonb,
  duration_ms int
);

create index if not exists news_feed_sync_run_at_idx
  on public.news_feed_sync (run_at desc);

comment on table public.news_feed_sync is 'Daily news sync run log (service role writes).';

alter table public.news_articles enable row level security;
alter table public.news_feed_sync enable row level security;

drop policy if exists "Public read news articles" on public.news_articles;
create policy "Public read news articles"
  on public.news_articles
  for select
  using (true);

-- news_feed_sync: no public policies (service role only)
