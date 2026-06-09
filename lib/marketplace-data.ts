import curatedCatalog from "@/data/marketplace-curated-catalog.json"
import { getAmazonAssociatesTag } from "@/lib/affiliate-urls"

export type MarketplaceCategory =
  | "Water"
  | "Food"
  | "Shelter"
  | "Energy"
  | "Medical"
  | "Tools"
  | "Security"
  | "Communications"
  | "Garden & Harvest"
  | "Fire & Cooking"
  | "Air Quality"
  | "Sanitation & Hygiene"
  | "Lighting"
  | "Navigation"
  | "Transportation & Vehicle"
  | "Pet Preparedness"
  | "Children & Family"
  | "Documents & Finance"
  | "Clothing"
  | "Bartering & Currency"

/** Locale slug per category (`marketplace.categories.{slug}.name`). */
export const CATEGORY_SLUGS: Record<MarketplaceCategory, string> = {
  Water: "water",
  Food: "food",
  Shelter: "shelter",
  Energy: "energy",
  Medical: "medical",
  Tools: "tools",
  Security: "security",
  Communications: "communications",
  "Garden & Harvest": "garden-harvest",
  "Fire & Cooking": "fire-cooking",
  "Air Quality": "air-quality",
  "Sanitation & Hygiene": "sanitation-hygiene",
  Lighting: "lighting",
  Navigation: "navigation",
  "Transportation & Vehicle": "transportation-vehicle",
  "Pet Preparedness": "pet-preparedness",
  "Children & Family": "children-family",
  "Documents & Finance": "documents-finance",
  Clothing: "clothing",
  "Bartering & Currency": "bartering-currency",
}

export function getCategorySlug(category: MarketplaceCategory): string {
  return CATEGORY_SLUGS[category]
}

/** Visible category chips for free members and visitors (10 categories). */
export const MARKETPLACE_FILTER_CATEGORIES: MarketplaceCategory[] = [
  "Water",
  "Food",
  "Shelter",
  "Energy",
  "Medical",
  "Tools",
  "Security",
  "Communications",
  "Garden & Harvest",
  "Fire & Cooking",
]

/** Pro-only Amazon categories (10 categories — chips shown only to Pro members). */
export const MARKETPLACE_PRO_ONLY_CATEGORIES: MarketplaceCategory[] = [
  "Air Quality",
  "Sanitation & Hygiene",
  "Lighting",
  "Navigation",
  "Transportation & Vehicle",
  "Pet Preparedness",
  "Children & Family",
  "Documents & Finance",
  "Clothing",
  "Bartering & Currency",
]

export const MARKETPLACE_FREE_AMAZON_CATEGORIES: MarketplaceCategory[] = [
  ...MARKETPLACE_FILTER_CATEGORIES,
]

export function getMarketplaceFilterCategories(hasPro: boolean): MarketplaceCategory[] {
  return hasPro
    ? [...MARKETPLACE_FILTER_CATEGORIES, ...MARKETPLACE_PRO_ONLY_CATEGORIES]
    : MARKETPLACE_FILTER_CATEGORIES
}

export type MarketplaceProduct = {
  /** Amazon ASIN (also used as stable product id). */
  asin: string
  category: MarketplaceCategory
  seller: MarketplaceSeller
  name_en: string
  name_es: string
  rationale_en: string
  rationale_es: string
  /** Locale-neutral fallback; prefer rationale_* + getAmazonProductCopy(). */
  description: string
  price: string
  affiliate: string
  image_url: string | null
  rating: number | null
  review_count: number | null
  free_tier_pick: boolean
  use_case: string
}

export type MarketplaceSeller = "Amazon" | (string & {})

export const MARKETPLACE_SELLERS: MarketplaceSeller[] = ["Amazon"]

export function buildMarketplaceSellers(awinSellerNames: string[]): MarketplaceSeller[] {
  return ["Amazon", ...awinSellerNames]
}

export type MarketplaceBundle = {
  id?: string
  name: string
  items: string
  original: string
  price: string
  savings: string
  affiliate: string
}

type CuratedCatalogProduct = {
  source: string
  id: string
  name_en: string
  name_es: string
  price_eur: number
  image_url?: string | null
  rating?: number | null
  review_count?: number | null
  use_case: string
  rationale_en: string
  rationale_es: string
  free_tier_pick?: boolean
}

type CuratedCatalogCategory = {
  slug: string
  name_en: string
  free_tier_enabled: boolean
  note?: string
  products: CuratedCatalogProduct[]
}

const SLUG_TO_CATEGORY = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([category, slug]) => [slug, category])
) as Record<string, MarketplaceCategory>

function formatPriceEur(amount: number): string {
  const rounded = Math.round(amount * 100) / 100
  return rounded % 1 === 0 ? `€${rounded}` : `€${rounded.toFixed(2)}`
}

/** Direct Amazon.es product URL with Associates tag. */
export function amazonProductUrl(asin: string): string {
  const tag = getAmazonAssociatesTag()
  const base = `https://www.amazon.es/dp/${asin}`
  return tag ? `${base}?tag=${encodeURIComponent(tag)}` : base
}

function loadCuratedAmazonProducts(): MarketplaceProduct[] {
  const catalog = curatedCatalog as {
    categories: CuratedCatalogCategory[]
  }
  const products: MarketplaceProduct[] = []

  for (const category of catalog.categories) {
    const marketplaceCategory = SLUG_TO_CATEGORY[category.slug]
    if (!marketplaceCategory) continue

    for (const product of category.products) {
      if (product.source !== "amazon") continue
      products.push({
        asin: product.id,
        category: marketplaceCategory,
        seller: "Amazon",
        name_en: product.name_en,
        name_es: product.name_es,
        rationale_en: product.rationale_en,
        rationale_es: product.rationale_es,
        description: product.rationale_en,
        price: formatPriceEur(product.price_eur),
        affiliate: amazonProductUrl(product.id),
        image_url: product.image_url ?? null,
        rating: product.rating ?? null,
        review_count: product.review_count ?? null,
        free_tier_pick: product.free_tier_pick ?? false,
        use_case: product.use_case,
      })
    }
  }

  return products
}

export function getAmazonProductCopy(
  product: MarketplaceProduct,
  locale: string
): { name: string; rationale: string } {
  const es = locale.startsWith("es")
  return {
    name: es ? product.name_es : product.name_en,
    rationale: es ? product.rationale_es : product.rationale_en,
  }
}

export const marketplaceProducts: MarketplaceProduct[] = loadCuratedAmazonProducts()

export function amazonSearchUrl(query: string): string {
  const tag = getAmazonAssociatesTag()
  return `https://www.amazon.es/s?k=${encodeURIComponent(query)}&tag=${encodeURIComponent(tag)}`
}

export const marketplaceBundlesFree: MarketplaceBundle[] = [
  {
    id: "72-hour-emergency",
    name: "72-Hour Emergency Kit",
    items: "water + food + medical + light + comms",
    original: "€234",
    price: "€189",
    savings: "€45",
    affiliate: amazonSearchUrl("72 hour emergency kit"),
  },
  {
    id: "home-energy-starter",
    name: "Home Energy Independence Starter",
    items: "solar panel + power station + MPPT controller",
    original: "€674",
    price: "€549",
    savings: "€125",
    affiliate: amazonSearchUrl("home solar starter kit portable power station"),
  },
  {
    id: "food-resilience-starter",
    name: "Food Resilience Starter",
    items: "raised bed + seeds + tools + soil meter",
    original: "€184",
    price: "€149",
    savings: "€35",
    affiliate: amazonSearchUrl("food growing starter kit raised bed"),
  },
  {
    id: "complete-emergency-readiness",
    name: "Complete Emergency Readiness",
    items: "water filter + 30-day food + first aid + communications",
    original: "€544",
    price: "€449",
    savings: "€95",
    affiliate: amazonSearchUrl("complete emergency readiness kit"),
  },
  {
    id: "off-grid-water",
    name: "Off-Grid Water System",
    items: "gravity filter + rain barrel + storage + hand pump",
    original: "€470",
    price: "€390",
    savings: "€80",
    affiliate: amazonSearchUrl("off grid water system rain collection"),
  },
  {
    id: "shelter-cold-weather",
    name: "Shelter & Cold Weather",
    items: "4p tent + sleeping bags + tarps + stove",
    original: "€612",
    price: "€499",
    savings: "€113",
    affiliate: amazonSearchUrl("winter emergency shelter tent sleeping bag"),
  },
  {
    id: "medical-trauma-core",
    name: "Medical Trauma Core",
    items: "tourniquets + chest seals + bandages + airway kit",
    original: "€298",
    price: "€239",
    savings: "€59",
    affiliate: amazonSearchUrl("trauma first aid kit tourniquet"),
  },
  {
    id: "communications-redundancy",
    name: "Communications Redundancy",
    items: "GMRS radios + solar charger + crank radio",
    original: "€356",
    price: "€289",
    savings: "€67",
    affiliate: amazonSearchUrl("emergency radio gmrs handheld"),
  },
  {
    id: "security-perimeter",
    name: "Security Perimeter Pack",
    items: "motion lights + trail camera + door reinforcement",
    original: "€412",
    price: "€339",
    savings: "€73",
    affiliate: amazonSearchUrl("home security motion sensor camera"),
  },
  {
    id: "navigation-evacuation",
    name: "Navigation & Evacuation",
    items: "topo maps + compass + rugged GPS + road atlas",
    original: "€428",
    price: "€349",
    savings: "€79",
    affiliate: amazonSearchUrl("gps handheld topo map compass"),
  },
  {
    id: "tools-field-repair",
    name: "Tools & Field Repair",
    items: "multitool + saw + sockets + multimeter + cordage",
    original: "€318",
    price: "€259",
    savings: "€59",
    affiliate: amazonSearchUrl("survival tool kit multimeter saw"),
  },
  {
    id: "clothing-layering",
    name: "Clothing Layering System",
    items: "merino base + rain shell + insulated jacket + boots",
    original: "€524",
    price: "€429",
    savings: "€95",
    affiliate: amazonSearchUrl("outdoor layering merino rain jacket"),
  },
  {
    id: "water-purification-pro",
    name: "Water Purification Pro",
    items: "ceramic filter + UV pen + test strips + storage",
    original: "€389",
    price: "€319",
    savings: "€70",
    affiliate: amazonSearchUrl("water purification ceramic filter uv"),
  },
  {
    id: "long-term-food-storage",
    name: "Long-Term Food Storage",
    items: "buckets + mylar + O2 absorbers + sealer",
    original: "€276",
    price: "€219",
    savings: "€57",
    affiliate: amazonSearchUrl("long term food storage mylar buckets"),
  },
  {
    id: "backup-power-week",
    name: "Backup Power Week",
    items: "LiFePO4 + inverter + solar folding + cables",
    original: "€1,120",
    price: "€949",
    savings: "€171",
    affiliate: amazonSearchUrl("lifepo4 battery solar inverter kit"),
  },
  {
    id: "homestead-food-preservation",
    name: "Homestead Food Preservation",
    items: "pressure canner + dehydrator + jars + labels",
    original: "€398",
    price: "€329",
    savings: "€69",
    affiliate: amazonSearchUrl("pressure canner dehydrator preserving"),
  },
  {
    id: "natural-building-starter",
    name: "Natural Building Starter",
    items: "straw needles + plaster hawk + levels + moisture meter",
    original: "€244",
    price: "€199",
    savings: "€45",
    affiliate: amazonSearchUrl("natural building tools plaster straw bale"),
  },
  {
    id: "rainwater-harvest",
    name: "Rainwater Harvest Complete",
    items: "gutters kit + first flush + IBC fittings + pump",
    original: "€512",
    price: "€419",
    savings: "€93",
    affiliate: amazonSearchUrl("rainwater harvesting kit first flush"),
  },
  {
    id: "wind-solar-hybrid-mini",
    name: "Wind + Solar Hybrid Mini",
    items: "400W turbine + MPPT hybrid + dump load + battery",
    original: "€1,340",
    price: "€1,099",
    savings: "€241",
    affiliate: amazonSearchUrl("small wind turbine solar hybrid mppt"),
  },
  {
    id: "family-hygiene-sanitation",
    name: "Family Hygiene & Sanitation",
    items: "portable toilet + waste bags + wash station + soap",
    original: "€198",
    price: "€159",
    savings: "€39",
    affiliate: amazonSearchUrl("camping portable toilet wash station"),
  },
  {
    id: "cyber-outage-analog",
    name: "Cyber-Outage Analog Kit",
    items: "maps + cash envelope + radio + paper logs + candles",
    original: "€167",
    price: "€135",
    savings: "€32",
    affiliate: amazonSearchUrl("emergency radio maps analog preparedness"),
  },
  {
    id: "vehicle-get-home",
    name: "Vehicle Get-Home Bag",
    items: "tools + water + food + blanket + light + charger",
    original: "€286",
    price: "€235",
    savings: "€51",
    affiliate: amazonSearchUrl("vehicle emergency kit get home bag"),
  },
]

/** @deprecated Use marketplaceBundlesFree — kept for existing imports. */
export const marketplaceBundles = marketplaceBundlesFree

export function getAmazonProductsForAccess(hasPro: boolean): MarketplaceProduct[] {
  if (hasPro) return marketplaceProducts
  return marketplaceProducts.filter((p) => p.free_tier_pick)
}

export function getAmazonProductCount(hasPro: boolean): number {
  return getAmazonProductsForAccess(hasPro).length
}

