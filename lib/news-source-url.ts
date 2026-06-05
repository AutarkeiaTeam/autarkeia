const NEWS_OG_USER_AGENT =
  "Mozilla/5.0 (compatible; AutarkeiaBot/1.0; +https://autarkeia.world)"

const RESOLVE_TIMEOUT_MS = 10_000
const resolvedUrlCache = new Map<string, string>()

function resolveSignal(): AbortSignal {
  return AbortSignal.timeout(RESOLVE_TIMEOUT_MS)
}

function parseHttpsUrl(raw: string): string | null {
  try {
    const parsed = new URL(raw.trim())
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null
    if (parsed.protocol === "http:") parsed.protocol = "https:"
    return parsed.href
  } catch {
    return null
  }
}

/** Google News RSS / redirect wrapper (not a publisher article URL). */
export function isGoogleNewsUrl(rawUrl: string): boolean {
  try {
    const host = new URL(rawUrl).hostname.toLowerCase()
    return host === "news.google.com" || host.endsWith(".news.google.com")
  } catch {
    return false
  }
}

function extractGoogleNewsArticleId(url: string): string | null {
  const match = url.match(/\/(?:rss\/)?articles\/([^?]+)/i)
  return match?.[1] ?? null
}

function tryDecodeBase64GoogleNewsArticle(articleId: string): string | null {
  const normalized = articleId.replace(/-/g, "+").replace(/_/g, "/")
  const padLen = (4 - (normalized.length % 4)) % 4
  const padded = normalized + "=".repeat(padLen)

  let bytes: Buffer
  try {
    bytes = Buffer.from(padded, "base64")
  } catch {
    return null
  }

  const utf8 = bytes.toString("utf8")
  const direct = utf8.match(/https?:\/\/[^\s"'\x00<>\]\\]+/)
  if (direct?.[0]) {
    const url = parseHttpsUrl(direct[0])
    if (url && !isGoogleNewsUrl(url)) return url
  }

  let binary = bytes.toString("latin1")
  const prefix = Buffer.from([0x08, 0x13, 0x22]).toString("latin1")
  if (binary.startsWith(prefix)) binary = binary.slice(prefix.length)

  const suffix = Buffer.from([0xd2, 0x01, 0x00]).toString("latin1")
  if (binary.endsWith(suffix)) binary = binary.slice(0, -suffix.length)

  if (binary.length === 0) return null
  const len = binary.charCodeAt(0)
  if (len >= 0x80 && binary.length > 1) {
    binary = binary.slice(2, len + 2)
  } else {
    binary = binary.slice(1, len + 1)
  }

  if (binary.startsWith("http")) {
    const url = parseHttpsUrl(binary)
    if (url && !isGoogleNewsUrl(url)) return url
  }

  return null
}

async function tryFollowRedirects(url: string): Promise<string | null> {
  for (const method of ["HEAD", "GET"] as const) {
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: resolveSignal(),
        headers: {
          "User-Agent": NEWS_OG_USER_AGENT,
          Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        },
      })
      const final = parseHttpsUrl(res.url)
      if (final && !isGoogleNewsUrl(final)) return final
    } catch {
      // try next method
    }
  }
  return null
}

async function tryBatchexecuteDecode(articleId: string): Promise<string | null> {
  const cookies = ["CONSENT=PENDING+987"]
  const pageUrl = `https://news.google.com/articles/${articleId}`

  let pageRes: Response
  try {
    pageRes = await fetch(pageUrl, {
      redirect: "follow",
      signal: resolveSignal(),
      headers: {
        "User-Agent": NEWS_OG_USER_AGENT,
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        Cookie: cookies.join("; "),
      },
    })
  } catch {
    return null
  }

  if (!pageRes.ok) return null
  const html = await pageRes.text()

  const sgMatch = html.match(/data-n-a-sg="([^"]+)"/)
  const tsMatch = html.match(/data-n-a-ts="([^"]+)"/)
  if (!sgMatch?.[1] || !tsMatch?.[1]) return null

  const signature = sgMatch[1]
  const timestamp = Number.parseInt(tsMatch[1], 10)
  if (!Number.isFinite(timestamp)) return null

  const innerJson = JSON.stringify([
    "garturlreq",
    [
      ["X", "X", ["X", "X"], null, null, 1, 1, "US:en", null, 1, null, null, null, null, null, 0, 1],
      "X",
      "X",
      1,
      [1, 1, 1],
      1,
      1,
      null,
      0,
      0,
      null,
      0,
    ],
    articleId,
    timestamp,
    signature,
  ])

  const body = new URLSearchParams()
  body.set("f.req", JSON.stringify([[["Fbv4je", innerJson]]]))

  let postRes: Response
  try {
    postRes = await fetch("https://news.google.com/_/DotsSplashUi/data/batchexecute", {
      method: "POST",
      signal: resolveSignal(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent": NEWS_OG_USER_AGENT,
        Cookie: cookies.join("; "),
        Origin: "https://news.google.com",
        Referer: "https://news.google.com/",
      },
      body: body.toString(),
    })
  } catch {
    return null
  }

  if (!postRes.ok) return null

  const respText = await postRes.text()
  const jsonPart = respText.split("\n\n")[1]?.trim()
  if (!jsonPart) return null

  try {
    const parsed = JSON.parse(jsonPart) as unknown
    const first = Array.isArray(parsed) ? parsed[0] : null
    const innerStr =
      Array.isArray(first) && typeof first[2] === "string" ? first[2] : null
    if (!innerStr) return null
    const inner = JSON.parse(innerStr) as unknown
    const decoded =
      Array.isArray(inner) && typeof inner[1] === "string" ? inner[1] : null
    const url = decoded ? parseHttpsUrl(decoded) : null
    if (url && !isGoogleNewsUrl(url)) return url
  } catch {
    return null
  }

  return null
}

async function resolveGoogleNewsUrl(sourceUrl: string): Promise<string | null> {
  const articleId = extractGoogleNewsArticleId(sourceUrl)
  if (!articleId) return null

  const fromBase64 = tryDecodeBase64GoogleNewsArticle(articleId)
  if (fromBase64) return fromBase64

  const fromRedirect = await tryFollowRedirects(sourceUrl)
  if (fromRedirect) return fromRedirect

  const fromBatch = await tryBatchexecuteDecode(articleId)
  if (fromBatch) return fromBatch

  return null
}

/**
 * Resolve Google News redirect URLs to publisher article URLs.
 * Uses in-memory cache; pass `cachedResolved` from DB to skip re-resolution on cron.
 */
export async function resolveNewsSourceUrl(
  sourceUrl: string,
  cachedResolved?: string | null
): Promise<string> {
  if (!isGoogleNewsUrl(sourceUrl)) return sourceUrl

  if (cachedResolved) {
    const cached = parseHttpsUrl(cachedResolved)
    if (cached && !isGoogleNewsUrl(cached)) return cached
  }

  const memCached = resolvedUrlCache.get(sourceUrl)
  if (memCached && !isGoogleNewsUrl(memCached)) return memCached

  const resolved = await resolveGoogleNewsUrl(sourceUrl)
  if (resolved) {
    resolvedUrlCache.set(sourceUrl, resolved)
    return resolved
  }

  return sourceUrl
}

/** Persist publisher URL only when decoded from a Google News redirect. */
export function storablePublisherUrl(sourceUrl: string, resolved: string): string | null {
  if (isGoogleNewsUrl(resolved) || resolved === sourceUrl) return null
  return resolved
}
