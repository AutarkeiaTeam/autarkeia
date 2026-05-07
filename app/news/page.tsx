const stories = [
  { category: "Middle East", urgency: "Critical", emoji: "🛰️", title: "Iran tensions raise Strait of Hormuz disruption risk", summary: "Naval maneuvers and retaliation threats have increased in the Gulf. Energy markets are pricing in a potential supply shock over coming weeks.", why: "Fuel and transport costs can jump quickly, then cascade into food and logistics prices.", time: "2h ago", sources: [["Reuters","https://www.reuters.com/"],["BBC","https://www.bbc.com/"],["AP","https://apnews.com/"]] },
  { category: "Conflict", urgency: "High", emoji: "🛡️", title: "Ukraine front remains volatile as long-range strikes continue", summary: "Both sides report intensified strikes on logistics and energy infrastructure. Civilian infrastructure remains exposed in several regions.", why: "Prolonged conflict pressures European energy, grain trade and strategic stockpiles.", time: "5h ago", sources: [["Reuters","https://www.reuters.com/world/europe/"],["BBC","https://www.bbc.com/news/world/europe"],["DW","https://www.dw.com/"]] },
  { category: "Asia Security", urgency: "High", emoji: "🌏", title: "Taiwan Strait patrol surge deepens China-Taiwan tensions", summary: "Military activity and strategic signaling increased around shipping corridors. Electronics and shipping firms are adjusting risk models.", why: "Any disruption threatens semiconductors and equipment needed for modern infrastructure.", time: "7h ago", sources: [["AP","https://apnews.com/"],["Reuters","https://www.reuters.com/world/asia-pacific/"],["Nikkei","https://asia.nikkei.com/"]] },
  { category: "Economy", urgency: "High", emoji: "🏦", title: "US debt stress revives fiscal and market instability concerns", summary: "Debate over debt trajectory and refinancing pressure is intensifying. Bond market volatility is feeding risk-off behavior globally.", why: "Debt-driven shocks can tighten credit and reduce household resilience options.", time: "9h ago", sources: [["FT","https://www.ft.com/"],["Reuters","https://www.reuters.com/markets/"],["WSJ","https://www.wsj.com/"]] },
  { category: "Energy", urgency: "High", emoji: "⚡", title: "European energy security enters another uncertain winter cycle", summary: "Storage progress is uneven while grid stress tests highlight local weaknesses. Industrial demand and weather risk remain key variables.", why: "Backup power and heating contingency can protect households from short disruptions.", time: "12h ago", sources: [["IEA","https://www.iea.org/"],["Reuters","https://www.reuters.com/"],["Euronews","https://www.euronews.com/"]] },
  { category: "Food", urgency: "High", emoji: "🌾", title: "Global food prices rebound on weather and shipping disruptions", summary: "Grain and edible oil pricing moved upward after climate events and freight delays. Import-dependent countries face renewed pressure.", why: "Food inflation is easier to absorb with pantry depth and local production habits.", time: "14h ago", sources: [["FAO","https://www.fao.org/worldfoodsituation/en/"],["Bloomberg","https://www.bloomberg.com/"],["Reuters","https://www.reuters.com/"]] },
  { category: "Migration", urgency: "Medium", emoji: "🧭", title: "Migration pressure increases across Mediterranean routes", summary: "Displacement from conflict and climate shocks continues to rise. Reception systems in multiple countries report sustained capacity strain.", why: "Large migration waves can reshape local services and social stability dynamics.", time: "18h ago", sources: [["UNHCR","https://www.unhcr.org/"],["BBC","https://www.bbc.com/"],["AP","https://apnews.com/"]] },
  { category: "Climate", urgency: "High", emoji: "🌪️", title: "Extreme climate events hit multiple regions in same week", summary: "Floods, heatwaves and wildfire alerts occurred across different continents. Emergency services report repeated deployment stress.", why: "Localized disruptions are now frequent enough to justify household redundancy planning.", time: "1d ago", sources: [["Copernicus","https://climate.copernicus.eu/"],["NOAA","https://www.noaa.gov/"],["Reuters","https://www.reuters.com/"]] },
  { category: "Supply Chain", urgency: "High", emoji: "🚢", title: "Supply chain rerouting extends delivery times for key goods", summary: "Shipping delays and route changes continue in key maritime corridors. Lead times for equipment and components remain unstable.", why: "Critical supplies are safer when purchased before disruption windows widen.", time: "1d ago", sources: [["Lloyd's List","https://lloydslist.com/"],["Reuters","https://www.reuters.com/"],["AP","https://apnews.com/"]] },
  { category: "China Economy", urgency: "Medium", emoji: "🏭", title: "China slowdown concerns grow amid weak demand indicators", summary: "Industrial output and property stress remain central concerns. Slower growth is affecting export and commodity expectations.", why: "Global slowdown can alter job markets and reduce supply predictability.", time: "1d ago", sources: [["Reuters","https://www.reuters.com/world/china/"],["SCMP","https://www.scmp.com/"],["BBC","https://www.bbc.com/"]] },
  { category: "South Asia", urgency: "Medium", emoji: "🛰️", title: "India-Pakistan tensions prompt renewed border alerts", summary: "Security rhetoric and military posturing have intensified in recent days. Diplomatic channels remain active but fragile.", why: "Regional escalations can influence global commodities and geopolitical risk premiums.", time: "2d ago", sources: [["Reuters","https://www.reuters.com/"],["Al Jazeera","https://www.aljazeera.com/"],["AP","https://apnews.com/"]] },
  { category: "Technology", urgency: "High", emoji: "🤖", title: "AI infrastructure vulnerabilities become priority risk topic", summary: "Security researchers warn about over-centralized AI and cloud dependencies. Outages and cyber incidents expose interconnected weak points.", why: "When digital systems fail, offline tools and low-tech options become essential.", time: "2d ago", sources: [["MIT Tech Review","https://www.technologyreview.com/"],["Wired","https://www.wired.com/"],["Reuters","https://www.reuters.com/"]] },
  { category: "Health", urgency: "Medium", emoji: "🧪", title: "Pandemic preparedness audits reveal uneven readiness levels", summary: "Recent assessments show major variation in stockpiles and response speed. Public health systems are improving, but gaps remain.", why: "Personal medical readiness reduces dependence on strained services during spikes.", time: "2d ago", sources: [["WHO","https://www.who.int/"],["CDC","https://www.cdc.gov/"],["BBC","https://www.bbc.com/"]] },
  { category: "Water", urgency: "High", emoji: "💧", title: "Water scarcity alerts expand across drought-prone regions", summary: "Reservoir and aquifer levels are dropping in multiple countries. Authorities are introducing restrictions earlier in the season.", why: "Water storage, filtration and conservation become core household resilience priorities.", time: "3d ago", sources: [["UN Water","https://www.unwater.org/"],["Nature","https://www.nature.com/"],["Reuters","https://www.reuters.com/"]] },
  { category: "Finance", urgency: "Medium", emoji: "₿", title: "Crypto volatility rekindles systemic risk debate", summary: "Large swings and liquidity concerns renewed calls for tighter oversight. Traditional-finance linkages are being monitored closely.", why: "Volatile financial cycles highlight value of practical, non-digital preparedness assets.", time: "3d ago", sources: [["Bloomberg","https://www.bloomberg.com/"],["FT","https://www.ft.com/"],["AP","https://apnews.com/"]] },
]

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
          {stories.map((story) => (
            <article key={story.title} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                <div className="h-28 rounded-lg bg-gradient-to-br from-[#1f3550] to-[#009b70] flex items-center justify-center text-4xl">{story.emoji}</div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white">{story.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${urgencyClasses[story.urgency]}`}>{story.urgency}</span>
                    <span className="text-xs text-white/40 ml-auto">{story.time}</span>
                  </div>
                  <h2 className="mt-2 text-lg font-medium text-white">{story.title}</h2>
                  <p className="mt-2 text-sm text-white/70">{story.summary}</p>
                  <div className="mt-3 rounded-lg border-l-2 border-[#009b70] bg-[#e8f8f3] px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">Why this matters to you</p>
                    <p className="text-xs text-[#0d1b2a] mt-1">{story.why}</p>
                  </div>
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-[#71d8be]">Read more</summary>
                    <ul className="mt-2 flex flex-wrap gap-3">
                      {story.sources.map(([label, url]) => (
                        <li key={label}><a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-white/80 underline">{label}</a></li>
                      ))}
                    </ul>
                  </details>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
