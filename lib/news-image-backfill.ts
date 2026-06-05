import { isGoogleHostedImageUrl } from "@/lib/news-image-url"
import { initPixabayImageCache } from "@/lib/news-fallback-image"
import { OG_IMAGE_BATCH_SIZE } from "@/lib/news-images"
import { resolveNewsArticleImages } from "@/lib/news-image-resolve"
import { createAdminClient } from "@/lib/supabase/admin"

export type NewsImageBackfillSummary = {
  total_rows: number
  processed: number
  with_real_image: number
  null_image: number
  cleared_google_icon: number
  newly_resolved: number
}

export type NewsPixabayFallbackBackfillSummary = {
  pixabay_rows: number
  nulled_pixabay_urls: number
  processed: number
  newly_resolved: number
  null_after_reresolve: number
}

export async function runNewsImageUrlBackfill(): Promise<NewsImageBackfillSummary> {
  await initPixabayImageCache()
  const admin = createAdminClient()
  const { data: rows, error } = await admin
    .from("news_articles")
    .select(
      "id, source_url, image_url, resolved_url, title_en, topic_query, category"
    )
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
        const resolved = await resolveNewsArticleImages({
          sourceUrl: row.source_url,
          title: row.title_en,
          category: row.category,
          cachedResolvedUrl: row.resolved_url,
        })
        return {
          id: row.id,
          hadGoogle,
          resolved,
          previous: row.image_url,
        }
      })
    )

    for (const { id, hadGoogle, resolved, previous } of results) {
      const { error: updateError } = await admin
        .from("news_articles")
        .update({
          image_url: resolved.image_url,
          image_source: resolved.image_source,
          image_credit_name: resolved.image_credit_name,
          image_credit_url: resolved.image_credit_url,
          resolved_url: resolved.resolved_url,
        })
        .eq("id", id)

      if (updateError) {
        console.error(`[news-image-backfill] update failed ${id}:`, updateError.message)
        continue
      }

      processed++
      if (hadGoogle) cleared_google_icon++
      if (resolved.image_url && resolved.image_url !== previous) newly_resolved++
      if (!resolved.image_url) null_image++
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

/**
 * Re-resolve Pixabay fallbacks only — nulls existing pixabay image_url rows first,
 * leaves publisher OG images untouched.
 */
export async function runNewsPixabayFallbackBackfill(): Promise<NewsPixabayFallbackBackfillSummary> {
  const admin = createAdminClient()

  const { data: pixabayRows, error: fetchError } = await admin
    .from("news_articles")
    .select("id, source_url, image_url, resolved_url, title_en, category")
    .eq("image_source", "pixabay")
    .order("published_at", { ascending: false })

  if (fetchError) throw new Error(fetchError.message)

  const rows = pixabayRows ?? []
  const previousUrls = new Map(rows.map((row) => [row.id, row.image_url]))

  const { error: nullError } = await admin
    .from("news_articles")
    .update({
      image_url: null,
      image_credit_name: null,
      image_credit_url: null,
    })
    .eq("image_source", "pixabay")

  if (nullError) throw new Error(nullError.message)

  await initPixabayImageCache()

  let processed = 0
  let newly_resolved = 0
  let null_after_reresolve = 0

  for (let i = 0; i < rows.length; i += OG_IMAGE_BATCH_SIZE) {
    const batch = rows.slice(i, i + OG_IMAGE_BATCH_SIZE)
    const results = await Promise.all(
      batch.map(async (row) => {
        const resolved = await resolveNewsArticleImages({
          sourceUrl: row.source_url,
          title: row.title_en,
          category: row.category,
          cachedResolvedUrl: row.resolved_url,
          pixabayOnly: true,
        })
        return {
          id: row.id,
          resolved,
          previous: previousUrls.get(row.id) ?? null,
        }
      })
    )

    for (const { id, resolved, previous } of results) {
      const { error: updateError } = await admin
        .from("news_articles")
        .update({
          image_url: resolved.image_url,
          image_source: resolved.image_source,
          image_credit_name: resolved.image_credit_name,
          image_credit_url: resolved.image_credit_url,
          resolved_url: resolved.resolved_url,
        })
        .eq("id", id)

      if (updateError) {
        console.error(
          `[news-pixabay-backfill] update failed ${id}:`,
          updateError.message
        )
        continue
      }

      processed++
      if (resolved.image_url && resolved.image_url !== previous) newly_resolved++
      if (!resolved.image_url) null_after_reresolve++
    }
  }

  return {
    pixabay_rows: rows.length,
    nulled_pixabay_urls: rows.length,
    processed,
    newly_resolved,
    null_after_reresolve,
  }
}
