import { isGoogleHostedImageUrl, sanitizeNewsImageUrl } from "@/lib/news-image-url"
import { OG_IMAGE_BATCH_SIZE, resolveArticleImage } from "@/lib/news-images"
import { createAdminClient } from "@/lib/supabase/admin"

export type NewsImageBackfillSummary = {
  total_rows: number
  processed: number
  with_real_image: number
  null_image: number
  cleared_google_icon: number
  newly_resolved: number
}

export async function runNewsImageUrlBackfill(): Promise<NewsImageBackfillSummary> {
  const admin = createAdminClient()
  const { data: rows, error } = await admin
    .from("news_articles")
    .select("id, source_url, image_url")
    .order("published_at", { ascending: false })

  if (error) throw new Error(error.message)

  const articles = rows ?? []
  let processed = 0
  let cleared_google_icon = 0
  let newly_resolved = 0
  let null_image = 0

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
        console.error(`[news-image-backfill] update failed ${id}:`, updateError.message)
        continue
      }

      processed++
      if (hadGoogle) cleared_google_icon++
      if (resolved && resolved !== previous) newly_resolved++
      if (!resolved) null_image++
    }
  }

  return {
    total_rows: articles.length,
    processed,
    with_real_image: processed - null_image,
    null_image,
    cleared_google_icon,
    newly_resolved,
  }
}
