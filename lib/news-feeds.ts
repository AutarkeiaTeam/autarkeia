export type NewsFeedConfig = {
  id: string
  topic_query: string
  hl: string
  gl: string
  ceid: string
}

const WHEN_7D = " when:7d"

export const NEWS_FEEDS: NewsFeedConfig[] = [
  {
    id: "water",
    topic_query: `("water security" OR drought OR "drinking water" contamination OR reservoir) preparedness${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "food",
    topic_query: `("food supply chain" OR "food shortage" OR agriculture OR grain OR "harvest failure") global${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "energy",
    topic_query: `("power grid" OR blackout OR "electricity outage" OR "energy crisis" OR "solar power") infrastructure${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "medical",
    topic_query: `(pandemic OR outbreak OR "public health" OR hospital OR epidemic OR H5N1) global${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "communications",
    topic_query: `(cyberattack OR "cyber attack" OR "internet outage" OR telecom OR "critical infrastructure" hacking)${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "shelter",
    topic_query: `("climate displacement" OR "housing damage" OR refugees OR shelter OR "heating crisis" OR "winter heating") disaster preparedness${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "extreme-weather",
    topic_query: `(flood OR wildfire OR hurricane OR typhoon OR heatwave OR blizzard OR "extreme weather" OR "weather warning") disaster${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "geopolitics",
    topic_query: `(sanctions OR "supply chain" OR geopolitical OR "trade war" OR shipping OR "Strait of Hormuz") disruption${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "economy",
    topic_query: `(inflation OR recession OR "economic crisis" OR currency OR "cost of living" OR unemployment) global${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "civil-unrest",
    topic_query: `(strike OR protest OR "civil unrest" OR riot OR "port strike" OR "logistics disruption")${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "industrial",
    topic_query: `(nuclear OR "chemical spill" OR "industrial accident" OR explosion OR "toxic leak" OR refinery)${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "es-eu",
    topic_query: `(crisis OR emergencia OR apagón OR sequía OR inundación) España OR Europa${WHEN_7D}`,
    hl: "es",
    gl: "ES",
    ceid: "ES:es",
  },
  {
    id: "ai-safety",
    topic_query: `("AI safety" OR "frontier model" OR "AI alignment" OR "existential risk" OR "AI regulation") global${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "biosecurity",
    topic_query: `("gain of function" OR "BSL-4" OR "pathogen research" OR "lab accident" OR "synthetic biology") global${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "supply-chain",
    topic_query: `("Red Sea shipping" OR "Panama Canal" OR "semiconductor shortage" OR "rare earth" OR chokepoint) global${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "water-scarcity",
    topic_query: `("transboundary water" OR "Colorado River" OR megadrought OR "desalination plant" OR "water treaty") global${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "refugee-crisis",
    topic_query: `("asylum policy" OR "border crisis" OR UNHCR OR "resettlement quota" OR "migration pact") global${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "currency-crisis",
    topic_query: `(hyperinflation OR "currency crisis" OR "sovereign default" OR "capital controls" OR "debt restructuring") global${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "cyber-infrastructure",
    topic_query: `("SCADA hack" OR "water treatment cyber" OR "hospital ransomware" OR "ICS attack" OR "OT security") global${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "earthquake",
    topic_query: `("magnitude 7" OR "early warning system" OR liquefaction OR "building collapse" OR "Ring of Fire") global${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "nuclear-incident",
    topic_query: `("reactor shutdown" OR "fuel rod" OR "radiation release" OR IAEA OR "nuclear plant alert") global${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
  {
    id: "food-crisis",
    topic_query: `(famine OR "WFP emergency" OR starvation OR "food aid" OR "Horn of Africa hunger") global${WHEN_7D}`,
    hl: "en",
    gl: "US",
    ceid: "US:en",
  },
]

export function googleNewsRssUrl(feed: NewsFeedConfig): string {
  const q = encodeURIComponent(feed.topic_query)
  return `https://news.google.com/rss/search?q=${q}&hl=${feed.hl}&gl=${feed.gl}&ceid=${feed.ceid}`
}
