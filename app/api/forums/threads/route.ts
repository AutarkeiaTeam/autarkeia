import { NextRequest, NextResponse } from "next/server"
import { CATEGORIES, createThread, listThreads } from "@/lib/forums-store"
import { getUserId } from "@/lib/auth-server"
import { parseForumSortMode } from "@/lib/forums-shared"
import { getLocale } from "@/lib/i18n-server"
import { processPostMentions } from "@/lib/forums-mentions"

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category") ?? undefined
    const sort = parseForumSortMode(req.nextUrl.searchParams.get("sort"))
    const viewerId = await getUserId()
    const threads = await listThreads({ category, sort, viewerId })
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
  const firstPostBody = (body.body || "").trim()
  if (!title || title.length < 4) {
    return NextResponse.json({ error: "forums.error.title_too_short" }, { status: 400 })
  }
  if (!firstPostBody || firstPostBody.length < 4) {
    return NextResponse.json({ error: "forums.error.first_post_too_short" }, { status: 400 })
  }
  if (!CATEGORIES.some((c) => c.id === category)) {
    return NextResponse.json({ error: "forums.error.unknown_category" }, { status: 400 })
  }
  const { thread, firstPost } = await createThread({
    title,
    description,
    category,
    body: firstPostBody,
    author_id: userId,
  })

  try {
    const locale = await getLocale()
    await processPostMentions({
      postId: firstPost.id,
      content: firstPost.content,
      authorId: userId,
      threadId: thread.id,
      threadTitle: thread.title,
      locale,
    })
  } catch (err) {
    console.error("[POST /api/forums/threads] mention processing failed:", err)
  }

  return NextResponse.json({ thread }, { status: 201 })
}
