/** Google-hosted imagery (RSS icons, News branding, OG on news.google.com wrappers). */
const GOOGLE_IMAGE_HOST_SUFFIXES = [
  "news.google.com",
  "google.com",
  "gstatic.com",
  "ggpht.com",
  "googleusercontent.com",
]

const IMAGE_CDN_HOST_SUFFIXES = [
  "pixabay.com",
  "cdn.pixabay.com",
  "ytimg.com",
  "bbci.co.uk",
  "bbc.com",
  "i.guim.co.uk",
  "reutersmedia.net",
  "reuters.com",
  "cloudfront.net",
  "akamaized.net",
  "fastly.net",
  "wp.com",
  "wordpress.com",
  "imgur.com",
  "cdn.ampproject.org",
  "ampproject.org",
  "cnn.com",
  "media.cnn.com",
  "nytimes.com",
  "static01.nyt.com",
  "washingtonpost.com",
  "theguardian.com",
  "apnews.com",
  "npr.org",
  "pbs.org",
  "aljazeera.com",
  "france24.com",
  "dw.com",
  "euronews.com",
  "politico.com",
  "axios.com",
  "substackcdn.com",
  "medium.com",
  "licdn.com",
  "fbcdn.net",
  "twimg.com",
  "bloomberg.com",
  "ft.com",
  "wsj.net",
  "forbes.com",
  "gettyimages.com",
  "shutterstock.com",
]

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp)(\?|$)/i

const SUSPICIOUS_OG_SUBSTRINGS = [
  "logo",
  "icon",
  "default",
  "placeholder",
  "share",
  "social",
]

export const MIN_OG_IMAGE_BYTES = 10_240

function parseDimension(value: unknown): number | null {
  if (value == null) return null
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : null
}

function isTrackingPixel(width: number | null, height: number | null): boolean {
  if (width != null && width < 50) return true
  if (height != null && height < 50) return true
  return false
}

function hostLooksLikeImageCdn(hostname: string): boolean {
  const host = hostname.toLowerCase()
  return IMAGE_CDN_HOST_SUFFIXES.some(
    (suffix) => host === suffix || host.endsWith(`.${suffix}`)
  )
}

function parseHttpsUrl(rawUrl: string): URL | null {
  const trimmed = rawUrl.trim()
  if (!trimmed || trimmed.startsWith("data:")) return null
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== "https:") return null
    return parsed
  } catch {
    return null
  }
}

/** Reject generic publisher OG assets (logos, share cards, placeholders). */
export function isSuspiciousOgImageUrl(rawUrl: string): boolean {
  const lower = rawUrl.toLowerCase()
  return SUSPICIOUS_OG_SUBSTRINGS.some((token) => lower.includes(token))
}

/** True when the URL is Google News branding / RSS iconography, not a publisher hero. */
export function isGoogleHostedImageUrl(rawUrl: string): boolean {
  const parsed = parseHttpsUrl(rawUrl)
  if (!parsed) return false
  const host = parsed.hostname.toLowerCase()
  return GOOGLE_IMAGE_HOST_SUFFIXES.some(
    (suffix) => host === suffix || host.endsWith(`.${suffix}`)
  )
}

/** Normalize for DB storage and UI — null when missing, Google-hosted, or invalid. */
export function sanitizeNewsImageUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl?.trim()) return null
  const trimmed = rawUrl.trim()
  if (isGoogleHostedImageUrl(trimmed)) return null
  if (!isValidNewsImageUrl(trimmed)) return null
  return trimmed
}

/** Shared validation for RSS media URLs and OG/Twitter meta images. */
export function isValidNewsImageUrl(
  rawUrl: string,
  dimensions?: { width?: unknown; height?: unknown }
): boolean {
  const parsed = parseHttpsUrl(rawUrl)
  if (!parsed) return false

  if (isGoogleHostedImageUrl(parsed.href)) return false

  const width = parseDimension(dimensions?.width)
  const height = parseDimension(dimensions?.height)
  if (isTrackingPixel(width, height)) return false

  const pathAndQuery = `${parsed.pathname}${parsed.search}`
  if (IMAGE_EXTENSIONS.test(pathAndQuery)) return true

  return hostLooksLikeImageCdn(parsed.hostname)
}

/** HEAD check — true when Content-Length is present and below ~10KB (likely a logo). */
export async function isOgImageTooSmall(
  rawUrl: string,
  userAgent: string
): Promise<boolean> {
  try {
    const res = await fetch(rawUrl, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(5_000),
      headers: { "User-Agent": userAgent },
    })
    if (!res.ok) return false

    const contentLength = res.headers.get("content-length")
    if (!contentLength) return false

    const bytes = Number(contentLength)
    return Number.isFinite(bytes) && bytes > 0 && bytes < MIN_OG_IMAGE_BYTES
  } catch {
    return false
  }
}
