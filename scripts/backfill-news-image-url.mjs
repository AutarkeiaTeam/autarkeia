/**
 * One-time backfill: re-resolve image_url for all news_articles rows.
 * Clears Google-hosted RSS icons; stores publisher OG images when found.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... npx tsx scripts/backfill-news-image-url.mjs
 */
import { createAdminClient } from "../lib/supabase/admin.ts"
import { resolveArticleImage, OG_IMAGE_BATCH_SIZE } from "../lib/news-images.ts"
import {
  isGoogleHostedImageUrl,
  sanitizeNewsImageUrl,
} from "../lib/news-image-url.ts"

async function main() {
  const admin = createAdminClient()
  const { data: rows, error } = await admin
    .from("news_articles")
    .select("id, source_url, image_url")
    .order("published_at", { ascending: false })

  if (error) throw new Error(error.message)

  const articles = rows ?? []
  let processed = 0
  let cleared_google = 0
  let resolved_new = 0
  let still_null = 0

  for (let i = 0; i < articles.length; i += OG_IMAGE_BATCH_SIZE) {
    const batch = articles.slice(i, i + OG_IMAGE_BATCH_SIZE)
    const results = await Promise.all(
      batch.map(async (row) => {
        const hadGoogle =
          row.image_url != null && isGoogleHostedImageUrl(row.image_url)
        const resolved = sanitizeNewsImageUrl(
          await resolveArticleImage(row.source_url)
        )
        return { id: row.id, hadGoogle, resolved, previous: row.image_url }
      })
    )

    for (const { id, hadGoogle, resolved, previous } of results) {
      const { error: updateError } = await admin
        .from("news_articles")
        .update({ image_url: resolved })
        .eq("id", id)

      if (updateError) {
        console.error(`[backfill] update failed ${id}:`, updateError.message)
        continue
      }

      processed++
      if (hadGoogle) cleared_google++
      if (resolved && resolved !== previous) resolved_new++
      if (!resolved) still_null++
    }
  }

  const with_image = processed - still_null

  console.log(
    JSON.stringify(
      {
        total_rows: articles.length,
        processed,
        with_real_image: with_image,
        null_image: still_null,
        cleared_google_icon: cleared_google,
        newly_resolved: resolved_new,
      },
      null,
      2
    )
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
