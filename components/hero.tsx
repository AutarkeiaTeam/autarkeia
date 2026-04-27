import { Button } from "@/components/ui/button"
import { ScoreCard } from "./score-card"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left content */}
          <div className="max-w-2xl">
            <h1 className="text-4xl font-light tracking-tight text-[#0d1b2a] sm:text-5xl lg:text-6xl text-balance">
              Live on your own terms. Depend on{" "}
              <span className="text-[#009b70]">nothing</span>{" "}you don&apos;t control.
            </h1>
            <p className="mt-6 text-lg font-light leading-relaxed text-[#3d5166] max-w-xl">
              Autarkeia helps you build genuine self-sufficiency — from growing your own food to knowing exactly how resilient your household is if the world around you stops cooperating.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" className="bg-[#009b70] text-white hover:bg-[#008060] px-8 font-medium rounded-lg">
                Get your free score
              </Button>
              <Button size="lg" variant="outline" className="border-[#d4dce8] text-[#0d1b2a] hover:bg-[#f5f7fa] font-normal rounded-lg">
                Explore the platform
              </Button>
            </div>
          </div>

          {/* Right content - Score Card */}
          <div className="flex justify-center lg:justify-end">
            <ScoreCard />
          </div>
        </div>
      </div>
    </section>
  )
}
