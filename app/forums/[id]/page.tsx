import Link from "next/link"
import { notFound } from "next/navigation"
import { CATEGORIES, getThread } from "@/lib/forums-store"
import { getUserId } from "@/lib/auth-server"
import { canDeleteForumContent, getForumDeleteAccess } from "@/lib/forum-permissions"
import { ReplyForm, DeletePostButton, DeleteThreadButton } from "./thread-actions"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getThread(id)
  if (!result) return { title: "Discussion not found — Autarkeia" }
  return {
    title: `${result.thread.title} — Autarkeia Forums`,
    description: result.thread.description || result.thread.title,
  }
}

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [result, viewerId] = await Promise.all([getThread(id), getUserId()])
  if (!result) notFound()

  const { thread, posts } = result
  const { isAdmin: viewerIsAdmin } = await getForumDeleteAccess(viewerId)
  const category = CATEGORIES.find((c) => c.id === thread.category)
  const canDeleteThread = canDeleteForumContent(viewerId, thread.author_id, viewerIsAdmin)

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <Link href="/forums" className="text-sm text-[#009b70]">← Forums</Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-[#009b70]">
          {category?.name || "General"}
        </p>
        <h1 className="mt-2 text-3xl font-light text-[#0d1b2a]">{thread.title}</h1>
        {thread.description && <p className="mt-2 text-sm text-[#3d5166]">{thread.description}</p>}
        <p className="mt-2 text-xs text-[#8a9bb0]">
          Started by <span className="font-medium text-[#3d5166]">{thread.author_name}</span> ·{" "}
          {new Date(thread.created_at).toLocaleString()}
        </p>
        {canDeleteThread && <DeleteThreadButton threadId={thread.id} />}

        <ol className="mt-8 space-y-4">
          {posts.map((p) => (
            <li key={p.id} className="rounded-2xl border border-[#d4dce8] bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-[#0d1b2a]">{p.author_name}</p>
                <p className="text-[11px] text-[#8a9bb0]">{new Date(p.created_at).toLocaleString()}</p>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#3d5166]">{p.content}</p>
              {canDeleteForumContent(viewerId, p.author_id, viewerIsAdmin) && (
                <DeletePostButton postId={p.id} threadId={thread.id} />
              )}
            </li>
          ))}
        </ol>

        <section className="mt-10">
          {viewerId ? (
            <ReplyForm threadId={thread.id} />
          ) : (
            <div className="rounded-2xl border border-dashed border-[#d4dce8] p-5 text-sm text-[#3d5166]">
              <Link href="/login" className="font-medium text-[#009b70]">
                Sign in
              </Link>{" "}
              to reply.
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
