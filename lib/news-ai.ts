import {
  NEWS_CATEGORIES,
  NEWS_SEVERITIES,
  type HaikuArticlePayload,
  type HaikuSkipPayload,
  type NewsCategory,
  type NewsSeverity,
  type ParsedRssItem,
} from "@/lib/news-types"

export const HAIKU_SYSTEM_PROMPT = `You are a preparedness-focused editor for Autarkeia, a platform for emergency readiness and household self-sufficiency. Read the news item below (title, snippet, source URL).

If the article is opinion/PR/paywalled with no real content, or the snippet contains no actual news, return ONLY: {"skip": true, "reason": "<short reason>"} — do NOT generate translations.

Otherwise return ONLY valid JSON with these fields (no markdown, no backticks, no commentary):

{
  "title_en": string (STRICT max 140 chars — text exceeding this will be truncated mid-sentence and look bad),
  "title_es": string (STRICT max 140 chars — text exceeding this will be truncated mid-sentence and look bad),
  "summary_en": string (STRICT max 220 chars, 1-2 sentences — exceeding this will be truncated mid-sentence and look bad),
  "summary_es": string (STRICT max 220 chars, 1-2 sentences — exceeding this will be truncated mid-sentence and look bad),
  "why_matters_en": string (STRICT max 200 chars, ONE practical idea — exceeding this will be truncated mid-sentence and look bad),
  "why_matters_es": string (STRICT max 200 chars, ONE practical idea — exceeding this will be truncated mid-sentence and look bad),
  "category": one of: water, food, energy, medical, communications, shelter, climate, geopolitics, economy, infrastructure, security, other,
  "severity": one of: low, medium, high, critical,
  "global_relevance": integer 1–5 (how globally relevant this story is for emergency-readiness planning)
}

Rules:
- Factual, concise. No sensationalism, no political spin, no investment advice.
- ES voice: tú-form only (no vosotros/vuestro). Use 'desconectado de la red' not 'off-grid'. 'Outdoor' is an acceptable retail loanword.
- why_matters is ONE practical action or implication, not two.

Severity scale (be conservative — critical/high are rare):
- critical: declared widespread emergency, active casualty events, system-level failures actively underway
- high: active emergency in one region OR confirmed serious disruption underway
- medium: official warnings/advisories, conservation appeals, elevated risk forecasts, single-incident situations
- low: informational, preparedness-relevant context, distant or minor household impact

Global relevance scale (score the story's usefulness to Autarkeia users worldwide):
- 1: hyper-local incident with no broader implications (single-home fire, local arrests, small-town accidents, school events, one-off neighborhood crime)
- 2: regional event with limited reach (county-level natural disaster, state-level policy, regional outage, local infrastructure failure)
- 3: significant national event (national policy change, major US/EU/large-country disaster, large-scale outbreak, nationwide grid or supply disruption)
- 4: multi-national or globally newsworthy event (geopolitical conflict, pandemic spread, cross-border crisis, climate tipping points, international sanctions)
- 5: world-shaping event (major war, global pandemic, economic collapse, mass casualty disaster, worldwide systemic failure)

When scoring global_relevance, weigh: scale of impact, number of people affected, cross-border relevance, and whether an Autarkeia user anywhere in the world would benefit from knowing this for emergency-readiness planning. Be strict — most local crime and single-building incidents are 1.`

const SYSTEM_PROMPT = HAIKU_SYSTEM_PROMPT

const LENGTH_CAPS = {
  title_en: 140,
  title_es: 140,
  summary_en: 220,
  summary_es: 220,
  why_matters_en: 200,
  why_matters_es: 200,
} as const

const ELLIPSIS = "…"

function truncateToCap(
  value: string,
  maxLength: number
): { value: string; truncated: boolean } {
  const trimmed = value.trim()
  if (trimmed.length <= maxLength) {
    return { value: trimmed, truncated: false }
  }

  const contentMax = maxLength - ELLIPSIS.length
  let cut = trimmed.slice(0, contentMax)
  const lastSpace = cut.lastIndexOf(" ")
  if (lastSpace > 0) {
    cut = cut.slice(0, lastSpace)
  }

  return { value: cut.trimEnd() + ELLIPSIS, truncated: true }
}

function buildUserMessage(item: ParsedRssItem): string {
  return `Process this news item for the Autarkeia World News Watch.
Source name: ${item.source_name ?? "Unknown"}
Published: ${item.published_at.toISOString()}
Topic feed: ${item.topic_query}
Title: ${item.raw_title}
Snippet: ${item.raw_snippet}
URL: ${item.source_url}`
}

function parseJsonObject(text: string): Record<string, unknown> | null {
  const trimmed = text.trim()
  const match = trimmed.match(/\{[\s\S]*\}/)
  if (!match) return null
  try {
    return JSON.parse(match[0]) as Record<string, unknown>
  } catch {
    return null
  }
}

function isSkipPayload(obj: Record<string, unknown>): HaikuSkipPayload | null {
  if (obj.skip === true && typeof obj.reason === "string" && obj.reason.trim()) {
    return { skip: true, reason: obj.reason.trim() }
  }
  return null
}

function parseGlobalRelevance(value: unknown): number | null {
  const score = typeof value === "number" ? value : Number(value)
  if (!Number.isInteger(score) || score < 1 || score > 5) return null
  return score
}

export function validateHaikuArticle(
  obj: Record<string, unknown>
): { payload: HaikuArticlePayload; truncated: boolean } | { error: string } {
  const skip = isSkipPayload(obj)
  if (skip) return { error: "unexpected_skip" }

  const fields = [
    "title_en",
    "title_es",
    "summary_en",
    "summary_es",
    "why_matters_en",
    "why_matters_es",
    "category",
    "severity",
  ] as const

  for (const key of fields) {
    if (typeof obj[key] !== "string" || !String(obj[key]).trim()) {
      return { error: `missing_${key}` }
    }
  }

  const global_relevance = parseGlobalRelevance(obj.global_relevance)
  if (global_relevance == null) {
    return { error: "invalid_global_relevance" }
  }

  const category = String(obj.category).trim() as NewsCategory
  if (!NEWS_CATEGORIES.includes(category)) {
    return { error: "invalid_category" }
  }

  const severity = String(obj.severity).trim() as NewsSeverity
  if (!NEWS_SEVERITIES.includes(severity)) {
    return { error: "invalid_severity" }
  }

  let truncated = false
  const payload = {} as HaikuArticlePayload

  for (const key of Object.keys(LENGTH_CAPS) as (keyof typeof LENGTH_CAPS)[]) {
    const { value, truncated: fieldTruncated } = truncateToCap(
      String(obj[key]),
      LENGTH_CAPS[key]
    )
    payload[key] = value
    if (fieldTruncated) truncated = true
  }

  payload.category = category
  payload.severity = severity
  payload.global_relevance = global_relevance

  return { payload, truncated }
}

export async function processArticleWithHaiku(
  item: ParsedRssItem
): Promise<
  | { kind: "skip"; payload: HaikuSkipPayload }
  | { kind: "article"; payload: HaikuArticlePayload; truncated: boolean }
  | { kind: "error"; message: string }
> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim()
  if (!apiKey) {
    return { kind: "error", message: "ANTHROPIC_API_KEY missing" }
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 650,
      temperature: 0.2,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserMessage(item) }],
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error("Anthropic error:", response.status, errorBody)
    return {
      kind: "error",
      message: `Anthropic returned non-200: ${response.status} — ${errorBody.slice(0, 500)}`,
    }
  }

  const data = (await response.json()) as {
    content?: { type: string; text?: string }[]
  }
  const text = data.content?.find((c) => c.type === "text")?.text
  if (!text) {
    return { kind: "error", message: "Anthropic response missing text" }
  }

  const obj = parseJsonObject(text)
  if (!obj) {
    return { kind: "error", message: "Failed to parse Haiku JSON" }
  }

  const skip = isSkipPayload(obj)
  if (skip) {
    return { kind: "skip", payload: skip }
  }

  const validated = validateHaikuArticle(obj)
  if ("error" in validated) {
    return { kind: "error", message: validated.error }
  }

  return {
    kind: "article",
    payload: validated.payload,
    truncated: validated.truncated,
  }
}
