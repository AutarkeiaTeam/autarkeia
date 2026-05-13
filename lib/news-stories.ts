export type NewsStory = {
  slug: string
  category: string
  urgency: string
  emoji: string
  title: string
  summary: string
  why: string
  time: string
  /** Topic illustration (Unsplash Source API style — deterministic by slug) */
  image: string
  body: string
  sources: { label: string; url: string }[]
}

/** Picsum image per story for consistent featured art */
function storyImage(slug: string): string {
  const seed = slug.replace(/[^a-z0-9]+/gi, "").slice(0, 40) || "news"
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/960/540`
}

/**
 * Per-story Google News search URL biased toward the named publisher.
 * Returns coverage of THIS specific story rather than a section landing page.
 */
function newsSearch(title: string, publisher: string): string {
  const q = `${title} ${publisher.replace(/\s+(Markets|Energy|Crypto|Sustainability|Asia|Europe|China|South Asia|Middle East|Migration|Health|Environment|Supply Chain|Technology|Commodities|Agriculture|Reports|Pressroom|Press|News|Climate|Water|Economy|Asia-Pacific|Business|News\/Markets)$/i, "")}`
  return `https://www.google.com/search?q=${encodeURIComponent(q)}&tbm=nws`
}

const rawStories: NewsStory[] = [
  {
    slug: "iran-strait-hormuz-risk",
    category: "Middle East",
    urgency: "Critical",
    emoji: "🛰️",
    title: "Iran tensions raise Strait of Hormuz disruption risk",
    summary:
      "Naval maneuvers and retaliation threats have increased in the Gulf. Energy markets are pricing in a potential supply shock over coming weeks.",
    why: "Fuel and transport costs can jump quickly, then cascade into food and logistics prices.",
    time: "2h ago",
    image: storyImage("iran-strait-hormuz-risk"),
    body: `Shipping through the Strait of Hormuz remains a choke point for global oil and LNG flows. When rhetoric escalates between regional powers, insurance premiums and charter rates often move before any physical disruption occurs. For households focused on resilience, the lesson is not prediction but preparation: maintain fuel buffers where safe and legal, review evacuation and communication plans if you live near critical infrastructure, and diversify food sourcing to reduce exposure to sudden freight-driven inflation.`,
    sources: [
      { label: "Reuters Middle East", url: "https://www.reuters.com/world/middle-east/" },
      { label: "BBC Middle East", url: "https://www.bbc.com/news/world/middle_east" },
      { label: "AP World News", url: "https://apnews.com/hub/world-news" },
    ],
  },
  {
    slug: "ukraine-front-logistics-strikes",
    category: "Conflict",
    urgency: "High",
    emoji: "🛡️",
    title: "Ukraine front remains volatile as long-range strikes continue",
    summary:
      "Both sides report intensified strikes on logistics and energy infrastructure. Civilian infrastructure remains exposed in several regions.",
    why: "Prolonged conflict pressures European energy, grain trade and strategic stockpiles.",
    time: "5h ago",
    image: storyImage("ukraine-front-logistics-strikes"),
    body: `Sustained conflict in Ukraine continues to stress global grain corridors and regional energy networks. Even distant economies feel second-order effects through fertilizer costs, wheat derivatives, and power interconnectors. Preparedness at the household level means deeper pantry rotation, attention to backup heat and cooking, and awareness of how local grids depend on imported fuels or interconnected markets.`,
    sources: [
      { label: "Reuters Europe", url: "https://www.reuters.com/world/europe/" },
      { label: "BBC Europe", url: "https://www.bbc.com/news/world/europe" },
      { label: "DW Europe", url: "https://www.dw.com/en/europe/s-1433" },
    ],
  },
  {
    slug: "taiwan-strait-shipping-risk",
    category: "Asia Security",
    urgency: "High",
    emoji: "🌏",
    title: "Taiwan Strait patrol surge deepens China-Taiwan tensions",
    summary:
      "Military activity and strategic signaling increased around shipping corridors. Electronics and shipping firms are adjusting risk models.",
    why: "Any disruption threatens semiconductors and equipment needed for modern infrastructure.",
    time: "7h ago",
    image: storyImage("taiwan-strait-shipping-risk"),
    body: `Semiconductor supply chains concentrate advanced fabrication in a small number of geographies. Strait tensions remind planners that redundancy—in spare parts, repair skills, and non-digital workflows—matters as much as cloud uptime. Document critical dependencies for water, power, and communications hardware you rely on, and identify manual fallbacks where feasible.`,
    sources: [
      { label: "AP Asia-Pacific", url: "https://apnews.com/hub/asia-pacific" },
      { label: "Reuters Asia", url: "https://www.reuters.com/world/asia-pacific/" },
      { label: "Nikkei Asia", url: "https://asia.nikkei.com/" },
    ],
  },
  {
    slug: "us-debt-fiscal-stress",
    category: "Economy",
    urgency: "High",
    emoji: "🏦",
    title: "US debt stress revives fiscal and market instability concerns",
    summary:
      "Debate over debt trajectory and refinancing pressure is intensifying. Bond market volatility is feeding risk-off behavior globally.",
    why: "Debt-driven shocks can tighten credit and reduce household resilience options.",
    time: "9h ago",
    image: storyImage("us-debt-fiscal-stress"),
    body: `Fiscal cycles interact with monetary policy in ways that affect employment, housing, and access to credit. For resilience planning, focus on liquidity without speculation, reduce fragile debt where possible, and build skills and networks that preserve optionality during downturns. Tangible readiness—medical, water, food—buffers non-financial shocks that often coincide with financial stress.`,
    sources: [
      { label: "FT Markets", url: "https://www.ft.com/markets" },
      { label: "Reuters Markets", url: "https://www.reuters.com/markets/" },
      { label: "WSJ Economy", url: "https://www.wsj.com/news/economy" },
    ],
  },
  {
    slug: "europe-energy-winter-grid",
    category: "Energy",
    urgency: "High",
    emoji: "⚡",
    title: "European energy security enters another uncertain winter cycle",
    summary:
      "Storage progress is uneven while grid stress tests highlight local weaknesses. Industrial demand and weather risk remain key variables.",
    why: "Backup power and heating contingency can protect households from short disruptions.",
    time: "12h ago",
    image: storyImage("europe-energy-winter-grid"),
    body: `Weather-normalized storage and interconnect capacity vary widely across regions. Households should validate heating contingencies, insulate thermal envelopes where possible, and test backup power safely. Community-level load sharing and demand flexibility become force multipliers when grids approach limits.`,
    sources: [
      { label: "IEA Reports", url: "https://www.iea.org/reports" },
      { label: "Reuters Energy", url: "https://www.reuters.com/business/energy/" },
      { label: "Euronews Green", url: "https://www.euronews.com/green" },
    ],
  },
  {
    slug: "global-food-prices-shipping",
    category: "Food",
    urgency: "High",
    emoji: "🌾",
    title: "Global food prices rebound on weather and shipping disruptions",
    summary:
      "Grain and edible oil pricing moved upward after climate events and freight delays. Import-dependent countries face renewed pressure.",
    why: "Food inflation is easier to absorb with pantry depth and local production habits.",
    time: "14h ago",
    image: storyImage("global-food-prices-shipping"),
    body: `Agricultural markets integrate climate volatility, currency moves, and freight bottlenecks. Rotating staples, preserving harvests, and learning low-energy preservation methods reduce exposure. Even small-scale home production changes price sensitivity at the margin while improving dietary diversity.`,
    sources: [
      { label: "FAO Food Situation", url: "https://www.fao.org/worldfoodsituation/en/" },
      { label: "Bloomberg Agriculture", url: "https://www.bloomberg.com/markets/commodities" },
      { label: "Reuters Commodities", url: "https://www.reuters.com/markets/commodities/" },
    ],
  },
  {
    slug: "mediterranean-migration-routes",
    category: "Migration",
    urgency: "Medium",
    emoji: "🧭",
    title: "Migration pressure increases across Mediterranean routes",
    summary:
      "Displacement from conflict and climate shocks continues to rise. Reception systems in multiple countries report sustained capacity strain.",
    why: "Large migration waves can reshape local services and social stability dynamics.",
    time: "18h ago",
    image: storyImage("mediterranean-migration-routes"),
    body: `Migration dynamics intersect with housing, water, and public health capacity. Communities that plan for inclusive infrastructure and clear governance tend to adapt more smoothly. Individuals can contribute through mutual aid networks, language support, and pressure on policymakers for transparent resource allocation.`,
    sources: [
      { label: "UNHCR News", url: "https://www.unhcr.org/news" },
      { label: "BBC Migration", url: "https://www.bbc.com/news/world/europe" },
      { label: "AP Migration", url: "https://apnews.com/hub/immigration" },
    ],
  },
  {
    slug: "extreme-weather-multi-region",
    category: "Climate",
    urgency: "High",
    emoji: "🌪️",
    title: "Extreme climate events hit multiple regions in same week",
    summary:
      "Floods, heatwaves and wildfire alerts occurred across different continents. Emergency services report repeated deployment stress.",
    why: "Localized disruptions are now frequent enough to justify household redundancy planning.",
    time: "1d ago",
    image: storyImage("extreme-weather-multi-region"),
    body: `Concurrent extremes strain mutual aid and insurance systems. Redundancy in water storage, air filtration for smoke, and heat illness prevention are increasingly baseline preparedness. Neighborhood-level coordination—cooling centers, well-sharing agreements, and tree planting—extends individual buffers.`,
    sources: [
      { label: "Copernicus Climate", url: "https://climate.copernicus.eu/" },
      { label: "NOAA Climate", url: "https://www.climate.gov/news-features" },
      { label: "Reuters Environment", url: "https://www.reuters.com/sustainability/" },
    ],
  },
  {
    slug: "supply-chain-rerouting-delays",
    category: "Supply Chain",
    urgency: "High",
    emoji: "🚢",
    title: "Supply chain rerouting extends delivery times for key goods",
    summary:
      "Shipping delays and route changes continue in key maritime corridors. Lead times for equipment and components remain unstable.",
    why: "Critical supplies are safer when purchased before disruption windows widen.",
    time: "1d ago",
    image: storyImage("supply-chain-rerouting-delays"),
    body: `Just-in-time systems optimize cost under stability assumptions. Resilience favors strategic inventories of repair parts, medical consumables, and water treatment consumables with known shelf lives. Map single points of failure in your own logistics—last-mile transport, cold chain, and prescription continuity.`,
    sources: [
      { label: "Lloyd's List", url: "https://lloydslist.com/" },
      { label: "Reuters Supply Chain", url: "https://www.reuters.com/business/autos-transportation/" },
      { label: "AP Business", url: "https://apnews.com/hub/business" },
    ],
  },
  {
    slug: "china-slowdown-industrial",
    category: "China Economy",
    urgency: "Medium",
    emoji: "🏭",
    title: "China slowdown concerns grow amid weak demand indicators",
    summary:
      "Industrial output and property stress remain central concerns. Slower growth is affecting export and commodity expectations.",
    why: "Global slowdown can alter job markets and reduce supply predictability.",
    time: "1d ago",
    image: storyImage("china-slowdown-industrial"),
    body: `Shifts in Chinese industrial demand ripple through metals, shipping, and manufacturing employment worldwide. Households should stress-test income assumptions and maintain retraining agility. Diversifying suppliers for durable goods and prepping for longer lead times reduces operational surprise.`,
    sources: [
      { label: "Reuters China", url: "https://www.reuters.com/world/china/" },
      { label: "SCMP Economy", url: "https://www.scmp.com/economy" },
      { label: "BBC China", url: "https://www.bbc.com/news/world/asia/china" },
    ],
  },
  {
    slug: "india-pakistan-border-alerts",
    category: "South Asia",
    urgency: "Medium",
    emoji: "🛰️",
    title: "India-Pakistan tensions prompt renewed border alerts",
    summary:
      "Security rhetoric and military posturing have intensified in recent days. Diplomatic channels remain active but fragile.",
    why: "Regional escalations can influence global commodities and geopolitical risk premiums.",
    time: "2d ago",
    image: storyImage("india-pakistan-border-alerts"),
    body: `South Asian security flare-ups can affect energy and food markets through sentiment and localized disruptions. Observers should separate signal from noise via primary sources, while maintaining personal readiness unrelated to speculation—communications plans, medical kits, and go-bags remain evergreen.`,
    sources: [
      { label: "Reuters South Asia", url: "https://www.reuters.com/world/india/" },
      { label: "Al Jazeera Asia", url: "https://www.aljazeera.com/asia/" },
      { label: "AP South Asia", url: "https://apnews.com/hub/asia-pacific" },
    ],
  },
  {
    slug: "ai-infrastructure-centralization-risk",
    category: "Technology",
    urgency: "High",
    emoji: "🤖",
    title: "AI infrastructure vulnerabilities become priority risk topic",
    summary:
      "Security researchers warn about over-centralized AI and cloud dependencies. Outages and cyber incidents expose interconnected weak points.",
    why: "When digital systems fail, offline tools and low-tech options become essential.",
    time: "2d ago",
    image: storyImage("ai-infrastructure-centralization-risk"),
    body: `Centralized AI stacks concentrate failure domains. Practice offline workflows: paper maps, radio nets, and printed medical references. Segment networks at home, maintain offline backups of critical documents, and rehearse degraded-mode days without assuming cloud availability.`,
    sources: [
      { label: "MIT Technology Review", url: "https://www.technologyreview.com/topic/artificial-intelligence/" },
      { label: "Wired Security", url: "https://www.wired.com/category/security/" },
      { label: "Reuters Technology", url: "https://www.reuters.com/technology/" },
    ],
  },
  {
    slug: "pandemic-preparedness-audits",
    category: "Health",
    urgency: "Medium",
    emoji: "🧪",
    title: "Pandemic preparedness audits reveal uneven readiness levels",
    summary:
      "Recent assessments show major variation in stockpiles and response speed. Public health systems are improving, but gaps remain.",
    why: "Personal medical readiness reduces dependence on strained services during spikes.",
    time: "2d ago",
    image: storyImage("pandemic-preparedness-audits"),
    body: `Audits highlight workforce burnout and supply chain fragility for basics like gloves and antivirals. Households should maintain rational medical caches with expiration discipline, coordinate with clinicians for chronic conditions, and support local public health funding rather than panic buying.`,
    sources: [
      { label: "WHO News", url: "https://www.who.int/news" },
      { label: "CDC Pressroom", url: "https://www.cdc.gov/media/index.html" },
      { label: "BBC Health", url: "https://www.bbc.com/news/health" },
    ],
  },
  {
    slug: "water-scarcity-drought-alerts",
    category: "Water",
    urgency: "High",
    emoji: "💧",
    title: "Water scarcity alerts expand across drought-prone regions",
    summary:
      "Reservoir and aquifer levels are dropping in multiple countries. Authorities are introducing restrictions earlier in the season.",
    why: "Water storage, filtration and conservation become core household resilience priorities.",
    time: "3d ago",
    image: storyImage("water-scarcity-drought-alerts"),
    body: `Drought cycles demand both demand reduction and supply diversification. Rainwater harvesting, greywater reuse where legal, and low-flow fixtures compound savings. Monitor local watershed governance and advocate for transparent allocation during scarcity events.`,
    sources: [
      { label: "UN Water", url: "https://www.unwater.org/" },
      { label: "Nature Water", url: "https://www.nature.com/natwater/" },
      { label: "Reuters Sustainability", url: "https://www.reuters.com/sustainability/" },
    ],
  },
  {
    slug: "crypto-volatility-systemic-debate",
    category: "Finance",
    urgency: "Medium",
    emoji: "₿",
    title: "Crypto volatility rekindles systemic risk debate",
    summary:
      "Large swings and liquidity concerns renewed calls for tighter oversight. Traditional-finance linkages are being monitored closely.",
    why: "Volatile financial cycles highlight value of practical, non-digital preparedness assets.",
    time: "3d ago",
    image: storyImage("crypto-volatility-systemic-debate"),
    body: `Speculative assets can distract from tangible readiness. Maintain a balanced view: liquidity for obligations, insurance for tail risks, and skills that generate value regardless of token prices. Physical health, shelter, and water access dominate welfare during crises.`,
    sources: [
      { label: "Bloomberg Crypto", url: "https://www.bloomberg.com/crypto" },
      { label: "FT Crypto", url: "https://www.ft.com/crypto" },
      { label: "AP Business", url: "https://apnews.com/hub/business" },
    ],
  },
]

export const newsStories: NewsStory[] = rawStories.map((story) => ({
  ...story,
  sources: story.sources.map((src) => ({
    label: src.label,
    url: newsSearch(story.title, src.label),
  })),
}))

export function getStoryBySlug(slug: string): NewsStory | undefined {
  return newsStories.find((s) => s.slug === slug)
}
