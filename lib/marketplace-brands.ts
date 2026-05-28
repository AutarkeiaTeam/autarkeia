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

const DEFAULT_MAX = 100

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

/** @deprecated Use getAwinSellerDisplayNames */
export function getAwinSellerNames(): string[] {
  return getAwinSellerDisplayNames()
}

const AFFILIATE_FALLBACK_ORDER = ["US", "UK", "IE", "DE", "IT", "NL", "CA", "Global"] as const

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

  for (const fallback of AFFILIATE_FALLBACK_ORDER) {
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
