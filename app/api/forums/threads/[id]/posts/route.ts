import { NextRequest, NextResponse } from "next/server"
import { addPost, getThread } from "@/lib/forums-store"
import { getUserId } from "@/lib/auth-server"
import { getLocale } from "@/lib/i18n-server"
import { notifyForumReply } from "@/lib/notification-dispatch"
import { processPostMentions } from "@/lib/forums-mentions"
import { isAdmin } from "@/lib/profiles"

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: "forums.error.auth_required" }, { status: 401 })

  const { id } = await ctx.params
  const existing = await getThread(id)
  if (!existing) return NextResponse.json({ error: "forums.error.thread_not_found" }, { status: 404 })

  if (existing.thread.locked && !(await isAdmin(userId))) {
    return NextResponse.json({ error: "forums.error.thread_locked" }, { status: 409 })
  }

  let body: { content?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "forums.error.invalid_json" }, { status: 400 })
  }
  const content = (body.content || "").trim()
  if (!content || content.length < 2) {
    return NextResponse.json({ error: "forums.error.reply_too_short" }, { status: 400 })
  }
  const post = await addPost(id, userId, content)

  try {
    const locale = await getLocale()
    await Promise.all([
      notifyForumReply({
        threadId: id,
        actorId: userId,
        postId: post.id,
        content,
        locale,
      }),
      processPostMentions({
        postId: post.id,
        content,
        authorId: userId,
        threadId: id,
        threadTitle: existing.thread.title,
        locale,
      }),
    ])
  } catch (err) {
    console.error("[POST /api/forums/threads/[id]/posts] notification failed:", err)
  }

  return NextResponse.json({ post }, { status: 201 })
}
