import type { Locale } from "@/lib/i18n-core"

export type CheckoutPlan = "monthly" | "annual"

export async function startCheckout(
  priceId: CheckoutPlan,
  locale: Locale = "en"
): Promise<void> {
  const response = await fetch("/api/stripe/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId, locale }),
  })

  const data = (await response.json()) as {
    url?: string
    error?: string
    existingSubscription?: boolean
    message?: string
  }
  if (!response.ok) {
    throw new Error(data.error || "plans.error.start_checkout")
  }

  if (!data.url) {
    throw new Error("plans.error.checkout_url_missing")
  }

  window.location.href = data.url
}

export async function openBillingPortal(): Promise<void> {
  const response = await fetch("/api/stripe/portal-session", {
    method: "POST",
  })

  const data = (await response.json()) as { url?: string; error?: string }
  if (!response.ok) {
    throw new Error(data.error || "plans.error.open_billing_portal")
  }

  if (!data.url) {
    throw new Error("plans.error.portal_url_missing")
  }

  window.location.href = data.url
}
