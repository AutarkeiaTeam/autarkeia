"use client"

import Link from "next/link"
import { RegisterInterestForm } from "@/components/communities/register-interest-form"
import { useI18n } from "@/components/i18n-provider"

const pathwayCards = [
  {
    titleKey: "communities.option.family_title",
    descKey: "communities.option.family_desc",
    href: "/communities?intent=live#register-interest",
  },
  {
    titleKey: "communities.option.coliving_title",
    descKey: "communities.option.coliving_desc",
    href: "/communities?intent=live#register-interest",
  },
  {
    titleKey: "communities.option.communal_living_title",
    descKey: "communities.option.communal_living_desc",
    href: "/communities?intent=live#register-interest",
  },
  {
    titleKey: "communities.option.plantation_market_title",
    descKey: "communities.option.plantation_market_desc",
    href: "/communities?intent=buy_food#register-interest",
  },
]

const modelKeys = [
  "communities.model.1",
  "communities.model.2",
  "communities.model.3",
  "communities.model.4",
  "communities.model.5",
  "communities.model.6",
]

export default function Communities() {
  const { t } = useI18n()

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#0d1b2a] text-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight max-w-3xl">{t("communities.title")}</h1>
          <p className="mt-6 text-white/75 max-w-3xl leading-relaxed">{t("communities.intro")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/communities?intent=both#register-interest" className="rounded-lg bg-[#009b70] px-5 py-3 text-sm font-medium hover:bg-[#008060]">
              {t("communities.cta_register")}
            </a>
          </div>
        </div>
      </section>

      <section id="vision" className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-light text-[#0d1b2a] mb-8">{t("communities.choose_path")}</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {pathwayCards.map((item) => (
              <article
                key={item.titleKey}
                className="rounded-2xl border border-[#d4dce8] bg-white p-6 shadow-sm transition-colors hover:border-[#009b70]"
              >
                <h3 className="text-xl font-medium text-[#0d1b2a]">{t(item.titleKey)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#3d5166]">{t(item.descKey)}</p>
                <Link href={item.href} className="mt-6 inline-block text-sm font-medium text-[#009b70] hover:text-[#007a58]">
                  {t("communities.explore_option")}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#f5f7fa]">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-light text-[#0d1b2a]">{t("communities.model_every")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {modelKeys.map((modelKey) => (
              <div key={modelKey} className="rounded-xl border border-[#d4dce8] bg-white p-5 text-sm text-[#3d5166]">{t(modelKey)}</div>
            ))}
          </div>
        </div>
      </section>

      <section id="register-interest" className="scroll-mt-28 py-14 bg-[#f5f7fa]">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-light text-[#0d1b2a] mb-8">{t("communities.register_heading")}</h2>
          <RegisterInterestForm />
        </div>
      </section>
    </main>
  )
}
