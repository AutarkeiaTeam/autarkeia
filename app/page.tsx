import { Hero } from "@/components/hero"
import { StatsBar } from "@/components/stats-bar"
import { Pillars } from "@/components/pillars"
import { NewsWatch } from "@/components/news-watch"
import { RuralCommunities } from "@/components/rural-communities"
import { HowItWorks } from "@/components/how-it-works"
import Link from "next/link"
import { Suspense } from "react"
import { AccountDeletedBanner } from "@/components/account-deleted-banner"
import { getLocale } from "@/lib/i18n-server"
import { translate } from "@/lib/i18n-core"
import { listNewsArticles } from "@/lib/news-db"
import { buildNewsWidgetArticles } from "@/lib/news-widget"

export default async function Home() {
  const locale = await getLocale()
  const t = (key: string) => translate(locale, key)
  const newsArticles = buildNewsWidgetArticles(await listNewsArticles(3), locale, 3)

  return (
    <main className="min-h-screen">
      <Suspense fallback={null}>
        <AccountDeletedBanner />
      </Suspense>
      <Hero
        title={t("home.hero_title")}
        subtitle={t("home.hero_sub")}
        ctaPrimary={t("home.cta_quiz")}
        ctaSecondary={t("home.cta_explore")}
      />
      <StatsBar />
      <Pillars />
      <NewsWatch articles={newsArticles} />
      <RuralCommunities />
      <HowItWorks />
      <section className="bg-[#f5f7fa] py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <Link href="/plans" className="text-lg font-medium text-[#009b70] hover:text-[#007a58] transition-colors">
            {t("home.cta_plans")} →
          </Link>
        </div>
      </section>
    </main>
  )
}
