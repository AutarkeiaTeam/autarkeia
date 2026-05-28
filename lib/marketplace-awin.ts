import type { MarketplaceCategory } from "@/lib/marketplace-data"

/** Serializable Awin product row (safe for client components). */
export type AwinMarketplaceProduct = {
  id: string
  advertiser_id: number
  advertiser_name: string
  product_name: string
  description: string | null
  price: number | null
  currency: string
  image_url: string | null
  deep_link: string
  category: MarketplaceCategory
  country: string | null
  in_stock: boolean
  brand_slug: string
  is_store_card: boolean
}

export function formatAwinPrice(price: number | null, currency: string): string {
  if (price == null) return ""
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "EUR",
      maximumFractionDigits: 2,
    }).format(price)
  } catch {
    return `${currency} ${price.toFixed(2)}`
  }
}
