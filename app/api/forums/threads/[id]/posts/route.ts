import { NextRequest, NextResponse } from "next/server"
import { addPost, getThread } from "@/lib/forums-store"
import { getUserId } from "@/lib/auth-server"

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 })

  const { id } = await ctx.params
  const existing = await getThread(id)
  if (!existing) return NextResponse.json({ error: "Thread not found" }, { status: 404 })

  let body: { content?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const content = (body.content || "").trim()
  if (!content || content.length < 2) {
    return NextResponse.json({ error: "Reply is too short" }, { status: 400 })
  }
  const post = await addPost(id, userId, content)
  return NextResponse.json({ post }, { status: 201 })
}
