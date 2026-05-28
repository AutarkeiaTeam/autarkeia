import { createAdminClient } from "@/lib/supabase/admin"
import {
  matchesKeywordWhitelist,
  mapAwinProductCategory,
} from "@/lib/marketplace-category-map"
import {
  decompressFeedBody,
  parseCsv,
  parseFeedListCsv,
  parseInStock,
  parsePrice,
  pickField,
} from "@/lib/marketplace-feed-parser"
import {
  getMarketplaceSyncTargets,
  type MarketplaceSyncTarget,
  type ProductFilterConfig,
} from "@/lib/marketplace-brands"

export type SyncSummary = {
  ok: boolean
  advertisersProcessed: number
  productsAdded: number
  productsUpdated: number
  productsRemoved: number
  errors: { advertiserId: number; brandSlug: string; message: string }[]
}

type NormalizedRow = {
  id: string
  advertiser_id: number
  advertiser_name: string
  product_name: string
  description: string | null
  price: number | null
  currency: string
  image_url: string | null
  deep_link: string
  category: string
  country: string | null
  in_stock: boolean
  aw_product_id: string
  brand_slug: string
  updated_at: string
}

const FEED_LIST_URL = "https://productdata.awin.com/datafeed/list/apikey"

export async function fetchAwinFeedList(apiKey: string): Promise<Map<number, { downloadUrl: string; advertiserName: string }>> {
  const res = await fetch(`${FEED_LIST_URL}/${encodeURIComponent(apiKey)}`, {
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(`Awin feed list failed: ${res.status} ${res.statusText}`)
  }
  const text = await res.text()
  const parsed = parseFeedListCsv(text)
  const slim = new Map<number, { downloadUrl: string; advertiserName: string }>()
  parsed.forEach((entry) => {
    slim.set(entry.advertiserId, {
      downloadUrl: entry.downloadUrl,
      advertiserName: entry.advertiserName,
    })
  })
  return slim
}

async function downloadFeedCsv(url: string): Promise<string> {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) {
    throw new Error(`Feed download failed: ${res.status} ${res.statusText}`)
  }
  const buffer = await res.arrayBuffer()
  return decompressFeedBody(buffer)
}

function passesFilter(
  row: Record<string, string>,
  filter: ProductFilterConfig
): boolean {
  if (filter.includeAll) return true
  const name = pickField(row, "product_name", "productname")
  const description = pickField(
    row,
    "description",
    "product_short_description",
    "productshortdescription"
  )
  const keywords = filter.keywordWhitelist ?? []
  if (keywords.length === 0) return false
  return matchesKeywordWhitelist(name, description, keywords)
}

function normalizeRow(
  row: Record<string, string>,
  target: MarketplaceSyncTarget,
  advertiserName: string
): NormalizedRow | null {
  const awProductId = pickField(row, "aw_product_id", "awproductid", "product_id")
  const productName = pickField(row, "product_name", "productname")
  const deepLink = pickField(row, "aw_deep_link", "awdeeplink", "merchant_deep_link")
  if (!awProductId || !productName || !deepLink) return null

  const feedCategory = pickField(
    row,
    "merchant_category",
    "merchantcategory",
    "category_name",
    "categoryname",
    "merchant_product_category_path"
  )
  const description =
    pickField(row, "description", "product_short_description", "productshortdescription") ||
    null
  const category = mapAwinProductCategory(feedCategory, productName, description ?? "")
  const price = parsePrice(pickField(row, "search_price", "searchprice", "store_price", "storeprice"))
  const currency = pickField(row, "currency") || "EUR"
  const imageUrl =
    pickField(row, "aw_image_url", "awimageurl", "merchant_image_url", "large_image") || null
  const inStock = parseInStock(pickField(row, "in_stock", "instock", "stock_status"))

  return {
    id: `awin:${target.advertiserId}:${awProductId}`,
    advertiser_id: target.advertiserId,
    advertiser_name: target.displayName,
    product_name: productName,
    description,
    price,
    currency: currency.toUpperCase(),
    image_url: imageUrl,
    deep_link: deepLink,
    category,
    country: target.country,
    in_stock: inStock,
    aw_product_id: awProductId,
    brand_slug: target.brandSlug,
    updated_at: new Date().toISOString(),
  }
}

async function syncAdvertiserFeed(
  target: MarketplaceSyncTarget,
  downloadUrl: string,
  feedListName: string
): Promise<{ added: number; updated: number; removed: number }> {
  const admin = createAdminClient()
  const csvText = await downloadFeedCsv(downloadUrl)
  const rows = parseCsv(csvText)
  const maxItems = target.productFilter.maxItems ?? 100

  const normalized: NormalizedRow[] = []
  for (const row of rows) {
    if (!passesFilter(row, target.productFilter)) continue
    const item = normalizeRow(row, target, feedListName)
    if (!item || !item.in_stock) continue
    normalized.push(item)
    if (normalized.length >= maxItems) break
  }

  const existingRes = await admin
    .from("marketplace_products")
    .select("id, aw_product_id")
    .eq("advertiser_id", target.advertiserId)

  const existingIds = new Set((existingRes.data ?? []).map((r) => r.id as string))
  const syncedIds = new Set<string>()

  let added = 0
  let updated = 0

  const batchSize = 50
  for (let i = 0; i < normalized.length; i += batchSize) {
    const batch = normalized.slice(i, i + batchSize)
    const { error } = await admin.from("marketplace_products").upsert(batch, { onConflict: "id" })
    if (error) throw new Error(error.message)

    for (const item of batch) {
      syncedIds.add(item.id)
      if (existingIds.has(item.id)) updated++
      else added++
    }
  }

  const toRemove = [...existingIds].filter((id) => !syncedIds.has(id))
  let removed = 0
  if (toRemove.length > 0) {
    const { error } = await admin
      .from("marketplace_products")
      .delete()
      .in("id", toRemove)
    if (error) throw new Error(error.message)
    removed = toRemove.length
  }

  return { added, updated, removed }
}

export async function runMarketplaceSync(opts?: {
  advertiserIds?: number[]
}): Promise<SyncSummary> {
  const apiKey = process.env.AWIN_DATAFEED_API_KEY
  if (!apiKey) {
    throw new Error("AWIN_DATAFEED_API_KEY is not configured")
  }

  const feedList = await fetchAwinFeedList(apiKey)
  let targets = getMarketplaceSyncTargets()
  if (opts?.advertiserIds?.length) {
    const allowed = new Set(opts.advertiserIds)
    targets = targets.filter((t) => allowed.has(t.advertiserId))
  }

  const summary: SyncSummary = {
    ok: true,
    advertisersProcessed: 0,
    productsAdded: 0,
    productsUpdated: 0,
    productsRemoved: 0,
    errors: [],
  }

  const admin = createAdminClient()

  for (const target of targets) {
    const syncLog = {
      started_at: new Date().toISOString(),
      advertiser_id: target.advertiserId,
      brand_slug: target.brandSlug,
      products_added: 0,
      products_updated: 0,
      products_removed: 0,
      error_message: null as string | null,
      finished_at: null as string | null,
    }

    const { data: logRow, error: logInsertError } = await admin
      .from("marketplace_feed_sync")
      .insert(syncLog)
      .select("id")
      .single()

    if (logInsertError) {
      console.error("sync log insert failed:", logInsertError.message)
    }

    try {
      const feedMeta = feedList.get(target.advertiserId)
      if (!feedMeta) {
        throw new Error(
          `No feed in Awin list for advertiser ${target.advertiserId} (${target.brandName})`
        )
      }

      await new Promise((r) => setTimeout(r, 500 + Math.random() * 1500))

      const result = await syncAdvertiserFeed(target, feedMeta.downloadUrl, feedMeta.advertiserName)
      summary.advertisersProcessed++
      summary.productsAdded += result.added
      summary.productsUpdated += result.updated
      summary.productsRemoved += result.removed

      if (logRow?.id) {
        await admin
          .from("marketplace_feed_sync")
          .update({
            finished_at: new Date().toISOString(),
            products_added: result.added,
            products_updated: result.updated,
            products_removed: result.removed,
          })
          .eq("id", logRow.id)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sync failed"
      summary.ok = false
      summary.errors.push({
        advertiserId: target.advertiserId,
        brandSlug: target.brandSlug,
        message,
      })

      if (logRow?.id) {
        await admin
          .from("marketplace_feed_sync")
          .update({
            finished_at: new Date().toISOString(),
            error_message: message,
          })
          .eq("id", logRow.id)
      }
    }
  }

  return summary
}

export function verifyCronSecret(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = request.headers.get("authorization")
  if (auth === `Bearer ${secret}`) return true
  return request.headers.get("x-cron-secret") === secret
}
