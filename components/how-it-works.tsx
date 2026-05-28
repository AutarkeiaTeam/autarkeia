"use client"

import { ClipboardCheck, Target, TrendingUp, Shield } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"

const steps = [
  {
    icon: ClipboardCheck,
    step: "01",
    titleKey: "home.how.1.title",
    descriptionKey: "home.how.1.desc",
  },
  {
    icon: Target,
    step: "02",
    titleKey: "home.how.2.title",
    descriptionKey: "home.how.2.desc",
  },
  {
    icon: TrendingUp,
    step: "03",
    titleKey: "home.how.3.title",
    descriptionKey: "home.how.3.desc",
  },
  {
    icon: Shield,
    step: "04",
    titleKey: "home.how.4.title",
    descriptionKey: "home.how.4.desc",
  },
]

export function HowItWorks() {
  const { t } = useI18n()

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-[#0d1b2a] sm:text-4xl">
            {t("home.how.title_prefix")} <span className="text-[#009b70]">{t("home.how.title_accent")}</span>
          </h2>
          <p className="mt-4 text-lg font-light text-[#3d5166] max-w-2xl mx-auto">
            {t("home.how.sub")}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-[#009b70]/30 to-transparent -translate-x-1/2" />
              )}
              
              <div className="text-center">
                <div className="relative inline-flex">
                  <div className="h-20 w-20 rounded-full bg-[#e8f8f3] flex items-center justify-center">
                    <item.icon className="h-8 w-8 text-[#009b70]" />
                  </div>
                  <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-[#009b70] text-white text-sm font-normal flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-normal text-[#0d1b2a]">{t(item.titleKey)}</h3>
                <p className="mt-2 text-sm font-light text-[#3d5166] leading-relaxed">{t(item.descriptionKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
