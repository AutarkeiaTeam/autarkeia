import type { Tier } from "@/lib/auth-server"
import {
  getAmazonProductsForAccess,
  type MarketplaceCategory,
  type MarketplaceProduct,
} from "@/lib/marketplace-data"
import { listAwinMarketplaceProducts } from "@/lib/marketplace-db"
import type { AwinMarketplaceProduct } from "@/lib/marketplace-awin"
import { formatAwinPrice } from "@/lib/marketplace-awin"
import { buildAffiliateUrl } from "@/lib/affiliate-urls"
import type { ProductRecommendation, QuizType } from "@/lib/quiz-data"

const MAX_CATALOG_ITEMS = 50
const MAX_PER_MARKETPLACE_CATEGORY = 10
const EMAIL_RECOMMENDATION_COUNT = 3

export type QuizCatalogPromptEntry = {
  sku: string
  name: string
  category: string
  description: string
  seller: string
}

export type ResolvedCatalogProduct = {
  sku: string
  name: string
  price: string
  image_url: string | null
  seller_name: string
  base_url: string
  advertiser_id?: number
  is_store_card?: boolean
  affiliate_url: string
}

export type QuizCatalogBundle = {
  entries: QuizCatalogPromptEntry[]
  lookup: Map<string, ResolvedCatalogProduct>
  weakestCategories: string[]
}

const QUIZ_TO_MARKETPLACE: Record<string, MarketplaceCategory[]> = {
  Water: ["Water"],
  Food: ["Food", "Garden & Harvest"],
  Medical: ["Medical", "Sanitation & Hygiene"],
  Power: ["Energy"],
  Communication: ["Communications"],
  Energy: ["Energy"],
  Shelter: ["Shelter"],
  Skills: ["Tools", "Security"],
}

function amazonSku(id: number): string {
  return `amazon:${id}`
}

function rankWeakestCategories(
  categoryScores: Record<string, number>,
  orderedCategories: string[]
): string[] {
  return [...orderedCategories].sort(
    (a, b) => (categoryScores[a] ?? 0) - (categoryScores[b] ?? 0)
  )
}

function marketplaceCategoriesForQuizCategories(quizCategories: string[]): Set<MarketplaceCategory> {
  const out = new Set<MarketplaceCategory>()
  for (const category of quizCategories) {
    for (const mapped of QUIZ_TO_MARKETPLACE[category] ?? ["Tools"]) {
      out.add(mapped)
    }
  }
  return out
}

function trimDescription(text: string, max = 140): string {
  const normalized = text.replace(/\s+/g, " ").trim()
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max - 1)}…`
}

function toAmazonResolved(product: MarketplaceProduct): ResolvedCatalogProduct {
  const sku = amazonSku(product.id)
  const base: Omit<ResolvedCatalogProduct, "affiliate_url"> = {
    sku,
    name: product.name,
    price: product.price,
    image_url: null,
    seller_name: "Amazon",
    base_url: product.affiliate,
  }
  return {
    ...base,
    affiliate_url: buildAffiliateUrl(base, {
      source: "email",
      campaign: "quiz_results",
    }),
  }
}

function toAwinResolved(product: AwinMarketplaceProduct): ResolvedCatalogProduct | null {
  if (product.is_store_card) return null

  const base: Omit<ResolvedCatalogProduct, "affiliate_url"> = {
    sku: product.id,
    name: product.product_name,
    price: formatAwinPrice(product.price, product.currency),
    image_url: product.image_url,
    seller_name: product.advertiser_name,
    base_url: product.deep_link,
    advertiser_id: product.advertiser_id,
    is_store_card: false,
  }
  return {
    ...base,
    affiliate_url: buildAffiliateUrl(base, {
      source: "email",
      campaign: "quiz_results",
    }),
  }
}

function pickAmazonProducts(
  products: MarketplaceProduct[],
  categories: Set<MarketplaceCategory>
): MarketplaceProduct[] {
  const byCategory = new Map<MarketplaceCategory, MarketplaceProduct[]>()
  for (const product of products) {
    if (!categories.has(product.category)) continue
    const bucket = byCategory.get(product.category) ?? []
    if (bucket.length < MAX_PER_MARKETPLACE_CATEGORY) {
      bucket.push(product)
      byCategory.set(product.category, bucket)
    }
  }

  const picked: MarketplaceProduct[] = []
  for (const items of byCategory.values()) {
    for (const item of items) {
      picked.push(item)
      if (picked.length >= MAX_CATALOG_ITEMS) return picked
    }
  }
  return picked
}

function pickAwinProducts(
  products: AwinMarketplaceProduct[],
  categories: Set<MarketplaceCategory>
): AwinMarketplaceProduct[] {
  const byCategory = new Map<MarketplaceCategory, AwinMarketplaceProduct[]>()
  for (const product of products) {
    if (product.is_store_card || !product.in_stock) continue
    if (!categories.has(product.category)) continue
    const bucket = byCategory.get(product.category) ?? []
    if (bucket.length < MAX_PER_MARKETPLACE_CATEGORY) {
      bucket.push(product)
      byCategory.set(product.category, bucket)
    }
  }

  const picked: AwinMarketplaceProduct[] = []
  for (const items of byCategory.values()) {
    for (const item of items) {
      picked.push(item)
      if (picked.length >= MAX_CATALOG_ITEMS) return picked
    }
  }
  return picked
}

export async function buildQuizCatalogBundle(options: {
  tier: Tier
  quizType: QuizType
  categoryScores: Record<string, number>
  orderedCategories: string[]
}): Promise<QuizCatalogBundle> {
  const weakest = rankWeakestCategories(options.categoryScores, options.orderedCategories)
  const focusQuizCategories = weakest.slice(0, 5)
  const marketplaceCategories = marketplaceCategoriesForQuizCategories(focusQuizCategories)

  const hasPro = options.tier === "pro"
  const amazonProducts = pickAmazonProducts(
    getAmazonProductsForAccess(hasPro),
    marketplaceCategories
  )

  const awinProducts = hasPro
    ? pickAwinProducts(await listAwinMarketplaceProducts(), marketplaceCategories)
    : []

  const entries: QuizCatalogPromptEntry[] = []
  const lookup = new Map<string, ResolvedCatalogProduct>()

  for (const product of amazonProducts) {
    const resolved = toAmazonResolved(product)
    entries.push({
      sku: resolved.sku,
      name: resolved.name,
      category: product.category,
      description: trimDescription(product.description),
      seller: "Amazon",
    })
    lookup.set(resolved.sku, resolved)
  }

  for (const product of awinProducts) {
    const resolved = toAwinResolved(product)
    if (!resolved) continue
    entries.push({
      sku: resolved.sku,
      name: resolved.name,
      category: product.category,
      description: trimDescription(product.description ?? ""),
      seller: product.advertiser_name,
    })
    lookup.set(resolved.sku, resolved)
  }

  return {
    entries,
    lookup,
    weakestCategories: weakest.slice(0, EMAIL_RECOMMENDATION_COUNT),
  }
}

export type HaikuCatalogRecommendation = {
  category: string
  advice_text: string
  recommended_sku: string | null
}

export function resolveCatalogRecommendations(
  items: HaikuCatalogRecommendation[] | undefined,
  lookup: Map<string, ResolvedCatalogProduct>
): ProductRecommendation[] {
  if (!items?.length) return []

  return items.map((item) => {
    const sku = typeof item.recommended_sku === "string" ? item.recommended_sku.trim() : ""
    const resolved = sku ? lookup.get(sku) : undefined

    if (sku && !resolved) {
      console.warn("[quiz-catalog] Haiku returned unknown SKU:", sku, "category:", item.category)
    }

    const catalogProduct = resolved
      ? {
          sku: resolved.sku,
          name: resolved.name,
          price: resolved.price,
          image_url: resolved.image_url,
          seller_name: resolved.seller_name,
          affiliate_url: resolved.affiliate_url,
        }
      : null

    return {
      category: item.category,
      name: resolved?.name ?? item.category,
      why: item.advice_text,
      estimated_price: resolved?.price ?? "",
      recommended_sku: sku || null,
      catalog_product: catalogProduct,
    }
  })
}

export function emailRecommendationCount(): number {
  return EMAIL_RECOMMENDATION_COUNT
}
