import { createClient } from "@/lib/supabase/server"
import type { NewsArticleRow } from "@/lib/news-types"
import { NEWS_LIST_LIMIT } from "@/lib/news-types"

export async function listNewsArticles(limit = NEWS_LIST_LIMIT): Promise<NewsArticleRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("news_articles")
    .select(
      "id, source_url, source_name, published_at, fetched_at, title_en, title_es, summary_en, summary_es, why_matters_en, why_matters_es, category, severity, topic_query, created_at"
    )
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[news-db] listNewsArticles:", error.message)
    return []
  }

  return (data ?? []) as NewsArticleRow[]
}

export async function fetchExistingSourceUrls(urls: string[]): Promise<Set<string>> {
  if (urls.length === 0) return new Set()
  const supabase = await createClient()
  const existing = new Set<string>()
  const chunkSize = 100

  for (let i = 0; i < urls.length; i += chunkSize) {
    const chunk = urls.slice(i, i + chunkSize)
    const { data, error } = await supabase
      .from("news_articles")
      .select("source_url")
      .in("source_url", chunk)

    if (error) {
      console.error("[news-db] fetchExistingSourceUrls:", error.message)
      continue
    }
    for (const row of data ?? []) {
      if (row.source_url) existing.add(row.source_url)
    }
  }

  return existing
}
