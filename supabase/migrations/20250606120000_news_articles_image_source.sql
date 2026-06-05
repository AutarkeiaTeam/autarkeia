-- Image provenance and Unsplash attribution for news hero images.
ALTER TABLE public.news_articles
  ADD COLUMN IF NOT EXISTS image_source text,
  ADD COLUMN IF NOT EXISTS image_credit_name text,
  ADD COLUMN IF NOT EXISTS image_credit_url text;
