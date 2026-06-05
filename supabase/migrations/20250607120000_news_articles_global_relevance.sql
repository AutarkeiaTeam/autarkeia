alter table public.news_articles
  add column if not exists global_relevance smallint
  check (global_relevance is null or (global_relevance >= 1 and global_relevance <= 5));

comment on column public.news_articles.global_relevance is
  'Haiku-assigned global relevance (1=hyper-local … 5=world-shaping). Ingest requires >= 3.';
