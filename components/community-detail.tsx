import Link from "next/link"

export type CommunitySectionImage = { src: string; alt: string; caption?: string }

export type CommunitySection = {
  heading: string
  body: string[]
  /** 0–2 images per section; aim for 2–3 images total per page, spread out. */
  images?: CommunitySectionImage[]
}

export type CommunityDetailProps = {
  eyebrow: string
  title: string
  tagline: string
  intro: string
  /** Use a 5000px-class width from Wikimedia, Unsplash, or Pexels for crisp heroes. */
  hero: { src: string; alt: string; credit?: string }
  sections: CommunitySection[]
  registerHref?: string
}

function SectionFigure({ img }: { img: CommunitySectionImage }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-[#d4dce8] bg-white shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img.src} alt={img.alt} className="aspect-[4/3] w-full object-cover" loading="lazy" />
      {img.caption && <figcaption className="px-4 py-2 text-xs text-[#8a9bb0]">{img.caption}</figcaption>}
    </figure>
  )
}

/**
 * Shared layout for the four community pillar pages: large hero, readable
 * section chunks, images distributed (not stacked in one block), and a
 * closing Register Interest CTA.
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
      <section className="relative min-h-[min(70vh,720px)] w-full overflow-hidden bg-[#0d1b2a]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.src}
          alt={hero.alt}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
          loading="eager"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a] via-[#0d1b2a]/55 to-[#0d1b2a]/30" />
        <div className="relative z-10 mx-auto flex min-h-[min(70vh,720px)] max-w-5xl flex-col justify-end px-4 pb-14 pt-24 lg:px-8">
          <Link href="/communities" className="mb-6 inline-flex w-fit text-sm text-white/85 hover:text-white">
            ← Communities
          </Link>
          <p className="text-sm font-medium uppercase tracking-wide text-[#71d8be]">{eyebrow}</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-light tracking-tight text-white sm:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/85">{tagline}</p>
        </div>
        {hero.credit && (
          <p className="absolute bottom-3 right-4 z-10 max-w-[70%] text-right text-[10px] text-white/45">
            {hero.credit}
          </p>
        )}
      </section>

      <section className="border-b border-[#e8eef5] bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
          <p className="text-lg leading-relaxed text-[#3d5166]">{intro}</p>
        </div>
      </section>

      {sections.map((section, idx) => {
        const imgs = section.images ?? []
        const imageOnLeft = idx % 2 === 1

        return (
          <section
            key={section.heading}
            className={`${idx % 2 === 0 ? "bg-[#f5f7fa]" : "bg-white"} border-b border-[#e8eef5] py-14 sm:py-20`}
          >
            <div className="mx-auto max-w-5xl px-4 lg:px-8">
              <h2 className="text-2xl font-light tracking-tight text-[#0d1b2a] sm:text-3xl">{section.heading}</h2>
              <div className="mt-2 h-1 w-14 rounded-full bg-[#009b70]" aria-hidden />

              {imgs.length === 0 ? (
                <div className="mt-8 max-w-3xl space-y-4 text-base leading-relaxed text-[#3d5166]">
                  {section.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ) : imgs.length === 1 ? (
                <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
                  <div
                    className={`space-y-4 text-base leading-relaxed text-[#3d5166] ${
                      imageOnLeft ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    {section.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  <div className={imageOnLeft ? "lg:order-1" : "lg:order-2"}>
                    <SectionFigure img={imgs[0]!} />
                  </div>
                </div>
              ) : (
                <div className="mt-8 space-y-8">
                  <div className="max-w-3xl space-y-4 text-base leading-relaxed text-[#3d5166]">
                    {section.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {imgs.map((img) => (
                      <SectionFigure key={img.src} img={img} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )
      })}

      <section className="bg-[#0d1b2a] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <h2 className="text-3xl font-light">Register interest</h2>
          <p className="mt-4 text-white/78 leading-relaxed">
            Tell us your region, skills, and timeline. We use registrations to map demand and sequence pilots — we
            never sell your details.
          </p>
          <Link
            href={registerHref}
            className="mt-8 inline-flex rounded-lg bg-[#009b70] px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-black/20 hover:bg-[#007a58]"
          >
            Register Interest
          </Link>
        </div>
      </section>
    </main>
  )
}
