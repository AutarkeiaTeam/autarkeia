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

export type NewsImageSource = "publisher"

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

/** Publisher OG / JSON-LD / article image only — no stock-photo fallbacks. */
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

  const fromPublisher = await acceptPublisherOgImage(
    await resolveArticleImage(options.sourceUrl, publisherUrl)
  )
  if (fromPublisher) {
    return {
      image_url: fromPublisher,
      image_source: "publisher",
      ...emptyCredits,
      resolved_url,
    }
  }

  return {
    image_url: null,
    image_source: null,
    ...emptyCredits,
    resolved_url,
  }
}
