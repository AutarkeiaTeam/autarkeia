"use client"

import { useMemo, useState } from "react"
import { libraryItems, subjectFilters, typeFilters } from "@/lib/library-data"

export default function Library() {
  const [type, setType] = useState("All")
  const [subject, setSubject] = useState("All")

  const filtered = useMemo(() => {
    return libraryItems.filter((item) => {
      const typeMatch = type === "All" || item.type === type
      const subjectMatch = subject === "All" || item.subjects.includes(subject)
      return typeMatch && subjectMatch
    })
  }, [type, subject])

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-3xl font-light text-[#0d1b2a]">Global Resilience Library</h1>
        <p className="mt-3 text-sm text-[#3d5166] max-w-2xl">
          A comprehensive emergency readiness and self-sufficiency library with open access to every resource.
        </p>

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

        <p className="mt-6 text-sm text-[#8a9bb0]">{filtered.length} resources</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <article key={item.id} className="rounded-xl border border-[#d4dce8] p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-[#f5f7fa] px-2.5 py-1 text-xs text-[#3d5166]">{item.type}</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {item.subjects.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#e8f8f3] px-2 py-0.5 text-[11px] text-[#0d1b2a]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <h2 className="mt-3 text-lg font-medium text-[#0d1b2a]">{item.title}</h2>
              <p className="text-sm text-[#8a9bb0]">{item.author}</p>
              <p className="mt-2 text-sm text-[#3d5166]">{item.description}</p>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-medium text-[#009b70]"
              >
                Open resource →
              </a>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
