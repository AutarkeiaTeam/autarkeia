import Link from "next/link"
import { Suspense } from "react"
import { CATEGORIES, listThreads } from "@/lib/forums-store"
import { isAuthenticated } from "@/lib/auth-server"
import { getLocale } from "@/lib/i18n-server"
import { translate } from "@/lib/i18n-core"

export const metadata = {
  title: "Forums — Autarkeia",
  description:
    "Discussions on Autarkeia Forums plus curated external communities on Reddit, Substack, Facebook Groups, and Discord.",
}

export const dynamic = "force-dynamic"

type ExternalForum = { name: string; href: string; platform: string }

const externalForums: ExternalForum[] = [
  { name: "r/preppers", href: "https://www.reddit.com/r/preppers/", platform: "Reddit" },
  { name: "r/homestead", href: "https://www.reddit.com/r/homestead/", platform: "Reddit" },
  { name: "r/OffGrid", href: "https://www.reddit.com/r/OffGrid/", platform: "Reddit" },
  { name: "r/permaculture", href: "https://www.reddit.com/r/permaculture/", platform: "Reddit" },
  { name: "r/SelfSufficiency", href: "https://www.reddit.com/r/SelfSufficiency/", platform: "Reddit" },
  { name: "r/IntentionalCommunity", href: "https://www.reddit.com/r/IntentionalCommunity/", platform: "Reddit" },
  { name: "r/collapse", href: "https://www.reddit.com/r/collapse/", platform: "Reddit" },
  { name: "r/Survival", href: "https://www.reddit.com/r/Survival/", platform: "Reddit" },
  { name: "Substack — Preparedness writers", href: "https://substack.com/search?q=preparedness", platform: "Substack" },
  { name: "Substack — Resilience", href: "https://substack.com/search?q=resilience", platform: "Substack" },
  { name: "Substack — Homestead newsletters", href: "https://substack.com/search?q=homestead", platform: "Substack" },
  { name: "Facebook — Prepper groups", href: "https://www.facebook.com/search/groups/?q=preppers", platform: "Facebook" },
  { name: "Facebook — Homesteading", href: "https://www.facebook.com/search/groups/?q=homesteading", platform: "Facebook" },
  { name: "Facebook — Permaculture", href: "https://www.facebook.com/search/groups/?q=permaculture", platform: "Facebook" },
  { name: "Disboard — prepping", href: "https://disboard.org/servers/tag/prepping", platform: "Discord" },
  { name: "Disboard — homestead", href: "https://disboard.org/servers/tag/homestead", platform: "Discord" },
  { name: "Disboard — off-grid", href: "https://disboard.org/servers/tag/off-grid", platform: "Discord" },
  { name: "Disboard — permaculture", href: "https://disboard.org/servers/tag/permaculture", platform: "Discord" },
]

async function ForumsPageContent() {
  const locale = await getLocale()
  const t = (key: string) => translate(locale, key)
  const [threads, authed] = await Promise.all([listThreads(), isAuthenticated()])
  const dateFmt = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale, { dateStyle: "medium" })

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
                  <p className="text-sm font-medium text-[#0d1b2a]">{c.name}</p>
                  <span className="text-xs text-[#8a9bb0]">
                    {counts[c.id] ?? 0} {t("forums.threads")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#3d5166]">{c.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {CATEGORIES.map((c) => {
          const list = threads.filter((th) => th.category === c.id)
          return (
            <section key={c.id} id={`category-${c.id}`} className="mt-12">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-medium text-[#0d1b2a]">{c.name}</h2>
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
                      <Link
                        href={`/forums/${th.id}`}
                        className="block rounded-xl border border-[#d4dce8] p-4 transition-colors hover:border-[#009b70]"
                      >
                        <p className="text-sm font-medium text-[#0d1b2a]">{th.title}</p>
                        {th.description && <p className="mt-1 text-xs text-[#3d5166]">{th.description}</p>}
                        <p className="mt-2 text-[11px] text-[#8a9bb0]">
                          {t("forums.updated")} {dateFmt.format(new Date(th.updated_at))}
                        </p>
                      </Link>
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
              <li key={`${f.platform}-${f.name}-${f.href}`}>
                <a
                  href={f.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col rounded-xl border border-[#d4dce8] bg-white p-4 transition-colors hover:border-[#009b70]"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">{f.platform}</span>
                  <span className="mt-1 text-sm font-medium text-[#0d1b2a]">{f.name}</span>
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

export default async function ForumsPage() {
  const locale = await getLocale()
  const loading = translate(locale, "forums.loading")

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center bg-white px-4 text-sm text-[#3d5166]">
          {loading}
        </div>
      }
    >
      <ForumsPageContent />
    </Suspense>
  )
}
