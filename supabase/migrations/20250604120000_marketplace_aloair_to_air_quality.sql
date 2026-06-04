-- Rename legacy Air Quality category slug (typo "aloair" → "air-quality").
-- Paste in Supabase SQL Editor if marketplace_products uses category_slug.
-- Note: Awin catalog rows use `category` (display name, e.g. "Air Quality"), not this slug.

UPDATE public.marketplace_products
SET category_slug = 'air-quality'
WHERE category_slug = 'aloair';
