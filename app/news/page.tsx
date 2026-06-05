import { NewsHeroImage } from "@/components/news/news-hero-image"
import { getLocale } from "@/lib/i18n-server"
import { translate } from "@/lib/i18n-core"
import { listNewsArticles } from "@/lib/news-db"
import { sanitizeNewsImageUrl } from "@/lib/news-image-url"
import { formatNewsRelativeTime } from "@/lib/news-relative-time"
import type { NewsArticleRow, NewsSeverity } from "@/lib/news-types"

const severityClasses: Record<NewsSeverity, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-amber-100 text-amber-700",
  medium: "bg-blue-100 text-blue-700",
  low: "bg-white/10 text-white/80",
}

function pickLocalized(
  locale: string,
  en: string,
  es: string
): string {
  return locale === "es" ? es : en
}

function severityKey(severity: string): string {
  const s = severity.toLowerCase()
  if (s === "critical" || s === "high" || s === "medium" || s === "low") {
    return `news.severity.${s}`
  }
  return "news.severity.low"
}

function categoryKey(category: string): string {
  const c = category.toLowerCase()
  return `news.category.${c}`
}

export default async function NewsPage() {
  const locale = await getLocale()
  const t = (key: string) => translate(locale, key)
  const articles = await listNewsArticles()

  return (
    <main className="min-h-screen bg-[#0d1b2a]">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-3xl font-light text-white">{t("news.title")}</h1>
        <p className="mt-3 text-sm text-white/60 max-w-2xl">{t("news.intro")}</p>

        {articles.length === 0 ? (
          <p className="mt-10 rounded-xl border border-white/10 bg-white/5 px-5 py-8 text-sm text-white/70">
            {t("news.empty_state")}
          </p>
        ) : (
          <div className="mt-8 grid gap-4">
            {articles.map((article) => (
              <NewsArticleCard
                key={article.id}
                article={article}
                locale={locale}
                t={t}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function NewsArticleCard({
  article,
  locale,
  t,
}: {
  article: NewsArticleRow
  locale: string
  t: (key: string) => string
}) {
  const title = pickLocalized(locale, article.title_en, article.title_es)
  const summary = pickLocalized(locale, article.summary_en, article.summary_es)
  const whyMatters = pickLocalized(
    locale,
    article.why_matters_en,
    article.why_matters_es
  )
  const relativeTime = formatNewsRelativeTime(locale, article.published_at)
  const severity = article.severity.toLowerCase() as NewsSeverity
  const severityClass =
    severityClasses[severity] ?? severityClasses.low
  const catKey = categoryKey(article.category)
  const categoryLabel = translate(locale, catKey) !== catKey ? t(catKey) : article.category
  const heroImage = sanitizeNewsImageUrl(article.image_url)

  return (
    <article className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      {heroImage ? <NewsHeroImage src={heroImage} alt={title} /> : null}
      <div className="p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white capitalize">
          {categoryLabel}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${severityClass}`}>
          {t(severityKey(article.severity))}
        </span>
        {relativeTime ? (
          <span className="text-xs text-white/40 ml-auto">{relativeTime}</span>
        ) : null}
      </div>
      <h2 className="mt-2 text-lg font-medium text-white">{title}</h2>
      <p className="mt-2 text-sm text-white/70">{summary}</p>
      <div className="mt-3 rounded-lg border-l-2 border-[#009b70] bg-[#e8f8f3] px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
          {t("news.why_matters")}
        </p>
        <p className="text-xs text-[#0d1b2a] mt-1">{whyMatters}</p>
      </div>
      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
          {t("news.read_source")}
        </p>
        <a
          href={article.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15 hover:text-[#71d8be]"
        >
          {article.source_name ?? t("news.source_fallback")}
          <span aria-hidden>↗</span>
        </a>
      </div>
      </div>
    </article>
  )
}
