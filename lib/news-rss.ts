import { XMLParser } from "fast-xml-parser"
import { isValidNewsImageUrl } from "@/lib/news-image-url"
import { NEWS_FEEDS, googleNewsRssUrl, type NewsFeedConfig } from "@/lib/news-feeds"
import type { ParsedRssItem } from "@/lib/news-types"

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  trimValues: true,
})

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function parsePubDate(raw: string | undefined): Date | null {
  if (!raw?.trim()) return null
  const d = new Date(raw)
  return Number.isNaN(d.getTime()) ? null : d
}

function readSourceName(item: Record<string, unknown>): string | null {
  const source = item.source
  if (typeof source === "string" && source.trim()) return source.trim()
  if (source && typeof source === "object") {
    const obj = source as Record<string, unknown>
    if (typeof obj["#text"] === "string") return obj["#text"].trim()
    if (typeof obj.text === "string") return obj.text.trim()
  }
  return null
}

function itemLink(item: Record<string, unknown>): string | null {
  const link = item.link
  if (typeof link === "string" && link.startsWith("http")) return link.trim()
  if (link && typeof link === "object") {
    const href = (link as Record<string, unknown>).href
    if (typeof href === "string" && href.startsWith("http")) return href.trim()
  }
  const guid = item.guid
  if (typeof guid === "string" && guid.startsWith("http")) return guid.trim()
  return null
}

function mediaNodes(item: Record<string, unknown>, keys: string[]): Record<string, unknown>[] {
  const nodes: Record<string, unknown>[] = []
  for (const key of keys) {
    for (const node of asArray(item[key])) {
      if (node && typeof node === "object") {
        nodes.push(node as Record<string, unknown>)
      }
    }
  }
  return nodes
}

function urlFromMediaNode(node: Record<string, unknown>): string | null {
  const url = node.url
  if (typeof url === "string" && url.trim()) return url.trim()
  return null
}

function firstImgSrcFromHtml(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return match?.[1]?.trim() ?? null
}

export function extractRssItemImageUrl(item: Record<string, unknown>): string | null {
  const candidates: { url: string; width?: unknown; height?: unknown }[] = []

  for (const node of mediaNodes(item, ["media:content", "media:thumbnail"])) {
    const url = urlFromMediaNode(node)
    if (url) {
      candidates.push({ url, width: node.width, height: node.height })
    }
  }

  for (const enc of asArray(item.enclosure)) {
    if (!enc || typeof enc !== "object") continue
    const node = enc as Record<string, unknown>
    const type = String(node.type ?? "")
    const url = typeof node.url === "string" ? node.url.trim() : ""
    if (url && type.toLowerCase().startsWith("image/")) {
      candidates.push({ url, width: node.width, height: node.height })
    }
  }

  const encoded = item["content:encoded"] ?? item.content
  if (typeof encoded === "string" && encoded.includes("<img")) {
    const src = firstImgSrcFromHtml(encoded)
    if (src) candidates.push({ url: src })
  }

  for (const { url, width, height } of candidates) {
    if (isValidNewsImageUrl(url, { width, height })) return url
  }

  return null
}

export async function fetchNewsFeedItems(feed: NewsFeedConfig): Promise<ParsedRssItem[]> {
  const url = googleNewsRssUrl(feed)
  const res = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "AutarkeiaNewsBot/1.0 (+https://autarkeia.world)" },
  })
  if (!res.ok) {
    throw new Error(`RSS fetch failed ${feed.id}: ${res.status}`)
  }
  const xml = await res.text()
  const doc = parser.parse(xml) as Record<string, unknown>
  const channel =
    (doc.rss as Record<string, unknown> | undefined)?.channel ??
    (doc.feed as Record<string, unknown> | undefined)
  if (!channel || typeof channel !== "object") return []

  const items = asArray((channel as Record<string, unknown>).item)
  const out: ParsedRssItem[] = []

  for (const raw of items) {
    if (!raw || typeof raw !== "object") continue
    const item = raw as Record<string, unknown>
    const source_url = itemLink(item)
    const raw_title = stripHtml(String(item.title ?? ""))
    if (!source_url || !raw_title) continue

    const published_at =
      parsePubDate(String(item.pubDate ?? item.published ?? item.updated ?? "")) ?? new Date()

    const description = stripHtml(String(item.description ?? item.summary ?? ""))
    const raw_snippet = description || raw_title

    out.push({
      source_url,
      source_name: readSourceName(item),
      published_at,
      raw_title,
      raw_snippet,
      topic_query: feed.topic_query,
      image_url: extractRssItemImageUrl(item),
    })
  }

  return out
}

export async function fetchAllNewsFeedItems(): Promise<ParsedRssItem[]> {
  const results = await Promise.allSettled(
    NEWS_FEEDS.map((feed) => fetchNewsFeedItems(feed))
  )
  const merged: ParsedRssItem[] = []
  for (const r of results) {
    if (r.status === "fulfilled") merged.push(...r.value)
  }
  return merged
}
