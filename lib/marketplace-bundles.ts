import type { AwinMarketplaceProduct } from "@/lib/marketplace-awin"
import {
  amazonSearchUrl,
  marketplaceBundlesFree,
  type MarketplaceBundle,
  type MarketplaceCategory,
} from "@/lib/marketplace-data"
import {
  marketplaceBrands,
  resolveAffiliateLink,
} from "@/lib/marketplace-brands"

export type BundleSource = "amazon" | "awin" | "mixed"

export type AwinBundleItemQuery = {
  source: "awin"
  brandSlug: string
  category?: MarketplaceCategory
  /** At least one keyword must appear in the product title/description. */
  keywords?: string[]
  /** All keywords must appear. */
  keywordsAll?: string[]
  minPrice?: number
  excludeKeywords?: string[]
  match?: "best" | "cheapest"
  /** When no SKU matches, use brand store affiliate link. */
  fallback?: "brand" | "skip"
}

export type AmazonBundleItemQuery = {
  source: "amazon"
  searchTerms: string
}

export type BundleItemQuery = AwinBundleItemQuery | AmazonBundleItemQuery

export type MarketplaceBundleDefinition = {
  id: string
  source: BundleSource
  name: string
  items: string
  itemQueries?: BundleItemQuery[]
  /** Primary Amazon search for amazon-only bundles (and mixed bundle CTA fallback). */
  amazonTerms?: string[]
  original: string
  price: string
  savings: string
}

export type ResolveProBundlesContext = {
  awinProducts: AwinMarketplaceProduct[]
  userCountry?: string | null
}

/** Pro-only bundle definitions (23). Resolved at render for Pro members. */
export const marketplaceBundlesProDefinitions: MarketplaceBundleDefinition[] = [
  {
    id: "pro-pantry-one-year",
    source: "amazon",
    name: "One-Year Pantry Build",
    items: "buckets + mylar + O₂ absorbers + sealer + calorie-dense staples",
    amazonTerms: [
      "long term food storage 25 year mylar buckets oxygen absorbers vacuum sealer",
      "emergency food supply 1 year family",
      "bulk rice beans lentils dry goods",
      "manual can opener bulk",
    ],
    original: "€1,240",
    price: "€999",
    savings: "€241",
  },
  {
    id: "pro-homestead-foundation",
    source: "awin",
    name: "Off-Grid Homestead Foundation",
    items:
      "AC180 power station + 200W solar panel + 4p tent + groundsheet + floor mat + bivvy + camp mess kit",
    itemQueries: [
      {
        source: "awin",
        brandSlug: "bluetti",
        category: "Energy",
        keywords: ["AC180"],
        keywordsAll: ["Portable", "Power", "Station"],
        excludeKeywords: ["refurbished", "+"],
        minPrice: 700,
        match: "best",
      },
      {
        source: "awin",
        brandSlug: "allpowers",
        category: "Energy",
        keywords: ["SP033"],
        keywordsAll: ["200"],
        excludeKeywords: ["refurbished", "+", "kit", "r600", "r3500"],
        minPrice: 150,
        match: "cheapest",
      },
      {
        source: "awin",
        brandSlug: "decathlon-ireland",
        category: "Shelter",
        keywords: ["Arpenaz", "4"],
        keywordsAll: ["tent"],
        match: "best",
      },
      {
        source: "awin",
        brandSlug: "decathlon-ireland",
        category: "Shelter",
        keywordsAll: ["groundsheet", "tent"],
        match: "cheapest",
      },
      {
        source: "awin",
        brandSlug: "decathlon-ireland",
        category: "Shelter",
        keywordsAll: ["floor", "mat"],
        match: "cheapest",
      },
      {
        source: "awin",
        brandSlug: "survival-frog",
        keywords: ["Bivvy"],
        match: "cheapest",
      },
      {
        source: "awin",
        brandSlug: "survival-frog",
        keywordsAll: ["Mess", "Kit"],
        match: "cheapest",
      },
    ],
    original: "€1,549",
    price: "€1,249",
    savings: "€300",
  },
  {
    id: "pro-seed-library-two-year",
    source: "amazon",
    name: "Two-Year Seed Library",
    items: "heirloom vault + region packs + seed saving + soil amendments",
    amazonTerms: [
      "heirloom vegetable seed vault survival",
      "non GMO seed bank variety pack",
      "seed saving storage envelopes",
      "organic compost worm castings bulk",
    ],
    original: "€420",
    price: "€339",
    savings: "€81",
  },
  {
    id: "pro-whole-house-solar",
    source: "awin",
    name: "Whole-House Solar + Battery Backup",
    items: "Apex 300 + DC hub station + 400W panel + 200W supplemental panel",
    itemQueries: [
      {
        source: "awin",
        brandSlug: "bluetti",
        category: "Energy",
        keywordsAll: ["Apex 300+Hub D1", "700W DC Power Hub"],
        excludeKeywords: [
          "refurbished",
          "B300",
          "B500",
          "2*",
          "Charger 2",
          "SORA",
          "SolarX",
          "Trolley",
        ],
        minPrice: 2400,
        match: "cheapest",
      },
      {
        source: "awin",
        brandSlug: "allpowers",
        category: "Energy",
        keywords: ["SP037"],
        keywordsAll: ["400"],
        excludeKeywords: ["refurbished", "+", "kit"],
        minPrice: 350,
        match: "cheapest",
      },
      {
        source: "awin",
        brandSlug: "allpowers",
        category: "Energy",
        keywords: ["SP033"],
        keywordsAll: ["200"],
        excludeKeywords: ["refurbished", "+", "kit", "r600"],
        minPrice: 150,
        match: "cheapest",
      },
    ],
    original: "€3,490",
    price: "€2,799",
    savings: "€691",
  },
  {
    id: "pro-wind-turbine-kit",
    source: "amazon",
    name: "Wind Turbine Full Install Kit",
    items: "400W turbine + hybrid controller + dump load + tower hardware",
    amazonTerms: [
      "400W wind turbine 12V 24V hybrid charge controller",
      "wind turbine tower gin pole kit",
      "dump load resistor wind solar",
      "deep cycle battery wind off grid",
    ],
    original: "€1,680",
    price: "€1,349",
    savings: "€331",
  },
  {
    id: "pro-dc-power-network",
    source: "awin",
    name: "DC Power Network",
    items: "AC70 station + R600 DC unit + 200W panel + Apex alternator charger hub kit",
    itemQueries: [
      {
        source: "awin",
        brandSlug: "bluetti",
        category: "Energy",
        keywords: ["AC70"],
        keywordsAll: ["Portable", "Power"],
        excludeKeywords: ["refurbished", "+"],
        minPrice: 350,
        match: "cheapest",
      },
      {
        source: "awin",
        brandSlug: "allpowers",
        category: "Energy",
        keywords: ["R600"],
        excludeKeywords: ["refurbished", "+"],
        minPrice: 250,
        match: "cheapest",
      },
      {
        source: "awin",
        brandSlug: "allpowers",
        category: "Energy",
        keywords: ["SP033"],
        keywordsAll: ["200"],
        excludeKeywords: ["refurbished", "+", "kit"],
        minPrice: 150,
        match: "cheapest",
      },
      {
        source: "awin",
        brandSlug: "bluetti",
        category: "Energy",
        keywordsAll: ["Apex 300+Charger 1+Hub D1"],
        excludeKeywords: ["refurbished", "B300", "B500", "2*"],
        minPrice: 2000,
        match: "cheapest",
      },
    ],
    original: "€3,690",
    price: "€2,949",
    savings: "€741",
  },
  {
    id: "pro-wood-heat-cooking",
    source: "amazon",
    name: "Wood Heat & Cooking",
    items: "wood stove + chimney kit + cast iron + firewood tools + carbon monoxide alarm",
    amazonTerms: [
      "portable wood burning stove chimney tent",
      "cast iron dutch oven campfire",
      "log splitter manual wedge",
      "carbon monoxide detector battery",
    ],
    original: "€890",
    price: "€719",
    savings: "€171",
  },
  {
    id: "pro-deep-well-system",
    source: "amazon",
    name: "Deep Well System",
    items: "hand pump + drop pipe + pressure tank + sediment filter",
    amazonTerms: [
      "deep well hand pump pitcher pump",
      "well pump drop pipe kit",
      "off grid water pressure tank",
      "spin down sediment filter well",
    ],
    original: "€1,120",
    price: "€899",
    savings: "€221",
  },
  {
    id: "pro-greywater-reuse",
    source: "amazon",
    name: "Greywater Reuse System",
    items: "diverter + surge tank + filter + garden hose manifold",
    amazonTerms: [
      "greywater recycling system garden",
      "rain barrel diverter kit downspout",
      "greywater filter sand bio",
      "drip irrigation gravity feed",
    ],
    original: "€680",
    price: "€549",
    savings: "€131",
  },
  {
    id: "pro-spring-stream-harvest",
    source: "mixed",
    name: "Spring & Stream Harvesting",
    items: "Water to Go bottles + collection + storage + test strips",
    itemQueries: [
      {
        source: "awin",
        brandSlug: "water-to-go",
        fallback: "brand",
      },
      {
        source: "amazon",
        searchTerms: "spring water collection cistern",
      },
      {
        source: "amazon",
        searchTerms: "water storage IBC tote food grade",
      },
      {
        source: "amazon",
        searchTerms: "coliform bacteria water test kit",
      },
      {
        source: "amazon",
        searchTerms: "gravity water filter ceramic",
      },
    ],
    amazonTerms: ["spring water collection cistern gravity filter"],
    original: "€520",
    price: "€419",
    savings: "€101",
  },
  {
    id: "pro-greenhouse-year-round",
    source: "mixed",
    name: "Greenhouse Year-Round Kit",
    items: "Gardening Naturally partner + polytunnel frame + vents + heaters",
    itemQueries: [
      {
        source: "awin",
        brandSlug: "gardening-naturally",
        fallback: "brand",
      },
      {
        source: "amazon",
        searchTerms: "walk in greenhouse polytunnel kit",
      },
      {
        source: "amazon",
        searchTerms: "greenhouse ventilation auto opener",
      },
      {
        source: "amazon",
        searchTerms: "propane greenhouse heater vented",
      },
      {
        source: "amazon",
        searchTerms: "seed starting heat mat thermostat",
      },
    ],
    amazonTerms: ["walk in greenhouse polytunnel kit"],
    original: "€780",
    price: "€629",
    savings: "€151",
  },
  {
    id: "pro-aquaponics-system",
    source: "amazon",
    name: "Aquaponics System",
    items: "IBC tote + grow bed + pump + biofilter media",
    amazonTerms: [
      "aquaponics kit IBC grow bed",
      "air pump aquaponics commercial",
      "clay pebbles hydroton bulk",
      "tilapia aquaponics starter",
    ],
    original: "€940",
    price: "€749",
    savings: "€191",
  },
  {
    id: "pro-livestock-chickens",
    source: "amazon",
    name: "Livestock Starter — Chickens",
    items: "coop + run + feeder/waterer + brooder + health kit",
    amazonTerms: [
      "backyard chicken coop walk in",
      "automatic chicken feeder waterer",
      "chick brooder heat plate",
      "poultry first aid electrolytes",
    ],
    original: "€720",
    price: "€579",
    savings: "€141",
  },
  {
    id: "pro-livestock-small-ruminants",
    source: "amazon",
    name: "Livestock Starter — Goats/Sheep",
    items: "fencing + shelter + mineral feeder + hoof/health kit",
    amazonTerms: [
      "electric netting fence goats sheep",
      "livestock shelter portable",
      "goat sheep mineral feeder",
      "livestock first aid kit",
    ],
    original: "€1,050",
    price: "€849",
    savings: "€201",
  },
  {
    id: "pro-permaculture-earthworks",
    source: "amazon",
    name: "Permaculture Earthworks",
    items: "swales + pond liner + keyline tools + cover crop seed",
    amazonTerms: [
      "pond liner EPDM 45 mil",
      "A-frame level permaculture swale",
      "broadfork deep tiller",
      "cover crop seed bulk annual rye",
    ],
    original: "€860",
    price: "€689",
    savings: "€171",
  },
  {
    id: "pro-field-surgery-suture",
    source: "amazon",
    name: "Field Surgery & Suture Kit",
    items: "trauma instruments + suture + hemostatic + sterilization",
    amazonTerms: [
      "suture kit surgical instruments medical",
      "hemostatic gauze combat",
      "sterilization tray instruments",
      "wilderness first aid advanced",
    ],
    original: "€480",
    price: "€389",
    savings: "€91",
  },
  {
    id: "pro-prescription-continuity",
    source: "amazon",
    name: "30-Day Prescription Continuity Kit",
    items: "pill organizer + cooling pouch + medical log + backup Rx copy system",
    amazonTerms: [
      "30 day pill organizer medical",
      "insulated medication travel case",
      "medical records organizer fireproof",
      "cooling wallet insulin travel",
    ],
    original: "€320",
    price: "€259",
    savings: "€61",
  },
  {
    id: "pro-dental-emergency",
    source: "amazon",
    name: "Dental Emergency Pro",
    items: "temporary filling + extraction tools + antiseptic + pain management supplies",
    amazonTerms: [
      "dental emergency kit temporary filling",
      "tooth extraction kit survival",
      "oral antiseptic gel emergency",
      "dental mirror probe kit",
    ],
    original: "€210",
    price: "€169",
    savings: "€41",
  },
  {
    id: "pro-perimeter-surveillance",
    source: "amazon",
    name: "Perimeter + Surveillance Pro",
    items: "motion lights + trail cam + door reinforcement + driveway alarm",
    amazonTerms: [
      "solar motion sensor light outdoor security",
      "trail camera cellular no monthly",
      "door security bar reinforcement",
      "driveway alarm wireless sensor",
    ],
    original: "€620",
    price: "€499",
    savings: "€121",
  },
  {
    id: "pro-trauma-response",
    source: "amazon",
    name: "Trauma Response Pro",
    items: "IFAK + tourniquets + chest seals + pressure bandages + litter",
    amazonTerms: [
      "IFAK trauma kit tourniquet",
      "chest seal vented hyfin",
      "pressure bandage israeli type",
      "rescue litter emergency",
    ],
    original: "€540",
    price: "€439",
    savings: "€101",
  },
  {
    id: "pro-reference-library-physical",
    source: "amazon",
    name: "Reference Library — Physical",
    items: "homesteading + medical + repair manuals + maps + notebooks",
    amazonTerms: [
      "encyclopedia country living homesteading",
      "where there is no doctor book",
      "foxfire series survival skills",
      "topographic map local region",
    ],
    original: "€380",
    price: "€309",
    savings: "€71",
  },
  {
    id: "pro-family-document-vault",
    source: "amazon",
    name: "Family Document Vault",
    items: "fireproof bag + safe + Faraday pouch + USB backup",
    amazonTerms: [
      "fireproof document bag legal size",
      "home safe fireproof waterproof",
      "faraday bag laptop phone",
      "encrypted usb backup drive",
    ],
    original: "€450",
    price: "€369",
    savings: "€81",
  },
  {
    id: "pro-bugout-vehicle",
    source: "mixed",
    name: "Bug-Out Vehicle Outfitting",
    items: "hiking boots + bivvy + dry bags + vehicle emergency + camp stove",
    itemQueries: [
      {
        source: "awin",
        brandSlug: "decathlon-ireland",
        category: "Clothing",
        keywords: ["hiking", "boot"],
        minPrice: 40,
        match: "best",
      },
      {
        source: "awin",
        brandSlug: "survival-frog",
        keywords: ["Bivvy"],
        match: "cheapest",
      },
      {
        source: "awin",
        brandSlug: "survival-frog",
        keywords: ["Dry Bag"],
        match: "best",
      },
      {
        source: "awin",
        brandSlug: "survival-frog",
        keywords: ["Campstove"],
        match: "cheapest",
      },
      {
        source: "amazon",
        searchTerms: "vehicle emergency kit get home bag",
      },
      {
        source: "amazon",
        searchTerms: "roof cargo bag waterproof",
      },
      {
        source: "amazon",
        searchTerms: "12V air compressor tire repair",
      },
      {
        source: "amazon",
        searchTerms: "window breaker seatbelt cutter tool",
      },
    ],
    amazonTerms: ["vehicle emergency kit get home bag"],
    original: "€780",
    price: "€629",
    savings: "€151",
  },
]

function normalizeCountry(code: string | null | undefined): string | null {
  if (!code) return null
  const upper = code.trim().toUpperCase()
  if (!upper) return null
  if (upper === "GB") return "UK"
  return upper
}

function productText(product: AwinMarketplaceProduct): string {
  return `${product.product_name} ${product.description ?? ""}`.toLowerCase()
}

function matchesAwinQuery(
  product: AwinMarketplaceProduct,
  query: AwinBundleItemQuery
): boolean {
  if (product.brand_slug !== query.brandSlug) return false
  if (query.category && product.category !== query.category) return false
  if (product.is_store_card) return false

  const text = productText(product)
  if (query.minPrice != null && (product.price ?? 0) < query.minPrice) return false

  if (query.excludeKeywords?.some((kw) => text.includes(kw.toLowerCase()))) {
    return false
  }

  if (query.keywordsAll?.some((kw) => !text.includes(kw.toLowerCase()))) {
    return false
  }

  if (query.keywords?.length) {
    const hit = query.keywords.some((kw) => text.includes(kw.toLowerCase()))
    if (!hit) return false
  }

  return true
}

function preferRegion(
  products: AwinMarketplaceProduct[],
  userCountry: string | null | undefined
): AwinMarketplaceProduct[] {
  const code = normalizeCountry(userCountry)
  if (!code) return products

  return [...products].sort((a, b) => {
    const aMatch = (a.country ?? "").toUpperCase() === code ? 0 : 1
    const bMatch = (b.country ?? "").toUpperCase() === code ? 0 : 1
    return aMatch - bMatch
  })
}

function pickAwinProduct(
  products: AwinMarketplaceProduct[],
  query: AwinBundleItemQuery,
  userCountry?: string | null
): AwinMarketplaceProduct | null {
  const ranked = preferRegion(products, userCountry)
  if (query.match === "cheapest") {
    return ranked.reduce<AwinMarketplaceProduct | null>((best, row) => {
      if (!best) return row
      return (row.price ?? 0) < (best.price ?? 0) ? row : best
    }, null)
  }
  return ranked.reduce<AwinMarketplaceProduct | null>((best, row) => {
    if (!best) return row
    return (row.price ?? 0) > (best.price ?? 0) ? row : best
  }, null)
}

function brandAffiliateUrl(brandSlug: string, userCountry?: string | null): string | null {
  const brand = marketplaceBrands.find((b) => b.id === brandSlug)
  if (!brand) return null
  return resolveAffiliateLink(brand, userCountry).url
}

function resolveAwinItemLink(
  query: AwinBundleItemQuery,
  awinProducts: AwinMarketplaceProduct[],
  userCountry?: string | null
): string | null {
  const matches = awinProducts.filter((p) => matchesAwinQuery(p, query))
  const picked = pickAwinProduct(matches, query, userCountry)
  if (picked?.deep_link) return picked.deep_link

  if (query.fallback === "brand") {
    return brandAffiliateUrl(query.brandSlug, userCountry)
  }

  return null
}

/** Resolve Pro bundle definitions against the live Awin catalog (Pro members only). */
export function resolveProMarketplaceBundles(
  ctx: ResolveProBundlesContext
): MarketplaceBundle[] {
  const { awinProducts, userCountry } = ctx

  return marketplaceBundlesProDefinitions.map((def) => {
    const links: string[] = []

    if (def.source === "amazon") {
      const term = def.amazonTerms?.[0]
      if (term) links.push(amazonSearchUrl(term))
    } else if (def.itemQueries) {
      for (const query of def.itemQueries) {
        if (query.source === "amazon") {
          links.push(amazonSearchUrl(query.searchTerms))
        } else {
          const url = resolveAwinItemLink(query, awinProducts, userCountry)
          if (url) links.push(url)
        }
      }
    }

    const affiliate =
      links[0] ??
      (def.amazonTerms?.[0] ? amazonSearchUrl(def.amazonTerms[0]) : "#")

    return {
      name: def.name,
      items: def.items,
      original: def.original,
      price: def.price,
      savings: def.savings,
      affiliate,
    }
  })
}

export function getBundlesForAccess(
  hasPro: boolean,
  resolvedProBundles: MarketplaceBundle[] = []
): MarketplaceBundle[] {
  if (!hasPro) return marketplaceBundlesFree
  return [...marketplaceBundlesFree, ...resolvedProBundles]
}
