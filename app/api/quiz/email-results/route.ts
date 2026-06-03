import { NextResponse } from "next/server"
import { parseAcceptLanguage, translate } from "@/lib/i18n-core"
import type { QuizAnswers, QuizType } from "@/lib/quiz-data"
import { scoreQuiz } from "@/lib/quiz-scoring"
import { sendQuizResultsEmail } from "@/lib/resend"
import { buildQuizAdvice } from "@/lib/quiz-advice"

type EmailPayload = {
  email?: unknown
  quizType?: unknown
  answers?: unknown
  locale?: unknown
}

function jsonError(locale: "en" | "es", key: string, status: number) {
  return NextResponse.json({ errorKey: key, error: translate(locale, key) }, { status })
}

export async function POST(request: Request) {
  const headerLocale = parseAcceptLanguage(request.headers.get("accept-language"))
  const body = (await request.json().catch(() => null)) as EmailPayload | null
  const locale =
    body?.locale === "en" || body?.locale === "es" ? body.locale : headerLocale
  const t = (key: string) => translate(locale, key)
  const email = typeof body?.email === "string" ? body.email.trim() : ""
  const quizType = typeof body?.quizType === "string" ? body.quizType : ""
  const answers = body?.answers as QuizAnswers | undefined

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonError(locale, "quiz.email.invalid_email", 400)
  }

  if (quizType !== "emergency-readiness" && quizType !== "self-sufficiency") {
    return jsonError(locale, "quiz.email.error.quiz_type_required", 400)
  }

  if (!answers || typeof answers !== "object") {
    return jsonError(locale, "quiz.email.error.answers_required", 400)
  }

  try {
    const quiz = quizType as QuizType
    const deterministic = scoreQuiz(quiz, answers)
    const { advice } = await buildQuizAdvice(quiz, answers, locale)

    await sendQuizResultsEmail({
      to: email,
      subject: t(`quiz.email.subject.${quiz}`),
      overallScore: deterministic.overall_score,
      scoreLabel: deterministic.score_label,
      categoryScores: deterministic.category_scores,
      actionPlan: advice.action_plan,
      productRecommendations: advice.product_recommendations,
      appUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://autarkeia.world",
      quizType: quiz,
      labels: {
        title: t("quiz.email.title"),
        subtitle: t("quiz.email.subtitle"),
        scoreSummary: t("quiz.email.section.score"),
        overallScore: t("quiz.email.label.overall_score"),
        scoreLabel: t("quiz.email.label.score_label"),
        categoryBreakdown: t("quiz.email.section.category_breakdown"),
        actionPlan: t("quiz.email.section.action_plan"),
        week: t("quiz.email.section.week"),
        month: t("quiz.email.section.month"),
        year: t("quiz.email.section.year"),
        estimatedCost: t("quiz.email.label.estimated_cost"),
        priority: t("quiz.email.label.priority"),
        products: t("quiz.email.section.products"),
        beyondProducts: t("quiz.results.beyond_this_week.title"),
        actionRecommended: t("quiz.results.action.recommended_label"),
        estimatedPrice: t("quiz.email.label.estimated_price"),
        footerNote: t("quiz.email.footer.note"),
        footerSignature: t("quiz.email.footer.signature"),
        viewOnAutarkeia: t("quiz.email.footer.view_autarkeia"),
      },
    })

    return NextResponse.json({
      ok: true,
      message: t("quiz.email.success.sent"),
    })
  } catch (error) {
    console.error("[quiz/email-results]", error)
    return jsonError(locale, "quiz.email.error.send_failed", 500)
  }
}
