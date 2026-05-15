"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Lock } from "lucide-react"
import { libraryItems, subjectFilters, typeFilters } from "@/lib/library-data"
import { useTier } from "@/lib/use-tier"
import { useI18n } from "@/components/i18n-provider"

export default function Library() {
  const { t } = useI18n()
  const [type, setType] = useState("All")
  const [subject, setSubject] = useState("All")
  const { tier } = useTier()

  const filtered = useMemo(() => {
    return libraryItems.filter((item) => {
      const typeMatch = type === "All" || item.type === type
      const subjectMatch = subject === "All" || item.subjects.includes(subject)
      return typeMatch && subjectMatch
    })
  }, [type, subject])

  const lockedCount = filtered.filter((i) => i.isPro).length
  const freeCount = filtered.length - lockedCount

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-3xl font-light text-[#0d1b2a]">{t("library.title")}</h1>
        <p className="mt-3 text-sm text-[#3d5166] max-w-2xl">{t("library.intro")}</p>

        <div className="mt-6 rounded-xl border border-[#d4dce8] bg-[#f5f7fa] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">New collection</p>
          <p className="mt-1 text-sm font-medium text-[#0d1b2a]">
            Geopolitics &amp; World Future Podcasts
          </p>
          <p className="mt-1 text-sm text-[#3d5166]">
            70+ specific episodes from Peter Zeihan, John Mearsheimer, Stephen Kotkin, Nate Hagens, Professor Jiang
            (Predictive History), Thomas Homer-Dixon, Adam Tooze, Lyn Alden, Ray Dalio, Vaclav Smil, Joseph Tainter,
            Yuval Noah Harari and others. Set type to <span className="font-medium">Podcasts</span> and subject to{" "}
            <span className="font-medium">Geopolitics</span> to browse.
          </p>
        </div>

        {tier === "free" && (
          <div className="mt-4 rounded-xl border border-[#009b70] bg-[#e8f8f3] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">Free preview</p>
            <p className="mt-1 text-sm text-[#0d1b2a]">
              You&apos;re seeing the Free taster set. {lockedCount} of {filtered.length} resources in this view are
              locked. Go Pro to unlock everything plus all 9 languages.
            </p>
            <Link
              href="/plans"
              className="mt-3 inline-block rounded-lg bg-[#009b70] px-4 py-2 text-xs font-medium text-white hover:bg-[#007a58]"
            >
              Upgrade to Pro →
            </Link>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            {typeFilters.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setType(value)}
                className={`rounded-full border px-3 py-1.5 text-xs ${
                  type === value ? "border-[#009b70] text-[#009b70]" : "border-[#d4dce8] text-[#3d5166]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {subjectFilters.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setSubject(value)}
                className={`rounded-full border px-3 py-1.5 text-xs ${
                  subject === value ? "border-[#009b70] text-[#009b70]" : "border-[#d4dce8] text-[#3d5166]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm text-[#8a9bb0]">
          {filtered.length} resources
          {tier === "free" && (
            <span className="ml-2 text-[#009b70]">· {freeCount} unlocked for Free</span>
          )}
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const locked = item.isPro && tier !== "pro"
            return (
              <article
                key={item.id}
                className={`relative rounded-xl border p-5 ${
                  locked ? "border-[#d4dce8] bg-[#f9fafc]" : "border-[#d4dce8]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#f5f7fa] px-2.5 py-1 text-xs text-[#3d5166]">{item.type}</span>
                    {item.isPro && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#0d1b2a] px-2 py-0.5 text-[10px] font-medium text-white">
                        <Lock className="h-2.5 w-2.5" /> Pro
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {item.subjects.map((tag) => (
                      <span key={tag} className="rounded-full bg-[#e8f8f3] px-2 py-0.5 text-[11px] text-[#0d1b2a]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h2 className={`mt-3 text-lg font-medium ${locked ? "text-[#3d5166]" : "text-[#0d1b2a]"}`}>
                  {item.title}
                </h2>
                <p className="text-sm text-[#8a9bb0]">{item.author}</p>
                <p className="mt-2 text-sm text-[#3d5166]">{item.description}</p>

                {locked ? (
                  <Link
                    href="/plans"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#009b70] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#007a58]"
                  >
                    <Lock className="h-3 w-3" /> Upgrade to Pro to open
                  </Link>
                ) : (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-medium text-[#009b70]"
                  >
                    Open resource →
                  </a>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}
