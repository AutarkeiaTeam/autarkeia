import {
  buildPixabayQuery,
  pixabayQueryHasHits,
  resolvePixabayImage,
} from "@/lib/news-fallback-image"
import { sanitizeNewsImageUrl } from "@/lib/news-image-url"
import { resolveArticleImage } from "@/lib/news-images"
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

/** Publisher OG → Pixabay (title) → Pixabay (category, only if title has zero hits) → null. */
export async function resolveNewsArticleImages(options: {
  sourceUrl: string
  title: string
  category?: string | null
  cachedResolvedUrl?: string | null
}): Promise<NewsImageFields> {
  const publisherUrl = await resolveNewsSourceUrl(
    options.sourceUrl,
    options.cachedResolvedUrl
  )
  const resolved_url = storablePublisherUrl(options.sourceUrl, publisherUrl)

  const fromOg = sanitizeNewsImageUrl(
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

  const titleQuery = buildPixabayQuery(options.title)
  const fromTitle = await pixabayImageFields(titleQuery)
  if (fromTitle) {
    return { ...fromTitle, resolved_url }
  }

  const titleHadHits = await pixabayQueryHasHits(titleQuery)
  if (!titleHadHits && options.category) {
    const fromCategory = await pixabayImageFields(
      options.category.trim().toLowerCase()
    )
    if (fromCategory) {
      return { ...fromCategory, resolved_url }
    }
  }

  return {
    image_url: null,
    image_source: null,
    ...emptyCredits,
    resolved_url,
  }
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
