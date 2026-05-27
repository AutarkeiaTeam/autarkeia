-- Awin product catalog (synced daily from product feeds; Amazon stays in-app).

create table if not exists public.marketplace_products (
  id text primary key,
  advertiser_id integer not null,
  advertiser_name text not null,
  product_name text not null,
  description text,
  price numeric(12, 2),
  currency text not null default 'EUR',
  image_url text,
  deep_link text not null,
  category text not null,
  country text,
  in_stock boolean not null default true,
  aw_product_id text not null,
  brand_slug text not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (advertiser_id, aw_product_id)
);

create index if not exists marketplace_products_advertiser_id_idx
  on public.marketplace_products (advertiser_id);

create index if not exists marketplace_products_category_idx
  on public.marketplace_products (category);

create index if not exists marketplace_products_brand_slug_idx
  on public.marketplace_products (brand_slug);

create index if not exists marketplace_products_in_stock_idx
  on public.marketplace_products (in_stock)
  where in_stock = true;

comment on table public.marketplace_products is 'Awin feed products; synced by cron. Amazon products remain client-side in lib/marketplace-data.ts.';

create table if not exists public.marketplace_feed_sync (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  advertiser_id integer,
  brand_slug text,
  products_added integer not null default 0,
  products_updated integer not null default 0,
  products_removed integer not null default 0,
  error_message text
);

create index if not exists marketplace_feed_sync_started_at_idx
  on public.marketplace_feed_sync (started_at desc);

alter table public.marketplace_products enable row level security;
alter table public.marketplace_feed_sync enable row level security;

drop policy if exists "Public read marketplace products" on public.marketplace_products;
create policy "Public read marketplace products"
  on public.marketplace_products
  for select
  using (true);

drop policy if exists "Public read marketplace feed sync" on public.marketplace_feed_sync;
create policy "Public read marketplace feed sync"
  on public.marketplace_feed_sync
  for select
  using (true);

-- Writes use service role only (no INSERT/UPDATE/DELETE policies for authenticated users).
