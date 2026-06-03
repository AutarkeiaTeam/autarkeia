import fs from "fs"
import path from "path"

const root = path.resolve(import.meta.dirname, "..")
const en = JSON.parse(fs.readFileSync(path.join(root, "locales/en.json"), "utf8"))

const QUIZ_TYPES = ["self-sufficiency", "emergency-readiness"]
const BANDS = ["foundational", "intermediate", "advanced", "refinement"]
const HORIZONS = ["week", "month", "year"]
const CATEGORIES = {
  "self-sufficiency": ["food", "water", "energy", "shelter", "skills"],
  "emergency-readiness": ["water", "food", "medical", "power", "communication"],
}

const PRODUCT_PRICES = {
  foundational: ["€35", "€55", "€28"],
  intermediate: ["€120", "€180", "€95"],
  advanced: ["€320", "€480", "€260"],
  refinement: ["€26", "€34", "€22"],
}

function autoProductKey(actionTitleKey) {
  const m = actionTitleKey.match(
    /^quiz\.advice\.action\.(self-sufficiency|emergency-readiness)\.(foundational|intermediate|advanced|refinement)\.([a-z]+)\.(week|month|year)\.(\d)\.title$/
  )
  if (!m) return null
  const [, quiz, band, cat, , n] = m
  return `quiz.advice.product.${quiz}.${band}.${cat}.${n}.name`
}

function scoreMismatch(actionTitle, actionCost, productName, horizon, band) {
  const reasons = []
  const costLow =
    /^€0/.test(actionCost) ||
    actionCost === "€10-50" ||
    actionCost === "€20-80" ||
    actionCost === "€30-100"
  const productBandPrice = (() => {
    const m = actionTitle.match(/quiz\.advice\.action\.[^.]+\.(foundational|intermediate|advanced|refinement)\./)
    return m ? m[1] : band
  })()

  const title = actionTitle.toLowerCase()
  const product = productName.toLowerCase()

  if (costLow && /kit|station|system|hub|canner|solar|whole-home|trauma|advanced/.test(product)) {
    reasons.push("low-cost-action-heavy-product")
  }

  if (
    /radio|antenna|hand-crank|walkie|two-way|receiver|alert/.test(title) ||
    /communication tree|check-in|message fallback|no-internet/.test(title)
  ) {
    if (/radio|hand-crank|crank/.test(title) && !/radio/.test(product)) {
      reasons.push("communication-radio")
    }
    if (/communication tree|contact|check-in/.test(title) && /radio|walkie|two-way/.test(product)) {
      reasons.push("communication-planning-vs-radio")
    }
    if (/message fallback|no-internet|template/.test(title) && /radio|walkie/.test(product)) {
      reasons.push("communication-templates-vs-radio")
    }
  }

  if (horizon === "year" && /starter|jerry can|basic|first |simple /.test(product)) {
    reasons.push("year-action-starter-product")
  }

  if (horizon === "year" && /calendar|audit|document|protocol|governance|review/.test(title)) {
    if (/kit|stove|can|filter|container/.test(product) && !/monitor|vault|reference|document/.test(product)) {
      reasons.push("year-abstract-action-concrete-product")
    }
  }

  if (/refinement/.test(actionTitle) && /audit|review|document|calibrat|optimi|governance/.test(title)) {
    if (/kit|stove|filter|can/.test(product)) {
      reasons.push("refinement-abstract")
    }
  }

  if (/water target|calculate|inventory|audit your pantry|list what/.test(title)) {
    if (/filter|purification kit|canner|stove/.test(product) && !/container|storage|label/.test(product)) {
      reasons.push("planning-action-gear-product")
    }
  }

  if (/skills/.test(actionTitle) && /food|water|energy|solar/.test(product)) {
    reasons.push("skills-category-wrong-product-theme")
  }

  return reasons
}

const actions = Object.keys(en).filter((k) => k.endsWith(".title") && k.includes("quiz.advice.action."))
const candidates = []

for (const titleKey of actions) {
  const productKey = autoProductKey(titleKey)
  if (!productKey || !en[productKey]) continue
  const descKey = titleKey.replace(".title", ".description")
  const m = titleKey.match(
    /\.(week|month|year)\.(\d)\.title$/
  )
  const horizon = m[1]
  const costKey = titleKey
    .replace("quiz.advice.action.", "")
    .replace(/\.(week|month|year)\.\d\.title$/, "")
  // derive cost from bank pattern - read description only, get cost from embedded structure
  const parts = titleKey.match(
    /^quiz\.advice\.action\.(self-sufficiency|emergency-readiness)\.(foundational|intermediate|advanced|refinement)\.([a-z]+)\.(week|month|year)\.(\d)\.title$/
  )
  if (!parts) continue
  const [, quiz, band, cat, hz, n] = parts
  const costs = {
    foundational: { week: ["€0-60", "€20-90", "€15-70"], month: ["€60-180", "€45-140", "€40-130"], year: ["€120-420", "€90-320", "€60-260"] },
    intermediate: { week: ["€70-220", "€80-260", "€60-180"], month: ["€140-420", "€110-360", "€90-320"], year: ["€260-900", "€200-700", "€160-550"] },
    advanced: { week: ["€160-500", "€180-600", "€140-420"], month: ["€450-1600", "€380-1400", "€300-1100"], year: ["€1200-5000", "€900-3800", "€700-3200"] },
    refinement: { week: ["€20-80", "€30-100", "€10-50"], month: ["€50-180", "€40-160", "€30-140"], year: ["€100-350", "€30-120", "€20-90"] },
  }
  const cost = costs[band][hz][Number(n) - 1]
  const reasons = scoreMismatch(en[titleKey], cost, en[productKey], hz, band)
  if (reasons.length) {
    candidates.push({
      titleKey,
      productKey,
      action: en[titleKey],
      product: en[productKey],
      horizon: hz,
      band,
      cost,
      reasons,
    })
  }
}

console.log("Candidates:", candidates.length)
for (const c of candidates) {
  console.log("\n---")
  console.log(c.reasons.join(", "))
  console.log("ACTION:", c.action)
  console.log("AUTO PRODUCT:", c.product)
  console.log(c.titleKey, "->", c.productKey)
}
