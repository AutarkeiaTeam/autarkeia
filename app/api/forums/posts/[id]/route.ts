import { NextRequest, NextResponse } from "next/server"
import { deletePost } from "@/lib/forums-store"
import { getUserId } from "@/lib/auth-server"

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  const { id } = await ctx.params
  const ok = await deletePost(id, userId)
  if (!ok) return NextResponse.json({ error: "Not found or not your post" }, { status: 404 })
  return NextResponse.json({ ok: true })
}
