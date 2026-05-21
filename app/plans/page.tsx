import { Suspense } from "react"
import { PricingSection } from "@/components/plans/pricing-section"
import { getProfileSubscription } from "@/lib/subscription"
import { createClient } from "@/lib/supabase/server"

export default async function PlansPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const profile = user ? await getProfileSubscription(user.id) : null

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f7fa]" />}>
      <PricingSection
        isLoggedIn={!!user}
        subscriptionStatus={profile?.subscription_status ?? "free"}
      />
    </Suspense>
  )
}
