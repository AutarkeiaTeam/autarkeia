import type { NewsArticleRow } from "@/lib/news-types"

/** Interleave articles by category so same-topic clusters don't render back-to-back. */
export function interleaveArticlesByCategory(
  articles: NewsArticleRow[]
): NewsArticleRow[] {
  if (articles.length <= 1) return articles

  const groups = new Map<string, NewsArticleRow[]>()
  for (const article of articles) {
    const category = article.category.toLowerCase()
    const bucket = groups.get(category)
    if (bucket) bucket.push(article)
    else groups.set(category, [article])
  }

  const categories = [...groups.keys()].sort((a, b) => {
    const aPublished = groups.get(a)?.[0]?.published_at
    const bPublished = groups.get(b)?.[0]?.published_at
    const aTime = aPublished ? new Date(aPublished).getTime() : 0
    const bTime = bPublished ? new Date(bPublished).getTime() : 0
    return bTime - aTime
  })

  const result: NewsArticleRow[] = []
  let hasMore = true
  while (hasMore) {
    hasMore = false
    for (const category of categories) {
      const bucket = groups.get(category)
      if (!bucket || bucket.length === 0) continue
      result.push(bucket.shift()!)
      hasMore = true
    }
  }

  return result
}
