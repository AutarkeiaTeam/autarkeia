import { processArticleWithHaiku } from "@/lib/news-ai"
import {
  NEWS_GLOBAL_RELEVANCE_MIN,
  type ParsedRssItem,
} from "@/lib/news-types"
import { createAdminClient } from "@/lib/supabase/admin"

export type NewsRelevanceBackfillSummary = {
  processed: number
  scored: number
  deleted_below_threshold: number
  kept: number
}

type UnscoredRow = {
  id: string
  source_url: string
  source_name: string | null
  published_at: string
  title_en: string
  summary_en: string
  topic_query: string | null
}

function toParsedRssItem(row: UnscoredRow): ParsedRssItem {
  return {
    source_url: row.source_url,
    source_name: row.source_name,
    published_at: new Date(row.published_at),
    raw_title: row.title_en,
    raw_snippet: row.summary_en,
    topic_query: row.topic_query ?? "backfill",
    image_url: null,
  }
}

/** Score existing articles with Haiku; delete rows below the global relevance threshold. */
export async function runNewsRelevanceBackfill(): Promise<NewsRelevanceBackfillSummary> {
  const admin = createAdminClient()
  const { data: rows, error } = await admin
    .from("news_articles")
    .select(
      "id, source_url, source_name, published_at, title_en, summary_en, topic_query"
    )
    .is("global_relevance", null)
    .order("published_at", { ascending: false })

  if (error) throw new Error(error.message)

  const articles = (rows ?? []) as UnscoredRow[]
  let processed = 0
  let scored = 0
  let deleted_below_threshold = 0
  let kept = 0

  for (const row of articles) {
    processed++

    const result = await processArticleWithHaiku(toParsedRssItem(row))
    if (result.kind !== "article") {
      console.error(
        `[news-relevance-backfill] skip ${row.id}:`,
        result.kind === "error" ? result.message : result.payload.reason
      )
      continue
    }

    scored++
    const score = result.payload.global_relevance

    if (score < NEWS_GLOBAL_RELEVANCE_MIN) {
      const { error: deleteError } = await admin
        .from("news_articles")
        .delete()
        .eq("id", row.id)

      if (deleteError) {
        console.error(
          `[news-relevance-backfill] delete failed ${row.id}:`,
          deleteError.message
        )
        continue
      }

      deleted_below_threshold++
      continue
    }

    const { error: updateError } = await admin
      .from("news_articles")
      .update({ global_relevance: score })
      .eq("id", row.id)

    if (updateError) {
      console.error(
        `[news-relevance-backfill] update failed ${row.id}:`,
        updateError.message
      )
      continue
    }

    kept++
  }

  return {
    processed,
    scored,
    deleted_below_threshold,
    kept,
  }
}
