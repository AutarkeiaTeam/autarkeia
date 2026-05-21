import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import { getStripe } from "@/lib/stripe"
import {
  applySubscriptionProfileUpdate,
  profileUpdateFromSubscription,
  revokeProAccess,
} from "@/lib/stripe-subscription-sync"

export const runtime = "nodejs"

async function resolveUserIdFromCustomer(customerId: string): Promise<string | null> {
  const admin = createAdminClient()
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle()

  if (profile?.id) return profile.id

  const stripe = getStripe()
  const customer = await stripe.customers.retrieve(customerId)
  if (customer.deleted) return null
  return customer.metadata?.supabase_user_id ?? null
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret || webhookSecret === "whsec_PLACEHOLDER") {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 })
  }

  const rawBody = await request.text()
  const stripe = getStripe()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature"
    return NextResponse.json({ error: message }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId =
          session.client_reference_id ?? session.metadata?.supabase_user_id ?? null
        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : session.subscription?.id

        if (userId && subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const update = profileUpdateFromSubscription(
            subscription,
            session.metadata?.plan ?? subscription.metadata?.plan
          )
          await applySubscriptionProfileUpdate(userId, update)
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id
        const userId = await resolveUserIdFromCustomer(customerId)

        if (userId) {
          const update = profileUpdateFromSubscription(subscription)
          await applySubscriptionProfileUpdate(userId, update)
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id
        const userId = await resolveUserIdFromCustomer(customerId)

        if (userId) {
          await revokeProAccess(userId, customerId)
        }
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id

        if (!subscriptionId) break

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id
        const userId = await resolveUserIdFromCustomer(customerId)

        if (userId) {
          const update = profileUpdateFromSubscription(subscription)
          update.subscription_status = "active"
          await applySubscriptionProfileUpdate(userId, update)
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id

        if (!subscriptionId) break

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id
        const userId = await resolveUserIdFromCustomer(customerId)

        if (userId) {
          const update = profileUpdateFromSubscription(subscription)
          update.subscription_status = "past_due"
          await applySubscriptionProfileUpdate(userId, update)
        }
        break
      }

      default:
        break
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook handler failed"
    console.error("Stripe webhook error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
