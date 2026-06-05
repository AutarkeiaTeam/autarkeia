import { createAdminClient } from "@/lib/supabase/admin"

const PIXABAY_API = "https://pixabay.com/api/"
const QUERY_WORD_CAP = 5
const CANDIDATES_PER_PAGE = 20

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "been",
  "being",
  "but",
  "by",
  "can",
  "could",
  "did",
  "do",
  "does",
  "for",
  "from",
  "had",
  "has",
  "have",
  "he",
  "her",
  "him",
  "his",
  "how",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "may",
  "might",
  "must",
  "not",
  "of",
  "on",
  "or",
  "our",
  "put",
  "she",
  "should",
  "so",
  "than",
  "that",
  "the",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "to",
  "too",
  "up",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "will",
  "with",
  "would",
  "you",
  "your",
])

type QueryCacheEntry = {
  candidates: string[]
  lastIndex: number
}

const queryCache = new Map<string, QueryCacheEntry>()
const usedPhotoUrls = new Set<string>()
const dbUrlCache = new Map<string, boolean>()

let pickChain: Promise<void> = Promise.resolve()

function withPickLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = pickChain.then(fn)
  pickChain = run.then(
    () => undefined,
    () => undefined
  )
  return run
}

/** Reset caches and preload all image_url values already stored in the DB. */
export async function initPixabayImageCache(): Promise<void> {
  queryCache.clear()
  usedPhotoUrls.clear()
  dbUrlCache.clear()
  pickChain = Promise.resolve()

  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from("news_articles")
      .select("image_url")
      .not("image_url", "is", null)

    for (const row of data ?? []) {
      const url = row.image_url?.trim()
      if (url) usedPhotoUrls.add(url)
    }
  } catch {
    // Allow image resolution to proceed when DB is unavailable (e.g. local dev).
  }
}

function extractTitleKeywords(title: string): string[] {
  const tokens = title
    .trim()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !STOPWORDS.has(w.toLowerCase()))

  const properNouns = tokens.filter(
    (w, i) => (i > 0 && /^[A-Z]/.test(w)) || /^[A-Z]{2,}$/.test(w)
  )
  const common = tokens.filter((w) => !properNouns.includes(w))
  return [...properNouns, ...common]
}

/** Build a title-only Pixabay query — never uses feed-level topic_query. */
export function buildPixabayQuery(title: string): string {
  const keywords = extractTitleKeywords(title)
  if (keywords.length > 0) {
    return keywords.slice(0, QUERY_WORD_CAP).join(" ")
  }

  return title
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, QUERY_WORD_CAP)
    .join(" ")
}

type PixabaySearchResponse = {
  hits?: { largeImageURL?: string }[]
}

async function fetchPixabayCandidates(query: string): Promise<string[]> {
  const apiKey = process.env.PIXABAY_API_KEY
  if (!apiKey) return []

  const params = new URLSearchParams({
    key: apiKey,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    per_page: String(CANDIDATES_PER_PAGE),
  })

  let res: Response
  try {
    res = await fetch(`${PIXABAY_API}?${params}`, {
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    return []
  }

  if (!res.ok) return []

  let data: PixabaySearchResponse
  try {
    data = (await res.json()) as PixabaySearchResponse
  } catch {
    return []
  }

  return (data.hits ?? [])
    .map((hit) => hit.largeImageURL?.trim())
    .filter((url): url is string => Boolean(url))
}

async function ensureQueryCache(query: string): Promise<QueryCacheEntry> {
  const trimmed = query.trim()
  let entry = queryCache.get(trimmed)
  if (!entry) {
    const candidates = await fetchPixabayCandidates(trimmed)
    entry = { candidates, lastIndex: -1 }
    queryCache.set(trimmed, entry)
  }
  return entry
}

/** True when Pixabay returned at least one candidate for this query. */
export async function pixabayQueryHasHits(query: string): Promise<boolean> {
  const trimmed = query.trim()
  if (!trimmed) return false
  const entry = await ensureQueryCache(trimmed)
  return entry.candidates.length > 0
}

async function isPhotoUrlUsedInDb(url: string): Promise<boolean> {
  if (usedPhotoUrls.has(url)) return true

  const cached = dbUrlCache.get(url)
  if (cached !== undefined) return cached

  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from("news_articles")
      .select("id")
      .eq("image_url", url)
      .limit(1)
      .maybeSingle()

    const used = Boolean(data)
    dbUrlCache.set(url, used)
    if (used) usedPhotoUrls.add(url)
    return used
  } catch {
    return usedPhotoUrls.has(url)
  }
}

async function pickCandidate(
  candidates: string[],
  entry: QueryCacheEntry
): Promise<string | null> {
  if (candidates.length === 0) return null

  const tryRange = async (start: number, end: number) => {
    for (let i = start; i < end; i++) {
      const url = candidates[i]
      if (await isPhotoUrlUsedInDb(url)) continue
      usedPhotoUrls.add(url)
      entry.lastIndex = i
      return url
    }
    return null
  }

  const fromNext = await tryRange(entry.lastIndex + 1, candidates.length)
  if (fromNext) return fromNext

  const fromStart = await tryRange(0, entry.lastIndex + 1)
  if (fromStart) return fromStart

  entry.lastIndex = 0
  const fallback = candidates[0]
  usedPhotoUrls.add(fallback)
  return fallback
}

/** Search Pixabay; dedupes via in-memory set + DB, rotates within a query. */
export async function resolvePixabayImage(query: string): Promise<string | null> {
  const trimmed = query.trim()
  if (!trimmed) return null

  return withPickLock(async () => {
    const entry = await ensureQueryCache(trimmed)
    return pickCandidate(entry.candidates, entry)
  })
}
