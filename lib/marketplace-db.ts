import { createClient } from "@/lib/supabase/server"
import type { AwinMarketplaceProduct } from "@/lib/marketplace-awin"

export type { AwinMarketplaceProduct } from "@/lib/marketplace-awin"

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
