import Link from "next/link"
import { notFound } from "next/navigation"
import { CATEGORIES, getThread } from "@/lib/forums-store"
import { getUserId } from "@/lib/auth-server"
import { canModerateForumContent, getForumDeleteAccess } from "@/lib/forum-permissions"
import { getLocale } from "@/lib/i18n-server"
import { translate } from "@/lib/i18n-core"
import { formatRelativeTime } from "@/lib/relative-time"
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
  const [result, viewerId] = await Promise.all([getThread(id), getUserId()])
  if (!result) notFound()

  const { thread, posts } = result
  const { isAdmin: viewerIsAdmin } = await getForumDeleteAccess(viewerId)
  const category = CATEGORIES.find((c) => c.id === thread.category)
  const canDeleteThread = canModerateForumContent(viewerId, thread.author_id, viewerIsAdmin)

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <Link href="/forums" className="text-sm text-[#009b70]">{t("forums.back")}</Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-[#009b70]">
          {category ? t(`forums.category.${category.id}.name`) : t("forums.category.general.name")}
        </p>
        <h1 className="mt-2 text-3xl font-light text-[#0d1b2a]">{thread.title}</h1>
        {thread.description && <p className="mt-2 text-sm text-[#3d5166]">{thread.description}</p>}
        <p className="mt-2 text-xs text-[#8a9bb0]">
          {t("forums.thread.started_by")}{" "}
          <span className="font-medium text-[#3d5166]">
            {thread.author_name === "forums.member_fallback" ? t("forums.member_fallback") : thread.author_name}
          </span>{" "}
          · {formatRelativeTime(thread.created_at, locale)}
        </p>
        {canDeleteThread && <DeleteThreadButton threadId={thread.id} />}

        <ol className="mt-8 space-y-4">
          {posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              viewerId={viewerId}
              viewerIsAdmin={viewerIsAdmin}
            />
          ))}
        </ol>

        <section className="mt-10">
          {viewerId ? (
            <ReplyForm threadId={thread.id} />
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
