/**
 * One-time backfill: re-resolve image_url for all news_articles rows.
 * Clears Google-hosted RSS icons; stores publisher OG images when found.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... npx tsx scripts/backfill-news-image-url.mjs
 */
import { runPublisherOgBackfill } from "../lib/news-image-backfill.ts"

async function main() {
  const summary = await runPublisherOgBackfill()
  console.log(JSON.stringify(summary, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
