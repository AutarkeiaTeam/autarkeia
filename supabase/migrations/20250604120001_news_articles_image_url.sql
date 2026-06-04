-- Hero images from Google News RSS (nullable — not every item has media).
ALTER TABLE public.news_articles
  ADD COLUMN IF NOT EXISTS image_url text;
