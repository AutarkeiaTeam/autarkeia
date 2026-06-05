const PIXABAY_API = "https://pixabay.com/api/"
const QUERY_WORD_CAP = 6
const CANDIDATES_PER_PAGE = 20

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

type QueryCacheEntry = {
  candidates: string[]
  lastIndex: number
}

const queryCache = new Map<string, QueryCacheEntry>()
const usedPhotoUrls = new Set<string>()

/** Clear in-memory Pixabay cache and used-URL set (call at start of each cron/backfill run). */
export function clearPixabayImageCache(): void {
  queryCache.clear()
  usedPhotoUrls.clear()
}

export function buildPixabayQuery(
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

function pickCandidate(
  candidates: string[],
  entry: QueryCacheEntry
): string | null {
  if (candidates.length === 0) return null

  const tryRange = (start: number, end: number) => {
    for (let i = start; i < end; i++) {
      const url = candidates[i]
      if (!usedPhotoUrls.has(url)) {
        usedPhotoUrls.add(url)
        entry.lastIndex = i
        return url
      }
    }
    return null
  }

  const fromNext = tryRange(entry.lastIndex + 1, candidates.length)
  if (fromNext) return fromNext

  const fromStart = tryRange(0, entry.lastIndex + 1)
  if (fromStart) return fromStart

  entry.lastIndex = 0
  return candidates[0]
}

/** Search Pixabay for a horizontal photo; dedupes across the run and rotates within a query. */
export async function resolvePixabayImage(query: string): Promise<string | null> {
  const trimmed = query.trim()
  if (!trimmed) return null

  let entry = queryCache.get(trimmed)
  if (!entry) {
    const candidates = await fetchPixabayCandidates(trimmed)
    entry = { candidates, lastIndex: -1 }
    queryCache.set(trimmed, entry)
  }

  return pickCandidate(entry.candidates, entry)
}
