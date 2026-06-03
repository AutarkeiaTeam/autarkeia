/**
 * Re-sync all Awin advertisers that have a product datafeed (cap 500 per feed).
 * Usage: AWIN_DATAFEED_API_KEY=... SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... npx tsx scripts/sync-feed-backed-advertisers.mjs
 */
export const FEED_BACKED_ADVERTISER_IDS = [
  30413, // Jackery UK
  30415, // Jackery DE
  32269, // Bluetti CA
  32271, // Bluetti AU
  37550, // Decathlon Ireland
  38934, // ALLPOWERS International
  40342, // ALLPOWERS US
  51793, // EcoFlow DE
  59271, // Bluetti US
  88727, // Survival Frog
  107466, // ALLPOWERS IT
  107468, // ALLPOWERS ES
  110350, // Indevolt DE
  123332, // EcoFlow NL
]

async function main() {
  const { runMarketplaceSync } = await import("../lib/marketplace-sync.ts")
  const summary = await runMarketplaceSync({
    advertiserIds: FEED_BACKED_ADVERTISER_IDS,
  })
  console.log(JSON.stringify(summary, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
