import Stripe from "stripe"

let stripeClient: Stripe | null = null

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2024-11-20.acacia",
      typescript: true,
    })
  }

  return stripeClient
}

export function resolveStripePriceId(plan: "monthly" | "annual"): string {
  const priceId =
    plan === "annual" ? process.env.STRIPE_PRICE_ANNUAL : process.env.STRIPE_PRICE_MONTHLY

  if (!priceId) {
    throw new Error(`Stripe price is not configured for plan: ${plan}`)
  }

  return priceId
}

export function planFromStripePriceId(priceId: string | null | undefined): "monthly" | "annual" | null {
  if (!priceId) return null
  if (priceId === process.env.STRIPE_PRICE_MONTHLY) return "monthly"
  if (priceId === process.env.STRIPE_PRICE_ANNUAL) return "annual"
  return null
}
