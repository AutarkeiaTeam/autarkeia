-- Publisher article URL decoded from Google News redirect (nullable).
ALTER TABLE public.news_articles
  ADD COLUMN IF NOT EXISTS resolved_url text;
