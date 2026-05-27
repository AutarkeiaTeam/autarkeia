import { createClient } from "@/lib/supabase/server"
import type { MarketplaceCategory } from "@/lib/marketplace-data"

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
}

export async function listAwinMarketplaceProducts(): Promise<AwinMarketplaceProduct[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("marketplace_products")
    .select(
      "id, advertiser_id, advertiser_name, product_name, description, price, currency, image_url, deep_link, category, country, in_stock, brand_slug"
    )
    .eq("in_stock", true)
    .order("product_name")

  if (error) {
    console.error("listAwinMarketplaceProducts:", error.message)
    return []
  }

  return (data ?? []) as AwinMarketplaceProduct[]
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
