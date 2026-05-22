"use client"

import Link from "next/link"
import { RegisterInterestForm } from "@/components/communities/register-interest-form"
import { useI18n } from "@/components/i18n-provider"

const livingOptions = [
  {
    title: "Individual or Family Home",
    desc: "Build your own self-sufficient home on your own land. Design and develop your property according to your vision.",
  },
  {
    title: "Co-living Community",
    desc: "Join a group of people building and sharing a house together. Co-own, share resources, and build community while maintaining individual autonomy.",
  },
]

const models = [
  "Independent family plot — buy your land, build your home, full privacy",
  "Co-living group — friends or like-minded people sharing a larger property",
  "Community investor — pool capital with others, Autarkeia develops the site",
  "Infrastructure subscriber — buy land near our shared solar/food infrastructure, pay monthly fee for access",
  "Seasonal resident — spend weeks or months per year, no permanent commitment",
  "Global partner — help us build in your country or region",
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
            <a href="#register-interest" className="rounded-lg bg-[#009b70] px-5 py-3 text-sm font-medium hover:bg-[#008060]">
              {t("communities.cta_register")}
            </a>
          </div>
        </div>
      </section>

      <section id="vision" className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-light text-[#0d1b2a] mb-8">Choose your path</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {livingOptions.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[#d4dce8] bg-white p-6 shadow-sm transition-colors hover:border-[#009b70]"
              >
                <h3 className="text-xl font-medium text-[#0d1b2a]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#3d5166]">{item.desc}</p>
                <a href="#register-interest" className="mt-6 inline-block text-sm font-medium text-[#009b70] hover:text-[#007a58]">
                  Explore this option →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#f5f7fa]">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-light text-[#0d1b2a]">A model for every vision</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {models.map((model) => (
              <div key={model} className="rounded-xl border border-[#d4dce8] bg-white p-5 text-sm text-[#3d5166]">{model}</div>
            ))}
          </div>
        </div>
      </section>

      <section id="register-interest" className="scroll-mt-28 py-14 bg-[#f5f7fa]">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-light text-[#0d1b2a] mb-8">Register your interest</h2>
          <RegisterInterestForm />
        </div>
      </section>
    </main>
  )
}
