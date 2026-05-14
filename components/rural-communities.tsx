import Link from "next/link"
import { Home, Wheat, Zap, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const focusAreas = [
  {
    icon: Home,
    title: "Housing & Land",
    description: "Natural building, earthen methods, timber frames, and straw bale homes.",
    href: "/communities/housing-land",
  },
  {
    icon: Wheat,
    title: "Food Systems",
    description: "Communal growing, food forests, regenerative design, and permaculture.",
    href: "/communities/food-systems",
  },
  {
    icon: Zap,
    title: "Energy & Water",
    description: "Off-grid solar, wind, rainwater harvesting, and resilient water systems.",
    href: "/communities/energy-water",
  },
  {
    icon: Users,
    title: "Governance",
    description: "Transparent co-governance, member participation, and clear decision-making.",
    href: "/communities/governance",
  },
]

export function RuralCommunities() {
  return (
    <section
      className="bg-gradient-to-b from-[#f5f7fa] to-[#e8ebe5] py-20"
      id="rural-communities"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-start">
          <div>
            <span className="inline-block rounded-full bg-[#009b70]/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#009b70]">
              Launching soon
            </span>
            <h2 className="mt-4 text-3xl font-light text-[#0d1b2a] sm:text-4xl">
              Communities <span className="text-[#009b70]">Coming Soon</span>
            </h2>
            <p className="mt-4 text-lg font-light text-[#3d5166] leading-relaxed">
              Autarkeia is building a global network of intentional, self-sufficient
              communities — places where people grow their own food, generate their
              own energy, build their own homes, and govern themselves transparently.
            </p>
            <p className="mt-4 text-base font-light text-[#3d5166] leading-relaxed">
              We are in the planning phase. Register your interest through the
              Communities access in your Plan, tell us where you want to live, and
              help us demonstrate the demand. Sites will launch in regions where
              member interest, climate, and conditions line up — starting in Spain
              and expanding from there.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-[#009b70] text-white hover:bg-[#008060] font-medium rounded-lg"
              >
                <Link href="/communities#register-interest">Explore communities</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="font-medium rounded-lg text-[#0d1b2a] hover:bg-white"
              >
                <Link href="/plans">See Plans</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {focusAreas.map((area) => {
              const Icon = area.icon
              return (
                <Link
                  key={area.title}
                  href={area.href}
                  className="group rounded-xl bg-white p-5 border border-[#d4dce8]/60 transition-colors hover:border-[#009b70]"
                  style={{ borderWidth: "0.5px" }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#009b70]/10 text-[#009b70]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-normal text-[#0d1b2a] group-hover:text-[#009b70]">
                    {area.title}
                  </h3>
                  <p className="mt-2 text-sm font-light text-[#3d5166] leading-relaxed">
                    {area.description}
                  </p>
                  <span className="mt-3 inline-block text-xs font-medium text-[#009b70]">
                    Learn more →
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
