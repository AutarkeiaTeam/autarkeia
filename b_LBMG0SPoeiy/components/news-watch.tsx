import { AlertTriangle, TrendingUp, Zap } from "lucide-react"

const newsItems = [
  {
    icon: AlertTriangle,
    category: "Supply Chain",
    title: "European grain exports face new restrictions amid drought concerns",
    summary: "Multiple EU countries announce export limitations as water levels drop to historic lows across major agricultural regions.",
    whyItMatters: "Food prices likely to rise 15-20% in affected regions. Consider accelerating your food storage plans and exploring local grain alternatives.",
    timeAgo: "2 hours ago",
  },
  {
    icon: TrendingUp,
    category: "Energy",
    title: "Natural gas prices surge as winter demand increases",
    summary: "Spot prices reach 18-month highs as storage facilities report below-average reserves heading into peak heating season.",
    whyItMatters: "Now is the time to audit your heating backup systems. Those with wood stoves or solar thermal should ensure systems are operational.",
    timeAgo: "5 hours ago",
  },
  {
    icon: Zap,
    category: "Infrastructure",
    title: "Major grid upgrade delays announced for Eastern seaboard",
    summary: "Utility companies push back modernization timelines by 3-5 years, citing supply chain issues and labor shortages.",
    whyItMatters: "Grid reliability will remain a concern. Prioritize backup power solutions and consider expanding battery storage capacity.",
    timeAgo: "8 hours ago",
  },
]

export function NewsWatch() {
  return (
    <section className="bg-[#0d1b2a] py-20" id="news">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-white sm:text-4xl">
            World News <span className="text-[#009b70]">Watch</span>
          </h2>
          <p className="mt-4 text-lg font-light text-white/70 max-w-2xl mx-auto">
            AI-curated global events that impact your self-sufficiency. Not just news - actionable intelligence.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {newsItems.map((item, index) => (
            <article
              key={index}
              className="rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#009b70]/20">
                  <item.icon className="h-5 w-5 text-[#009b70]" />
                </div>
                <div>
                  <span className="text-xs font-normal text-[#009b70] uppercase tracking-wide">
                    {item.category}
                  </span>
                  <p className="text-xs font-light text-white/50">{item.timeAgo}</p>
                </div>
              </div>

              <h3 className="text-lg font-normal text-white mb-3 leading-snug">
                {item.title}
              </h3>
              <p className="text-sm font-light text-white/70 mb-4">{item.summary}</p>

              <div className="rounded-lg bg-[#009b70]/10 border border-[#009b70]/20 p-4">
                <p className="text-xs font-normal text-[#009b70] uppercase tracking-wide mb-2">
                  Why this matters
                </p>
                <p className="text-sm font-light text-white/80">{item.whyItMatters}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
