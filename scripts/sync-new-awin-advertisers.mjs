/**
 * Sync the 11 new/expanded Awin advertisers (8 feeds + 3 store-cards).
 * Usage: AWIN_DATAFEED_API_KEY=... SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... node scripts/sync-new-awin-advertisers.mjs
 */
import { createRequire } from "module"

const require = createRequire(import.meta.url)

const NEW_ADVERTISER_IDS = [
  38934, // ALLPOWERS International (feed)
  121776, // ALLPOWERS PL (store)
  107468, // ALLPOWERS ES (feed)
  125820, // ALLPOWERS PT (store)
  32271, // Bluetti AU (feed)
  51793, // EcoFlow DE (feed)
  123332, // EcoFlow NL (feed)
  30415, // Jackery DE (feed)
  30413, // Jackery UK (feed)
  110350, // Indevolt DE (feed)
  88995, // BattlBox (store)
]

async function main() {
  const { runMarketplaceSync } = await import("../lib/marketplace-sync.ts")
  const summary = await runMarketplaceSync({ advertiserIds: NEW_ADVERTISER_IDS })
  console.log(JSON.stringify(summary, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
