#!/usr/bin/env node
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const en = JSON.parse(readFileSync(join(root, "locales/en.json"), "utf8"))
const es = JSON.parse(readFileSync(join(root, "locales/es.json"), "utf8"))
const overrides = (
  await import(join(root, "lib/quiz-advice-product-overrides.ts"))
).QUIZ_ADVICE_PRODUCT_OVERRIDES

console.log(`Final override list: ${Object.keys(overrides).length} entries\n`)
let i = 0
for (const [titleKey, productKey] of Object.entries(overrides)) {
  i++
  console.log(`${i}. EN action: ${en[titleKey]}`)
  console.log(`   ES action: ${es[titleKey]}`)
  console.log(`   EN product: ${en[productKey]}`)
  console.log(`   ES product: ${es[productKey]}`)
  console.log("")
}
