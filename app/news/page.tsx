import Link from "next/link"
import { newsStories } from "@/lib/news-stories"

const urgencyClasses: Record<string, string> = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-amber-100 text-amber-700",
  Medium: "bg-blue-100 text-blue-700",
}

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-[#0d1b2a]">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-3xl font-light text-white">World News Watch</h1>
        <p className="mt-3 text-sm text-white/60 max-w-2xl">Global risks that matter for emergency readiness and self-sufficiency planning.</p>

        <div className="mt-8 grid gap-4">
          {newsStories.map((story) => (
            <article key={story.slug} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="grid gap-4 md:grid-cols-[minmax(0,200px)_1fr]">
                <Link href={`/news/${story.slug}`} className="block shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={story.image}
                    alt=""
                    className="h-36 w-full rounded-lg object-cover md:h-full md:min-h-[140px]"
                    loading="lazy"
                  />
                </Link>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white">{story.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${urgencyClasses[story.urgency]}`}>{story.urgency}</span>
                    <span className="text-xs text-white/40 ml-auto">{story.time}</span>
                  </div>
                  <h2 className="mt-2 text-lg font-medium text-white">
                    <Link href={`/news/${story.slug}`} className="hover:text-[#71d8be] transition-colors">
                      {story.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-white/70">{story.summary}</p>
                  <div className="mt-3 rounded-lg border-l-2 border-[#009b70] bg-[#e8f8f3] px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">Why this matters to you</p>
                    <p className="text-xs text-[#0d1b2a] mt-1">{story.why}</p>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Read the story at the source</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {story.sources.map((s) => (
                        <li key={s.url}>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15 hover:text-[#71d8be]"
                          >
                            {s.label}
                            <span aria-hidden>↗</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href={`/news/${story.slug}`} className="mt-3 inline-block text-sm font-medium text-[#71d8be] hover:underline">
                    Read Autarkeia brief →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
