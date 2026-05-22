import type { CommunityInterestInput } from "@/lib/community-interest"

const FROM_EMAIL = "Autarkeia <noreply@send.autarkeia.world>"
const SUBJECT = "We received your interest — Autarkeia Communities"

function buildSummary(data: CommunityInterestInput): string {
  const locations =
    data.preferredLocations.length > 0
      ? data.preferredLocations.join(", ")
      : "Not specified"

  return [
    `Preferred locations: ${locations}`,
    `Community types: ${data.communityTypes.join(", ")}`,
    `Investment capacity: ${data.investmentCapacity}`,
    `Timeline: ${data.moveTimeline}`,
  ].join("\n")
}

export async function sendCommunityInterestConfirmation(
  data: CommunityInterestInput
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set; skipping community interest confirmation email")
    return
  }

  const summary = buildSummary(data)
  const html = `
    <p>Hi ${escapeHtml(data.fullName)},</p>
    <p>Thank you for registering your interest in Autarkeia Communities.</p>
    <p>We have saved your preferences and will be in touch as we develop projects in your preferred regions. Your submission helps us demonstrate demand to investors and partners.</p>
    <p><strong>Summary</strong></p>
    <pre style="font-family: sans-serif; white-space: pre-wrap;">${escapeHtml(summary)}</pre>
    <p>— The Autarkeia team</p>
  `.trim()

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [data.email],
      subject: SUBJECT,
      html,
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => "")
    throw new Error(`Resend API error (${response.status}): ${body}`)
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
