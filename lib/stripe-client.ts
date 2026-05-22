export type CheckoutPlan = "monthly" | "annual"

export async function startCheckout(priceId: CheckoutPlan): Promise<void> {
  const response = await fetch("/api/stripe/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId }),
  })

  const data = (await response.json()) as {
    url?: string
    error?: string
    existingSubscription?: boolean
    message?: string
  }
  if (!response.ok) {
    throw new Error(data.error || "Could not start checkout")
  }

  if (!data.url) {
    throw new Error("Checkout URL missing")
  }

  window.location.href = data.url
}

export async function openBillingPortal(): Promise<void> {
  const response = await fetch("/api/stripe/portal-session", {
    method: "POST",
  })

  const data = (await response.json()) as { url?: string; error?: string }
  if (!response.ok) {
    throw new Error(data.error || "Could not open billing portal")
  }

  if (!data.url) {
    throw new Error("Portal URL missing")
  }

  window.location.href = data.url
}
