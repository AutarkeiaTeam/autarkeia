import type { Locale } from "@/lib/i18n-core"
import { formatNewsRelativeTime } from "@/lib/news-relative-time"
import type { NewsArticleRow } from "@/lib/news-types"

export type NewsWidgetArticle = {
  id: string
  title: string
  summary: string
  whyMatters: string
  category: string
  href: string
  isExternal: boolean
  relativeTime: string
}

export function pickNewsArticleTitle(article: NewsArticleRow, locale: Locale): string {
  return locale === "es" ? article.title_es : article.title_en
}

export function pickNewsArticleSummary(article: NewsArticleRow, locale: Locale): string {
  return locale === "es" ? article.summary_es : article.summary_en
}

export function pickNewsArticleWhyMatters(article: NewsArticleRow, locale: Locale): string {
  return locale === "es" ? article.why_matters_es : article.why_matters_en
}

export function newsArticleHref(article: NewsArticleRow): { href: string; isExternal: boolean } {
  const external = article.resolved_url ?? article.source_url
  if (external?.startsWith("http")) {
    return { href: external, isExternal: true }
  }
  return { href: `/news#article-${article.id}`, isExternal: false }
}

export function buildNewsWidgetArticles(
  articles: NewsArticleRow[],
  locale: Locale,
  limit?: number
): NewsWidgetArticle[] {
  const slice = limit ? articles.slice(0, limit) : articles
  return slice.map((article) => {
    const { href, isExternal } = newsArticleHref(article)
    return {
      id: article.id,
      title: pickNewsArticleTitle(article, locale),
      summary: pickNewsArticleSummary(article, locale),
      whyMatters: pickNewsArticleWhyMatters(article, locale),
      category: article.category,
      href,
      isExternal,
      relativeTime: formatNewsRelativeTime(locale, article.published_at) ?? "",
    }
  })
}
