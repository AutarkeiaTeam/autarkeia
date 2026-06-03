#!/usr/bin/env node
/**
 * Prints fallback + enrich-style samples (pool[0] inline) and beyond/bundle summary.
 * Run: npx tsx scripts/print-quiz-enriched-samples.mjs  (preferred)
 * Or this file mirrors week-slot + product[0] logic without TS import.
 */
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { execFileSync } from "child_process"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

const script = `
import { buildScoreAwareFallback, enrichQuizAdviceWithBankProducts } from './lib/quiz-advice-bank.ts'
import { getQuizConfig } from './lib/quiz-data.ts'
import { scoreQuiz } from './lib/quiz-scoring.ts'

const scenarios = [
  { label: 'LOW SS 22', quiz: 'self-sufficiency', score: 22,
    scores: { Food: 8, Water: 12, Energy: 18, Shelter: 20, Skills: 25 } },
  { label: 'MID ER 50', quiz: 'emergency-readiness', score: 50,
    scores: { Water: 30, Food: 45, Medical: 35, Power: 55, Communication: 60 } },
  { label: 'HIGH SS 88', quiz: 'self-sufficiency', score: 88,
    scores: { Food: 90, Water: 92, Energy: 70, Shelter: 72, Skills: 95 } },
]

for (const s of scenarios) {
  const cats = getQuizConfig(s.quiz).categories
  const fb = buildScoreAwareFallback({ quizType: s.quiz, locale: 'en', overallScore: s.score, categoryScores: s.scores, orderedCategories: cats })
  const haikuPlan = { week: fb.action_plan.week.map(a => ({ ...a, title: '[Haiku] ' + a.title, linked_product: undefined })), month: fb.action_plan.month, year: fb.action_plan.year }
  const enriched = enrichQuizAdviceWithBankProducts({ quizType: s.quiz, locale: 'en', overallScore: s.score, categoryScores: s.scores, orderedCategories: cats, action_plan: haikuPlan })
  console.log('\\n' + '='.repeat(70))
  console.log(s.label, '| FALLBACK week inline:')
  fb.action_plan.week.forEach((a,i) => console.log(\`  \${i+1}. \${a.title} → \${a.linked_product?.name}\`))
  console.log('HAIKU+ENRICH week inline:')
  enriched.action_plan.week.forEach((a,i) => console.log(\`  \${i+1}. \${a.title} → \${a.linked_product?.name}\`))
  console.log('Beyond:', enriched.product_recommendations.map(p => p.name).join(' | '))
  console.log('Pro bundles:', (enriched.pro_bundle_upsells||[]).map(b => b.href).join(', '))
}

const mid = scenarios[1]
const cats = getQuizConfig(mid.quiz).categories
const midOut = buildScoreAwareFallback({ quizType: mid.quiz, locale: 'en', overallScore: mid.score, categoryScores: mid.scores, orderedCategories: cats })
console.log('\\n--- FREE vs PRO (MID ER 50) ---')
console.log('FREE: ', midOut.product_recommendations.length, 'beyond cards, upsell link /plans')
console.log('PRO: ', midOut.product_recommendations.length, 'beyond +', (midOut.pro_bundle_upsells||[]).length, 'bundles:')
;(midOut.pro_bundle_upsells||[]).forEach(b => console.log(' ', b.name, '→', b.href))
`

try {
  execFileSync("npx", ["tsx", "-e", script], { cwd: root, stdio: "inherit" })
} catch {
  console.log("tsx unavailable — run: npx tsx scripts/print-quiz-enriched-samples.mjs")
  process.exit(1)
}
