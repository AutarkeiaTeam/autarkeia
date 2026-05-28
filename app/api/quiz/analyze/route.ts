import type { QuizType, QuizAnswers } from '@/lib/quiz-data'
import { getQuizConfig } from '@/lib/quiz-data'
import { parseAcceptLanguage, translate, type Locale } from '@/lib/i18n-core'

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
  const fallbackByCategory: Record<string, number> = {
    Food: 30,
    Water: 40,
    Energy: 35,
    Shelter: 40,
    Skills: 25,
    Medical: 35,
    Power: 30,
    Communication: 28,
  }
  const category_scores = Object.fromEntries(
    getQuizConfig(quizType).categories.map((category) => [category, fallbackByCategory[category] ?? 30])
  )

  return {
    overall_score: 35,
    category_scores,
    score_label: t(locale, 'quiz.fallback.score_label'),
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
  try {
    const locale = parseAcceptLanguage(req.headers.get('accept-language'))
    const { quizType, answers } = await req.json() as {
      quizType: QuizType
      answers: QuizAnswers
    }
    const config = getQuizConfig(quizType)
    const formattedAnswers = formatAnswersForPrompt(quizType, answers)
    const systemPrompt = `You are Autarkeia's AI analyst. Analyse these quiz answers and return ONLY raw JSON with no markdown or backticks. The JSON must have: overall_score (integer 0-92), category_scores (object with keys: ${config.categories.join(', ')} each value 0-100), score_label (one of: Just getting started, Early stage, Moderately self-sufficient, Highly self-sufficient), action_plan (object with week/month/year arrays each with exactly 3 items having title/description/estimated_cost/priority as high or medium or low), product_recommendations (array of exactly 6 items with category/name/why/estimated_price). Be specific to the user location and situation. Never exceed 92 for overall_score.`

    const apiKey = process.env.ANTHROPIC_API_KEY?.trim()

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: 'user', content: formattedAnswers }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Anthropic API error:', response.status, errorText)
      return Response.json({ result: buildFallback(locale, quizType) })
    }

    const data = await response.json()
    const content = data.content?.[0]
    if (!content || content.type !== 'text') {
      return Response.json({ result: buildFallback(locale, quizType) })
    }

    const text = content.text.trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return Response.json({ result: buildFallback(locale, quizType) })
    }

    const result = JSON.parse(jsonMatch[0])
    return Response.json({ result })

  } catch (error) {
    console.error('Quiz analysis error:', error)
    const locale = parseAcceptLanguage(req.headers.get('accept-language'))
    return Response.json({ result: buildFallback(locale, 'self-sufficiency') })
  }
}
