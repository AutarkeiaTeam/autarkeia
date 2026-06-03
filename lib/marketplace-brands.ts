import { PREPAREDNESS_KEYWORD_WHITELIST } from "@/lib/marketplace-category-map"
import type { MarketplaceCategory } from "@/lib/marketplace-data"

export type AffiliateLink = { country: string; url: string }

export type ProductFilterConfig = {
  includeAll?: boolean
  keywordWhitelist?: string[]
  maxItems?: number
}

export type BrandFeed = {
  advertiserId: number
  country: string
}

export type Brand = {
  id: string
  name: string
  /** Shown in seller filter and product cards (defaults to name). */
  displayName?: string
  description: string
  /** Primary marketplace category for store-card fallback rows. */
  primaryCategory: MarketplaceCategory
  logoUrl?: string
  links: AffiliateLink[]
  feeds: BrandFeed[]
  productFilter: ProductFilterConfig
}

const COUNTRY_SUFFIX_RE =
  /\s+(Ireland|UK|United Kingdom|US|USA|DE|Germany|IT|Italy|NL|Netherlands|CA|Canada|Global)$/i

export function stripAdvertiserCountrySuffix(name: string): string {
  const stripped = name.replace(COUNTRY_SUFFIX_RE, "").trim()
  return stripped || name
}

export function getBrandDisplayName(brand: Pick<Brand, "name" | "displayName">): string {
  return brand.displayName?.trim() || stripAdvertiserCountrySuffix(brand.name)
}

export function resolveAdvertiserDisplayName(
  brandSlug: string,
  rawAdvertiserName: string
): string {
  const brand = marketplaceBrands.find((b) => b.id === brandSlug)
  if (brand) return getBrandDisplayName(brand)
  return stripAdvertiserCountrySuffix(rawAdvertiserName)
}

export function extractAwinAdvertiserId(url: string): number | null {
  const match = url.match(/awinmid=(\d+)/)
  return match ? Number(match[1]) : null
}

function feedsFromLinks(links: AffiliateLink[]): BrandFeed[] {
  return links
    .map((link) => ({
      advertiserId: extractAwinAdvertiserId(link.url),
      country: link.country,
    }))
    .filter((f): f is BrandFeed => f.advertiserId != null)
}

/** Max SKUs imported per Awin advertiser feed (feed-backed brands only). */
export const FEED_BACKED_ADVERTISER_IDS = [
  30413, // Jackery UK
  30415, // Jackery DE
  32269, // Bluetti CA
  32271, // Bluetti AU
  37550, // Decathlon Ireland
  38934, // ALLPOWERS International
  40342, // ALLPOWERS US
  51793, // EcoFlow DE
  59271, // Bluetti US
  88727, // Survival Frog
  107466, // ALLPOWERS IT
  107468, // ALLPOWERS ES
  110350, // Indevolt DE
  123332, // EcoFlow NL
] as const

const DEFAULT_MAX = 500

export const marketplaceBrands: Brand[] = [
  {
    id: "allpowers",
    name: "ALLPOWERS",
    primaryCategory: "Energy",
    description:
      "Portable solar panels and power stations for off-grid backup and everyday outdoor power.",
    links: [
      {
        country: "US",
        url: "https://www.awin1.com/cread.php?awinmid=40342&awinaffid=2900523&ued=https%3A%2F%2Fiallpowers.com%2F",
      },
      {
        country: "DE",
        url: "https://www.awin1.com/cread.php?awinmid=67914&awinaffid=2900523&ued=https%3A%2F%2Fwww.iallpowers.de%2F",
      },
      {
        country: "IT",
        url: "https://www.awin1.com/cread.php?awinmid=107466&awinaffid=2900523&ued=https%3A%2F%2Fiallpowers.it%2F",
      },
      {
        country: "NL",
        url: "https://www.awin1.com/cread.php?awinmid=125964&awinaffid=2900523&ued=https%3A%2F%2Fiallpowers.nl%2F",
      },
      {
        country: "EU",
        url: "https://www.awin1.com/cread.php?awinmid=38934&awinaffid=2900523&ued=https%3A%2F%2Fiallpowers.eu%2F%3Futm_source%3Daw",
      },
      {
        country: "PL",
        url: "https://www.awin1.com/cread.php?awinmid=121776&awinaffid=2900523&ued=https%3A%2F%2Fallpowers.com.pl%2Fpl-ie",
      },
      {
        country: "ES",
        url: "https://www.awin1.com/cread.php?awinmid=107468&awinaffid=2900523&ued=https%3A%2F%2Fiallpowers.es%2F",
      },
      {
        country: "PT",
        url: "https://www.awin1.com/cread.php?awinmid=125820&awinaffid=2900523&ued=https%3A%2F%2Fallpowers-pt.com%2F",
      },
    ],
    feeds: [],
    productFilter: { includeAll: true, maxItems: DEFAULT_MAX },
  },
  {
    id: "bluetti",
    name: "Bluetti",
    primaryCategory: "Energy",
    description:
      "Expandable portable power stations and solar kits for home backup and van-life resilience.",
    links: [
      {
        country: "US",
        url: "https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2900523&ued=https%3A%2F%2Fwww.bluettipower.com%2F",
      },
      {
        country: "CA",
        url: "https://www.awin1.com/cread.php?awinmid=32269&awinaffid=2900523&ued=https%3A%2F%2Fwww.bluettipower.ca%2F",
      },
      {
        country: "AU",
        url: "https://www.awin1.com/cread.php?awinmid=32271&awinaffid=2900523&ued=https%3A%2F%2Fwww.bluettipower.com.au%2F",
      },
    ],
    feeds: [],
    productFilter: { includeAll: true, maxItems: DEFAULT_MAX },
  },
  {
    id: "ecoflow",
    name: "EcoFlow",
    displayName: "EcoFlow",
    primaryCategory: "Energy",
    description:
      "Portable power stations and expandable solar setups for home backup, van-life, and off-grid resilience.",
    links: [
      {
        country: "DE",
        url: "https://www.awin1.com/cread.php?awinmid=51793&awinaffid=2900523&ued=https%3A%2F%2Fde.ecoflow.com%2F",
      },
      {
        country: "NL",
        url: "https://www.awin1.com/cread.php?awinmid=123332&awinaffid=2900523&ued=https%3A%2F%2Fnl.ecoflow.com%2F",
      },
    ],
    feeds: [],
    productFilter: { includeAll: true, maxItems: DEFAULT_MAX },
  },
  {
    id: "jackery",
    name: "Jackery",
    displayName: "Jackery",
    primaryCategory: "Energy",
    description:
      "Lightweight portable power stations for camping, RV travel, and outdoor backup when the grid isn't available.",
    links: [
      {
        country: "DE",
        url: "https://www.awin1.com/cread.php?awinmid=30415&awinaffid=2900523&ued=https%3A%2F%2Fde.jackery.com%2F",
      },
      {
        country: "UK",
        url: "https://www.awin1.com/cread.php?awinmid=30413&awinaffid=2900523&ued=https%3A%2F%2Fuk.jackery.com%2F",
      },
    ],
    feeds: [],
    productFilter: { includeAll: true, maxItems: DEFAULT_MAX },
  },
  {
    id: "indevolt",
    name: "Indevolt",
    displayName: "Indevolt",
    primaryCategory: "Energy",
    description:
      "German-engineered home battery storage and solar integration for backup power and everyday energy independence.",
    links: [
      {
        country: "DE",
        url: "https://www.awin1.com/cread.php?awinmid=110350&awinaffid=2900523&ued=https%3A%2F%2Fde.indevolt.com%2F",
      },
    ],
    feeds: [],
    productFilter: { includeAll: true, maxItems: DEFAULT_MAX },
  },
  {
    id: "battlbox",
    name: "BattlBox",
    displayName: "BattlBox",
    primaryCategory: "Security",
    description:
      "Monthly subscription boxes of curated preparedness and outdoor gear — preparedness tools, survival supplies, and self-reliance essentials on a delivery schedule.",
    links: [
      {
        country: "US",
        url: "https://www.awin1.com/cread.php?awinmid=88995&awinaffid=2900523&ued=https%3A%2F%2Fglobal.battlbox.com%2F%3FredirectFrom%3Dusa-store",
      },
    ],
    feeds: [],
    productFilter: { includeAll: true, maxItems: DEFAULT_MAX },
  },
  {
    id: "alorair",
    name: "AlorAir",
    primaryCategory: "Air Quality",
    description:
      "Commercial-grade dehumidifiers and drying equipment to protect buildings from moisture damage.",
    links: [
      {
        country: "Global",
        url: "https://www.awin1.com/cread.php?awinmid=124284&awinaffid=2900523&ued=https%3A%2F%2Fthedryair.com%2F",
      },
    ],
    feeds: [],
    productFilter: { includeAll: true, maxItems: DEFAULT_MAX },
  },
  {
    id: "alorair-crawlspace",
    name: "AlorAir Crawlspace",
    primaryCategory: "Air Quality",
    description:
      "Dedicated crawlspace and basement dehumidification systems for long-term structural health.",
    links: [
      {
        country: "Global",
        url: "https://www.awin1.com/cread.php?awinmid=104549&awinaffid=2900523&ued=https%3A%2F%2Faloraircrawlspace.com%2F",
      },
    ],
    feeds: [],
    productFilter: { includeAll: true, maxItems: DEFAULT_MAX },
  },
  {
    id: "brisks-outdoors",
    name: "Brisks Outdoors",
    primaryCategory: "Clothing",
    description:
      "UK outdoor and adventure gear for camping, hiking, and time spent off the beaten path.",
    links: [
      {
        country: "UK",
        url: "https://www.awin1.com/cread.php?awinmid=112976&awinaffid=2900523&ued=https%3A%2F%2Fbrisks.co.uk%2F",
      },
    ],
    feeds: [],
    productFilter: { includeAll: true, maxItems: DEFAULT_MAX },
  },
  {
    id: "decathlon-ireland",
    name: "Decathlon Ireland",
    displayName: "Decathlon",
    primaryCategory: "Tools",
    description:
      "Affordable outdoor, sports, and camping equipment from Ireland’s go-to active lifestyle retailer.",
    links: [
      {
        country: "IE",
        url: "https://www.awin1.com/cread.php?awinmid=37550&awinaffid=2900523&ued=https%3A%2F%2Fwww.decathlon.ie%2F",
      },
    ],
    feeds: [],
    productFilter: {
      keywordWhitelist: PREPAREDNESS_KEYWORD_WHITELIST,
      maxItems: DEFAULT_MAX,
    },
  },
  {
    id: "gardening-naturally",
    name: "Gardening Naturally",
    primaryCategory: "Food",
    description:
      "Organic pest control, seeds, and supplies for chemical-free food growing at home.",
    links: [
      {
        country: "UK",
        url: "https://www.awin1.com/cread.php?awinmid=122646&awinaffid=2900523&ued=https%3A%2F%2Fgardening-naturally.com%2F",
      },
    ],
    feeds: [],
    productFilter: { includeAll: true, maxItems: DEFAULT_MAX },
  },
  {
    id: "survival-frog",
    name: "Survival Frog",
    primaryCategory: "Security",
    description:
      "US preparedness gear — emergency kits, shelter, lighting, and supplies for shelter-in-place scenarios.",
    links: [
      {
        country: "US",
        url: "https://www.awin1.com/cread.php?awinmid=88727&awinaffid=2900523&ued=https%3A%2F%2Fwww.survivalfrog.com%2F",
      },
    ],
    feeds: [],
    productFilter: {
      keywordWhitelist: PREPAREDNESS_KEYWORD_WHITELIST,
      maxItems: DEFAULT_MAX,
    },
  },
  {
    id: "water-to-go",
    name: "Water to Go",
    primaryCategory: "Water",
    description:
      "Filtered water bottles and purification systems for travel, hiking, and unreliable water sources.",
    links: [
      {
        country: "Global",
        url: "https://www.awin1.com/cread.php?awinmid=86997&awinaffid=2900523&ued=https%3A%2F%2Fwatertogo.eu%2F",
      },
    ],
    feeds: [],
    productFilter: { includeAll: true, maxItems: DEFAULT_MAX },
  },
].map((brand) => ({
  ...brand,
  feeds: feedsFromLinks(brand.links),
}))

export type MarketplaceSyncTarget = {
  brandSlug: string
  brandName: string
  displayName: string
  brandDescription: string
  affiliateUrl: string
  primaryCategory: MarketplaceCategory
  advertiserId: number
  country: string
  productFilter: ProductFilterConfig
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return marketplaceBrands.find((b) => b.id === slug)
}

export function getMarketplaceSyncTargets(): MarketplaceSyncTarget[] {
  const targets: MarketplaceSyncTarget[] = []
  for (const brand of marketplaceBrands) {
    for (const feed of brand.feeds) {
      const affiliateUrl =
        brand.links.find((l) => l.country === feed.country)?.url ?? brand.links[0]?.url
      if (!affiliateUrl) continue

      targets.push({
        brandSlug: brand.id,
        brandName: brand.name,
        displayName: getBrandDisplayName(brand),
        brandDescription: brand.description,
        affiliateUrl,
        primaryCategory: brand.primaryCategory ?? "Tools",
        advertiserId: feed.advertiserId,
        country: feed.country,
        productFilter: brand.productFilter,
      })
    }
  }
  return targets
}

export function getAwinSellerDisplayNames(): string[] {
  return marketplaceBrands.map((b) => getBrandDisplayName(b))
}

export function getMarketplaceBrandDescriptionKey(brandSlug: string): string {
  return `marketplace.brands.${brandSlug}.description`
}

/** @deprecated Use getAwinSellerDisplayNames */
export function getAwinSellerNames(): string[] {
  return getAwinSellerDisplayNames()
}

const AFFILIATE_FALLBACK_ORDER = ["US", "UK", "IE", "DE", "IT", "NL", "CA", "Global"] as const

/** Per-brand regional link priority (first match wins after direct country hit). */
const BRAND_LINK_PRIORITY: Partial<Record<string, readonly string[]>> = {
  allpowers: ["US", "IT", "PL", "ES", "PT", "EU", "DE", "NL", "CA", "Global"],
  bluetti: ["US", "CA", "AU", "UK", "DE", "Global"],
  ecoflow: ["DE", "NL", "EU", "Global"],
  jackery: ["DE", "UK", "US", "Global"],
  indevolt: ["DE"],
  battlbox: ["US", "Global"],
}

export type ResolvedAffiliateLink = { url: string; country: string }

export function resolveAffiliateLink(
  brand: Brand,
  userCountry: string | null | undefined
): ResolvedAffiliateLink {
  const code = normalizeCountryForLinks(userCountry)
  const byCountry = new Map(
    brand.links.map((link) => [link.country.toUpperCase(), link] as const)
  )

  if (code) {
    const direct = byCountry.get(code)
    if (direct) return { url: direct.url, country: direct.country }
  }

  const priority = BRAND_LINK_PRIORITY[brand.id] ?? AFFILIATE_FALLBACK_ORDER
  for (const fallback of priority) {
    const match = byCountry.get(fallback)
    if (match) return { url: match.url, country: match.country }
  }

  const first = brand.links[0]
  return { url: first.url, country: first.country }
}

function normalizeCountryForLinks(code: string | null | undefined): string | null {
  if (!code) return null
  const upper = code.trim().toUpperCase()
  if (!upper) return null
  if (upper === "GB") return "UK"
  return upper
}
