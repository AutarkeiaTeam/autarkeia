const IMAGE_CDN_HOST_SUFFIXES = [
  "googleusercontent.com",
  "ggpht.com",
  "gstatic.com",
  "ytimg.com",
  "bbci.co.uk",
  "bbc.com",
  "reutersmedia.net",
  "reuters.com",
  "cloudfront.net",
  "akamaized.net",
  "wp.com",
  "wordpress.com",
  "imgur.com",
  "cdn.ampproject.org",
  "ampproject.org",
  "cnn.com",
  "nytimes.com",
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
]

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp)(\?|$)/i

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

/** Shared validation for RSS media URLs and OG/Twitter meta images. */
export function isValidNewsImageUrl(
  rawUrl: string,
  dimensions?: { width?: unknown; height?: unknown }
): boolean {
  const trimmed = rawUrl.trim()
  if (!trimmed || trimmed.startsWith("data:")) return false

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return false
  }

  if (parsed.protocol !== "https:") return false

  const width = parseDimension(dimensions?.width)
  const height = parseDimension(dimensions?.height)
  if (isTrackingPixel(width, height)) return false

  const pathAndQuery = `${parsed.pathname}${parsed.search}`
  if (IMAGE_EXTENSIONS.test(pathAndQuery)) return true

  return hostLooksLikeImageCdn(parsed.hostname)
}
