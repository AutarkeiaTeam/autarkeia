export const NEWS_TITLE_DEDUP_HOURS = 48
export const NEWS_TITLE_SIMILARITY_THRESHOLD = 0.6

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

/** Lowercase, strip punctuation, drop stopwords — word set for Jaccard comparison. */
export function normalizeTitleWords(title: string): Set<string> {
  const words = title
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))

  return new Set(words)
}

export function titleWordOverlap(a: string, b: string): {
  intersection: number
  jaccard: number
  overlapCoefficient: number
} {
  const setA = normalizeTitleWords(a)
  const setB = normalizeTitleWords(b)
  if (setA.size === 0 && setB.size === 0) {
    return { intersection: 0, jaccard: 1, overlapCoefficient: 1 }
  }
  if (setA.size === 0 || setB.size === 0) {
    return { intersection: 0, jaccard: 0, overlapCoefficient: 0 }
  }

  let intersection = 0
  for (const word of setA) {
    if (setB.has(word)) intersection++
  }

  const union = setA.size + setB.size - intersection
  const jaccard = union === 0 ? 0 : intersection / union
  const overlapCoefficient =
    intersection / Math.min(setA.size, setB.size)

  return { intersection, jaccard, overlapCoefficient }
}

export function titleJaccardSimilarity(a: string, b: string): number {
  return titleWordOverlap(a, b).jaccard
}

/**
 * Duplicate when headlines are near-identical (Jaccard ≥ 0.6) or when one title
 * is a subset of another (overlap ≥ 0.5 with ≥ 3 shared keywords — catches
 * "RBI cuts GDP forecast…" vs "RBI lowers GDP forecast…" clusters).
 */
export function isSimilarTitle(
  candidate: string,
  existing: string,
  threshold = NEWS_TITLE_SIMILARITY_THRESHOLD
): boolean {
  const { intersection, jaccard, overlapCoefficient } = titleWordOverlap(
    candidate,
    existing
  )
  if (jaccard >= threshold) return true
  return intersection >= 3 && overlapCoefficient >= 0.5
}

export function isDuplicateOfAny(
  candidate: string,
  existingTitles: string[],
  threshold = NEWS_TITLE_SIMILARITY_THRESHOLD
): boolean {
  return existingTitles.some((title) => isSimilarTitle(candidate, title, threshold))
}
