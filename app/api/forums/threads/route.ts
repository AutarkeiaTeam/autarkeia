import { NextRequest, NextResponse } from "next/server"
import { CATEGORIES, createThread, listThreads } from "@/lib/forums-store"
import { getUserId } from "@/lib/auth-server"

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") ?? undefined
  const threads = await listThreads(category)
  return NextResponse.json({ threads })
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }
  let body: { title?: string; description?: string; category?: string; body?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const title = (body.title || "").trim()
  const description = (body.description || "").trim()
  const category = (body.category || "").trim()
  const firstPost = (body.body || "").trim()
  if (!title || title.length < 4) {
    return NextResponse.json({ error: "Title is too short" }, { status: 400 })
  }
  if (!firstPost || firstPost.length < 4) {
    return NextResponse.json({ error: "First post is too short" }, { status: 400 })
  }
  if (!CATEGORIES.some((c) => c.id === category)) {
    return NextResponse.json({ error: "Unknown category" }, { status: 400 })
  }
  const thread = await createThread({ title, description, category, body: firstPost, author_id: userId })
  return NextResponse.json({ thread }, { status: 201 })
}
