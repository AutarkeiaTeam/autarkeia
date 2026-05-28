import { NextResponse } from "next/server"
import { parseAcceptLanguage, translate } from "@/lib/i18n-core"

export async function POST(request: Request) {
  const locale = parseAcceptLanguage(request.headers.get("accept-language"))
  const t = (key: string) => translate(locale, key)
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === "string" ? body.email.trim() : ""
  const quizType = typeof body?.quizType === "string" ? body.quizType : ""

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: t("quiz.email.invalid_email") }, { status: 400 })
  }

  if (quizType !== "emergency-readiness" && quizType !== "self-sufficiency") {
    return NextResponse.json({ error: t("quiz.email.invalid_type") }, { status: 400 })
  }

  // Placeholder: wire to Resend / SendGrid / etc. in production
  return NextResponse.json({
    ok: true,
    message: t("quiz.email.placeholder_success"),
  })
}
