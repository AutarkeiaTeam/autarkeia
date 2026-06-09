import Link from "next/link"
import { Lock, Pin } from "lucide-react"
import { notFound } from "next/navigation"
import { reactionsFromMap } from "@/lib/forums-shared"
import { CATEGORIES, getThread } from "@/lib/forums-store"
import { getUserId } from "@/lib/auth-server"
import { canModerateForumContent, getForumDeleteAccess } from "@/lib/forum-permissions"
import { fetchMentionUsernamesForPosts } from "@/lib/forums-mentions"
import { getLocale } from "@/lib/i18n-server"
import { translate } from "@/lib/i18n-core"
import { formatRelativeTime } from "@/lib/relative-time"
import { ForumAuthor } from "@/components/forums/forum-author"
import { ThreadAdminActions } from "@/components/forums/thread-admin-actions"
import { ThreadViewTracker } from "@/components/forums/thread-view-tracker"
import { PostCard } from "./post-card"
import { ReplyForm, DeleteThreadButton } from "./thread-actions"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const locale = await getLocale()
  const result = await getThread(id)
  if (!result) return { title: translate(locale, "forums.thread.not_found_meta") }
  return {
    title: `${result.thread.title} — ${translate(locale, "forums.heading")}`,
    description: result.thread.description || result.thread.title,
  }
}

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const locale = await getLocale()
  const t = (key: string) => translate(locale, key)
  const { id } = await params
  const viewerId = await getUserId()
  const result = await getThread(id, viewerId)
  if (!result) notFound()

  const { thread, posts, reactionsByPostId } = result
  const { isAdmin: viewerIsAdmin } = await getForumDeleteAccess(viewerId)
  const category = CATEGORIES.find((c) => c.id === thread.category)
  const canDeleteThread = canModerateForumContent(viewerId, thread.author_id, viewerIsAdmin)

  const mentionsByPostId = await fetchMentionUsernamesForPosts(posts.map((p) => p.id))

  return (
    <main className="min-h-screen bg-white">
      {viewerId ? <ThreadViewTracker threadId={thread.id} /> : null}
      <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <Link href="/forums" className="text-sm text-[#009b70]">{t("forums.back")}</Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-[#009b70]">
          {category ? t(`forums.category.${category.id}.name`) : t("forums.category.general.name")}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-light text-[#0d1b2a]">{thread.title}</h1>
          {thread.pinned && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f0faf6] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#009b70]">
              <Pin className="h-3 w-3" aria-hidden />
              {t("forums.thread.pinned_badge")}
            </span>
          )}
          {thread.locked && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f5f7fa] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#8a9bb0]">
              <Lock className="h-3 w-3" aria-hidden />
              {t("forums.thread.locked_label")}
            </span>
          )}
        </div>
        {thread.description && <p className="mt-2 text-sm text-[#3d5166]">{thread.description}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-[#8a9bb0]">
          <span>{t("forums.thread.started_by")}</span>
          <ForumAuthor
            author={thread}
            size={32}
            linkClassName="text-xs font-medium text-[#3d5166] hover:text-[#009b70]"
            plainClassName="text-xs font-medium text-[#3d5166]"
          />
          <span aria-hidden>·</span>
          <span>{formatRelativeTime(thread.created_at, locale)}</span>
        </div>
        {viewerIsAdmin && (
          <ThreadAdminActions
            threadId={thread.id}
            pinned={thread.pinned}
            locked={thread.locked}
          />
        )}
        {canDeleteThread && <DeleteThreadButton threadId={thread.id} />}

        {thread.locked && !viewerIsAdmin && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#d4dce8] bg-[#f9fafc] px-4 py-3 text-sm text-[#3d5166]">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#8a9bb0]" aria-hidden />
            <p>{t("forums.thread.locked_banner")}</p>
          </div>
        )}

        <ol className="mt-8 space-y-4">
          {posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              reactions={reactionsFromMap(reactionsByPostId, p.id)}
              verifiedMentions={mentionsByPostId.get(p.id) ?? new Set()}
              viewerId={viewerId}
              viewerIsAdmin={viewerIsAdmin}
            />
          ))}
        </ol>

        <section className="mt-10">
          {viewerId ? (
            <ReplyForm
              threadId={thread.id}
              locked={thread.locked}
              viewerIsAdmin={viewerIsAdmin}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-[#d4dce8] p-5 text-sm text-[#3d5166]">
              <Link href="/login" className="font-medium text-[#009b70]">
                {t("forums.sign_in")}
              </Link>{" "}
              {t("forums.thread.reply_sign_in_suffix")}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
