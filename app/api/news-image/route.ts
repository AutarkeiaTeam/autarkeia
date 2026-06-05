import { NextResponse } from "next/server"
import { sanitizeNewsImageUrl } from "@/lib/news-image-url"

export const dynamic = "force-dynamic"

const PROXY_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

export async function GET(request: Request) {
  const rawUrl = new URL(request.url).searchParams.get("url")
  const imageUrl = sanitizeNewsImageUrl(rawUrl)
  if (!imageUrl) {
    return new NextResponse(null, { status: 404 })
  }

  let upstream: Response
  try {
    upstream = await fetch(imageUrl, {
      headers: { "User-Agent": PROXY_USER_AGENT },
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    return new NextResponse(null, { status: 404 })
  }

  if (!upstream.ok) {
    return new NextResponse(null, { status: 404 })
  }

  const contentType = upstream.headers.get("content-type") ?? ""
  if (!contentType.startsWith("image/")) {
    return new NextResponse(null, { status: 404 })
  }

  const bytes = await upstream.arrayBuffer()
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, s-maxage=86400, immutable",
    },
  })
}
