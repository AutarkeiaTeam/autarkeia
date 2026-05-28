"use client"

import { useI18n } from "@/components/i18n-provider"

const stats = [
  { value: "2.1B", labelKey: "home.stats.1.label" },
  { value: "94%", labelKey: "home.stats.2.label" },
  { value: "€400B", labelKey: "home.stats.3.label" },
]

export function StatsBar() {
  const { t } = useI18n()

  return (
    <section className="bg-[#0d1b2a] py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl sm:text-4xl font-light text-[#009b70]">{stat.value}</p>
              <p className="mt-2 text-sm font-light text-white/80">{t(stat.labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
