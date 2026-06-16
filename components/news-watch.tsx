"use client"

import Link from "next/link"
import { AlertTriangle, Newspaper, TrendingUp, Zap } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import type { NewsWidgetArticle } from "@/lib/news-widget"

const CARD_ICONS: LucideIcon[] = [AlertTriangle, TrendingUp, Zap]

type NewsWatchProps = {
  articles: NewsWidgetArticle[]
}

function categoryLabel(category: string, t: (key: string) => string): string {
  const key = `news.category.${category.toLowerCase()}`
  const translated = t(key)
  return translated !== key ? translated : category
}

function ArticleTitleLink({ article }: { article: NewsWidgetArticle }) {
  const className = "text-lg font-normal text-white mb-3 leading-snug hover:text-[#71d8be] transition-colors"
  if (article.isExternal) {
    return (
      <a
        href={article.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {article.title}
      </a>
    )
  }
  return (
    <Link href={article.href} className={className}>
      {article.title}
    </Link>
  )
}

export function NewsWatch({ articles }: NewsWatchProps) {
  const { t } = useI18n()

  return (
    <section className="bg-[#0d1b2a] py-20" id="news">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-white sm:text-4xl">
            {t("home.news.title_prefix")}{" "}
            <span className="text-[#009b70]">{t("home.news.title_accent")}</span>
          </h2>
          <p className="mt-4 text-lg font-light text-white/70 max-w-2xl mx-auto">
            {t("home.news.sub")}
          </p>
        </div>

        {articles.length === 0 ? (
          <p className="text-center text-sm text-white/60">
            <Link href="/news" className="text-[#009b70] hover:text-[#71d8be]">
              {t("nav.news")} →
            </Link>
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {articles.map((article, index) => {
              const Icon = CARD_ICONS[index % CARD_ICONS.length] ?? Newspaper
              return (
                <article
                  key={article.id}
                  className="rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#009b70]/20">
                      <Icon className="h-5 w-5 text-[#009b70]" />
                    </div>
                    <div>
                      <span className="text-xs font-normal text-[#009b70] uppercase tracking-wide">
                        {categoryLabel(article.category, t)}
                      </span>
                      {article.relativeTime ? (
                        <p className="text-xs font-light text-white/50">{article.relativeTime}</p>
                      ) : null}
                    </div>
                  </div>

                  <ArticleTitleLink article={article} />
                  <p className="text-sm font-light text-white/70 mb-4">{article.summary}</p>

                  <div className="rounded-lg bg-[#009b70]/10 border border-[#009b70]/20 p-4">
                    <p className="text-xs font-normal text-[#009b70] uppercase tracking-wide mb-2">
                      {t("home.news.why_label")}
                    </p>
                    <p className="text-sm font-light text-white/80">{article.whyMatters}</p>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
