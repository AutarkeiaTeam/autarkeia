import Link from "next/link"
import { notFound } from "next/navigation"
import { getStoryBySlug, newsStories } from "@/lib/news-stories"

const urgencyClasses: Record<string, string> = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-amber-100 text-amber-700",
  Medium: "bg-blue-100 text-blue-700",
}

export function generateStaticParams() {
  return newsStories.map((s) => ({ slug: s.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params
  const story = getStoryBySlug(slug)
  if (!story) notFound()

  return (
    <main className="min-h-screen bg-[#0d1b2a]">
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12">
        <Link href="/news" className="text-sm text-[#71d8be] hover:underline">
          ← World News Watch
        </Link>

        <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={story.image} alt="" className="aspect-video w-full object-cover" loading="eager" />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white">{story.category}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${urgencyClasses[story.urgency]}`}>{story.urgency}</span>
          <span className="text-xs text-white/40 ml-auto">{story.time}</span>
        </div>

        <h1 className="mt-4 text-2xl sm:text-3xl font-light text-white text-balance">{story.title}</h1>
        <p className="mt-4 text-white/75 leading-relaxed">{story.summary}</p>

        <div className="mt-6 rounded-lg border-l-2 border-[#009b70] bg-[#e8f8f3] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">Why this matters to you</p>
          <p className="text-sm text-[#0d1b2a] mt-1">{story.why}</p>
        </div>

        <div className="mt-8 space-y-4 text-sm text-white/80 leading-relaxed">
          {story.body.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-sm font-medium text-white">Sources & ongoing coverage</h2>
          <ul className="mt-3 flex flex-wrap gap-3">
            {story.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#71d8be] underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
