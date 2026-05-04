import { Hero } from "@/components/hero"
import { StatsBar } from "@/components/stats-bar"
import { Pillars } from "@/components/pillars"
import { NewsWatch } from "@/components/news-watch"
import { RuralCommunities } from "@/components/rural-communities"
import { HowItWorks } from "@/components/how-it-works"
import { Pricing } from "@/components/pricing"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <StatsBar />
      <Pillars />
      <NewsWatch />
      <RuralCommunities />
      <HowItWorks />
      <Pricing />
      <Footer />
    </main>
  )
}
