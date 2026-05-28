import type { QuizType, QuizAnswers } from '@/lib/quiz-data'
import { getQuizConfig } from '@/lib/quiz-data'
import { parseAcceptLanguage, translate, type Locale } from '@/lib/i18n-core'
import { scoreQuiz } from '@/lib/quiz-scoring'

function formatAnswersForPrompt(quizType: QuizType, answers: QuizAnswers): string {
  const config = getQuizConfig(quizType)
  const formattedAnswers = config.questions.map((q, idx) => {
    const answer = answers[q.id]
    let answerText: string
    if (q.type === 'single') {
      const option = q.options.find(o => o.id === answer)
      answerText = option?.label || 'Not answered'
    } else {
      const selectedIds = answer as string[]
      if (!selectedIds || selectedIds.length === 0) {
        answerText = 'None selected'
      } else {
        const selectedLabels = selectedIds
          .map(id => q.options.find(o => o.id === id)?.label)
          .filter(Boolean)
        answerText = selectedLabels.join(', ')
      }
    }
    return `Q${idx + 1}: ${q.question}\nAnswer: ${answerText}`
  }).join('\n\n')
  return `Quiz Type: ${quizType === 'self-sufficiency' ? 'Self-Sufficiency' : 'Emergency Readiness'}\n\n${formattedAnswers}`
}

function t(locale: Locale, key: string): string {
  return translate(locale, key)
}

function buildFallback(locale: Locale, quizType: QuizType) {
  return {
    action_plan: {
      week: [
        { title: t(locale, 'quiz.fallback.week.1.title'), description: t(locale, 'quiz.fallback.week.1.description'), estimated_cost: '€15-25', priority: 'high' },
        { title: t(locale, 'quiz.fallback.week.2.title'), description: t(locale, 'quiz.fallback.week.2.description'), estimated_cost: '€0', priority: 'high' },
        { title: t(locale, 'quiz.fallback.week.3.title'), description: t(locale, 'quiz.fallback.week.3.description'), estimated_cost: '€25-40', priority: 'high' },
      ],
      month: [
        { title: t(locale, 'quiz.fallback.month.1.title'), description: t(locale, 'quiz.fallback.month.1.description'), estimated_cost: '€80-150', priority: 'medium' },
        { title: t(locale, 'quiz.fallback.month.2.title'), description: t(locale, 'quiz.fallback.month.2.description'), estimated_cost: '€45-120', priority: 'medium' },
        { title: t(locale, 'quiz.fallback.month.3.title'), description: t(locale, 'quiz.fallback.month.3.description'), estimated_cost: '€20-50', priority: 'medium' },
      ],
      year: [
        { title: t(locale, 'quiz.fallback.year.1.title'), description: t(locale, 'quiz.fallback.year.1.description'), estimated_cost: '€800-2000', priority: 'low' },
        { title: t(locale, 'quiz.fallback.year.2.title'), description: t(locale, 'quiz.fallback.year.2.description'), estimated_cost: '€50-100', priority: 'low' },
        { title: t(locale, 'quiz.fallback.year.3.title'), description: t(locale, 'quiz.fallback.year.3.description'), estimated_cost: '€0-varies', priority: 'low' },
      ],
    },
    product_recommendations: [
      { category: t(locale, 'quiz.fallback.products.1.category'), name: t(locale, 'quiz.fallback.products.1.name'), why: t(locale, 'quiz.fallback.products.1.why'), estimated_price: '€320' },
      { category: t(locale, 'quiz.fallback.products.2.category'), name: t(locale, 'quiz.fallback.products.2.name'), why: t(locale, 'quiz.fallback.products.2.why'), estimated_price: '€85' },
      { category: t(locale, 'quiz.fallback.products.3.category'), name: t(locale, 'quiz.fallback.products.3.name'), why: t(locale, 'quiz.fallback.products.3.why'), estimated_price: '€499' },
      { category: t(locale, 'quiz.fallback.products.4.category'), name: t(locale, 'quiz.fallback.products.4.name'), why: t(locale, 'quiz.fallback.products.4.why'), estimated_price: '€89' },
      { category: t(locale, 'quiz.fallback.products.5.category'), name: t(locale, 'quiz.fallback.products.5.name'), why: t(locale, 'quiz.fallback.products.5.why'), estimated_price: '€49' },
      { category: t(locale, 'quiz.fallback.products.6.category'), name: t(locale, 'quiz.fallback.products.6.name'), why: t(locale, 'quiz.fallback.products.6.why'), estimated_price: '€39' },
    ],
  }
}

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
    const config = getQuizConfig(quizType)
    const deterministic = scoreQuiz(quizType, answers)
    const formattedAnswers = formatAnswersForPrompt(quizType, answers)
    const systemPrompt = `You are Autarkeia's AI advisor. Return ONLY raw JSON with no markdown or backticks. The JSON must have: action_plan (object with week/month/year arrays each with exactly 3 items having title/description/estimated_cost/priority as high or medium or low), product_recommendations (array of exactly 6 items with category/name/why/estimated_price). Do NOT include score fields. The score is already computed deterministically and you must align recommendations with it.`
    const scoreContext = JSON.stringify({
      overall_score: deterministic.overall_score,
      category_scores: deterministic.category_scores,
      score_label: deterministic.score_label,
    })

    const apiKey = process.env.ANTHROPIC_API_KEY?.trim()
    const fallbackAdvice = buildFallback(locale, quizType)
    if (!apiKey) {
      return Response.json({
        result: {
          ...deterministic,
          ...fallbackAdvice,
        },
      })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-latest',
        max_tokens: 2200,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Computed score context:\n${scoreContext}\n\nUser answers:\n${formattedAnswers}` }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Anthropic API error:', response.status, errorText)
      return Response.json({
        result: {
          ...deterministic,
          ...fallbackAdvice,
        },
      })
    }

    const data = await response.json()
    const content = data.content?.[0]
    if (!content || content.type !== 'text') {
      return Response.json({
        result: {
          ...deterministic,
          ...fallbackAdvice,
        },
      })
    }

    const text = content.text.trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return Response.json({
        result: {
          ...deterministic,
          ...fallbackAdvice,
        },
      })
    }

    const aiResult = JSON.parse(jsonMatch[0]) as {
      action_plan?: unknown
      product_recommendations?: unknown
    }

    if (!aiResult.action_plan || !aiResult.product_recommendations) {
      return Response.json({
        result: {
          ...deterministic,
          ...fallbackAdvice,
        },
      })
    }

    return Response.json({
      result: {
        ...deterministic,
        action_plan: aiResult.action_plan,
        product_recommendations: aiResult.product_recommendations,
      },
    })

  } catch (error) {
    console.error('Quiz analysis error:', error)
    const locale = parseAcceptLanguage(req.headers.get('accept-language'))
    const deterministic = scoreQuiz(requestQuizType, requestAnswers)
    return Response.json({
      result: {
        ...deterministic,
        ...buildFallback(locale, requestQuizType),
      },
    })
  }
}
