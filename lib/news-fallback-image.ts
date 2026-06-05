const UNSPLASH_SEARCH = "https://api.unsplash.com/search/photos"
const QUERY_WORD_CAP = 6

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "has",
  "have",
  "in",
  "into",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "this",
  "to",
  "was",
  "were",
  "will",
  "with",
])

export type UnsplashImageResult = {
  imageUrl: string
  creditName: string
  creditUrl: string
}

const unsplashCache = new Map<string, UnsplashImageResult | null>()

/** Clear in-memory Unsplash cache (call at start of each cron run). */
export function clearUnsplashImageCache(): void {
  unsplashCache.clear()
}

export function buildUnsplashQuery(
  topicQuery: string | null | undefined,
  title: string
): string {
  const raw = topicQuery?.trim() || title.trim()
  const words = raw
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !STOPWORDS.has(w.toLowerCase()))

  if (words.length > 0) {
    return words.slice(0, QUERY_WORD_CAP).join(" ")
  }

  return title
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, QUERY_WORD_CAP)
    .join(" ")
}

function appendUtm(url: string): string {
  const parsed = new URL(url)
  parsed.searchParams.set("utm_source", "autarkeia")
  parsed.searchParams.set("utm_medium", "referral")
  return parsed.href
}

type UnsplashSearchResponse = {
  results?: {
    urls?: { regular?: string }
    links?: { html?: string }
    user?: { name?: string; links?: { html?: string } }
  }[]
}

/** Search Unsplash for a landscape photo; returns URL + attribution or null. */
export async function resolveUnsplashImage(
  query: string
): Promise<UnsplashImageResult | null> {
  const trimmed = query.trim()
  if (!trimmed) return null

  if (unsplashCache.has(trimmed)) {
    return unsplashCache.get(trimmed) ?? null
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) {
    unsplashCache.set(trimmed, null)
    return null
  }

  const params = new URLSearchParams({
    query: trimmed,
    per_page: "1",
    orientation: "landscape",
    content_filter: "high",
  })

  let res: Response
  try {
    res = await fetch(`${UNSPLASH_SEARCH}?${params}`, {
      headers: { Authorization: `Client-ID ${accessKey}` },
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    unsplashCache.set(trimmed, null)
    return null
  }

  if (res.status === 403 || res.status === 429 || !res.ok) {
    unsplashCache.set(trimmed, null)
    return null
  }

  let data: UnsplashSearchResponse
  try {
    data = (await res.json()) as UnsplashSearchResponse
  } catch {
    unsplashCache.set(trimmed, null)
    return null
  }

  const hit = data.results?.[0]
  const imageUrl = hit?.urls?.regular
  const creditName = hit?.user?.name?.trim()
  const creditUrl = hit?.links?.html || hit?.user?.links?.html

  if (!imageUrl || !creditName || !creditUrl) {
    unsplashCache.set(trimmed, null)
    return null
  }

  const result: UnsplashImageResult = {
    imageUrl,
    creditName,
    creditUrl: appendUtm(creditUrl),
  }
  unsplashCache.set(trimmed, result)
  return result
}
