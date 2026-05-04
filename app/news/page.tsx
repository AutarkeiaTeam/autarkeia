export default function NewsPage() {
  const stories = [
    { category: "Conflict", urgency: "critical", title: "Iran conflict escalation threatens Strait of Hormuz — 20% of global oil supply at risk", summary: "Military tensions between Iran and a US-led coalition have reached their highest point since 2020. Naval movements in the Persian Gulf suggest the possibility of a shipping disruption affecting energy markets globally.", why: "A Hormuz closure would spike fuel prices within 72 hours, affect food supply chains within 2 weeks, and trigger economic instability across Europe within a month.", source: "Reuters · FT · Al Jazeera", time: "2h ago", emoji: "⚠️" },
    { category: "Economy", urgency: "high", title: "Global debt-to-GDP ratio hits 350% — IMF warns of systemic fragility", summary: "The IMF's latest stability report warns that sovereign debt levels in G20 nations have reached a threshold where any major shock could trigger cascading defaults and currency crises.", why: "Currency devaluation and bank runs historically follow debt crises. Physical assets, local food systems and stored goods hold value when paper doesn't.", source: "IMF · Financial Times", time: "4h ago", emoji: "📉" },
    { category: "Conflict", urgency: "critical", title: "Taiwan Strait: China conducts largest naval exercise since 1996 crisis", summary: "PLA Navy has encircled Taiwan with a 72-hour live-fire exercise involving carrier groups. Taiwan Semiconductor Manufacturing Company halted non-essential operations as a precaution.", why: "A Taiwan conflict would collapse global semiconductor supply within weeks, affecting solar panels, electronics and modern infrastructure.", source: "Reuters · AP", time: "6h ago", emoji: "🚨" },
    { category: "Food & water", urgency: "high", title: "Mediterranean aquifers at historic lows — Spain, Italy and Greece facing severe shortage by 2028", summary: "Five-year drought combined with agricultural over-extraction has reduced aquifer levels across southern Europe to levels not seen in recorded history.", why: "Water scarcity is the fastest route to food price inflation and social instability. Rainwater collection and water storage are urgent priorities in southern Europe.", source: "El País · Nature", time: "Yesterday", emoji: "💧" },
    { category: "Energy", urgency: "high", title: "European gas reserves at 58% — well below winter resilience target", summary: "Despite efforts to diversify away from Russian gas, Europe enters another winter below storage targets. Industrial rationing cannot be ruled out.", why: "Blackouts and heating fuel shortages hit unprepared households hardest. Off-grid energy capability is the highest-impact preparedness investment in Europe right now.", source: "IEA · Der Spiegel", time: "Yesterday", emoji: "⚡" },
    { category: "Migration", urgency: "medium", title: "Record 1.2M displaced persons crossing Mediterranean in Q1 2026", summary: "UNHCR reports the highest quarterly displacement figure since records began, driven by climate stress and regional conflicts across sub-Saharan Africa and the Middle East.", why: "Mass migration reshapes social cohesion, strains public services and accelerates political instability. Locally self-sufficient communities are more resilient to these pressures.", source: "UNHCR · Guardian", time: "2 days ago", emoji: "🌍" },
    { category: "Food & water", urgency: "high", title: "Global fertiliser prices up 40% — food inflation set to accelerate through 2027", summary: "Sanctions on Russian and Belarusian potash combined with natural gas price increases have driven fertiliser costs to levels that will flow through to food prices in the next two growing seasons.", why: "Growing even 10-15% of your own food insulates you meaningfully from food inflation. Permaculture and composting eliminate fertiliser dependency entirely.", source: "FAO · Bloomberg", time: "3 days ago", emoji: "🌾" },
    { category: "Conflict", urgency: "high", title: "NATO defence spending hits record — 23 of 32 members now exceed 2% GDP target", summary: "For the first time since the Cold War, the majority of NATO members are spending at or above the alliance target. Signals a fundamental shift in how governments assess medium-term security.", why: "When governments rearm at this scale, they are signalling something about the future they expect. Individual preparedness is a rational response to the same information.", source: "NATO · Guardian", time: "4 days ago", emoji: "🛡️" },
    { category: "Climate", urgency: "medium", title: "2025 confirmed as hottest year on record — 1.6°C above pre-industrial average", summary: "Copernicus Climate Change Service confirms 2025 broke all previous temperature records, with 8 months exceeding the 1.5°C Paris Agreement threshold.", why: "Extreme heat, wildfires and flooding are becoming baseline risks. Resilient housing, water independence and local food production are the most practical responses.", source: "Copernicus · BBC", time: "1 week ago", emoji: "🌡️" },
  ]

  const urgencyColor = (u: string) => u === "critical" ? "bg-red-100 text-red-700" : u === "high" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
  const whyColor = (u: string) => u === "critical" ? "border-red-400 bg-red-50" : u === "high" ? "border-amber-400 bg-amber-50" : "border-[#009b70] bg-[#e8f8f3]"
  const whyLabelColor = (u: string) => u === "critical" ? "text-red-600" : u === "high" ? "text-amber-600" : "text-[#009b70]"

  return (
    <div className="min-h-screen bg-[#0d1b2a]">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-[#009b70] uppercase mb-2">World News Watch</p>
          <h1 className="text-3xl font-light text-white mb-3">The world is telling you something.</h1>
          <p className="text-[#8a9bb0] text-sm max-w-xl">We track the geopolitical, economic and environmental events that matter to anyone building a self-sufficient life. Every story explains exactly why it is relevant to you.</p>
        </div>

        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 mb-8">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0"></div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider font-medium">Global instability index</p>
            <p className="text-sm text-white">Elevated — multiple concurrent crises active across energy, conflict and food systems</p>
          </div>
          <p className="text-xs text-white/30 ml-auto">Updated daily · May 2026</p>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          {["All", "Conflict", "Economy", "Food & water", "Energy", "Migration", "Climate"].map(cat => (
            <button key={cat} className="text-xs font-medium px-3 py-1.5 rounded-full border border-white/15 text-white/50 hover:border-white/40 hover:text-white transition-colors">
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {stories.map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/8 rounded-xl p-5 hover:bg-white/8 transition-colors">
              <div className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0 mt-0.5">{s.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${urgencyColor(s.urgency)}`}>{s.category}</span>
                    <span className="text-xs text-white/30">{s.time}</span>
                    <span className="text-xs text-white/30 ml-auto">{s.source}</span>
                  </div>
                  <h3 className="text-base font-medium text-white mb-2 leading-snug">{s.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-3">{s.summary}</p>
                  <div className={`border-l-2 px-3 py-2 rounded-r-lg ${whyColor(s.urgency)}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${whyLabelColor(s.urgency)}`}>Why this matters to you</p>
                    <p className="text-xs text-[#0d1b2a] leading-relaxed">{s.why}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-[#009b70]/10 border border-[#009b70]/30 rounded-xl p-6 flex items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-medium text-white mb-1">Get the World News Watch briefing every week</h3>
            <p className="text-sm text-white/50">The 5 most important global developments relevant to self-sufficiency — every Monday morning. Free for all members.</p>
          </div>
          <button className="text-sm font-medium text-white bg-[#009b70] px-5 py-2.5 rounded-lg whitespace-nowrap hover:bg-[#007a58] transition-colors">Subscribe free →</button>
        </div>
      </div>
    </div>
  )
}
