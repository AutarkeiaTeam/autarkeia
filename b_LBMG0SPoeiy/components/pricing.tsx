import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const tiers = [
  {
    name: "Free",
    price: "€0",
    period: "forever",
    description: "Get started with the basics",
    features: [
      "Self-sufficiency assessment",
      "Basic score tracking",
      "Community forum access",
      "Weekly news digest",
      "Limited library access",
    ],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Essential",
    price: "€15",
    period: "/month",
    description: "For serious beginners",
    features: [
      "Everything in Free",
      "AI-powered roadmap",
      "Full library access",
      "Marketplace discounts (5%)",
      "Monthly expert webinars",
      "Priority forum support",
    ],
    cta: "Start free trial",
    featured: false,
  },
  {
    name: "Pro",
    price: "€29",
    period: "/month",
    description: "For committed preppers",
    features: [
      "Everything in Essential",
      "Advanced AI planner",
      "1-on-1 monthly consultation",
      "Marketplace discounts (15%)",
      "Rural community matching",
      "Custom alerts & reports",
      "Family accounts (up to 4)",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Community",
    price: "€99",
    period: "/month",
    description: "For groups & organizations",
    features: [
      "Everything in Pro",
      "Up to 25 team members",
      "Group planning tools",
      "Marketplace discounts (25%)",
      "Dedicated account manager",
      "Custom integrations",
      "Private community space",
      "API access",
    ],
    cta: "Contact sales",
    featured: false,
  },
]

export function Pricing() {
  return (
    <section className="bg-[#f5f7fa] py-20" id="pricing">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-[#0d1b2a] sm:text-4xl">
            Simple, Transparent <span className="text-[#009b70]">Pricing</span>
          </h2>
          <p className="mt-4 text-lg font-light text-[#3d5166] max-w-2xl mx-auto">
            Choose the plan that matches your journey. All paid plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 ${
                tier.featured
                  ? "bg-[#0d1b2a] text-white ring-2 ring-[#009b70] scale-105"
                  : "bg-white border border-[#d4dce8]"
              }`}
              style={{ borderWidth: tier.featured ? undefined : '0.5px' }}
            >
              {tier.featured && (
                <span className="inline-block mb-4 px-3 py-1 text-xs font-normal bg-[#009b70] text-white rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className={`text-xl font-normal ${tier.featured ? "text-white" : "text-[#0d1b2a]"}`}>
                {tier.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className={`text-4xl font-light ${tier.featured ? "text-white" : "text-[#0d1b2a]"}`}>
                  {tier.price}
                </span>
                <span className={`text-sm font-light ${tier.featured ? "text-white/70" : "text-[#8a9bb0]"}`}>
                  {tier.period}
                </span>
              </div>
              <p className={`mt-2 text-sm font-light ${tier.featured ? "text-white/70" : "text-[#3d5166]"}`}>
                {tier.description}
              </p>

              <ul className="mt-6 space-y-3">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-[#009b70]" />
                    <span className={`text-sm font-light ${tier.featured ? "text-white/90" : "text-[#3d5166]"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`mt-8 w-full font-medium rounded-lg ${
                  tier.featured
                    ? "bg-[#009b70] text-white hover:bg-[#008060]"
                    : "bg-[#0d1b2a] text-white hover:bg-[#1a2a3a]"
                }`}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
