-- Synthetic store cards for advertisers without Awin product feeds.

alter table public.marketplace_products
  add column if not exists is_store_card boolean not null default false;

create index if not exists marketplace_products_is_store_card_idx
  on public.marketplace_products (is_store_card)
  where is_store_card = true;

comment on column public.marketplace_products.is_store_card is 'True for feed-less brand fallback rows (Visit store), not individual SKU listings.';
