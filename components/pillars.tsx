"use client"

import { ShieldCheck, ShoppingBag, BookOpen, Home, Globe, Sparkles } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"

const pillars = [
  {
    icon: ShieldCheck,
    titleKey: "nav.emergency",
    descriptionKey: "home.pillars.emergency.desc",
  },
  {
    icon: ShoppingBag,
    titleKey: "nav.marketplace",
    descriptionKey: "home.pillars.marketplace.desc",
  },
  {
    icon: BookOpen,
    titleKey: "nav.library",
    descriptionKey: "home.pillars.library.desc",
  },
  {
    icon: Home,
    titleKey: "nav.communities",
    descriptionKey: "home.pillars.communities.desc",
  },
  {
    icon: Globe,
    titleKey: "nav.news",
    descriptionKey: "home.pillars.news.desc",
  },
  {
    icon: Sparkles,
    titleKey: "nav.plans",
    descriptionKey: "home.pillars.plans.desc",
  },
]

export function Pillars() {
  const { t } = useI18n()

  return (
    <section className="bg-[#f5f7fa] py-20" id="self-sufficiency">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-[#0d1b2a] sm:text-4xl">
            {t("home.pillars.title_prefix")} <span className="text-[#009b70]">{t("home.pillars.title_accent")}</span>
          </h2>
          <p className="mt-4 text-lg font-light text-[#3d5166] max-w-2xl mx-auto">
            {t("home.pillars.sub")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="group rounded-xl bg-white p-6 border border-[#d4dce8]/50 transition-all hover:border-[#009b70]/30"
              style={{ borderWidth: '0.5px' }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8f8f3]">
                <pillar.icon className="h-6 w-6 text-[#009b70]" />
              </div>
              <h3 className="text-lg font-normal text-[#0d1b2a] mb-2">{t(pillar.titleKey)}</h3>
              <p className="text-sm font-light text-[#3d5166] leading-relaxed">{t(pillar.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
