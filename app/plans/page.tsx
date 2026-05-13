"use client"

import Link from "next/link"
import { useState } from "react"

const freeFeatures = [
  "Both quizzes (Emergency Readiness + Self-Sufficiency)",
  "Basic score — overall percentage only",
  "3 action items for this week only",
  "Limited library access",
  "World News Watch headlines",
  "Communities access — register interest, get updates on community development",
]

const proFeatures = [
  "Everything in Free",
  "Full score breakdown across all 5 categories",
  "Complete action plan — this week, 30 days, 1 year",
  "Plan saved to account and updated as you progress",
  "Score history — track improvement over time",
  "Full library — all guides, books, films, courses, apps",
  "World News Watch weekly email briefing every Monday",
  "AI chat — ask Claude about your specific situation, location and household",
  "Priority Community Access — register interest, get updates on community development. Paid subscribers get priority selection during high demand.",
]

type Tier = "free" | "pro"

export default function PlansPage() {
  const [active, setActive] = useState<Tier>("pro")

  const cardClass = (tier: Tier) =>
    `rounded-2xl bg-white p-6 transition-all duration-200 ${
      active === tier
        ? "border-2 border-[#009b70] shadow-lg"
        : "border border-[#d4dce8] shadow-none"
    }`

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <div className="mx-auto max-w-6xl px-4 lg:px-8 py-14">
        <h1 className="text-3xl font-light text-[#0d1b2a]">Plans</h1>
        <p className="mt-3 text-sm text-[#3d5166]">Two simple tiers: Free and Pro (€7/month).</p>

        <div id="pricing" className="mt-10 grid gap-6 md:grid-cols-2">
          <section
            className={cardClass("free")}
            onMouseEnter={() => setActive("free")}
            onFocus={() => setActive("free")}
          >
            <h2 className="text-xl font-medium text-[#0d1b2a]">Free</h2>
            <p className="mt-2 text-3xl font-semibold text-[#0d1b2a]">€0</p>
            <ul className="mt-4 space-y-2 text-sm text-[#3d5166]">
              {freeFeatures.map((feature) => <li key={feature}>• {feature}</li>)}
            </ul>
            <Link href="/signup" className="mt-6 inline-block rounded-lg bg-[#0d1b2a] px-5 py-2.5 text-sm font-medium text-white">Start free</Link>
          </section>

          <section
            className={cardClass("pro")}
            onMouseEnter={() => setActive("pro")}
            onFocus={() => setActive("pro")}
          >
            <h2 className="text-xl font-medium text-[#0d1b2a]">Pro</h2>
            <div className="mt-2">
              <p className="text-3xl font-semibold text-[#0d1b2a]">€7<span className="text-base font-normal text-[#3d5166]">/month</span></p>
              <p className="text-sm text-[#009b70] font-medium">€59/year (save 2 months)</p>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-[#3d5166]">
              {proFeatures.map((feature) => <li key={feature}>• {feature}</li>)}
            </ul>
            <Link href="/signup" className="mt-6 inline-block rounded-lg bg-[#009b70] px-5 py-2.5 text-sm font-medium text-white">Go Pro →</Link>
          </section>
        </div>
      </div>
    </main>
  )
}
