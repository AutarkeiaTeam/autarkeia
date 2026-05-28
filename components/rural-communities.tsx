"use client"

import Link from "next/link"
import { Home, Wheat, Zap, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n-provider"

const focusAreas = [
  {
    icon: Home,
    titleKey: "home.communities.focus.housing.title",
    descriptionKey: "home.communities.focus.housing.desc",
    href: "/communities/housing-land",
  },
  {
    icon: Wheat,
    titleKey: "home.communities.focus.food.title",
    descriptionKey: "home.communities.focus.food.desc",
    href: "/communities/food-systems",
  },
  {
    icon: Zap,
    titleKey: "home.communities.focus.energy.title",
    descriptionKey: "home.communities.focus.energy.desc",
    href: "/communities/energy-water",
  },
  {
    icon: Users,
    titleKey: "home.communities.focus.governance.title",
    descriptionKey: "home.communities.focus.governance.desc",
    href: "/communities/governance",
  },
]

export function RuralCommunities() {
  const { t } = useI18n()

  return (
    <section
      className="bg-gradient-to-b from-[#f5f7fa] to-[#e8ebe5] py-20"
      id="rural-communities"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-start">
          <div>
            <span className="inline-block rounded-full bg-[#009b70]/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#009b70]">
              {t("home.communities.badge")}
            </span>
            <h2 className="mt-4 text-3xl font-light text-[#0d1b2a] sm:text-4xl">
              {t("home.communities.title_prefix")} <span className="text-[#009b70]">{t("home.communities.title_accent")}</span>
            </h2>
            <p className="mt-4 text-lg font-light text-[#3d5166] leading-relaxed">
              {t("home.communities.p1")}
            </p>
            <p className="mt-4 text-base font-light text-[#3d5166] leading-relaxed">
              {t("home.communities.p2")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-[#009b70] text-white hover:bg-[#008060] font-medium rounded-lg"
              >
                <Link href="/communities#register-interest">{t("home.communities.cta_explore")}</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="font-medium rounded-lg text-[#0d1b2a] hover:bg-white"
              >
                <Link href="/plans">{t("home.cta_plans")}</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {focusAreas.map((area) => {
              const Icon = area.icon
              return (
                <Link
                  key={area.titleKey}
                  href={area.href}
                  className="group rounded-xl bg-white p-5 border border-[#d4dce8]/60 transition-colors hover:border-[#009b70]"
                  style={{ borderWidth: "0.5px" }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#009b70]/10 text-[#009b70]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-normal text-[#0d1b2a] group-hover:text-[#009b70]">
                    {t(area.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm font-light text-[#3d5166] leading-relaxed">
                    {t(area.descriptionKey)}
                  </p>
                  <span className="mt-3 inline-block text-xs font-medium text-[#009b70]">
                    {t("home.communities.learn_more")}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
