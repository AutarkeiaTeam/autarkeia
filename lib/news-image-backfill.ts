import { OG_IMAGE_BATCH_SIZE } from "@/lib/news-images"
import { resolveNewsArticleImages } from "@/lib/news-image-resolve"
import { createAdminClient } from "@/lib/supabase/admin"

export type PublisherOgBackfillSummary = {
  processed: number
  recovered_with_og: number
  deleted_no_image: number
  kept_publisher: number
}

/**
 * Re-run publisher image resolution for every row.
 * Recover missing images, delete rows that still have no publisher hero.
 */
export async function runPublisherOgBackfill(): Promise<PublisherOgBackfillSummary> {
  const admin = createAdminClient()
  const { data: rows, error } = await admin
    .from("news_articles")
    .select("id, source_url, image_url, image_source, resolved_url, title_en")
    .order("published_at", { ascending: false })

  if (error) throw new Error(error.message)

  const articles = rows ?? []
  let processed = 0
  let recovered_with_og = 0
  let deleted_no_image = 0
  let kept_publisher = 0

  for (let i = 0; i < articles.length; i += OG_IMAGE_BATCH_SIZE) {
    const batch = articles.slice(i, i + OG_IMAGE_BATCH_SIZE)
    const results = await Promise.all(
      batch.map(async (row) => {
        const wasPublisher =
          row.image_source === "publisher" && row.image_url != null
        const resolved = await resolveNewsArticleImages({
          sourceUrl: row.source_url,
          title: row.title_en,
          cachedResolvedUrl: row.resolved_url,
        })
        return { row, wasPublisher, resolved }
      })
    )

    for (const { row, wasPublisher, resolved } of results) {
      processed++

      if (!resolved.image_url) {
        const { error: deleteError } = await admin
          .from("news_articles")
          .delete()
          .eq("id", row.id)

        if (deleteError) {
          console.error(
            `[news-image-backfill] delete failed ${row.id}:`,
            deleteError.message
          )
          continue
        }

        deleted_no_image++
        continue
      }

      const { error: updateError } = await admin
        .from("news_articles")
        .update({
          image_url: resolved.image_url,
          image_source: "publisher",
          image_credit_name: resolved.image_credit_name,
          image_credit_url: resolved.image_credit_url,
          resolved_url: resolved.resolved_url,
        })
        .eq("id", row.id)

      if (updateError) {
        console.error(
          `[news-image-backfill] update failed ${row.id}:`,
          updateError.message
        )
        continue
      }

      if (wasPublisher) {
        kept_publisher++
      } else {
        recovered_with_og++
      }
    }
  }

  return {
    processed,
    recovered_with_og,
    deleted_no_image,
    kept_publisher,
  }
}
