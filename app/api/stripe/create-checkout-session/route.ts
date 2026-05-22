import { NextResponse } from "next/server"
import { getOrCreateStripeCustomer } from "@/lib/profiles"
import { getStripe, resolveStripePriceId } from "@/lib/stripe"
import { findBlockingSubscription } from "@/lib/stripe-subscriptions"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as { priceId?: string }
    const plan = body.priceId === "annual" ? "annual" : "monthly"
    const stripePriceId = resolveStripePriceId(plan)
    const origin = new URL(request.url).origin

    const stripeCustomerId = await getOrCreateStripeCustomer(user)
    const stripe = getStripe()

    const existing = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "all",
      limit: 10,
    })

    const activeSubscription = findBlockingSubscription(existing.data)

    if (activeSubscription) {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${origin}/plans`,
      })

      if (!portalSession.url) {
        return NextResponse.json({ error: "Billing portal URL missing" }, { status: 500 })
      }

      return NextResponse.json({
        url: portalSession.url,
        existingSubscription: true,
        message: "You already have a subscription. Manage it in the billing portal.",
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [{ price: stripePriceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 3,
        metadata: { supabase_user_id: user.id, plan },
      },
      payment_method_collection: "always",
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/plans?checkout=cancelled`,
      automatic_tax: { enabled: true },
      customer_update: { address: "auto", name: "auto" },
      tax_id_collection: { enabled: true },
      client_reference_id: user.id,
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
    })

    if (!session.url) {
      return NextResponse.json({ error: "Checkout session URL missing" }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
