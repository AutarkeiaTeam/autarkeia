import type { ContactMessageInput } from "@/lib/contact"
import type { CommunityInterestInput } from "@/lib/community-interest"
import { formatPreferredLocationsForDisplay } from "@/lib/community-interest-location"

const FROM_EMAIL = "Autarkeia <noreply@send.autarkeia.world>"
const CONTACT_NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL ?? "hello@autarkeia.world"
const SUBJECT = "We received your interest — Autarkeia Communities"

function formatList(items: string[]): string {
  return items.length > 0 ? items.join(", ") : "Not specified"
}

function buildSummary(data: CommunityInterestInput): string {
  const locations =
    data.preferredLocations.length > 0
      ? formatPreferredLocationsForDisplay(data.preferredLocations)
      : "Not specified"

  const energySources =
    data.energyOwnership === "Resident-owned" && data.energyPreferences != null
      ? formatList(data.energyPreferences)
      : "N/A (Autarkeia-managed)"

  const foodMethods =
    data.foodOwnership === "Resident-owned" && data.foodPreferences != null
      ? formatList(data.foodPreferences)
      : "N/A (Autarkeia-managed)"

  return [
    `Preferred locations: ${locations}`,
    `Living model: ${data.livingModel}`,
    `Energy ownership: ${data.energyOwnership}`,
    `Preferred energy sources: ${energySources}`,
    `Food ownership: ${data.foodOwnership}`,
    `Preferred food production: ${foodMethods}`,
    `Dietary community preference: ${data.dietaryPreference}`,
    `Climate: ${data.climatePreference}`,
    `Distance from city: ${data.distanceFromCity}`,
    `Investment capacity: ${data.investmentCapacity}`,
    `Investor type: ${data.investorType}`,
    `Timeline: ${data.moveTimeline}`,
  ].join("\n")
}

async function sendResendEmail(options: {
  to: string[]
  subject: string
  html: string
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set; skipping email")
    return
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => "")
    throw new Error(`Resend API error (${response.status}): ${body}`)
  }
}

export async function sendCommunityInterestConfirmation(
  data: CommunityInterestInput
): Promise<void> {
  const summary = buildSummary(data)
  const html = `
    <p>Hi ${escapeHtml(data.fullName)},</p>
    <p>Thank you for registering your interest in Autarkeia Communities.</p>
    <p>We have saved your preferences and will be in touch as we develop projects in your preferred regions. Your submission helps us demonstrate demand to investors and partners.</p>
    <p><strong>Summary</strong></p>
    <pre style="font-family: sans-serif; white-space: pre-wrap;">${escapeHtml(summary)}</pre>
    <p>— The Autarkeia team</p>
  `.trim()

  await sendResendEmail({
    to: [data.email],
    subject: SUBJECT,
    html,
  })
}

export async function sendContactConfirmation(data: ContactMessageInput): Promise<void> {
  const html = `
    <p>Hi ${escapeHtml(data.name)},</p>
    <p>Thank you for contacting Autarkeia. We have received your message and will reply when we can.</p>
    <p>— The Autarkeia team</p>
  `.trim()

  await sendResendEmail({
    to: [data.email],
    subject: "We received your message — Autarkeia",
    html,
  })
}

export async function sendContactNotification(data: ContactMessageInput): Promise<void> {
  const subjectLine = data.subject?.trim() || "(no subject)"
  const body = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Subject: ${subjectLine}`,
    "",
    "Message:",
    data.message,
  ].join("\n")

  const html = `
    <p><strong>New contact form submission</strong></p>
    <pre style="font-family: sans-serif; white-space: pre-wrap;">${escapeHtml(body)}</pre>
  `.trim()

  await sendResendEmail({
    to: [CONTACT_NOTIFY_EMAIL],
    subject: `Contact form: ${subjectLine}`,
    html,
  })
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
