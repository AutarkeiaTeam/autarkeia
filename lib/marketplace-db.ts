import { createClient } from "@/lib/supabase/server"
import { normalizeMarketplaceCategory } from "@/lib/marketplace-category-map"
import type { AwinMarketplaceProduct } from "@/lib/marketplace-awin"

export type { AwinMarketplaceProduct } from "@/lib/marketplace-awin"

const PAGE_SIZE = 1000

/** Count in-stock rows in marketplace_products (Awin feed + store cards). */
export async function countAwinMarketplaceProducts(): Promise<number> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from("marketplace_products")
    .select("*", { count: "exact", head: true })
    .eq("in_stock", true)

  if (error) {
    console.error("countAwinMarketplaceProducts:", error.message)
    return 0
  }

  return count ?? 0
}

export async function listAwinMarketplaceProducts(): Promise<AwinMarketplaceProduct[]> {
  const supabase = await createClient()
  const all: AwinMarketplaceProduct[] = []
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from("marketplace_products")
      .select(
        "id, advertiser_id, advertiser_name, product_name, description, price, currency, image_url, deep_link, category, country, in_stock, brand_slug, is_store_card"
      )
      .eq("in_stock", true)
      .order("product_name")
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      console.error("listAwinMarketplaceProducts:", error.message)
      break
    }

    if (!data?.length) break

    for (const row of data) {
      all.push({
        ...(row as AwinMarketplaceProduct),
        is_store_card: row.is_store_card ?? false,
        category: normalizeMarketplaceCategory(
          row.category,
          row.product_name,
          row.description ?? ""
        ),
      })
    }

    if (data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  return all
}

export type AwinProductCategoryStat = {
  advertiser_name: string
  category: string
  count: number
}

/** For admin audit: products per advertiser × category. */
export async function getAwinMarketplaceProductStats(): Promise<AwinProductCategoryStat[]> {
  const supabase = await createClient()
  const counts = new Map<string, AwinProductCategoryStat>()
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from("marketplace_products")
      .select("advertiser_name, category")
      .range(from, from + PAGE_SIZE - 1)

    if (error) {
      console.error("getAwinMarketplaceProductStats:", error.message)
      break
    }

    if (!data?.length) break

    for (const row of data) {
    const key = `${row.advertiser_name}\0${row.category}`
    const existing = counts.get(key)
    if (existing) {
      existing.count += 1
    } else {
      counts.set(key, {
        advertiser_name: row.advertiser_name,
        category: row.category,
        count: 1,
      })
    }
    }

    if (data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  return [...counts.values()].sort((a, b) =>
    a.advertiser_name.localeCompare(b.advertiser_name) || a.category.localeCompare(b.category)
  )
}
