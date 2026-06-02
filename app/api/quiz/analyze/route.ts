import type { QuizType, QuizAnswers } from '@/lib/quiz-data'
import { parseAcceptLanguage } from '@/lib/i18n-core'
import { scoreQuiz } from '@/lib/quiz-scoring'
import { buildQuizAdvice } from '@/lib/quiz-advice'

export async function POST(req: Request) {
  let requestQuizType: QuizType = 'self-sufficiency'
  let requestAnswers: QuizAnswers = {}
  try {
    const locale = parseAcceptLanguage(req.headers.get('accept-language'))
    const { quizType, answers } = await req.json() as {
      quizType: QuizType
      answers: QuizAnswers
    }
    requestQuizType = quizType
    requestAnswers = answers
    const deterministic = scoreQuiz(quizType, answers)
    const adviceResult = await buildQuizAdvice(quizType, answers, locale)
    if (adviceResult.usedFallback && adviceResult.reason) {
      console.error('[quiz/analyze] fallback:', adviceResult.reason)
    }

    return Response.json({
      result: {
        ...deterministic,
        ...adviceResult.advice,
      },
      ...(adviceResult.usedFallback && adviceResult.reason
        ? { _fallback_reason: adviceResult.reason }
        : {}),
    })

  } catch (error) {
    console.error('[quiz/analyze] fallback:', `Unhandled exception: ${
      error instanceof Error ? error.message : 'unknown'
    }`)
    const locale = parseAcceptLanguage(req.headers.get('accept-language'))
    const deterministic = scoreQuiz(requestQuizType, requestAnswers)
    return Response.json({
      result: {
        ...deterministic,
        ...(await buildQuizAdvice(requestQuizType, requestAnswers, locale)).advice,
      },
    })
  }
}
