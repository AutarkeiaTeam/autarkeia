import { Brain, ShoppingBag, BookOpen, Grid3X3, MessageSquare, Home, Globe } from "lucide-react"

const pillars = [
  {
    icon: Brain,
    title: "AI Planner",
    description: "Personalized roadmaps to self-sufficiency powered by AI. Get step-by-step guidance based on your location, resources, and goals.",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description: "Curated products for preparedness, homesteading, and sustainable living. Every item vetted by our community.",
  },
  {
    icon: BookOpen,
    title: "Library",
    description: "Comprehensive guides, tutorials, and courses on everything from food preservation to off-grid energy systems.",
  },
  {
    icon: Grid3X3,
    title: "App Directory",
    description: "Discover and integrate the best tools for tracking, planning, and managing your self-sufficiency journey.",
  },
  {
    icon: MessageSquare,
    title: "Forums",
    description: "Connect with thousands of like-minded individuals. Share experiences, ask questions, and learn from experts.",
  },
  {
    icon: Home,
    title: "Rural Communities",
    description: "Find and connect with intentional communities, rural properties, and collaborative living opportunities worldwide.",
  },
  {
    icon: Globe,
    title: "World News Watch",
    description: "Stay informed about global events that impact self-sufficiency. AI-curated news with actionable insights.",
  },
]

export function Pillars() {
  return (
    <section className="bg-[#f5f7fa] py-20" id="self-sufficiency">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-[#0d1b2a] sm:text-4xl">
            Seven Pillars of <span className="text-[#009b70]">Independence</span>
          </h2>
          <p className="mt-4 text-lg font-light text-[#3d5166] max-w-2xl mx-auto">
            Everything you need to build a resilient, self-sufficient life - all in one platform.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="group rounded-xl bg-white p-6 border border-[#d4dce8]/50 transition-all hover:border-[#009b70]/30"
              style={{ borderWidth: '0.5px' }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8f8f3]">
                <pillar.icon className="h-6 w-6 text-[#009b70]" />
              </div>
              <h3 className="text-lg font-normal text-[#0d1b2a] mb-2">{pillar.title}</h3>
              <p className="text-sm font-light text-[#3d5166] leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
