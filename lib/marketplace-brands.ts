export type AffiliateLink = { country: string; url: string }

export type BrandCategory =
  | "power"
  | "outdoor"
  | "gardening"
  | "water"
  | "air-quality"
  | "preparedness"

export type Brand = {
  id: string
  name: string
  description: string
  category: BrandCategory
  logoUrl?: string
  links: AffiliateLink[]
}

export const MARKETPLACE_CATEGORY_ORDER: BrandCategory[] = [
  "power",
  "outdoor",
  "gardening",
  "water",
  "air-quality",
  "preparedness",
]

export const MARKETPLACE_CATEGORY_LABELS: Record<BrandCategory, string> = {
  power: "Power",
  outdoor: "Outdoor",
  gardening: "Gardening",
  water: "Water",
  "air-quality": "Air Quality",
  preparedness: "Preparedness",
}

const AFFILIATE_FALLBACK_ORDER = ["US", "UK", "IE", "DE", "IT", "NL", "CA", "Global"] as const

export const marketplaceBrands: Brand[] = [
  {
    id: "allpowers",
    name: "ALLPOWERS",
    description:
      "Portable solar panels and power stations for off-grid backup and everyday outdoor power.",
    category: "power",
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
  },
  {
    id: "bluetti",
    name: "Bluetti",
    description:
      "Expandable portable power stations and solar kits for home backup and van-life resilience.",
    category: "power",
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
  },
  {
    id: "alorair",
    name: "AlorAir",
    description:
      "Commercial-grade dehumidifiers and drying equipment to protect buildings from moisture damage.",
    category: "air-quality",
    links: [
      {
        country: "Global",
        url: "https://www.awin1.com/cread.php?awinmid=124284&awinaffid=2900523&ued=https%3A%2F%2Fthedryair.com%2F",
      },
    ],
  },
  {
    id: "alorair-crawlspace",
    name: "AlorAir Crawlspace",
    description:
      "Dedicated crawlspace and basement dehumidification systems for long-term structural health.",
    category: "air-quality",
    links: [
      {
        country: "Global",
        url: "https://www.awin1.com/cread.php?awinmid=104549&awinaffid=2900523&ued=https%3A%2F%2Faloraircrawlspace.com%2F",
      },
    ],
  },
  {
    id: "brisks-outdoors",
    name: "Brisks Outdoors",
    description:
      "UK outdoor and adventure gear for camping, hiking, and time spent off the beaten path.",
    category: "outdoor",
    links: [
      {
        country: "UK",
        url: "https://www.awin1.com/cread.php?awinmid=112976&awinaffid=2900523&ued=https%3A%2F%2Fbrisks.co.uk%2F",
      },
    ],
  },
  {
    id: "decathlon-ireland",
    name: "Decathlon Ireland",
    description:
      "Affordable outdoor, sports, and camping equipment from Ireland’s go-to active lifestyle retailer.",
    category: "outdoor",
    links: [
      {
        country: "IE",
        url: "https://www.awin1.com/cread.php?awinmid=37550&awinaffid=2900523&ued=https%3A%2F%2Fwww.decathlon.ie%2F",
      },
    ],
  },
  {
    id: "gardening-naturally",
    name: "Gardening Naturally",
    description:
      "Organic pest control, seeds, and supplies for chemical-free food growing at home.",
    category: "gardening",
    links: [
      {
        country: "UK",
        url: "https://www.awin1.com/cread.php?awinmid=122646&awinaffid=2900523&ued=https%3A%2F%2Fgardening-naturally.com%2F",
      },
    ],
  },
  {
    id: "survival-frog",
    name: "Survival Frog",
    description:
      "US preparedness gear — emergency kits, shelter, lighting, and supplies for shelter-in-place scenarios.",
    category: "preparedness",
    links: [
      {
        country: "US",
        url: "https://www.awin1.com/cread.php?awinmid=88727&awinaffid=2900523&ued=https%3A%2F%2Fwww.survivalfrog.com%2F",
      },
    ],
  },
  {
    id: "water-to-go",
    name: "Water to Go",
    description:
      "Filtered water bottles and purification systems for travel, hiking, and unreliable water sources.",
    category: "water",
    links: [
      {
        country: "Global",
        url: "https://www.awin1.com/cread.php?awinmid=86997&awinaffid=2900523&ued=https%3A%2F%2Fwatertogo.eu%2F",
      },
    ],
  },
]

export const BRAND_PLACEHOLDER_COLORS: Record<string, string> = {
  allpowers: "#d97706",
  bluetti: "#2563eb",
  alorair: "#0891b2",
  "alorair-crawlspace": "#0e7490",
  "brisks-outdoors": "#15803d",
  "decathlon-ireland": "#4f46e5",
  "gardening-naturally": "#65a30d",
  "survival-frog": "#b45309",
  "water-to-go": "#0284c7",
}

export function getBrandInitials(name: string): string {
  const words = name.replace(/[^a-zA-Z0-9\s]/g, "").trim().split(/\s+/)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
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

export function countryDisplayLabel(country: string): string {
  const labels: Record<string, string> = {
    US: "United States",
    UK: "United Kingdom",
    IE: "Ireland",
    DE: "Germany",
    IT: "Italy",
    NL: "Netherlands",
    CA: "Canada",
    Global: "Global store",
  }
  return labels[country] ?? country
}

export function countryFlagEmoji(country: string): string {
  if (country === "Global") return "🌍"
  if (country.length !== 2) return "🏳️"
  const code =
    country === "UK"
      ? "GB"
      : country
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 - 65 + c.charCodeAt(0))
  )
}

export function countBrandsByCategory(
  brands: Brand[],
  category: BrandCategory | "all"
): number {
  if (category === "all") return brands.length
  return brands.filter((b) => b.category === category).length
}
