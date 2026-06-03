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
]

export function googleNewsRssUrl(feed: NewsFeedConfig): string {
  const q = encodeURIComponent(feed.topic_query)
  return `https://news.google.com/rss/search?q=${q}&hl=${feed.hl}&gl=${feed.gl}&ceid=${feed.ceid}`
}
