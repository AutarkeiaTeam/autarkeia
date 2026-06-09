import type { ContactMessageInput } from "@/lib/contact"
import {
  CLIMATE_LABEL_KEYS,
  DIETARY_LABEL_KEYS,
  DISTANCE_LABEL_KEYS,
  ENERGY_SOURCE_LABEL_KEYS,
  FOOD_PRODUCTION_LABEL_KEYS,
  INVESTMENT_LABEL_KEYS,
  INVESTOR_TYPE_LABEL_KEYS,
  LIVING_MODEL_OPTIONS,
  MOVE_TIMELINE_LABEL_KEYS,
  OWNERSHIP_OPTIONS,
  type CommunityInterestInput,
} from "@/lib/community-interest"
import { formatPreferredLocationsForDisplay } from "@/lib/community-interest-location"
import { translate, type Locale } from "@/lib/i18n-core"
import type { QuizResult, QuizType } from "@/lib/quiz-data"

const FROM_EMAIL = "Autarkeia <noreply@send.autarkeia.world>"
const CONTACT_NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL ?? "hello@autarkeia.world"

const INTENT_LABEL_KEYS = {
  live: "communities.form.intent_option.live",
  buy_food: "communities.form.intent_option.buy_food",
  both: "communities.form.intent_option.both",
} as const

function notSpecified(locale: Locale): string {
  return translate(locale, "communities.email.summary.not_specified")
}

function naAutarkeiaManaged(locale: Locale): string {
  return translate(locale, "communities.email.summary.na_autarkeia_managed")
}

function summaryLine(locale: Locale, labelKey: string, value: string): string {
  return `${translate(locale, labelKey)}: ${value}`
}

function translateByMap<T extends string>(
  locale: Locale,
  value: T | null | undefined,
  map: Record<T, string>
): string {
  if (!value) return notSpecified(locale)
  const key = map[value]
  return key ? translate(locale, key) : value
}

function translateLivingModel(
  locale: Locale,
  value: CommunityInterestInput["livingModel"]
): string {
  if (!value) return notSpecified(locale)
  const option = LIVING_MODEL_OPTIONS.find((entry) => entry.value === value)
  return option ? translate(locale, option.labelKey) : value
}

function translateOwnership(
  locale: Locale,
  value: CommunityInterestInput["energyOwnership"]
): string {
  if (!value) return notSpecified(locale)
  const option = OWNERSHIP_OPTIONS.find((entry) => entry.value === value)
  return option ? translate(locale, option.labelKey) : value
}

function translateListByMap<T extends string>(
  locale: Locale,
  items: T[] | null | undefined,
  map: Record<T, string>
): string {
  if (!items || items.length === 0) return notSpecified(locale)
  return items.map((item) => translateByMap(locale, item, map)).join(", ")
}

function translateFoodProducts(locale: Locale, items: string[] | null | undefined): string {
  if (!items || items.length === 0) return notSpecified(locale)
  return items
    .map((item) => translate(locale, `communities.form.food_product_option.${item}`))
    .join(", ")
}

function translateFoodFrequency(
  locale: Locale,
  value: CommunityInterestInput["foodFrequency"]
): string {
  if (!value) return notSpecified(locale)
  return translate(locale, `communities.form.food_frequency_option.${value}`)
}

function buildSummary(data: CommunityInterestInput, locale: Locale): string {
  const locations =
    data.preferredLocations.length > 0
      ? formatPreferredLocationsForDisplay(data.preferredLocations)
      : notSpecified(locale)

  const energySources =
    data.energyOwnership === "Resident-owned" && data.energyPreferences != null
      ? translateListByMap(locale, data.energyPreferences, ENERGY_SOURCE_LABEL_KEYS)
      : naAutarkeiaManaged(locale)

  const foodMethods =
    data.foodOwnership === "Resident-owned" && data.foodPreferences != null
      ? translateListByMap(locale, data.foodPreferences, FOOD_PRODUCTION_LABEL_KEYS)
      : naAutarkeiaManaged(locale)

  const lines = [
    summaryLine(locale, "communities.email.summary.preferred_locations", locations),
    summaryLine(
      locale,
      "communities.email.summary.intent",
      translate(locale, INTENT_LABEL_KEYS[data.intent])
    ),
  ]

  if (data.intent === "live" || data.intent === "both") {
    lines.push(
      summaryLine(
        locale,
        "communities.email.summary.living_model",
        translateLivingModel(locale, data.livingModel)
      ),
      summaryLine(
        locale,
        "communities.email.summary.energy_ownership",
        translateOwnership(locale, data.energyOwnership)
      ),
      summaryLine(locale, "communities.email.summary.preferred_energy_sources", energySources),
      summaryLine(
        locale,
        "communities.email.summary.food_ownership",
        translateOwnership(locale, data.foodOwnership)
      ),
      summaryLine(locale, "communities.email.summary.preferred_food_production", foodMethods),
      summaryLine(
        locale,
        "communities.email.summary.dietary_preference",
        translateByMap(locale, data.dietaryPreference, DIETARY_LABEL_KEYS)
      ),
      summaryLine(
        locale,
        "communities.email.summary.climate",
        translateByMap(locale, data.climatePreference, CLIMATE_LABEL_KEYS)
      ),
      summaryLine(
        locale,
        "communities.email.summary.distance_from_city",
        translateByMap(locale, data.distanceFromCity, DISTANCE_LABEL_KEYS)
      ),
      summaryLine(
        locale,
        "communities.email.summary.investment_capacity",
        translateByMap(locale, data.investmentCapacity, INVESTMENT_LABEL_KEYS)
      ),
      summaryLine(
        locale,
        "communities.email.summary.investor_type",
        translateByMap(locale, data.investorType, INVESTOR_TYPE_LABEL_KEYS)
      ),
      summaryLine(
        locale,
        "communities.email.summary.move_timeline",
        translateByMap(locale, data.moveTimeline, MOVE_TIMELINE_LABEL_KEYS)
      )
    )
  }

  if (data.intent === "buy_food" || data.intent === "both") {
    lines.push(
      summaryLine(
        locale,
        "communities.email.summary.food_products",
        translateFoodProducts(locale, data.foodProducts ?? [])
      ),
      summaryLine(
        locale,
        "communities.email.summary.purchase_frequency",
        translateFoodFrequency(locale, data.foodFrequency)
      )
    )
  }

  const notes = data.notes?.trim()
  if (notes) {
    lines.push(summaryLine(locale, "communities.form.notes", notes))
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
    priceLabel: string
    ctaBuyAt: string
    affiliateDisclosure: string
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
          item.linked_product && safeString(item.linked_product.name).trim()
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

  const productCardHtml = (rec: QuizResult["product_recommendations"][number]) => {
    const product = rec.catalog_product
    if (!product) return ""

    const sku = safeString(product.sku).trim()
    const name = safeString(product.name).trim()
    const affiliateUrl = safeString(product.affiliate_url).trim()
    if (!sku || !name || !affiliateUrl) return ""

    const sellerName = safeString(product.seller_name).trim() || "Autarkeia"
    const ctaLabel = safeString(labels.ctaBuyAt).replace("{brand}", sellerName)
    const imageUrl = safeString(product.image_url).trim()
    const price = safeString(product.price).trim()

    const imageCell = imageUrl
      ? `<td style="width:72px;min-width:72px;vertical-align:top;padding-right:12px;">
            <div style="width:72px;height:72px;min-width:72px;min-height:72px;background:#eef2f6;border:1px solid #e8edf2;border-radius:6px;overflow:hidden;line-height:0;">
              <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(name)}" width="72" height="72" style="display:block;width:72px;height:72px;max-width:72px;max-height:72px;object-fit:contain;background:#ffffff;border:0;outline:none;text-decoration:none;" />
            </div>
          </td>`
      : ""

    return `
      <div style="margin-top:12px;padding:12px;border:1px solid #e8edf2;border-radius:8px;background:#fafbfc;">
        <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;">
          <tr>
            ${imageCell}
            <td style="vertical-align:top;">
              <p style="margin:0 0 6px;font-size:14px;font-weight:600;color:#0d1b2a;">${escapeHtml(name)}</p>
              ${
                price
                  ? `<p style="margin:0 0 10px;font-size:12px;color:#8a9bb0;">${escapeHtml(
                      labels.priceLabel
                    )}: ${escapeHtml(price)}</p>`
                  : ""
              }
              <a href="${escapeHtml(affiliateUrl)}" style="display:inline-block;background:#009b70;color:#ffffff;text-decoration:none;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:600;">${escapeHtml(
                ctaLabel
              )}</a>
            </td>
          </tr>
        </table>
      </div>`
  }

  const recRows = options.productRecommendations
    .map((rec) => {
      const legacyPrice = safeString(rec.estimated_price).trim()
      const showLegacyPrice = !rec.catalog_product?.affiliate_url && legacyPrice
      return `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #eef2f6;">
          <p style="margin:0 0 4px;font-size:12px;color:#8a9bb0;text-transform:uppercase;">${escapeHtml(
            rec.category
          )}</p>
          <p style="margin:0 0 8px;font-size:14px;color:#3d5166;line-height:1.5;">${escapeHtml(rec.why)}</p>
          ${
            showLegacyPrice
              ? `<p style="margin:0 0 8px;font-size:12px;color:#8a9bb0;">${escapeHtml(
                  labels.estimatedPrice
                )}: ${escapeHtml(legacyPrice)}</p>`
              : ""
          }
          ${productCardHtml(rec)}
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
  const viewUrl = `${safeString(options.appUrl).replace(/\/$/, "")}${resultsPath}`

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
                  <p style="margin:0 0 10px;font-size:11px;color:#8a9bb0;line-height:1.5;">${escapeHtml(
                    labels.affiliateDisclosure
                  )}</p>
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

export async function sendWelcomeEmail(
  email: string,
  displayName: string | null,
  locale: Locale = "en"
): Promise<void> {
  const appUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://autarkeia.world").replace(
    /\/$/,
    ""
  )
  const subject = translate(locale, "welcome.email.subject")
  const greeting = displayName?.trim()
    ? translate(locale, "welcome.email.greeting_with_name").replace("{name}", displayName.trim())
    : translate(locale, "welcome.email.greeting_default")
  const intro = translate(locale, "welcome.email.intro")
  const actionEmergency = translate(locale, "welcome.email.action_quiz_emergency")
  const actionSelf = translate(locale, "welcome.email.action_quiz_self_sufficiency")
  const actionMarketplace = translate(locale, "welcome.email.action_marketplace")
  const ctaDashboard = translate(locale, "welcome.email.cta_dashboard")
  const footerQuestions = translate(locale, "welcome.email.footer_questions")
  const footerSignoff = translate(locale, "welcome.email.footer_signoff")

  const emergencyUrl = `${appUrl}/quiz/emergency-readiness`
  const selfUrl = `${appUrl}/quiz/self-sufficiency`
  const marketplaceUrl = `${appUrl}/marketplace`
  const dashboardUrl = `${appUrl}/dashboard`

  const bullet = (href: string, label: string) =>
    `<li style="margin:0 0 10px;color:#3d5166;font-size:14px;line-height:1.5;">
      <a href="${escapeHtml(href)}" style="color:#009b70;text-decoration:none;font-weight:500;">${escapeHtml(label)}</a>
    </li>`

  const html = `
    <div style="margin:0;padding:0;background:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fa;padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;border:1px solid #d4dce8;border-radius:14px;overflow:hidden;">
              <tr>
                <td style="background:#0d1b2a;padding:28px 24px;text-align:center;">
                  <p style="margin:0;font-size:18px;font-weight:300;letter-spacing:3px;color:#ffffff;">
                    AUT<span style="color:#009b70;">ARK</span>EIA
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 24px 20px;background:#ffffff;">
                  <p style="margin:0 0 16px;font-size:16px;color:#0d1b2a;font-weight:500;">${escapeHtml(greeting)}</p>
                  <p style="margin:0 0 20px;font-size:14px;color:#3d5166;line-height:1.6;">${escapeHtml(intro)}</p>
                  <ul style="margin:0 0 24px;padding-left:20px;">
                    ${bullet(emergencyUrl, actionEmergency)}
                    ${bullet(selfUrl, actionSelf)}
                    ${bullet(marketplaceUrl, actionMarketplace)}
                  </ul>
                  <a href="${escapeHtml(dashboardUrl)}" style="display:inline-block;background:#009b70;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-size:14px;font-weight:600;">${escapeHtml(ctaDashboard)}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 24px 24px;border-top:1px solid #eef2f6;background:#fafbfc;">
                  <p style="margin:0 0 8px;font-size:13px;color:#3d5166;line-height:1.5;">${escapeHtml(footerQuestions)}</p>
                  <p style="margin:0;font-size:13px;color:#8a9bb0;">${escapeHtml(footerSignoff)}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `.trim()

  await sendResendEmail({
    to: [email],
    subject,
    html,
  })
}

function buildBrandedConfirmationEmail(options: {
  greeting: string
  thanksLine: string
  summaryHeading?: string
  summaryContent?: string
  signoff: string
}): string {
  const summaryBlock =
    options.summaryHeading && options.summaryContent
      ? `
                  <h2 style="margin:0 0 12px;font-size:16px;color:#0d1b2a;font-weight:600;">${escapeHtml(
                    options.summaryHeading
                  )}</h2>
                  <pre style="margin:0;padding:14px;border:1px solid #d4dce8;border-radius:10px;background:#fafbfc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:13px;line-height:1.5;color:#3d5166;white-space:pre-wrap;">${escapeHtml(
                    options.summaryContent
                  )}</pre>`
      : ""

  return `
    <div style="margin:0;padding:0;background:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fa;padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;border:1px solid #d4dce8;border-radius:14px;overflow:hidden;">
              <tr>
                <td style="background:#0d1b2a;padding:28px 24px;text-align:center;">
                  <p style="margin:0;font-size:18px;font-weight:300;letter-spacing:3px;color:#ffffff;">
                    AUT<span style="color:#009b70;">ARK</span>EIA
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 24px 20px;background:#ffffff;">
                  <p style="margin:0 0 16px;font-size:16px;color:#0d1b2a;font-weight:500;">${escapeHtml(
                    options.greeting
                  )}</p>
                  <p style="margin:0 0 24px;font-size:14px;color:#3d5166;line-height:1.6;">${escapeHtml(
                    options.thanksLine
                  )}</p>
                  ${summaryBlock}
                </td>
              </tr>
              <tr>
                <td style="padding:16px 24px 24px;border-top:1px solid #eef2f6;background:#fafbfc;">
                  <p style="margin:0;font-size:13px;color:#8a9bb0;">${escapeHtml(options.signoff)}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `.trim()
}

export async function sendCommunityInterestConfirmation(
  data: CommunityInterestInput,
  locale: Locale = "en"
): Promise<void> {
  const summary = buildSummary(data, locale)
  const greeting = translate(locale, "communities.email.greeting").replace(
    "{name}",
    data.fullName.trim()
  )
  const html = buildBrandedConfirmationEmail({
    greeting,
    thanksLine: translate(locale, "communities.email.thanks_line"),
    summaryHeading: translate(locale, "communities.email.summary_heading"),
    summaryContent: summary,
    signoff: translate(locale, "communities.email.signoff"),
  })

  await sendResendEmail({
    to: [data.email],
    subject: translate(locale, "communities.email.subject"),
    html,
  })
}

export async function sendContactConfirmation(
  data: ContactMessageInput,
  locale: Locale = "en"
): Promise<void> {
  const greeting = translate(locale, "contact.email.greeting").replace("{name}", data.name.trim())
  const html = buildBrandedConfirmationEmail({
    greeting,
    thanksLine: translate(locale, "contact.email.thanks_line"),
    signoff: translate(locale, "contact.email.signoff"),
  })

  await sendResendEmail({
    to: [data.email],
    subject: translate(locale, "contact.email.subject"),
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

export type NotificationEmailPayload = {
  id: string
  type: "forum_reply" | "forum_reaction" | "forum_mention"
  actorName: string | null
  actorAvatarUrl: string | null
  metadata: Record<string, unknown>
  href: string
}

const NOTIFICATION_SUBJECT_KEYS: Record<NotificationEmailPayload["type"], string> = {
  forum_reply: "emails.notification.subject.forum_reply",
  forum_reaction: "emails.notification.subject.forum_reaction",
  forum_mention: "emails.notification.subject.forum_mention",
}

const NOTIFICATION_ACTION_KEYS: Record<NotificationEmailPayload["type"], string> = {
  forum_reply: "notifications.types.forum_reply",
  forum_reaction: "notifications.types.forum_reaction",
  forum_mention: "notifications.types.forum_mention",
}

export async function sendNotificationEmail(
  notification: NotificationEmailPayload,
  recipientEmail: string,
  locale: Locale = "en"
): Promise<void> {
  const appUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://autarkeia.world").replace(/\/$/, "")
  const actorDisplay = notification.actorName?.trim() || translate(locale, "notifications.actor_fallback")
  const subject = translate(locale, NOTIFICATION_SUBJECT_KEYS[notification.type]).replace(
    "{actor}",
    actorDisplay
  )

  const actionKey = NOTIFICATION_ACTION_KEYS[notification.type]
  const emoji =
    notification.type === "forum_reaction" && typeof notification.metadata.emoji === "string"
      ? notification.metadata.emoji
      : ""
  const actionLine = translate(locale, actionKey)
    .replace(/\{actor\}/g, actorDisplay)
    .replace(/\{emoji\}/g, emoji)

  const snippet =
    typeof notification.metadata.snippet === "string" ? notification.metadata.snippet : ""
  const threadTitle =
    typeof notification.metadata.thread_title === "string" ? notification.metadata.thread_title : ""

  const cta = translate(locale, "emails.notification.body.cta_reply")
  const footerRaw = translate(locale, "emails.notification.body.footer_settings")
  const accountUrl = `${appUrl}/account`
  const footerHtml = footerRaw.replace(
    "{link}",
    `<a href="${escapeHtml(accountUrl)}" style="color:#009b70;text-decoration:none;">${escapeHtml(accountUrl)}</a>`
  )

  const threadUrl = `${appUrl}${notification.href.startsWith("/") ? notification.href : `/${notification.href}`}`

  const avatarBlock = notification.actorAvatarUrl
    ? `<img src="${escapeHtml(notification.actorAvatarUrl)}" alt="" width="40" height="40" style="border-radius:50%;object-fit:cover;display:block;" />`
    : `<div style="width:40px;height:40px;border-radius:50%;background:#d4dce8;color:#3d5166;font-size:14px;font-weight:600;line-height:40px;text-align:center;">${escapeHtml(actorDisplay.charAt(0).toUpperCase())}</div>`

  const snippetBlock = snippet
    ? `<p style="margin:12px 0 0;padding:12px 14px;border-left:3px solid #009b70;background:#fafbfc;border-radius:0 8px 8px 0;font-size:13px;color:#3d5166;line-height:1.5;font-style:italic;">${escapeHtml(snippet)}</p>`
    : ""

  const threadBlock = threadTitle
    ? `<p style="margin:8px 0 0;font-size:13px;color:#8a9bb0;">${escapeHtml(threadTitle)}</p>`
    : ""

  const html = `
    <div style="margin:0;padding:0;background:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fa;padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;border:1px solid #d4dce8;border-radius:14px;overflow:hidden;">
              <tr>
                <td style="background:#0d1b2a;padding:28px 24px;text-align:center;">
                  <p style="margin:0;font-size:18px;font-weight:300;letter-spacing:3px;color:#ffffff;">
                    AUT<span style="color:#009b70;">ARK</span>EIA
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 24px 20px;background:#ffffff;">
                  <table role="presentation" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="vertical-align:top;padding-right:12px;">${avatarBlock}</td>
                      <td style="vertical-align:top;">
                        <p style="margin:0;font-size:14px;color:#3d5166;line-height:1.5;">${escapeHtml(actionLine)}</p>
                        ${threadBlock}
                      </td>
                    </tr>
                  </table>
                  ${snippetBlock}
                  <p style="margin:24px 0 0;">
                    <a href="${escapeHtml(threadUrl)}" style="display:inline-block;background:#009b70;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-size:14px;font-weight:600;">${escapeHtml(cta)}</a>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 24px 24px;border-top:1px solid #eef2f6;background:#fafbfc;">
                  <p style="margin:0;font-size:13px;color:#8a9bb0;line-height:1.5;">${footerHtml}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `.trim()

  await sendResendEmail({
    to: [recipientEmail],
    subject,
    html,
  })
}

const FORUM_REPORT_NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL ?? "hello@autarkeia.world"

export async function sendForumReportNotification(options: {
  reportId: string
  reason: string
  note: string | null
  reporterName: string
  reporterEmail: string
  postSnippet: string
  postUrl: string
  threadTitle: string
}): Promise<void> {
  const appUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://autarkeia.world").replace(/\/$/, "")
  const adminReportsUrl = `${appUrl}/admin/forums-reports`
  const subject = `Forum post reported — ${options.reason}`

  const body = [
    `Report ID: ${options.reportId}`,
    `Reason: ${options.reason}`,
    `Thread: ${options.threadTitle}`,
    "",
    `Reporter: ${options.reporterName} <${options.reporterEmail}>`,
    "",
    "Post snippet:",
    options.postSnippet,
    "",
    options.note ? `Reporter note:\n${options.note}` : "",
    "",
    `View post: ${options.postUrl}`,
    `Admin reports (TODO): ${adminReportsUrl}`,
  ]
    .filter(Boolean)
    .join("\n")

  const html = `
    <div style="margin:0;padding:0;background:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fa;padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;border:1px solid #d4dce8;border-radius:14px;overflow:hidden;">
              <tr>
                <td style="background:#0d1b2a;padding:28px 24px;text-align:center;">
                  <p style="margin:0;font-size:18px;font-weight:300;letter-spacing:3px;color:#ffffff;">
                    AUT<span style="color:#009b70;">ARK</span>EIA
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 24px 20px;background:#ffffff;">
                  <p style="margin:0 0 12px;font-size:16px;color:#0d1b2a;font-weight:600;">Forum post reported</p>
                  <p style="margin:0 0 8px;font-size:14px;color:#3d5166;"><strong>Reason:</strong> ${escapeHtml(options.reason)}</p>
                  <p style="margin:0 0 8px;font-size:14px;color:#3d5166;"><strong>Thread:</strong> ${escapeHtml(options.threadTitle)}</p>
                  <p style="margin:0 0 8px;font-size:14px;color:#3d5166;"><strong>Reporter:</strong> ${escapeHtml(options.reporterName)} &lt;${escapeHtml(options.reporterEmail)}&gt;</p>
                  <pre style="margin:12px 0;padding:14px;border:1px solid #d4dce8;border-radius:10px;background:#fafbfc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:13px;line-height:1.5;color:#3d5166;white-space:pre-wrap;">${escapeHtml(options.postSnippet)}</pre>
                  ${options.note ? `<p style="margin:0 0 8px;font-size:14px;color:#3d5166;"><strong>Note:</strong> ${escapeHtml(options.note)}</p>` : ""}
                  <p style="margin:16px 0 0;font-size:14px;color:#3d5166;">
                    <a href="${escapeHtml(options.postUrl)}" style="color:#009b70;text-decoration:none;font-weight:600;">View post →</a>
                  </p>
                  <p style="margin:12px 0 0;font-size:13px;color:#8a9bb0;">
                    Admin moderation UI coming soon. Reports are in Supabase Table Editor for now.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `.trim()

  await sendResendEmail({
    to: [FORUM_REPORT_NOTIFY_EMAIL],
    subject,
    html,
  })
}

function safeString(value: unknown): string {
  if (value == null) return ""
  return String(value)
}

function escapeHtml(value: unknown): string {
  return safeString(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
