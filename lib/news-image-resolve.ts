import {
  buildUnsplashQuery,
  resolveUnsplashImage,
} from "@/lib/news-fallback-image"
import { sanitizeNewsImageUrl } from "@/lib/news-image-url"
import { resolveArticleImage } from "@/lib/news-images"
import {
  resolveNewsSourceUrl,
  storablePublisherUrl,
} from "@/lib/news-source-url"

export type NewsImageSource = "publisher" | "unsplash"

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

async function unsplashImageFields(
  query: string
): Promise<Pick<
  NewsImageFields,
  "image_url" | "image_source" | "image_credit_name" | "image_credit_url"
> | null> {
  const hit = await resolveUnsplashImage(query)
  if (!hit) return null
  const image_url = sanitizeNewsImageUrl(hit.imageUrl)
  if (!image_url) return null
  return {
    image_url,
    image_source: "unsplash",
    image_credit_name: hit.creditName,
    image_credit_url: hit.creditUrl,
  }
}

/** Publisher OG → Unsplash (title/topic) → Unsplash (category) → null. */
export async function resolveNewsArticleImages(options: {
  sourceUrl: string
  topicQuery?: string | null
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

  const fromTitle = await unsplashImageFields(
    buildUnsplashQuery(options.topicQuery, options.title)
  )
  if (fromTitle) {
    return { ...fromTitle, resolved_url }
  }

  if (options.category) {
    const fromCategory = await unsplashImageFields(
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

/** Category Unsplash only — after Haiku when enrich had no category yet. */
export async function applyCategoryUnsplashFallback(
  fields: NewsImageFields,
  category: string
): Promise<NewsImageFields> {
  if (fields.image_url) return fields
  const fromCategory = await unsplashImageFields(category.trim().toLowerCase())
  if (!fromCategory) return fields
  return { ...fields, ...fromCategory }
}
