import { createAdminClient } from "@/lib/supabase/admin"
import { processArticleWithHaiku } from "@/lib/news-ai"
import { NEWS_FEEDS } from "@/lib/news-feeds"
import { enrichCandidatesWithOgImages } from "@/lib/news-images"
import { fetchNewsFeedItems } from "@/lib/news-rss"
import {
  isDuplicateOfAny,
  NEWS_TITLE_DEDUP_HOURS,
} from "@/lib/news-title-similarity"
import {
  NEWS_CANDIDATE_CAP,
  NEWS_GLOBAL_RELEVANCE_MIN,
  NEWS_HARD_CAP,
  NEWS_RETENTION_DAYS,
  type NewsSyncSummary,
  type ParsedRssItem,
} from "@/lib/news-types"

export function verifyNewsCron(request: Request): boolean {
  if (request.headers.get("x-vercel-cron") === "1") return true
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = request.headers.get("authorization")
  if (auth === `Bearer ${secret}`) return true
  return request.headers.get("x-cron-secret") === secret
}

/** First-level dedup: unique source_url within the merged RSS batch. */
function dedupeCandidates(items: ParsedRssItem[]): ParsedRssItem[] {
  const seen = new Set<string>()
  const out: ParsedRssItem[] = []
  for (const item of items) {
    if (seen.has(item.source_url)) continue
    seen.add(item.source_url)
    out.push(item)
  }
  return out
}

/** Second-level dedup: skip candidates whose title matches a recent DB title or earlier candidate. */
function dedupeCandidatesByTitle(
  items: ParsedRssItem[],
  recentTitles: string[]
): ParsedRssItem[] {
  const acceptedTitles = [...recentTitles]
  const out: ParsedRssItem[] = []

  for (const item of items) {
    if (isDuplicateOfAny(item.raw_title, acceptedTitles)) continue
    out.push(item)
    acceptedTitles.push(item.raw_title)
  }

  return out
}

export async function runNewsSync(): Promise<NewsSyncSummary> {
  const started = Date.now()
  const errors: NewsSyncSummary["errors"] = []
  let articles_fetched = 0
  let articles_added = 0
  let articles_skipped = 0
  let articles_truncated = 0
  let og_image_attempted = 0
  let og_image_resolved = 0
  let og_image_failed = 0

  const feedResults = await Promise.allSettled(
    NEWS_FEEDS.map(async (feed) => {
      const items = await fetchNewsFeedItems(feed)
      return { feedId: feed.id, items }
    })
  )

  const merged: ParsedRssItem[] = []
  for (const result of feedResults) {
    if (result.status === "fulfilled") {
      merged.push(...result.value.items)
    } else {
      errors.push({
        stage: "rss_fetch",
        message: result.reason instanceof Error ? result.reason.message : "RSS fetch failed",
      })
    }
  }

  articles_fetched = merged.length
  const unique = dedupeCandidates(merged)
  const urls = unique.map((i) => i.source_url)
  const existing = await fetchExistingUrlsAdmin(urls)

  const urlFiltered = unique
    .filter((i) => !existing.has(i.source_url))
    .sort((a, b) => b.published_at.getTime() - a.published_at.getTime())
    .slice(0, NEWS_CANDIDATE_CAP)

  const recentTitles = await fetchRecentArticleTitlesAdmin(NEWS_TITLE_DEDUP_HOURS)
  const filtered = dedupeCandidatesByTitle(urlFiltered, recentTitles)
  articles_skipped += urlFiltered.length - filtered.length

  const { items: candidates, stats: ogStats } = await enrichCandidatesWithOgImages(filtered)
  og_image_attempted = ogStats.og_image_attempted
  og_image_resolved = ogStats.og_image_resolved
  og_image_failed = ogStats.og_image_failed

  const admin = createAdminClient()
  const acceptedTitlesThisRun = [...recentTitles]

  for (const item of candidates) {
    if (articles_added >= NEWS_HARD_CAP) break

    const result = await processArticleWithHaiku(item)

    if (result.kind === "skip") {
      articles_skipped++
      continue
    }

    if (result.kind === "error") {
      errors.push({
        stage: "haiku",
        message: result.message,
        url: item.source_url,
      })
      continue
    }

    if (isDuplicateOfAny(result.payload.title_en, acceptedTitlesThisRun)) {
      articles_skipped++
      continue
    }

    if (result.payload.global_relevance < NEWS_GLOBAL_RELEVANCE_MIN) {
      articles_skipped++
      continue
    }

    if (!item.image_url) {
      articles_skipped++
      continue
    }

    const { error: insertError } = await admin.from("news_articles").insert({
      source_url: item.source_url,
      source_name: item.source_name,
      published_at: item.published_at.toISOString(),
      title_en: result.payload.title_en,
      title_es: result.payload.title_es,
      summary_en: result.payload.summary_en,
      summary_es: result.payload.summary_es,
      why_matters_en: result.payload.why_matters_en,
      why_matters_es: result.payload.why_matters_es,
      category: result.payload.category,
      severity: result.payload.severity,
      topic_query: item.topic_query,
      image_url: item.image_url,
      image_source: item.image_source ?? "publisher",
      image_credit_name: item.image_credit_name,
      image_credit_url: item.image_credit_url,
      resolved_url: item.resolved_url,
      global_relevance: result.payload.global_relevance,
    })

    if (insertError) {
      if (insertError.code === "23505") {
        articles_skipped++
        continue
      }
      errors.push({
        stage: "insert",
        message: insertError.message,
        url: item.source_url,
      })
      continue
    }

    articles_added++
    acceptedTitlesThisRun.push(result.payload.title_en)
  }

  const cutoff = new Date()
  cutoff.setUTCDate(cutoff.getUTCDate() - NEWS_RETENTION_DAYS)
  const { error: deleteError } = await admin
    .from("news_articles")
    .delete()
    .lt("published_at", cutoff.toISOString())

  if (deleteError) {
    errors.push({ stage: "cleanup", message: deleteError.message })
  }

  const duration_ms = Date.now() - started

  console.log("[news-sync] complete", {
    articles_fetched,
    articles_added,
    articles_skipped,
    articles_truncated,
    errors: errors.length,
    duration_ms,
  })

  await admin.from("news_feed_sync").insert({
    articles_fetched,
    articles_added,
    articles_skipped,
    errors: errors.length ? errors : null,
    duration_ms,
  })

  return {
    ok: errors.length === 0 || articles_added > 0,
    articles_fetched,
    articles_added,
    articles_skipped,
    articles_truncated,
    og_image_attempted,
    og_image_resolved,
    og_image_failed,
    errors,
    duration_ms,
  }
}

async function fetchExistingUrlsAdmin(urls: string[]): Promise<Set<string>> {
  if (urls.length === 0) return new Set()
  const admin = createAdminClient()
  const existing = new Set<string>()
  const chunkSize = 100

  for (let i = 0; i < urls.length; i += chunkSize) {
    const chunk = urls.slice(i, i + chunkSize)
    const { data, error } = await admin
      .from("news_articles")
      .select("source_url")
      .in("source_url", chunk)

    if (error) {
      console.error("[news-sync] fetchExisting:", error.message)
      continue
    }
    for (const row of data ?? []) {
      if (row.source_url) existing.add(row.source_url)
    }
  }

  return existing
}

async function fetchRecentArticleTitlesAdmin(hours: number): Promise<string[]> {
  const admin = createAdminClient()
  const since = new Date()
  since.setTime(since.getTime() - hours * 60 * 60 * 1000)

  const { data, error } = await admin
    .from("news_articles")
    .select("title_en")
    .gte("published_at", since.toISOString())

  if (error) {
    console.error("[news-sync] fetchRecentArticleTitles:", error.message)
    return []
  }

  return (data ?? [])
    .map((row) => row.title_en?.trim())
    .filter((title): title is string => Boolean(title))
}
