#!/usr/bin/env node
/**
 * Standalone sample printer (no tsx) — mirrors buildScoreAwareFallback week slice.
 */
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const en = JSON.parse(readFileSync(join(root, "locales/en.json"), "utf8"))
const es = JSON.parse(readFileSync(join(root, "locales/es.json"), "utf8"))
const overrideSrc = readFileSync(
  join(root, "lib/quiz-advice-product-overrides.ts"),
  "utf8"
)
const OVERRIDES = Object.fromEntries(
  [...overrideSrc.matchAll(/"(quiz\.advice\.action\.[^"]+)":\s*"(quiz\.advice\.product\.[^"]+)"/g)].map(
    (m) => [m[1], m[2]]
  )
)

const BANDS = ["foundational", "intermediate", "advanced", "refinement"]
const HORIZON_SLOTS = {
  week: [
    { cat: "w1", band: "primary", slot: 0 },
    { cat: "w2", band: "primary", slot: 0 },
    { cat: "w1", band: "neighbor", slot: 0 },
  ],
}

function bandFromScore(score) {
  if (score <= 30) return "foundational"
  if (score <= 65) return "intermediate"
  if (score <= 90) return "advanced"
  return "refinement"
}

function neighborBand(band) {
  const i = BANDS.indexOf(band)
  if (i > 0) return BANDS[i - 1]
  if (i < BANDS.length - 1) return BANDS[i + 1]
  return band
}

function rank(scores, order) {
  return [...order].sort((a, b) => (scores[a] ?? 0) - (scores[b] ?? 0))
}

function actionKey(quiz, band, cat, hz, n) {
  return `quiz.advice.action.${quiz}.${band}.${cat.toLowerCase()}.${hz}.${n}.title`
}

function productKey(quiz, band, cat, n) {
  return `quiz.advice.product.${quiz}.${band}.${cat.toLowerCase()}.${n}.name`
}

function resolveProduct(quiz, band, cat, hz, actionTitleKey) {
  if (OVERRIDES[actionTitleKey]) {
    const ok = OVERRIDES[actionTitleKey]
    for (const b of BANDS) {
      const k = `quiz.advice.product.${quiz}.${b}.${cat.toLowerCase()}.${ok.split(".").pop().replace(".name", "")}`
      // find by full name key
      if (en[ok]) return ok
    }
    return OVERRIDES[actionTitleKey]
  }
  const n = actionTitleKey.match(/\.(\d)\.title$/)?.[1] ?? "1"
  return productKey(quiz, band, cat, n)
}

function weekSample(label, quiz, score, scores, order, locale) {
  const dict = locale === "es" ? es : en
  const band = bandFromScore(score)
  const ranked = rank(scores, order)
  const w1 = ranked[0]
  const w2 = ranked[1] ?? w1
  const nb = neighborBand(band)
  console.log(`\n${"=".repeat(70)}\n${label} (${locale.toUpperCase()})\n${"=".repeat(70)}`)
  HORIZON_SLOTS.week.forEach((slot, i) => {
    const cat = slot.cat === "w1" ? w1 : w2
    const b = slot.band === "primary" ? band : nb
    const n = slot.slot + 1
    const ak = actionKey(quiz, b, cat, "week", n)
    const pk = resolveProduct(quiz, b, cat, "week", ak)
    console.log(`${i + 1}. ${dict[ak]}`)
    console.log(`   → ${dict[pk]}`)
  })
}

const scenarios = [
  ["LOW — SS 22", "self-sufficiency", 22, { Food: 8, Water: 12, Energy: 18, Shelter: 20, Skills: 25 }, ["Food", "Water", "Energy", "Shelter", "Skills"]],
  ["MID — ER 50", "emergency-readiness", 50, { Water: 30, Food: 45, Medical: 35, Power: 55, Communication: 60 }, ["Water", "Food", "Medical", "Power", "Communication"]],
  ["HIGH — SS 88", "self-sufficiency", 88, { Food: 90, Water: 92, Energy: 70, Shelter: 72, Skills: 95 }, ["Food", "Water", "Energy", "Shelter", "Skills"]],
]

for (const [label, quiz, score, catScores, order] of scenarios) {
  weekSample(label, quiz, score, catScores, order, "en")
  weekSample(label, quiz, score, catScores, order, "es")
}

console.log("\n--- Beyond + Pro (MID / ER 50, EN) ---")
console.log("Deeper products: picked from PRODUCT_BANK excluding 9 inline nameKeys (see live API).")
console.log("Pro bundles (weakest Water + Medical): pro-deep-well-system, pro-trauma-response")
console.log("\nFREE view: 4–6 product cards + link to /plans")
console.log("PRO view: same products + 2 bundle cards → /marketplace?bundle=...")
