import type { MarketplaceCategory } from "@/lib/marketplace-data"

const CATEGORY_KEYWORDS: Record<MarketplaceCategory, string[]> = {
  Water: ["water", "filter", "purif", "hydration", "bottle", "jerrycan", "rain"],
  Food: ["food", "seed", "garden", "grow", "organic", "compost", "preserv", "grain", "nutrition"],
  Shelter: ["shelter", "tent", "sleeping", "tarps", "insulation", "camping", "outdoor living"],
  Energy: ["solar", "battery", "power station", "generator", "inverter", "panel", "bluetti", "allpowers", "charge"],
  Medical: ["medical", "first aid", "health", "hygiene", "sanit"],
  Tools: ["tool", "knife", "axe", "shovel", "multitool", "hardware", "workshop"],
  Clothing: ["clothing", "jacket", "boots", "apparel", "wear", "fleece", "rainwear"],
  Security: ["security", "lock", "alarm", "survival", "emergency", "preparedness", "defense"],
  Communications: ["radio", "communication", "antenna", "satellite", "signal"],
  Navigation: ["navigation", "compass", "map", "gps"],
  "Air Quality": ["dehumid", "humid", "air quality", "moisture", "dry air", "crawlspace", "basement"],
}

export function mapAwinProductCategory(
  feedCategory: string,
  productName: string,
  description: string
): MarketplaceCategory {
  const haystack = `${feedCategory} ${productName} ${description}`.toLowerCase()

  let best: MarketplaceCategory = "Tools"
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

  return best
}

export const PREPAREDNESS_KEYWORD_WHITELIST = [
  "solar",
  "generator",
  "battery",
  "power station",
  "water filter",
  "filter bottle",
  "dehydrator",
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
