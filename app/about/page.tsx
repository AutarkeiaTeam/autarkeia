import { getLocale } from "@/lib/i18n-server"
import { translate } from "@/lib/i18n-core"

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: translate(locale, "about.meta_title"),
    description: translate(locale, "about.meta_description"),
  }
}

export default async function AboutPage() {
  const locale = await getLocale()
  const t = (key: string) => translate(locale, key)
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
        <h1 className="text-3xl font-light text-[#0d1b2a]">{t("about.heading")}</h1>

        <div className="mt-8 space-y-6 text-[#3d5166] leading-relaxed">
          <p>{t("about.p1")}</p>
          <p>{t("about.p2")}</p>
          <p>{t("about.p3")}</p>
        </div>
      </div>
    </main>
  )
}
