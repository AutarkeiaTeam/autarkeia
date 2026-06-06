import type { ContactMessageInput } from "@/lib/contact"
import type { CommunityInterestInput } from "@/lib/community-interest"
import { formatPreferredLocationsForDisplay } from "@/lib/community-interest-location"
import { translate, type Locale } from "@/lib/i18n-core"
import type { QuizResult, QuizType } from "@/lib/quiz-data"

const FROM_EMAIL = "Autarkeia <noreply@send.autarkeia.world>"
const CONTACT_NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL ?? "hello@autarkeia.world"
const SUBJECT = "We received your interest — Autarkeia Communities"

function formatList(items: string[]): string {
  return items.length > 0 ? items.join(", ") : "Not specified"
}

function buildSummary(data: CommunityInterestInput, notesLabel: string): string {
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

  const intentLabel =
    data.intent === "live"
      ? "Live in community"
      : data.intent === "buy_food"
      ? "Buy food only"
      : "Live + buy food"

  const lines = [`Preferred locations: ${locations}`, `Intent: ${intentLabel}`]

  if (data.intent === "live" || data.intent === "both") {
    lines.push(
      `Living model: ${data.livingModel ?? "Not specified"}`,
      `Energy ownership: ${data.energyOwnership ?? "Not specified"}`,
      `Preferred energy sources: ${energySources}`,
      `Food ownership: ${data.foodOwnership ?? "Not specified"}`,
      `Preferred food production: ${foodMethods}`,
      `Dietary community preference: ${data.dietaryPreference ?? "Not specified"}`,
      `Climate: ${data.climatePreference ?? "Not specified"}`,
      `Distance from city: ${data.distanceFromCity ?? "Not specified"}`,
      `Investment capacity: ${data.investmentCapacity ?? "Not specified"}`,
      `Investor type: ${data.investorType ?? "Not specified"}`,
      `Timeline: ${data.moveTimeline ?? "Not specified"}`
    )
  }

  if (data.intent === "buy_food" || data.intent === "both") {
    lines.push(
      `Food products of interest: ${formatList(data.foodProducts ?? [])}`,
      `Purchase frequency: ${data.foodFrequency ?? "Not specified"}`
    )
  }

  const notes = data.notes?.trim()
  if (notes) {
    lines.push(`${notesLabel}: ${notes}`)
  }

  return lines.join("\n")
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

export async function sendQuizResultsEmail(options: {
  to: string
  subject: string
  overallScore: number
  scoreLabel: string
  categoryScores: Record<string, number>
  actionPlan: QuizResult["action_plan"]
  productRecommendations: QuizResult["product_recommendations"]
  labels: {
    title: string
    subtitle: string
    scoreSummary: string
    overallScore: string
    scoreLabel: string
    categoryBreakdown: string
    actionPlan: string
    week: string
    month: string
    year: string
    estimatedCost: string
    priority: string
    products: string
    beyondProducts: string
    actionRecommended: string
    estimatedPrice: string
    footerNote: string
    footerSignature: string
    viewOnAutarkeia: string
  }
  appUrl: string
  quizType: QuizType
}): Promise<void> {
  const { labels } = options
  const actionSection = (heading: string, items: QuizResult["action_plan"]["week"]) => `
    <h3 style="margin:16px 0 8px;font-size:16px;color:#0d1b2a;">${escapeHtml(heading)}</h3>
    ${items
      .map(
        (item) => `
      <div style="border:1px solid #d4dce8;border-radius:10px;padding:12px;margin-bottom:10px;background:#ffffff;">
        <p style="margin:0 0 6px;font-weight:600;color:#0d1b2a;">${escapeHtml(item.title)}</p>
        <p style="margin:0 0 8px;color:#3d5166;font-size:14px;">${escapeHtml(item.description)}</p>
        <p style="margin:0 0 8px;color:#8a9bb0;font-size:12px;">
          ${escapeHtml(labels.estimatedCost)}: ${escapeHtml(item.estimated_cost)} · ${escapeHtml(
          labels.priority
        )}: ${escapeHtml(item.priority)}
        </p>
        ${
          item.linked_product?.name
            ? `<div style="margin-top:10px;padding-top:10px;border-top:1px solid #e8edf2;">
          <p style="margin:0 0 4px;font-size:11px;color:#8a9bb0;text-transform:uppercase;">${escapeHtml(
            labels.actionRecommended
          )}</p>
          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#3d5166;">${escapeHtml(
            item.linked_product.name
          )}</p>
          <p style="margin:0;font-size:12px;color:#8a9bb0;">${escapeHtml(
            labels.estimatedPrice
          )}: ${escapeHtml(item.linked_product.estimated_price)}</p>
        </div>`
            : ""
        }
      </div>`
      )
      .join("")}
  `

  const recRows = options.productRecommendations
    .map((rec) => {
      const linkHtml = ""
      return `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #eef2f6;">
          <p style="margin:0 0 4px;font-size:12px;color:#8a9bb0;text-transform:uppercase;">${escapeHtml(
            rec.category
          )}</p>
          <p style="margin:0 0 4px;font-weight:600;color:#0d1b2a;">${escapeHtml(rec.name)}</p>
          <p style="margin:0 0 4px;font-size:14px;color:#3d5166;">${escapeHtml(rec.why)}</p>
          <p style="margin:0;font-size:12px;color:#8a9bb0;">${escapeHtml(
            labels.estimatedPrice
          )}: ${escapeHtml(rec.estimated_price)}</p>
          ${linkHtml}
        </td>
      </tr>
    `
    })
    .join("")

  const categories = Object.entries(options.categoryScores)
    .map(
      ([category, pct]) => `
      <tr>
        <td style="padding:8px 10px;border-bottom:1px solid #eef2f6;color:#0d1b2a;">${escapeHtml(
          category
        )}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eef2f6;color:#0d1b2a;text-align:right;">${pct}%</td>
      </tr>`
    )
    .join("")

  const resultsPath =
    options.quizType === "self-sufficiency"
      ? "/quiz/self-sufficiency/results"
      : "/quiz/emergency-readiness/results"
  const viewUrl = `${options.appUrl.replace(/\/$/, "")}${resultsPath}`

  const html = `
    <div style="margin:0;padding:0;background:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fa;padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #d4dce8;border-radius:14px;overflow:hidden;">
              <tr>
                <td style="padding:24px 24px 12px;background:#ffffff;">
                  <p style="margin:0 0 8px;color:#009b70;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Autarkeia</p>
                  <h1 style="margin:0 0 8px;font-size:24px;color:#0d1b2a;font-weight:500;">${escapeHtml(
                    labels.title
                  )}</h1>
                  <p style="margin:0;color:#3d5166;font-size:14px;">${escapeHtml(labels.subtitle)}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 24px 8px;">
                  <h2 style="margin:0 0 10px;font-size:18px;color:#0d1b2a;">${escapeHtml(
                    labels.scoreSummary
                  )}</h2>
                  <div style="border:1px solid #d4dce8;border-radius:12px;background:#ffffff;padding:14px;">
                    <p style="margin:0 0 6px;color:#8a9bb0;font-size:12px;">${escapeHtml(
                      labels.overallScore
                    )}</p>
                    <p style="margin:0 0 10px;color:#0d1b2a;font-size:30px;font-weight:600;">${
                      options.overallScore
                    }%</p>
                    <p style="margin:0;color:#3d5166;font-size:14px;">${escapeHtml(
                      labels.scoreLabel
                    )}: ${escapeHtml(options.scoreLabel)}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 24px 8px;">
                  <h2 style="margin:0 0 10px;font-size:18px;color:#0d1b2a;">${escapeHtml(
                    labels.categoryBreakdown
                  )}</h2>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #d4dce8;border-radius:10px;overflow:hidden;">
                    ${categories}
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 24px 8px;">
                  <h2 style="margin:0 0 10px;font-size:18px;color:#0d1b2a;">${escapeHtml(
                    labels.actionPlan
                  )}</h2>
                  ${actionSection(labels.week, options.actionPlan.week)}
                  ${actionSection(labels.month, options.actionPlan.month)}
                  ${actionSection(labels.year, options.actionPlan.year)}
                </td>
              </tr>
              <tr>
                <td style="padding:12px 24px 16px;">
                  <h2 style="margin:0 0 10px;font-size:18px;color:#0d1b2a;">${escapeHtml(
                    labels.beyondProducts
                  )}</h2>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #d4dce8;border-radius:10px;overflow:hidden;">
                    ${recRows}
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 24px 24px;border-top:1px solid #eef2f6;background:#fafbfc;">
                  <p style="margin:0 0 10px;font-size:13px;color:#3d5166;">${escapeHtml(labels.footerNote)}</p>
                  <p style="margin:0 0 12px;font-size:13px;color:#3d5166;">${escapeHtml(
                    labels.footerSignature
                  )}</p>
                  <a href="${escapeHtml(
                    viewUrl
                  )}" style="display:inline-block;background:#009b70;color:#ffffff;text-decoration:none;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:600;">${escapeHtml(
                    labels.viewOnAutarkeia
                  )}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `.trim()

  await sendResendEmail({
    to: [options.to],
    subject: options.subject,
    html,
  })
}

export async function sendCommunityInterestConfirmation(
  data: CommunityInterestInput,
  locale: Locale = "en"
): Promise<void> {
  const notesLabel = translate(locale, "communities.form.notes")
  const summary = buildSummary(data, notesLabel)
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
