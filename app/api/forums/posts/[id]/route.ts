import { NextRequest, NextResponse } from "next/server"
import { deletePost, getPost, getThread, updatePost } from "@/lib/forums-store"
import { getUserId } from "@/lib/auth-server"
import { canModerateForumContent, getForumDeleteAccess } from "@/lib/forum-permissions"
import { getLocale } from "@/lib/i18n-server"
import { processPostMentions } from "@/lib/forums-mentions"

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: "forums.error.auth_required" }, { status: 401 })

  const { id } = await ctx.params
  const existing = await getPost(id)
  if (!existing) return NextResponse.json({ error: "forums.error.not_found" }, { status: 404 })

  const { isAdmin: requesterIsAdmin } = await getForumDeleteAccess(userId)
  if (!canModerateForumContent(userId, existing.author_id, requesterIsAdmin)) {
    return NextResponse.json({ error: "forums.error.forbidden" }, { status: 403 })
  }

  let body: { content?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "forums.error.invalid_json" }, { status: 400 })
  }

  const content = (body.content ?? "").trim()
  if (content.length < 2) {
    return NextResponse.json({ error: "forums.error.reply_too_short" }, { status: 400 })
  }

  const post = await updatePost(id, content, userId, requesterIsAdmin)
  if (!post) return NextResponse.json({ error: "forums.error.not_found" }, { status: 404 })

  try {
    const threadData = await getThread(post.thread_id)
    const locale = await getLocale()
    await processPostMentions({
      postId: post.id,
      content,
      authorId: post.author_id,
      threadId: post.thread_id,
      threadTitle: threadData?.thread.title ?? "",
      locale,
    })
  } catch (err) {
    console.error("[PATCH /api/forums/posts/[id]] mention processing failed:", err)
  }

  return NextResponse.json({ post })
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: "forums.error.auth_required" }, { status: 401 })
  const { id } = await ctx.params
  const post = await getPost(id)
  if (!post) return NextResponse.json({ error: "forums.error.not_found" }, { status: 404 })

  const { isAdmin: requesterIsAdmin } = await getForumDeleteAccess(userId)
  if (!canModerateForumContent(userId, post.author_id, requesterIsAdmin)) {
    return NextResponse.json({ error: "forums.error.forbidden" }, { status: 403 })
  }

  const ok = await deletePost(id, userId, requesterIsAdmin)
  if (!ok) return NextResponse.json({ error: "forums.error.not_found" }, { status: 404 })
  return NextResponse.json({ ok: true })
}
