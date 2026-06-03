#!/usr/bin/env node
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const bundlesSrc = readFileSync(join(root, "lib/marketplace-bundles.ts"), "utf8")
const bankSrc = readFileSync(join(root, "lib/quiz-advice-bank.ts"), "utf8")

const bundleIds = new Set(
  [...bundlesSrc.matchAll(/id:\s*"(pro-[^"]+)"/g)].map((m) => m[1])
)

const mappedIds = [
  ...bankSrc.matchAll(/:\s*"(pro-[^"]+)"/g),
].map((m) => m[1])

const uniqueMapped = [...new Set(mappedIds)]
let ok = true
for (const id of uniqueMapped) {
  if (!bundleIds.has(id)) {
    console.log("MISSING bundle definition:", id)
    ok = false
  } else {
    console.log("OK", id, "→", `/marketplace?bundle=${id}`)
  }
}
console.log(ok ? "\nAll mapped Pro bundle IDs exist." : "\nSome IDs missing!")
process.exit(ok ? 0 : 1)
