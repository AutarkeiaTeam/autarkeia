import {
  NEWS_CATEGORIES,
  NEWS_SEVERITIES,
  type HaikuArticlePayload,
  type HaikuSkipPayload,
  type NewsCategory,
  type NewsSeverity,
  type ParsedRssItem,
} from "@/lib/news-types"

const SYSTEM_PROMPT = `You are a preparedness-focused editor for Autarkeia, a platform for emergency readiness and household self-sufficiency. Read the news item below (title, snippet, source URL).

If the article is opinion/PR/paywalled with no real content, or the snippet contains no actual news, return ONLY: {"skip": true, "reason": "<short reason>"} — do NOT generate translations.

Otherwise return ONLY valid JSON with these fields (no markdown, no backticks, no commentary):

{
  "title_en": string (max 140 chars),
  "title_es": string (max 140 chars),
  "summary_en": string (max 220 chars, 1-2 sentences),
  "summary_es": string (max 220 chars, 1-2 sentences),
  "why_matters_en": string (max 200 chars, ONE practical idea for household readiness),
  "why_matters_es": string (max 200 chars, ONE practical idea),
  "category": one of: water, food, energy, medical, communications, shelter, climate, geopolitics, economy, infrastructure, security, other,
  "severity": one of: low, medium, high, critical
}

Rules:
- Factual, concise. No sensationalism, no political spin, no investment advice.
- ES voice: tú-form only (no vosotros/vuestro). Use 'desconectado de la red' not 'off-grid'. 'Outdoor' is an acceptable retail loanword.
- why_matters is ONE practical action or implication, not two.

Severity scale (be conservative — critical/high are rare):
- critical: declared widespread emergency, active casualty events, system-level failures actively underway
- high: active emergency in one region OR confirmed serious disruption underway
- medium: official warnings/advisories, conservation appeals, elevated risk forecasts, single-incident situations
- low: informational, preparedness-relevant context, distant or minor household impact`

const LENGTH_CAPS = {
  title_en: 140,
  title_es: 140,
  summary_en: 220,
  summary_es: 220,
  why_matters_en: 200,
  why_matters_es: 200,
} as const

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

export function validateHaikuArticle(
  obj: Record<string, unknown>
): HaikuArticlePayload | { error: string } {
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

  for (const key of Object.keys(LENGTH_CAPS) as (keyof typeof LENGTH_CAPS)[]) {
    const val = String(obj[key]).trim()
    if (val.length > LENGTH_CAPS[key]) {
      return { error: `${key}_too_long` }
    }
  }

  const category = String(obj.category).trim() as NewsCategory
  if (!NEWS_CATEGORIES.includes(category)) {
    return { error: "invalid_category" }
  }

  const severity = String(obj.severity).trim() as NewsSeverity
  if (!NEWS_SEVERITIES.includes(severity)) {
    return { error: "invalid_severity" }
  }

  return {
    title_en: String(obj.title_en).trim(),
    title_es: String(obj.title_es).trim(),
    summary_en: String(obj.summary_en).trim(),
    summary_es: String(obj.summary_es).trim(),
    why_matters_en: String(obj.why_matters_en).trim(),
    why_matters_es: String(obj.why_matters_es).trim(),
    category,
    severity,
  }
}

export async function processArticleWithHaiku(
  item: ParsedRssItem
): Promise<
  | { kind: "skip"; payload: HaikuSkipPayload }
  | { kind: "article"; payload: HaikuArticlePayload }
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
      max_tokens: 600,
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

  return { kind: "article", payload: validated }
}
