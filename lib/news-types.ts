export const NEWS_HARD_CAP = 15
export const NEWS_CANDIDATE_CAP = 30
export const NEWS_LIST_LIMIT = 50
export const NEWS_RETENTION_DAYS = 60

export const NEWS_CATEGORIES = [
  "water",
  "food",
  "energy",
  "medical",
  "communications",
  "shelter",
  "climate",
  "geopolitics",
  "economy",
  "infrastructure",
  "security",
  "other",
] as const

export type NewsCategory = (typeof NEWS_CATEGORIES)[number]

export const NEWS_SEVERITIES = ["low", "medium", "high", "critical"] as const

export type NewsSeverity = (typeof NEWS_SEVERITIES)[number]

export type NewsArticleRow = {
  id: string
  source_url: string
  source_name: string | null
  published_at: string
  fetched_at: string
  title_en: string
  title_es: string
  summary_en: string
  summary_es: string
  why_matters_en: string
  why_matters_es: string
  category: string
  severity: string
  topic_query: string | null
  image_url: string | null
  created_at: string | null
}

export type ParsedRssItem = {
  source_url: string
  source_name: string | null
  published_at: Date
  raw_title: string
  raw_snippet: string
  topic_query: string
  image_url: string | null
}

export type HaikuArticlePayload = {
  title_en: string
  title_es: string
  summary_en: string
  summary_es: string
  why_matters_en: string
  why_matters_es: string
  category: NewsCategory
  severity: NewsSeverity
}

export type HaikuSkipPayload = {
  skip: true
  reason: string
}

export type NewsSyncSummary = {
  ok: boolean
  articles_fetched: number
  articles_added: number
  articles_skipped: number
  articles_truncated: number
  og_image_attempted: number
  og_image_resolved: number
  og_image_failed: number
  errors: { stage: string; message: string; url?: string }[]
  duration_ms: number
}
