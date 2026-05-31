import {
  MARKETPLACE_FILTER_CATEGORIES,
  MARKETPLACE_PRO_ONLY_CATEGORIES,
  type MarketplaceCategory,
} from "@/lib/marketplace-data"

const ALL_CATEGORIES: MarketplaceCategory[] = [
  ...MARKETPLACE_FILTER_CATEGORIES,
  ...MARKETPLACE_PRO_ONLY_CATEGORIES,
]

const CATEGORY_KEYWORDS: Record<MarketplaceCategory, string[]> = {
  Water: ["water", "filter", "purif", "hydration", "bottle", "jerrycan", "rain", "filtration"],
  Food: ["food", "seed", "garden", "grow", "organic", "compost", "preserv", "grain", "nutrition", "sprout"],
  Shelter: ["shelter", "tent", "sleeping", "tarps", "insulation", "camping", "outdoor living", "canopy"],
  Energy: [
    "solar",
    "battery",
    "power station",
    "generator",
    "inverter",
    "panel",
    "bluetti",
    "allpowers",
    "charge",
    "portable power",
    "lifepo4",
    "ac outlet",
    "watt",
    "kwh",
    "mppt",
  ],
  Medical: ["medical", "first aid", "health", "hygiene", "sanit", "bandage"],
  Tools: ["tool", "knife", "axe", "shovel", "multitool", "hardware", "workshop", "drill"],
  Clothing: ["clothing", "jacket", "boots", "apparel", "wear", "fleece", "rainwear", "gloves"],
  Security: ["security", "lock", "alarm", "survival", "emergency", "preparedness", "defense", "prepper"],
  Communications: ["radio", "communication", "antenna", "satellite", "signal", "walkie"],
  Navigation: ["navigation", "compass", "map", "gps", "headlamp", "torch", "flashlight", "lantern"],
  "Garden & Harvest": [
    "seed",
    "garden",
    "greenhouse",
    "compost",
    "canning",
    "preserv",
    "sprout",
    "hydroponic",
    "harvest",
    "planter",
    "irrigation",
    "ferment",
  ],
  "Air Quality": [
    "dehumid",
    "humid",
    "air quality",
    "moisture",
    "dry air",
    "crawlspace",
    "basement",
    "mould",
    "mold",
    "ventilation fan",
  ],
}

/** Match Awin merchant_category paths and Google-style feed segments first. */
const FEED_PATH_RULES: { test: RegExp; category: MarketplaceCategory }[] = [
  { test: /solar|power station|generator|battery|inverter|energy|portable power/i, category: "Energy" },
  { test: /dehumid|humidifier|air quality|moisture|hvac|ventilation/i, category: "Air Quality" },
  { test: /water filter|filtration|hydration|purif/i, category: "Water" },
  { test: /tent|sleeping bag|shelter|camping|outdoor(?!.*wear)/i, category: "Shelter" },
  { test: /first aid|medical|health/i, category: "Medical" },
  { test: /seed|garden|grow your own|organic pest/i, category: "Food" },
  { test: /survival|emergency|preparedness|prepper/i, category: "Security" },
  { test: /flashlight|torch|lantern|headlamp/i, category: "Navigation" },
  { test: /knife|tool|multitool|axe/i, category: "Tools" },
  { test: /jacket|boots|clothing|apparel|wear/i, category: "Clothing" },
  { test: /radio|communication/i, category: "Communications" },
]

export function mapAwinProductCategory(
  feedCategory: string,
  productName: string,
  description: string
): MarketplaceCategory {
  const pathHaystack = feedCategory.toLowerCase()
  for (const rule of FEED_PATH_RULES) {
    if (rule.test.test(pathHaystack)) return rule.category
  }

  const haystack = `${feedCategory} ${productName} ${description}`.toLowerCase()

  let best: MarketplaceCategory = "Energy"
  let bestScore = 0

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [
    MarketplaceCategory,
    string[],
  ][]) {
    let score = 0
    for (const kw of keywords) {
      if (haystack.includes(kw)) score += 1
    }
    if (score > bestScore) {
      bestScore = score
      best = category
    }
  }

  if (bestScore === 0) {
    if (/electronic|tech|computer|phone/i.test(haystack)) return "Tools"
    if (/sport|fitness|bike/i.test(haystack)) return "Clothing"
    return "Tools"
  }

  return best
}

/** Coerce stored DB category to a valid marketplace chip (handles legacy sync values). */
export function normalizeMarketplaceCategory(
  raw: string,
  productName = "",
  description = ""
): MarketplaceCategory {
  const trimmed = raw?.trim() ?? ""
  if (ALL_CATEGORIES.includes(trimmed as MarketplaceCategory)) {
    return trimmed as MarketplaceCategory
  }
  return mapAwinProductCategory(trimmed, productName, description)
}

export const PREPAREDNESS_KEYWORD_WHITELIST = [
  "solar",
  "generator",
  "battery",
  "power station",
  "water filter",
  "filter bottle",
  "dehumidifier",
  "tent",
  "sleeping bag",
  "backpack",
  "knife",
  "first aid",
  "flashlight",
  "torch",
  "lantern",
  "emergency",
  "survival",
  "off-grid",
  "off grid",
  "seeds",
  "garden",
  "water storage",
  "camping",
  "hiking",
  "outdoor",
  "purification",
  "portable power",
  "solar panel",
  "power bank",
  "rain jacket",
  "boots",
  "rope",
  "paracord",
  "stove",
  "cookset",
  "ferro",
  "fire starter",
  "water bottle",
  "filtration",
]

export function matchesKeywordWhitelist(
  productName: string,
  description: string,
  keywords: string[]
): boolean {
  const haystack = `${productName} ${description}`.toLowerCase()
  return keywords.some((kw) => haystack.includes(kw.toLowerCase()))
}
