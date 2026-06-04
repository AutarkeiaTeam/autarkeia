import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { legalEn, legalEs } from "./legal-locale-data.mjs"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")

function mergeLocale(file, additions) {
  const p = path.join(root, "locales", file)
  const data = JSON.parse(fs.readFileSync(p, "utf8"))
  Object.assign(data, additions)
  const sorted = Object.fromEntries(Object.keys(data).sort().map((k) => [k, data[k]]))
  fs.writeFileSync(p, JSON.stringify(sorted, null, 2) + "\n")
}

mergeLocale("en.json", legalEn)
mergeLocale("es.json", legalEs)

const en = JSON.parse(fs.readFileSync(path.join(root, "locales/en.json"), "utf8"))
const es = JSON.parse(fs.readFileSync(path.join(root, "locales/es.json"), "utf8"))
const enKeys = Object.keys(en)
const esKeys = Object.keys(es)
const onlyEn = enKeys.filter((k) => !(k in es))
const onlyEs = esKeys.filter((k) => !(k in en))
const legalOnly = (k) =>
  k.startsWith("terms.") ||
  k.startsWith("refund_policy.") ||
  k.startsWith("privacy.") ||
  k === "footer.refund_policy" ||
  k === "footer.privacy_policy" ||
  k === "plans.guarantee_badge"

console.log("Legal keys EN:", enKeys.filter(legalOnly).length)
console.log("Legal keys ES:", esKeys.filter(legalOnly).length)
if (onlyEn.length) console.log("Only in EN:", onlyEn.filter(legalOnly))
if (onlyEs.length) console.log("Only in ES:", onlyEs.filter(legalOnly))
if (!onlyEn.filter(legalOnly).length && !onlyEs.filter(legalOnly).length) {
  console.log("Legal i18n parity OK")
}
