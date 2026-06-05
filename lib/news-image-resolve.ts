import {
  buildPixabayQuery,
  pixabayQueryHasHits,
  resolvePixabayImage,
} from "@/lib/news-fallback-image"
import {
  isOgImageTooSmall,
  isSuspiciousOgImageUrl,
  sanitizeNewsImageUrl,
} from "@/lib/news-image-url"
import { NEWS_OG_USER_AGENT, resolveArticleImage } from "@/lib/news-images"
import {
  resolveNewsSourceUrl,
  storablePublisherUrl,
} from "@/lib/news-source-url"

export type NewsImageSource = "publisher" | "pixabay"

export type NewsImageFields = {
  image_url: string | null
  image_source: NewsImageSource | null
  image_credit_name: string | null
  image_credit_url: string | null
  resolved_url: string | null
}

const emptyCredits = {
  image_credit_name: null as string | null,
  image_credit_url: null as string | null,
}

async function acceptPublisherOgImage(
  rawUrl: string | null
): Promise<string | null> {
  const sanitized = sanitizeNewsImageUrl(rawUrl)
  if (!sanitized) return null
  if (isSuspiciousOgImageUrl(sanitized)) return null
  if (await isOgImageTooSmall(sanitized, NEWS_OG_USER_AGENT)) return null
  return sanitized
}

async function pixabayImageFields(
  query: string
): Promise<Pick<
  NewsImageFields,
  "image_url" | "image_source" | "image_credit_name" | "image_credit_url"
> | null> {
  const hit = await resolvePixabayImage(query)
  if (!hit) return null
  const image_url = sanitizeNewsImageUrl(hit)
  if (!image_url) return null
  return {
    image_url,
    image_source: "pixabay",
    ...emptyCredits,
  }
}

async function resolvePixabayFallback(
  title: string,
  category?: string | null
): Promise<Pick<
  NewsImageFields,
  "image_url" | "image_source" | "image_credit_name" | "image_credit_url"
>> {
  const titleQuery = buildPixabayQuery(title)
  const fromTitle = await pixabayImageFields(titleQuery)
  if (fromTitle) return fromTitle

  const titleHadHits = await pixabayQueryHasHits(titleQuery)
  if (!titleHadHits && category) {
    const fromCategory = await pixabayImageFields(
      category.trim().toLowerCase()
    )
    if (fromCategory) return fromCategory
  }

  return {
    image_url: null,
    image_source: null,
    ...emptyCredits,
  }
}

/** Publisher OG → Pixabay (title) → Pixabay (category, only if title has zero hits) → null. */
export async function resolveNewsArticleImages(options: {
  sourceUrl: string
  title: string
  category?: string | null
  cachedResolvedUrl?: string | null
  /** Skip publisher OG — re-resolve Pixabay fallback only. */
  pixabayOnly?: boolean
}): Promise<NewsImageFields> {
  const publisherUrl = await resolveNewsSourceUrl(
    options.sourceUrl,
    options.cachedResolvedUrl
  )
  const resolved_url = storablePublisherUrl(options.sourceUrl, publisherUrl)

  if (!options.pixabayOnly) {
    const fromOg = await acceptPublisherOgImage(
      await resolveArticleImage(options.sourceUrl, publisherUrl)
    )
    if (fromOg) {
      return {
        image_url: fromOg,
        image_source: "publisher",
        ...emptyCredits,
        resolved_url,
      }
    }
  }

  const fallback = await resolvePixabayFallback(
    options.title,
    options.category
  )
  return { ...fallback, resolved_url }
}

/** Category Pixabay only when title query returned zero Pixabay hits (post-Haiku). */
export async function applyCategoryPixabayFallback(
  fields: NewsImageFields,
  category: string,
  title: string
): Promise<NewsImageFields> {
  if (fields.image_url) return fields

  const titleQuery = buildPixabayQuery(title)
  if (await pixabayQueryHasHits(titleQuery)) return fields

  const fromCategory = await pixabayImageFields(category.trim().toLowerCase())
  if (!fromCategory) return fields
  return { ...fields, ...fromCategory }
}
