import { cookies } from 'next/headers'
import type { QuizType, QuizAnswers } from '@/lib/quiz-data'
import {
  isLocale,
  LOCALE_COOKIE,
  parseAcceptLanguage,
  type Locale,
} from '@/lib/i18n-core'
import { scoreQuiz } from '@/lib/quiz-scoring'
import { buildQuizAdvice } from '@/lib/quiz-advice'

async function resolveAnalyzeLocale(
  req: Request,
  bodyLocale: unknown
): Promise<Locale> {
  if (bodyLocale === 'en' || bodyLocale === 'es') return bodyLocale
  const jar = await cookies()
  const cookieLocale = jar.get(LOCALE_COOKIE)?.value
  if (isLocale(cookieLocale)) return cookieLocale
  return parseAcceptLanguage(req.headers.get('accept-language'))
}

export async function POST(req: Request) {
  let requestQuizType: QuizType = 'self-sufficiency'
  let requestAnswers: QuizAnswers = {}
  try {
    const body = (await req.json()) as {
      quizType: QuizType
      answers: QuizAnswers
      locale?: unknown
    }
    const locale = await resolveAnalyzeLocale(req, body.locale)
    const { quizType, answers } = body
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
    const locale = await resolveAnalyzeLocale(req, undefined)
    const deterministic = scoreQuiz(requestQuizType, requestAnswers)
    return Response.json({
      result: {
        ...deterministic,
        ...(await buildQuizAdvice(requestQuizType, requestAnswers, locale)).advice,
      },
    })
  }
}
