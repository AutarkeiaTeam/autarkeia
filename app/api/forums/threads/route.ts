import { NextRequest, NextResponse } from "next/server"
import { CATEGORIES, createThread, listThreads } from "@/lib/forums-store"
import { getUserId } from "@/lib/auth-server"

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category") ?? undefined
    const threads = await listThreads(category)
    return NextResponse.json({ threads })
  } catch (err) {
    console.error("[GET /api/forums/threads]", err)
    const message = err instanceof Error ? err.message : "forums.error.list_threads_failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json({ error: "forums.error.auth_required" }, { status: 401 })
  }
  let body: { title?: string; description?: string; category?: string; body?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "forums.error.invalid_json" }, { status: 400 })
  }
  const title = (body.title || "").trim()
  const description = (body.description || "").trim()
  const category = (body.category || "").trim()
  const firstPost = (body.body || "").trim()
  if (!title || title.length < 4) {
    return NextResponse.json({ error: "forums.error.title_too_short" }, { status: 400 })
  }
  if (!firstPost || firstPost.length < 4) {
    return NextResponse.json({ error: "forums.error.first_post_too_short" }, { status: 400 })
  }
  if (!CATEGORIES.some((c) => c.id === category)) {
    return NextResponse.json({ error: "forums.error.unknown_category" }, { status: 400 })
  }
  const thread = await createThread({ title, description, category, body: firstPost, author_id: userId })
  return NextResponse.json({ thread }, { status: 201 })
}
