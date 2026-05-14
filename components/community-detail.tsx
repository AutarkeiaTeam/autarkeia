import Link from "next/link"

export type CommunitySection = {
  heading: string
  body: string[]
  images: { src: string; alt: string; caption?: string }[]
}

export type CommunityDetailProps = {
  eyebrow: string
  title: string
  tagline: string
  intro: string
  hero: { src: string; alt: string; credit?: string }
  sections: CommunitySection[]
  registerHref?: string
}

/**
 * Shared layout for the four community pillar pages. Each page passes a
 * hero photo and 3-5 themed sections; the layout renders them with
 * subheadings, multi-image rows, and a closing "Register interest" CTA.
 */
export function CommunityDetail({
  eyebrow,
  title,
  tagline,
  intro,
  hero,
  sections,
  registerHref = "/communities#register-interest",
}: CommunityDetailProps) {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden bg-[#0d1b2a]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.src}
          alt={hero.alt}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a]/95 via-[#0d1b2a]/40 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-12 lg:px-8">
          <Link
            href="/communities"
            className="mb-6 inline-flex w-fit text-sm text-white/80 hover:text-white"
          >
            ← Communities
          </Link>
          <p className="text-sm font-medium uppercase tracking-wide text-[#71d8be]">{eyebrow}</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-light tracking-tight text-white sm:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-base text-white/80">{tagline}</p>
        </div>
        {hero.credit && (
          <p className="absolute bottom-2 right-3 z-10 text-[10px] text-white/50">{hero.credit}</p>
        )}
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
        <p className="text-lg leading-relaxed text-[#3d5166]">{intro}</p>
      </section>

      {sections.map((section, idx) => (
        <section
          key={section.heading}
          className={`${idx % 2 === 0 ? "bg-[#f5f7fa]" : "bg-white"} py-14 sm:py-20`}
        >
          <div className="mx-auto max-w-5xl px-4 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
              Section {String(idx + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-2 text-3xl font-light text-[#0d1b2a]">{section.heading}</h2>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div className="space-y-4 text-[#3d5166] leading-relaxed">
                {section.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {section.images.map((img) => (
                  <figure key={img.src} className="overflow-hidden rounded-2xl border border-[#d4dce8] bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="aspect-[4/3] w-full object-cover"
                      loading="lazy"
                    />
                    {img.caption && (
                      <figcaption className="px-4 py-2 text-xs text-[#8a9bb0]">{img.caption}</figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="bg-[#0d1b2a] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <h2 className="text-3xl font-light">Help us build this</h2>
          <p className="mt-4 text-white/75">
            Register your interest, tell us where you want to live, and help us demonstrate that a serious cohort
            of households wants to live this way. We don&apos;t share your details with third parties.
          </p>
          <Link
            href={registerHref}
            className="mt-8 inline-flex rounded-lg bg-[#009b70] px-6 py-3 text-sm font-medium text-white hover:bg-[#007a58]"
          >
            Register interest →
          </Link>
        </div>
      </section>
    </main>
  )
}
