import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScoreCard } from "./score-card"

export type HeroCopy = {
  title: string
  subtitle: string
  ctaPrimary: string
  ctaSecondary: string
}

export function Hero({ title, subtitle, ctaPrimary, ctaSecondary }: HeroCopy) {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-light tracking-tight text-[#0d1b2a] sm:text-5xl lg:text-6xl text-balance">
              {title}
            </h1>
            <p className="mt-6 text-lg font-light leading-relaxed text-[#3d5166] max-w-xl">
              {subtitle}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" className="bg-[#009b70] text-white hover:bg-[#008060] px-8 font-medium rounded-lg" asChild>
                <Link href="/quiz">{ctaPrimary}</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-[#d4dce8] text-[#0d1b2a] hover:bg-[#f5f7fa] font-normal rounded-lg" asChild>
                <Link href="/marketplace">{ctaSecondary}</Link>
              </Button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <ScoreCard />
          </div>
        </div>
      </div>
    </section>
  )
}
