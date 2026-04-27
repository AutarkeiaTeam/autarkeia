import { ClipboardCheck, Target, TrendingUp, Shield } from "lucide-react"

const steps = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: "Take the Assessment",
    description: "Answer questions about your current situation, resources, and goals. Our AI analyzes 47 factors across 5 categories.",
  },
  {
    icon: Target,
    step: "02",
    title: "Get Your Roadmap",
    description: "Receive a personalized plan with prioritized actions based on your location, budget, and timeline.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Track Progress",
    description: "Monitor your self-sufficiency score as you complete tasks. Celebrate milestones and adjust your plan as needed.",
  },
  {
    icon: Shield,
    step: "04",
    title: "Build Resilience",
    description: "Connect with community, access resources, and continuously improve. True independence is a journey, not a destination.",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-[#0d1b2a] sm:text-4xl">
            How It <span className="text-[#009b70]">Works</span>
          </h2>
          <p className="mt-4 text-lg font-light text-[#3d5166] max-w-2xl mx-auto">
            Start your journey to self-sufficiency in four simple steps.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-[#009b70]/30 to-transparent -translate-x-1/2" />
              )}
              
              <div className="text-center">
                <div className="relative inline-flex">
                  <div className="h-20 w-20 rounded-full bg-[#e8f8f3] flex items-center justify-center">
                    <item.icon className="h-8 w-8 text-[#009b70]" />
                  </div>
                  <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-[#009b70] text-white text-sm font-normal flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-normal text-[#0d1b2a]">{item.title}</h3>
                <p className="mt-2 text-sm font-light text-[#3d5166] leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
