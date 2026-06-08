import { NextRequest, NextResponse } from "next/server"
import { getUserId } from "@/lib/auth-server"
import { togglePostReaction } from "@/lib/forums-engagement"
import { getPost, getThread } from "@/lib/forums-store"
import { isForumReactionEmoji } from "@/lib/forums-shared"
import { getLocale } from "@/lib/i18n-server"
import { notifyForumReaction } from "@/lib/notification-dispatch"

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const userId = await getUserId()
  if (!userId) {
    return NextResponse.json({ error: "forums.error.auth_required" }, { status: 401 })
  }

  const { id } = await ctx.params
  const post = await getPost(id)
  if (!post) {
    return NextResponse.json({ error: "forums.error.not_found" }, { status: 404 })
  }

  let body: { emoji?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "forums.error.invalid_json" }, { status: 400 })
  }

  const emoji = (body.emoji ?? "").trim()
  if (!isForumReactionEmoji(emoji)) {
    return NextResponse.json({ error: "forums.error.invalid_reaction" }, { status: 400 })
  }

  try {
    const { reactions, added } = await togglePostReaction(id, userId, emoji)

    if (added) {
      try {
        const threadData = await getThread(post.thread_id)
        const locale = await getLocale()
        await notifyForumReaction({
          postId: id,
          threadId: post.thread_id,
          threadTitle: threadData?.thread.title ?? "",
          postAuthorId: post.author_id,
          actorId: userId,
          emoji,
          locale,
        })
      } catch (notifyErr) {
        console.error("[POST /api/forums/posts/[id]/reactions] notification failed:", notifyErr)
      }
    }

    return NextResponse.json({ reactions })
  } catch (err) {
    console.error("[POST /api/forums/posts/[id]/reactions]", err)
    const message = err instanceof Error ? err.message : "forums.error.unknown"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
