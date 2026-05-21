import { NextResponse } from "next/server"
import { getProfileSubscription } from "@/lib/subscription"
import { getStripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await getProfileSubscription(user.id)
    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: "No billing account found" }, { status: 400 })
    }

    const origin = new URL(request.url).origin
    const stripe = getStripe()

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${origin}/dashboard`,
    })

    if (!session.url) {
      return NextResponse.json({ error: "Portal session URL missing" }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Portal session failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
