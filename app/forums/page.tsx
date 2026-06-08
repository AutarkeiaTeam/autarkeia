import Link from "next/link"
import { Suspense } from "react"
import { ForumAuthor } from "@/components/forums/forum-author"
import { ThreadSort } from "@/components/forums/thread-sort"
import { CATEGORIES, listThreads } from "@/lib/forums-store"
import { getUserId, isAuthenticated } from "@/lib/auth-server"
import { parseForumSortMode, type ForumSortMode } from "@/lib/forums-shared"
import { getLocale } from "@/lib/i18n-server"
import { translate } from "@/lib/i18n-core"
import { formatRelativeTime } from "@/lib/relative-time"

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: translate(locale, "forums.meta_title"),
    description: translate(locale, "forums.meta_description"),
  }
}

export const dynamic = "force-dynamic"

type ExternalForum = { key: string; href: string; platform: string }

const externalForums: ExternalForum[] = [
  { key: "forums.external.1", href: "https://www.reddit.com/r/preppers/", platform: "Reddit" },
  { key: "forums.external.2", href: "https://www.reddit.com/r/homestead/", platform: "Reddit" },
  { key: "forums.external.3", href: "https://www.reddit.com/r/OffGrid/", platform: "Reddit" },
  { key: "forums.external.4", href: "https://www.reddit.com/r/permaculture/", platform: "Reddit" },
  { key: "forums.external.5", href: "https://www.reddit.com/r/SelfSufficiency/", platform: "Reddit" },
  { key: "forums.external.6", href: "https://www.reddit.com/r/IntentionalCommunity/", platform: "Reddit" },
  { key: "forums.external.7", href: "https://www.reddit.com/r/collapse/", platform: "Reddit" },
  { key: "forums.external.8", href: "https://www.reddit.com/r/Survival/", platform: "Reddit" },
  { key: "forums.external.9", href: "https://substack.com/search?q=preparedness", platform: "Substack" },
  { key: "forums.external.10", href: "https://substack.com/search?q=resilience", platform: "Substack" },
  { key: "forums.external.11", href: "https://substack.com/search?q=homestead", platform: "Substack" },
  { key: "forums.external.12", href: "https://www.facebook.com/search/groups/?q=preppers", platform: "Facebook" },
  { key: "forums.external.13", href: "https://www.facebook.com/search/groups/?q=homesteading", platform: "Facebook" },
  { key: "forums.external.14", href: "https://www.facebook.com/search/groups/?q=permaculture", platform: "Facebook" },
  { key: "forums.external.15", href: "https://disboard.org/servers/tag/prepping", platform: "Discord" },
  { key: "forums.external.16", href: "https://disboard.org/servers/tag/homestead", platform: "Discord" },
  { key: "forums.external.17", href: "https://disboard.org/servers/tag/off-grid", platform: "Discord" },
  { key: "forums.external.18", href: "https://disboard.org/servers/tag/permaculture", platform: "Discord" },
]

async function ForumsPageContent({ sort }: { sort: ForumSortMode }) {
  const locale = await getLocale()
  const t = (key: string) => translate(locale, key)
  const viewerId = await getUserId()
  const [threads, authed] = await Promise.all([
    listThreads({ sort, viewerId }),
    isAuthenticated(),
  ])

  const counts = CATEGORIES.reduce<Record<string, number>>((acc, c) => {
    acc[c.id] = threads.filter((th) => th.category === c.id).length
    return acc
  }, {})

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-14 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light text-[#0d1b2a]">{t("forums.heading")}</h1>
            <p className="mt-3 max-w-3xl text-sm text-[#3d5166]">{t("forums.intro")}</p>
          </div>
          {authed ? (
            <Link
              href="/forums/new"
              className="rounded-lg bg-[#009b70] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#007a58]"
            >
              {t("forums.new_thread")}
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-[#0d1b2a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1a2942]"
            >
              {t("forums.sign_in_to_post")}
            </Link>
          )}
        </div>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#009b70]">{t("forums.categories")}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`#category-${c.id}`}
                className="rounded-xl border border-[#d4dce8] p-4 transition-colors hover:border-[#009b70]"
              >
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-medium text-[#0d1b2a]">{t(`forums.category.${c.id}.name`)}</p>
                  <span className="text-xs text-[#8a9bb0]">
                    {counts[c.id] ?? 0} {t("forums.threads")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#3d5166]">{t(`forums.category.${c.id}.description`)}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <Suspense fallback={null}>
            <ThreadSort />
          </Suspense>
        </section>

        {CATEGORIES.map((c) => {
          const list = threads.filter((th) => th.category === c.id)
          return (
            <section key={c.id} id={`category-${c.id}`} className="mt-12">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-medium text-[#0d1b2a]">{t(`forums.category.${c.id}.name`)}</h2>
                <span className="text-xs text-[#8a9bb0]">
                  {list.length} {t("forums.threads")}
                </span>
              </div>
              {list.length === 0 ? (
                <p className="mt-3 rounded-xl border border-dashed border-[#d4dce8] p-4 text-sm text-[#8a9bb0]">
                  {t("forums.no_threads")}{" "}
                  {authed ? (
                    <Link href={`/forums/new?category=${c.id}`} className="font-medium text-[#009b70]">
                      {t("forums.start_first")}
                    </Link>
                  ) : (
                    <>
                      <Link href="/login" className="font-medium text-[#009b70]">
                        {t("forums.sign_in")}
                      </Link>{" "}
                      {t("forums.sign_in_suffix")}
                    </>
                  )}
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {list.map((th) => (
                    <li key={th.id}>
                      <div className="rounded-xl border border-[#d4dce8] p-4 transition-colors hover:border-[#009b70]">
                        <Link href={`/forums/${th.id}`} className="block">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-medium text-[#0d1b2a]">{th.title}</p>
                            {th.pinned ? (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#009b70]">
                                📌 {t("forums.thread.pinned_badge")}
                              </span>
                            ) : null}
                            {th.locked ? (
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8a9bb0]">
                                🔒
                              </span>
                            ) : null}
                            {viewerId && th.is_unread ? (
                              <span className="rounded-full bg-[#009b70] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                                {t("forums.thread.unread_label")}
                              </span>
                            ) : null}
                          </div>
                          {th.description && (
                            <p className="mt-1 text-xs text-[#3d5166]">{th.description}</p>
                          )}
                        </Link>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <ForumAuthor author={th} size={32} />
                          <p className="text-[11px] text-[#8a9bb0]">
                            {t("forums.updated")} {formatRelativeTime(th.updated_at, locale)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}

        <section className="mt-16 border-t border-[#d4dce8] pt-12">
          <h2 className="text-xl font-light text-[#0d1b2a]">{t("forums.external_heading")}</h2>
          <p className="mt-2 text-sm text-[#8a9bb0]">{t("forums.external_note")}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {externalForums.map((f) => (
              <li key={`${f.platform}-${f.key}-${f.href}`}>
                <a
                  href={f.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col rounded-xl border border-[#d4dce8] bg-white p-4 transition-colors hover:border-[#009b70]"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">{f.platform}</span>
                  <span className="mt-1 text-sm font-medium text-[#0d1b2a]">{t(f.key)}</span>
                  <span className="mt-1 truncate text-xs text-[#8a9bb0]">{f.href}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}

export default async function ForumsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>
}) {
  const locale = await getLocale()
  const loading = translate(locale, "forums.loading")
  const params = await searchParams
  const sort = parseForumSortMode(params.sort)

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center bg-white px-4 text-sm text-[#3d5166]">
          {loading}
        </div>
      }
    >
      <ForumsPageContent sort={sort} />
    </Suspense>
  )
}
