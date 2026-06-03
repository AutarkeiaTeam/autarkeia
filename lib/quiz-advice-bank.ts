import { translate, type Locale } from "@/lib/i18n-core"
import { marketplaceBundlesProDefinitions } from "@/lib/marketplace-bundles"
import { QUIZ_ADVICE_PRODUCT_OVERRIDES } from "@/lib/quiz-advice-product-overrides"
import type {
  LinkedProductRecommendation,
  ProBundleUpsell,
  QuizResult,
  QuizType,
} from "@/lib/quiz-data"

export type AdviceBand = "foundational" | "intermediate" | "advanced" | "refinement"
export type AdvicePriority = "high" | "medium" | "low"
export type AdviceHorizon = "week" | "month" | "year"

export type AdviceItem = {
  titleKey: string
  descriptionKey: string
  cost: string
  priority: AdvicePriority
  tags: string[]
}

export type ProductItem = {
  nameKey: string
  whyKey: string
  price: string
  tags: string[]
}

type CategoryPool<T> = Record<string, T[]>
type ActionBandPool = Record<string, Record<AdviceHorizon, AdviceItem[]>>
type ProductBandPool = CategoryPool<ProductItem>

export type ActionBank = Record<QuizType, Record<AdviceBand, ActionBandPool>>
export type ProductBank = Record<QuizType, Record<AdviceBand, ProductBandPool>>

const BANDS: AdviceBand[] = ["foundational", "intermediate", "advanced", "refinement"]
const HORIZONS: AdviceHorizon[] = ["week", "month", "year"]

const QUIZ_CATEGORIES: Record<QuizType, string[]> = {
  "self-sufficiency": ["Food", "Water", "Energy", "Shelter", "Skills"],
  "emergency-readiness": ["Water", "Food", "Medical", "Power", "Communication"],
}

const TAGS_BY_CATEGORY: Record<string, string[]> = {
  Food: ["food", "storage", "resilience"],
  Water: ["water", "purification", "redundancy"],
  Energy: ["energy", "integration", "maintenance"],
  Shelter: ["shelter", "resilience", "documentation"],
  Skills: ["skills", "continuity", "family"],
  Medical: ["medical", "trauma", "readiness"],
  Power: ["power", "redundancy", "logistics"],
  Communication: ["communication", "coordination", "protocols"],
  General: ["resilience", "continuity", "documentation"],
}

const PRIORITIES_BY_BAND: Record<AdviceBand, AdvicePriority[]> = {
  foundational: ["high", "high", "medium"],
  intermediate: ["high", "medium", "medium"],
  advanced: ["high", "high", "medium"],
  refinement: ["medium", "medium", "low"],
}

const COSTS_BY_BAND_AND_HORIZON: Record<AdviceBand, Record<AdviceHorizon, string[]>> = {
  foundational: {
    week: ["€0-60", "€20-90", "€15-70"],
    month: ["€60-180", "€45-140", "€40-130"],
    year: ["€120-420", "€90-320", "€60-260"],
  },
  intermediate: {
    week: ["€70-220", "€80-260", "€60-180"],
    month: ["€140-420", "€110-360", "€90-320"],
    year: ["€260-900", "€200-700", "€160-550"],
  },
  advanced: {
    week: ["€160-500", "€180-600", "€140-420"],
    month: ["€450-1600", "€380-1400", "€300-1100"],
    year: ["€1200-5000", "€900-3800", "€700-3200"],
  },
  refinement: {
    week: ["€20-80", "€30-100", "€10-50"],
    month: ["€50-180", "€40-160", "€30-140"],
    year: ["€100-350", "€30-120", "€20-90"],
  },
}

const PRODUCT_PRICES_BY_BAND: Record<AdviceBand, string[]> = {
  foundational: ["€35", "€55", "€28"],
  intermediate: ["€120", "€180", "€95"],
  advanced: ["€320", "€480", "€260"],
  refinement: ["€26", "€34", "€22"],
}

function normalizeCategory(category: string): string {
  return category.toLowerCase()
}

function keyBase(quizType: QuizType, band: AdviceBand, category: string): string {
  return `${quizType}.${band}.${normalizeCategory(category)}`
}

function createActionPool(
  quizType: QuizType,
  band: AdviceBand,
  category: string
): Record<AdviceHorizon, AdviceItem[]> {
  const base = keyBase(quizType, band, category)
  return {
    week: [1, 2, 3].map((n, idx) => ({
      titleKey: `quiz.advice.action.${base}.week.${n}.title`,
      descriptionKey: `quiz.advice.action.${base}.week.${n}.description`,
      cost: COSTS_BY_BAND_AND_HORIZON[band].week[idx],
      priority: PRIORITIES_BY_BAND[band][idx],
      tags: TAGS_BY_CATEGORY[category] ?? TAGS_BY_CATEGORY.General,
    })),
    month: [1, 2, 3].map((n, idx) => ({
      titleKey: `quiz.advice.action.${base}.month.${n}.title`,
      descriptionKey: `quiz.advice.action.${base}.month.${n}.description`,
      cost: COSTS_BY_BAND_AND_HORIZON[band].month[idx],
      priority: PRIORITIES_BY_BAND[band][idx],
      tags: TAGS_BY_CATEGORY[category] ?? TAGS_BY_CATEGORY.General,
    })),
    year: [1, 2, 3].map((n, idx) => ({
      titleKey: `quiz.advice.action.${base}.year.${n}.title`,
      descriptionKey: `quiz.advice.action.${base}.year.${n}.description`,
      cost: COSTS_BY_BAND_AND_HORIZON[band].year[idx],
      priority: PRIORITIES_BY_BAND[band][idx],
      tags: TAGS_BY_CATEGORY[category] ?? TAGS_BY_CATEGORY.General,
    })),
  }
}

function createProductPool(quizType: QuizType, band: AdviceBand, category: string): ProductItem[] {
  const base = keyBase(quizType, band, category)
  return [1, 2, 3].map((n, idx) => ({
    nameKey: `quiz.advice.product.${base}.${n}.name`,
    whyKey: `quiz.advice.product.${base}.${n}.why`,
    price: PRODUCT_PRICES_BY_BAND[band][idx],
    tags: TAGS_BY_CATEGORY[category] ?? TAGS_BY_CATEGORY.General,
  }))
}

export const ACTION_BANK: ActionBank = {
  "self-sufficiency": Object.fromEntries(
    BANDS.map((band) => [
      band,
      Object.fromEntries(
        QUIZ_CATEGORIES["self-sufficiency"].map((category) => [
          category,
          createActionPool("self-sufficiency", band, category),
        ])
      ),
    ])
  ) as Record<AdviceBand, ActionBandPool>,
  "emergency-readiness": Object.fromEntries(
    BANDS.map((band) => [
      band,
      Object.fromEntries(
        QUIZ_CATEGORIES["emergency-readiness"].map((category) => [
          category,
          createActionPool("emergency-readiness", band, category),
        ])
      ),
    ])
  ) as Record<AdviceBand, ActionBandPool>,
}

export const PRODUCT_BANK: ProductBank = {
  "self-sufficiency": Object.fromEntries(
    BANDS.map((band) => [
      band,
      Object.fromEntries(
        QUIZ_CATEGORIES["self-sufficiency"].map((category) => [
          category,
          createProductPool("self-sufficiency", band, category),
        ])
      ),
    ])
  ) as Record<AdviceBand, ProductBandPool>,
  "emergency-readiness": Object.fromEntries(
    BANDS.map((band) => [
      band,
      Object.fromEntries(
        QUIZ_CATEGORIES["emergency-readiness"].map((category) => [
          category,
          createProductPool("emergency-readiness", band, category),
        ])
      ),
    ])
  ) as Record<AdviceBand, ProductBandPool>,
}

export function bandFromScore(score: number): AdviceBand {
  if (score <= 30) return "foundational"
  if (score <= 65) return "intermediate"
  if (score <= 90) return "advanced"
  return "refinement"
}

function bandNeighbors(band: AdviceBand): AdviceBand[] {
  const idx = BANDS.indexOf(band)
  const prev = idx > 0 ? BANDS[idx - 1] : undefined
  const next = idx < BANDS.length - 1 ? BANDS[idx + 1] : undefined
  return [band, prev, next].filter(Boolean) as AdviceBand[]
}

/** Adjacent band for variety (underflow toward foundational, overflow toward refinement). */
function neighborBandForVariety(band: AdviceBand): AdviceBand {
  const idx = BANDS.indexOf(band)
  if (idx > 0) return BANDS[idx - 1]
  if (idx < BANDS.length - 1) return BANDS[idx + 1]
  return band
}

function pickOneAction(
  quizType: QuizType,
  band: AdviceBand,
  category: string,
  horizon: AdviceHorizon,
  startIndex: number,
  used: Set<string>
): AdviceItem | undefined {
  const pool = poolForAction(quizType, band, category, horizon)
  for (let i = startIndex; i < pool.length; i++) {
    const item = pool[i]
    if (!used.has(item.titleKey)) {
      used.add(item.titleKey)
      return item
    }
  }
  for (const item of pool) {
    if (!used.has(item.titleKey)) {
      used.add(item.titleKey)
      return item
    }
  }
  return undefined
}

function pickOneProduct(
  quizType: QuizType,
  band: AdviceBand,
  category: string,
  startIndex: number,
  used: Set<string>
): ProductItem | undefined {
  const pool = poolForProduct(quizType, band, category)
  for (let i = startIndex; i < pool.length; i++) {
    const item = pool[i]
    if (!used.has(item.nameKey)) {
      used.add(item.nameKey)
      return item
    }
  }
  for (const item of pool) {
    if (!used.has(item.nameKey)) {
      used.add(item.nameKey)
      return item
    }
  }
  return undefined
}

const HORIZON_ACTION_SLOTS: Record<
  AdviceHorizon,
  { category: "weakest1" | "weakest2"; band: "primary" | "neighbor"; slot: number }[]
> = {
  week: [
    { category: "weakest1", band: "primary", slot: 0 },
    { category: "weakest2", band: "primary", slot: 0 },
    { category: "weakest1", band: "neighbor", slot: 0 },
  ],
  month: [
    { category: "weakest2", band: "primary", slot: 0 },
    { category: "weakest1", band: "primary", slot: 1 },
    { category: "weakest2", band: "neighbor", slot: 1 },
  ],
  year: [
    { category: "weakest1", band: "primary", slot: 1 },
    { category: "weakest2", band: "primary", slot: 1 },
    { category: "weakest1", band: "neighbor", slot: 2 },
  ],
}

function pickUnique<T>(items: T[], n: number, keyFn: (item: T) => string): T[] {
  const seen = new Set<string>()
  const out: T[] = []
  for (const item of items) {
    const key = keyFn(item)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
    if (out.length >= n) break
  }
  return out
}

function poolForAction(
  quizType: QuizType,
  band: AdviceBand,
  category: string,
  horizon: AdviceHorizon
): AdviceItem[] {
  return ACTION_BANK[quizType][band][category]?.[horizon] ?? []
}

function poolForProduct(quizType: QuizType, band: AdviceBand, category: string): ProductItem[] {
  return PRODUCT_BANK[quizType][band][category] ?? []
}

function findProductByNameKey(
  quizType: QuizType,
  category: string,
  nameKey: string
): ProductItem | undefined {
  for (const band of BANDS) {
    const found = poolForProduct(quizType, band, category).find((p) => p.nameKey === nameKey)
    if (found) return found
  }
  return undefined
}

function actionIndexInPool(
  quizType: QuizType,
  band: AdviceBand,
  category: string,
  horizon: AdviceHorizon,
  action: AdviceItem
): number {
  const pool = poolForAction(quizType, band, category, horizon)
  const idx = pool.findIndex((a) => a.titleKey === action.titleKey)
  return idx >= 0 ? idx : 0
}

export function resolveLinkedProduct(
  quizType: QuizType,
  band: AdviceBand,
  category: string,
  horizon: AdviceHorizon,
  action: AdviceItem
): ProductItem | null {
  const overrideNameKey = QUIZ_ADVICE_PRODUCT_OVERRIDES[action.titleKey]
  if (overrideNameKey) {
    const overridden = findProductByNameKey(quizType, category, overrideNameKey)
    if (overridden) return overridden
  }

  const pool = poolForProduct(quizType, band, category)
  const idx = actionIndexInPool(quizType, band, category, horizon, action)
  return pool[idx] ?? pool[0] ?? null
}

const PRIMARY_BUNDLE_BY_CATEGORY: Record<string, string> = {
  Food: "pro-pantry-one-year",
  Water: "pro-deep-well-system",
  Energy: "pro-whole-house-solar",
  Shelter: "pro-homestead-foundation",
  Skills: "pro-reference-library-physical",
  Medical: "pro-trauma-response",
  Power: "pro-dc-power-network",
  Communication: "pro-family-document-vault",
}

const SECONDARY_BUNDLE_BY_CATEGORY: Record<string, string> = {
  Food: "pro-seed-library-two-year",
  Water: "pro-greywater-reuse",
  Energy: "pro-wind-turbine-kit",
  Shelter: "pro-greenhouse-year-round",
  Skills: "pro-family-document-vault",
  Medical: "pro-prescription-continuity",
  Power: "pro-wood-heat-cooking",
  Communication: "pro-perimeter-surveillance",
}

function proBundlesForWeakest(weakest1: string, weakest2: string): ProBundleUpsell[] {
  const ids: string[] = []
  const primary = PRIMARY_BUNDLE_BY_CATEGORY[weakest1]
  const secondary = SECONDARY_BUNDLE_BY_CATEGORY[weakest2]
  if (primary) ids.push(primary)
  if (secondary && secondary !== primary) ids.push(secondary)
  if (ids.length < 2) {
    const alt = PRIMARY_BUNDLE_BY_CATEGORY[weakest2]
    if (alt && !ids.includes(alt)) ids.push(alt)
  }

  return [...new Set(ids)]
    .slice(0, 2)
    .map((id) => {
      const def = marketplaceBundlesProDefinitions.find((b) => b.id === id)
      if (!def) return null
      return {
        id: def.id,
        name: def.name,
        items: def.items,
        price: def.price,
        href: `/marketplace?bundle=${def.id}`,
      }
    })
    .filter((b): b is ProBundleUpsell => b !== null)
}

function localizedLinkedProduct(
  locale: Locale,
  item: ProductItem
): LinkedProductRecommendation {
  return {
    name: translate(locale, item.nameKey),
    why: translate(locale, item.whyKey),
    estimated_price: item.price,
  }
}

function localizedAction(
  locale: Locale,
  item: AdviceItem,
  linked: ProductItem | null
): QuizResult["action_plan"]["week"][number] {
  return {
    title: translate(locale, item.titleKey),
    description: translate(locale, item.descriptionKey),
    estimated_cost: item.cost,
    priority: item.priority,
    linked_product: linked ? localizedLinkedProduct(locale, linked) : null,
  }
}

function localizedProduct(
  locale: Locale,
  category: string,
  item: ProductItem
): QuizResult["product_recommendations"][number] {
  return {
    category: translate(locale, `quiz.advice.tag.${normalizeCategory(category)}`),
    name: translate(locale, item.nameKey),
    why: translate(locale, item.whyKey),
    estimated_price: item.price,
  }
}

function rankWeakestCategories(
  categoryScores: Record<string, number>,
  orderedCategories: string[]
): string[] {
  return [...orderedCategories].sort((a, b) => {
    const delta = (categoryScores[a] ?? 0) - (categoryScores[b] ?? 0)
    if (delta !== 0) return delta
    return orderedCategories.indexOf(a) - orderedCategories.indexOf(b)
  })
}

export function buildScoreAwareFallback(options: {
  quizType: QuizType
  locale: Locale
  overallScore: number
  categoryScores: Record<string, number>
  orderedCategories: string[]
}): Pick<QuizResult, "action_plan" | "product_recommendations" | "pro_bundle_upsells"> {
  const { quizType, locale, overallScore, categoryScores, orderedCategories } = options
  const band = bandFromScore(overallScore)
  const ranked = rankWeakestCategories(categoryScores, orderedCategories)
  const weakest1 = ranked[0] ?? orderedCategories[0]
  const weakest2 = ranked[1] ?? orderedCategories[1] ?? weakest1

  const actionPlan: QuizResult["action_plan"] = {
    week: [],
    month: [],
    year: [],
  }

  const neighborBand = neighborBandForVariety(band)
  const inlineProductNameKeys = new Set<string>()

  type PickedAction = { item: AdviceItem; band: AdviceBand; category: string }

  for (const horizon of HORIZONS) {
    const used = new Set<string>()
    const selected: PickedAction[] = []
    for (const slot of HORIZON_ACTION_SLOTS[horizon]) {
      const category = slot.category === "weakest1" ? weakest1 : weakest2
      const slotBand = slot.band === "primary" ? band : neighborBand
      const item = pickOneAction(quizType, slotBand, category, horizon, slot.slot, used)
      if (item) selected.push({ item, band: slotBand, category })
    }
    if (selected.length < 3) {
      const fallback = pickUnique(
        poolForAction(quizType, band, weakest1, horizon),
        3 - selected.length,
        (item) => item.titleKey
      )
      for (const item of fallback) {
        if (!used.has(item.titleKey)) {
          used.add(item.titleKey)
          selected.push({ item, band, category: weakest1 })
        }
      }
    }
    actionPlan[horizon] = selected.map(({ item, band: actionBand, category }) => {
      const linked = resolveLinkedProduct(quizType, actionBand, category, horizon, item)
      if (linked) inlineProductNameKeys.add(linked.nameKey)
      return localizedAction(locale, item, linked)
    })
  }

  const usedProducts = new Set(inlineProductNameKeys)
  const selectedProducts: Array<{ item: ProductItem; category: string }> = []
  const productSlots: { category: string; band: AdviceBand; slot: number }[] = [
    { category: weakest1, band, slot: 0 },
    { category: weakest1, band, slot: 1 },
    { category: weakest2, band, slot: 0 },
    { category: weakest2, band, slot: 1 },
    { category: weakest1, band: neighborBand, slot: 0 },
    { category: weakest1, band: neighborBand, slot: 1 },
    { category: weakest2, band: neighborBand, slot: 0 },
    { category: weakest2, band: neighborBand, slot: 1 },
  ]
  for (const { category, band: slotBand, slot } of productSlots) {
    if (selectedProducts.length >= 6) break
    const pool = poolForProduct(quizType, slotBand, category)
    for (let i = slot; i < pool.length; i++) {
      const item = pool[i]
      if (usedProducts.has(item.nameKey)) continue
      usedProducts.add(item.nameKey)
      selectedProducts.push({ item, category })
      break
    }
    for (const item of pool) {
      if (selectedProducts.length >= 6) break
      if (usedProducts.has(item.nameKey)) continue
      usedProducts.add(item.nameKey)
      selectedProducts.push({ item, category })
    }
  }

  return {
    action_plan: actionPlan,
    product_recommendations: selectedProducts
      .slice(0, 6)
      .map((entry) =>
        localizedProduct(
          locale,
          entry.category === "General" ? weakest1 : entry.category,
          entry.item
        )
      ),
    pro_bundle_upsells: proBundlesForWeakest(weakest1, weakest2),
  }
}

