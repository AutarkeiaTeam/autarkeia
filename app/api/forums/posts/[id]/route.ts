import { NextRequest, NextResponse } from "next/server"
import { deletePost, getPost } from "@/lib/forums-store"
import { getUserId } from "@/lib/auth-server"
import { canDeleteForumContent, getForumDeleteAccess } from "@/lib/forum-permissions"

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  const { id } = await ctx.params
  const post = await getPost(id)
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { isAdmin: requesterIsAdmin } = await getForumDeleteAccess(userId)
  if (!canDeleteForumContent(userId, post.author_id, requesterIsAdmin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const ok = await deletePost(id, userId, requesterIsAdmin)
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ ok: true })
}
