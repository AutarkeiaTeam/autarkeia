"use client"

import { AlertTriangle, TrendingUp, Zap } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"

const newsItems = [
  {
    icon: AlertTriangle,
    categoryKey: "home.news.1.category",
    titleKey: "home.news.1.title",
    summaryKey: "home.news.1.summary",
    whyItMattersKey: "home.news.1.why",
    timeAgoKey: "home.news.1.time",
  },
  {
    icon: TrendingUp,
    categoryKey: "home.news.2.category",
    titleKey: "home.news.2.title",
    summaryKey: "home.news.2.summary",
    whyItMattersKey: "home.news.2.why",
    timeAgoKey: "home.news.2.time",
  },
  {
    icon: Zap,
    categoryKey: "home.news.3.category",
    titleKey: "home.news.3.title",
    summaryKey: "home.news.3.summary",
    whyItMattersKey: "home.news.3.why",
    timeAgoKey: "home.news.3.time",
  },
]

export function NewsWatch() {
  const { t } = useI18n()

  return (
    <section className="bg-[#0d1b2a] py-20" id="news">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-white sm:text-4xl">
            {t("home.news.title_prefix")} <span className="text-[#009b70]">{t("home.news.title_accent")}</span>
          </h2>
          <p className="mt-4 text-lg font-light text-white/70 max-w-2xl mx-auto">
            {t("home.news.sub")}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {newsItems.map((item, index) => (
            <article
              key={index}
              className="rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#009b70]/20">
                  <item.icon className="h-5 w-5 text-[#009b70]" />
                </div>
                <div>
                  <span className="text-xs font-normal text-[#009b70] uppercase tracking-wide">
                    {t(item.categoryKey)}
                  </span>
                  <p className="text-xs font-light text-white/50">{t(item.timeAgoKey)}</p>
                </div>
              </div>

              <h3 className="text-lg font-normal text-white mb-3 leading-snug">
                {t(item.titleKey)}
              </h3>
              <p className="text-sm font-light text-white/70 mb-4">{t(item.summaryKey)}</p>

              <div className="rounded-lg bg-[#009b70]/10 border border-[#009b70]/20 p-4">
                <p className="text-xs font-normal text-[#009b70] uppercase tracking-wide mb-2">
                  {t("home.news.why_label")}
                </p>
                <p className="text-sm font-light text-white/80">{t(item.whyItMattersKey)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
