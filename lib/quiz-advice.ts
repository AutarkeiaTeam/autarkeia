import type { QuizAnswers, QuizResult, QuizType } from "@/lib/quiz-data"
import { getQuizConfig } from "@/lib/quiz-data"
import type { Locale } from "@/lib/i18n-core"
import { scoreQuiz } from "@/lib/quiz-scoring"
import { buildScoreAwareFallback } from "@/lib/quiz-advice-bank"

function formatAnswersForPrompt(quizType: QuizType, answers: QuizAnswers): string {
  const config = getQuizConfig(quizType)
  const formattedAnswers = config.questions
    .map((q, idx) => {
      const answer = answers[q.id]
      let answerText: string
      if (q.type === "single") {
        const option = q.options.find((o) => o.id === answer)
        answerText = option?.label || "Not answered"
      } else {
        const selectedIds = answer as string[]
        if (!selectedIds || selectedIds.length === 0) {
          answerText = "None selected"
        } else {
          const selectedLabels = selectedIds
            .map((id) => q.options.find((o) => o.id === id)?.label)
            .filter(Boolean)
          answerText = selectedLabels.join(", ")
        }
      }
      return `Q${idx + 1}: ${q.question}\nAnswer: ${answerText}`
    })
    .join("\n\n")
  return `Quiz Type: ${
    quizType === "self-sufficiency" ? "Self-Sufficiency" : "Emergency Readiness"
  }\n\n${formattedAnswers}`
}

function buildFallback(
  locale: Locale,
  quizType: QuizType,
  deterministic: ReturnType<typeof scoreQuiz>
): Pick<QuizResult, "action_plan" | "product_recommendations"> {
  const orderedCategories = getQuizConfig(quizType).categories
  return buildScoreAwareFallback({
    quizType,
    locale,
    overallScore: deterministic.overall_score,
    categoryScores: deterministic.category_scores,
    orderedCategories,
  })
}

export type QuizAdviceResult = {
  advice: Pick<QuizResult, "action_plan" | "product_recommendations">
  usedFallback: boolean
  reason?: string
}

export async function buildQuizAdvice(
  quizType: QuizType,
  answers: QuizAnswers,
  locale: Locale
): Promise<QuizAdviceResult> {
  const deterministic = scoreQuiz(quizType, answers)
  const fallbackAdvice = buildFallback(locale, quizType, deterministic)
  const formattedAnswers = formatAnswersForPrompt(quizType, answers)
  const systemPrompt =
    "You are Autarkeia's AI advisor. Return ONLY raw JSON with no markdown or backticks. The JSON must have: action_plan (object with week/month/year arrays each with exactly 3 items having title/description/estimated_cost/priority as high or medium or low), product_recommendations (array of exactly 6 items with category/name/why/estimated_price). Do NOT include score fields. The score is already computed deterministically and you must align recommendations with it."
  const scoreContext = JSON.stringify({
    overall_score: deterministic.overall_score,
    category_scores: deterministic.category_scores,
    score_label: deterministic.score_label,
  })

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim()
  if (!apiKey) {
    return {
      advice: fallbackAdvice,
      usedFallback: true,
      reason: "ANTHROPIC_API_KEY missing",
    }
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-latest",
      max_tokens: 2200,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Computed score context:\n${scoreContext}\n\nUser answers:\n${formattedAnswers}`,
        },
      ],
    }),
  })
  if (!response.ok) {
    const errorBody = await response.text()
    console.error("Anthropic error:", response.status, errorBody)
    return {
      advice: fallbackAdvice,
      usedFallback: true,
      reason: `Anthropic returned non-200: ${response.status} — ${errorBody.slice(0, 500)}`,
    }
  }
  const data = await response.json()
  const content = data.content?.[0]
  if (!content || content.type !== "text") {
    return {
      advice: fallbackAdvice,
      usedFallback: true,
      reason: "Anthropic returned 200 but shape validation failed",
    }
  }
  const jsonMatch = String(content.text ?? "").trim().match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return {
      advice: fallbackAdvice,
      usedFallback: true,
      reason: "Anthropic returned 200 but parse failed: missing JSON object in text",
    }
  }
  try {
    const parsed = JSON.parse(jsonMatch[0]) as Pick<
      QuizResult,
      "action_plan" | "product_recommendations"
    >
    if (!parsed.action_plan || !parsed.product_recommendations) {
      return {
        advice: fallbackAdvice,
        usedFallback: true,
        reason: "Anthropic returned 200 but shape validation failed",
      }
    }
    return {
      advice: parsed,
      usedFallback: false,
    }
  } catch {
    return {
      advice: fallbackAdvice,
      usedFallback: true,
      reason: "Anthropic returned 200 but parse failed",
    }
  }
}
