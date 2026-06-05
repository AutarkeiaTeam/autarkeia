import {
  isValidNewsImageUrl,
  sanitizeNewsImageUrl,
} from "@/lib/news-image-url"
import { resolveNewsArticleImages } from "@/lib/news-image-resolve"
import { resolveNewsSourceUrl } from "@/lib/news-source-url"
import type { ParsedRssItem } from "@/lib/news-types"

export const NEWS_OG_USER_AGENT =
  "Mozilla/5.0 (compatible; AutarkeiaBot/1.0; +https://autarkeia.world)"

const FETCH_TIMEOUT_MS = 5000
const MAX_REDIRECTS = 5
/** Cap downloaded HTML; Google News places og:image around ~577k. */
const HTML_SCAN_BYTES = 800_000
export const OG_IMAGE_BATCH_SIZE = 8

const MIN_ARTICLE_IMG_PX = 200
const SKIP_IMG_SRC_SUBSTRINGS = ["logo", "icon", "avatar"]

const OG_META_SPECS: { attr: "property" | "name"; key: string }[] = [
  { attr: "property", key: "og:image" },
  { attr: "property", key: "og:image:secure_url" },
  { attr: "name", key: "twitter:image" },
  { attr: "name", key: "twitter:image:src" },
]

function fetchSignal(): AbortSignal {
  return AbortSignal.timeout(FETCH_TIMEOUT_MS)
}

function fetchHeaders(accept: string): HeadersInit {
  return {
    "User-Agent": NEWS_OG_USER_AGENT,
    Accept: accept,
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .trim()
}

function resolveHttpsUrl(raw: string, baseUrl: string): string | null {
  const trimmed = decodeHtmlEntities(raw)
  if (!trimmed || trimmed.startsWith("data:")) return null
  try {
    const resolved = new URL(trimmed, baseUrl)
    if (resolved.protocol === "http:") {
      resolved.protocol = "https:"
    }
    if (resolved.protocol !== "https:") return null
    return resolved.href
  } catch {
    return null
  }
}

function metaTagContent(html: string, attr: "property" | "name", key: string): string | null {
  const escaped = escapeRegExp(key)
  const patterns = [
    new RegExp(
      `<meta[^>]+${attr}=["']${escaped}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${escaped}["']`,
      "i"
    ),
  ]
  for (const re of patterns) {
    const match = html.match(re)
    if (match?.[1]) return match[1]
  }
  return null
}

function parseImgDimension(tag: string, attr: "width" | "height"): number | null {
  const match = tag.match(new RegExp(`\\b${attr}=["'](\\d+)["']`, "i"))
  if (!match?.[1]) return null
  const value = Number(match[1])
  return Number.isFinite(value) && value > 0 ? value : null
}

function isSkippableArticleImg(src: string, tag: string): boolean {
  const lower = src.toLowerCase()
  if (SKIP_IMG_SRC_SUBSTRINGS.some((token) => lower.includes(token))) return true

  const width = parseImgDimension(tag, "width")
  const height = parseImgDimension(tag, "height")
  if (width != null && width < MIN_ARTICLE_IMG_PX) return true
  if (height != null && height < MIN_ARTICLE_IMG_PX) return true
  return false
}

function firstImgInArticleOrMain(html: string): string | null {
  for (const region of ["article", "main"] as const) {
    const regionMatch = html.match(
      new RegExp(`<${region}\\b[^>]*>([\\s\\S]*?)<\\/${region}>`, "i")
    )
    if (!regionMatch?.[1]) continue

    const imgTags = regionMatch[1].match(/<img[^>]+>/gi) ?? []
    for (const tag of imgTags) {
      const srcMatch = tag.match(/\bsrc=["']([^"']+)["']/i)
      const src = srcMatch?.[1]?.trim()
      if (!src || isSkippableArticleImg(src, tag)) continue
      return src
    }
  }
  return null
}

function isArticleSchemaType(value: unknown): boolean {
  if (typeof value === "string") {
    return value === "NewsArticle" || value === "Article"
  }
  if (Array.isArray(value)) {
    return value.some((item) => isArticleSchemaType(item))
  }
  return false
}

function normalizeJsonLdImageValue(value: unknown, pageUrl: string): string | null {
  if (typeof value === "string") {
    return pickResolvableImage(value, pageUrl)
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const picked = normalizeJsonLdImageValue(item, pageUrl)
      if (picked) return picked
    }
    return null
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>
    for (const key of ["url", "contentUrl", "@id"] as const) {
      const raw = record[key]
      if (typeof raw === "string") {
        const picked = pickResolvableImage(raw, pageUrl)
        if (picked) return picked
      }
    }
  }

  return null
}

function jsonLdArticleImage(html: string, pageUrl: string): string | null {
  const blocks = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  )

  for (const match of blocks) {
    let data: unknown
    try {
      data = JSON.parse(match[1].trim())
    } catch {
      continue
    }

    const picked = walkJsonLdForArticleImage(data, pageUrl)
    if (picked) return picked
  }

  return null
}

function walkJsonLdForArticleImage(value: unknown, pageUrl: string): string | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const picked = walkJsonLdForArticleImage(item, pageUrl)
      if (picked) return picked
    }
    return null
  }

  if (!value || typeof value !== "object") return null

  const record = value as Record<string, unknown>
  if (isArticleSchemaType(record["@type"]) && record.image != null) {
    const picked = normalizeJsonLdImageValue(record.image, pageUrl)
    if (picked) return picked
  }

  if (record["@graph"] != null) {
    const fromGraph = walkJsonLdForArticleImage(record["@graph"], pageUrl)
    if (fromGraph) return fromGraph
  }

  for (const child of Object.values(record)) {
    const picked = walkJsonLdForArticleImage(child, pageUrl)
    if (picked) return picked
  }

  return null
}

function boundedHtml(raw: string): string {
  return raw.length <= HTML_SCAN_BYTES ? raw : raw.slice(0, HTML_SCAN_BYTES)
}

/**
 * Search the full bounded HTML for OG/Twitter image meta tags (regex, any position).
 */
function pickResolvableImage(raw: string | null, pageUrl: string): string | null {
  if (!raw) return null
  const resolved = resolveHttpsUrl(raw, pageUrl)
  if (!resolved || !isValidNewsImageUrl(resolved)) return null
  return sanitizeNewsImageUrl(resolved)
}

export function extractOgImageFromHtml(html: string, pageUrl: string): string | null {
  const scan = boundedHtml(html)

  for (const spec of OG_META_SPECS) {
    const picked = pickResolvableImage(metaTagContent(scan, spec.attr, spec.key), pageUrl)
    if (picked) return picked
  }

  const fromJsonLd = jsonLdArticleImage(scan, pageUrl)
  if (fromJsonLd) return fromJsonLd

  return pickResolvableImage(firstImgInArticleOrMain(scan), pageUrl)
}

function logOgFetch(payload: Record<string, unknown>): void {
  console.log("[news-og]", JSON.stringify(payload))
}

const HTML_ACCEPT = "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8"

/** Follow redirect chain (Google News → publisher), up to MAX_REDIRECTS hops. */
export async function resolvePublisherUrl(sourceUrl: string): Promise<string | null> {
  let current = sourceUrl

  for (let hop = 0; hop < MAX_REDIRECTS; hop++) {
    let res: Response
    try {
      res = await fetch(current, {
        method: "GET",
        redirect: "manual",
        signal: fetchSignal(),
        headers: fetchHeaders(HTML_ACCEPT),
      })
    } catch {
      return null
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location")
      if (!location) return res.url || current
      const next = resolveHttpsUrl(location, current)
      if (!next) return null
      current = next
      continue
    }

    if (res.ok) return res.url || current
    if (res.status === 403 || res.status === 401) return null
    return null
  }

  return current
}

/** Resolve hero image from publisher Open Graph / Twitter meta tags. */
export async function resolveArticleImage(
  sourceUrl: string,
  publisherFetchUrl?: string
): Promise<string | null> {
  const fetchUrl = publisherFetchUrl ?? (await resolveNewsSourceUrl(sourceUrl))
  let current = fetchUrl
  const hops: { status: number; url: string }[] = []

  for (let hop = 0; hop < MAX_REDIRECTS; hop++) {
    let res: Response
    try {
      res = await fetch(current, {
        method: "GET",
        redirect: "manual",
        signal: fetchSignal(),
        headers: fetchHeaders(HTML_ACCEPT),
      })
    } catch (err) {
      logOgFetch({
        source_url: sourceUrl,
        fetch_url: fetchUrl,
        hops,
        reason: "fetch_error",
        error: err instanceof Error ? err.name : "unknown",
        message: err instanceof Error ? err.message : String(err),
        og_image: null,
      })
      return null
    }

    hops.push({ status: res.status, url: current })

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location")
      if (!location) {
        logOgFetch({
          source_url: sourceUrl,
          hops,
          final_url: res.url || current,
          reason: "redirect_missing_location",
          og_image: null,
        })
        return null
      }
      const next = resolveHttpsUrl(location, current)
      if (!next) {
        logOgFetch({
          source_url: sourceUrl,
          fetch_url: fetchUrl,
          hops,
          reason: "redirect_location_invalid",
          location,
          og_image: null,
        })
        return null
      }
      current = next
      continue
    }

    if (res.status === 403 || res.status === 401) {
      logOgFetch({
        source_url: sourceUrl,
        fetch_url: fetchUrl,
        hops,
        final_url: res.url || current,
        reason: `http_${res.status}`,
        og_image: null,
      })
      return null
    }

    if (!res.ok) {
      logOgFetch({
        source_url: sourceUrl,
        fetch_url: fetchUrl,
        hops,
        final_url: res.url || current,
        reason: `http_${res.status}`,
        og_image: null,
      })
      return null
    }

    const pageUrl = res.url || current
    const rawHtml = await res.text()
    const html = boundedHtml(rawHtml)
    const image = extractOgImageFromHtml(html, pageUrl)

    logOgFetch({
      source_url: sourceUrl,
      fetch_url: fetchUrl,
      hops,
      final_url: pageUrl,
      html_bytes: rawHtml.length,
      scanned_bytes: html.length,
      og_image: image,
      reason: image ? "resolved" : "og_meta_not_found_or_rejected",
    })

    return image
  }

  logOgFetch({
    source_url: sourceUrl,
    fetch_url: fetchUrl,
    hops,
    final_url: current,
    reason: "max_redirects_exceeded",
    og_image: null,
  })
  return null
}

export type OgImageBatchStats = {
  og_image_attempted: number
  og_image_resolved: number
  og_image_failed: number
}

/** Fetch OG images for RSS candidates in parallel batches (before Haiku). */
export async function enrichCandidatesWithOgImages(
  candidates: ParsedRssItem[]
): Promise<{ items: ParsedRssItem[]; stats: OgImageBatchStats }> {
  const items: ParsedRssItem[] = []
  let og_image_resolved = 0

  for (let i = 0; i < candidates.length; i += OG_IMAGE_BATCH_SIZE) {
    const batch = candidates.slice(i, i + OG_IMAGE_BATCH_SIZE)
    const settled = await Promise.allSettled(
      batch.map(async (item) => {
        const resolved = await resolveNewsArticleImages({
          sourceUrl: item.source_url,
          title: item.raw_title,
        })
        return {
          enriched: {
            ...item,
            image_url: resolved.image_url,
            image_source: resolved.image_source,
            image_credit_name: resolved.image_credit_name,
            image_credit_url: resolved.image_credit_url,
            resolved_url: resolved.resolved_url,
          } as ParsedRssItem,
          fromOg: resolved.image_source === "publisher",
        }
      })
    )

    for (let j = 0; j < settled.length; j++) {
      const result = settled[j]
      if (result.status === "fulfilled") {
        items.push(result.value.enriched)
        if (result.value.fromOg) og_image_resolved++
      } else {
        const fallback = batch[j]
        logOgFetch({
          source_url: fallback.source_url,
          reason: "promise_rejected",
          error: String(result.reason),
          og_image: null,
        })
        items.push({
          ...fallback,
          image_url: fallback.image_url ?? null,
          image_source: fallback.image_source ?? null,
          image_credit_name: fallback.image_credit_name ?? null,
          image_credit_url: fallback.image_credit_url ?? null,
        })
      }
    }
  }

  const og_image_attempted = candidates.length
  return {
    items,
    stats: {
      og_image_attempted,
      og_image_resolved,
      og_image_failed: og_image_attempted - og_image_resolved,
    },
  }
}
