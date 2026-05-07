import type { QuizType, QuizAnswers } from '@/lib/quiz-data'
import { getQuizConfig } from '@/lib/quiz-data'

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

const FALLBACK = {
  overall_score: 35,
  category_scores: { food: 30, water: 40, energy: 35, shelter: 40, resilience: 25 },
  score_label: "Early stage",
  action_plan: {
    week: [
      { title: "Store 72 hours of water", description: "Buy at minimum 9 litres per person.", estimated_cost: "€15-25", priority: "high" },
      { title: "Audit your food supply", description: "Check how many days of food you have at home.", estimated_cost: "€0", priority: "high" },
      { title: "Charge a power bank", description: "Keep a 20,000mAh power bank charged at all times.", estimated_cost: "€25-40", priority: "high" }
    ],
    month: [
      { title: "Build a 2-week food store", description: "Rice, lentils, pasta, canned goods.", estimated_cost: "€80-150", priority: "medium" },
      { title: "Buy a water filter", description: "A gravity filter covers water quality.", estimated_cost: "€45-120", priority: "medium" },
      { title: "Start a small garden", description: "Even herbs on a windowsill starts the habit.", estimated_cost: "€20-50", priority: "medium" }
    ],
    year: [
      { title: "Install solar backup", description: "A 500W panel and battery covers essentials.", estimated_cost: "€800-2000", priority: "low" },
      { title: "Learn food preservation", description: "Fermentation and dehydrating extend your harvest.", estimated_cost: "€50-100", priority: "low" },
      { title: "Join an Autarkeia community", description: "Shared knowledge and shared land accelerates everything.", estimated_cost: "€0-varies", priority: "low" }
    ]
  },
  product_recommendations: [
    { category: "Water", name: "Berkey water filter", why: "Filters tap, well or collected water to drinking quality.", estimated_price: "€320" },
    { category: "Food", name: "72-hour emergency food kit", why: "Freeze-dried, 5-year shelf life.", estimated_price: "€85" },
    { category: "Energy", name: "Jackery 500 solar generator", why: "Entry-level solar and battery.", estimated_price: "€499" },
    { category: "Food growing", name: "Raised bed starter kit", why: "Best first step for food production.", estimated_price: "€89" },
    { category: "Medical", name: "Comprehensive first aid kit", why: "Covers burns, trauma, fractures.", estimated_price: "€49" },
    { category: "Communications", name: "Solar wind-up radio", why: "No batteries needed. Weather alerts.", estimated_price: "€39" }
  ]
}

export async function POST(req: Request) {
  try {
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
      return Response.json({ result: FALLBACK })
    }

    const data = await response.json()
    const content = data.content?.[0]
    if (!content || content.type !== 'text') {
      return Response.json({ result: FALLBACK })
    }

    const text = content.text.trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return Response.json({ result: FALLBACK })
    }

    const result = JSON.parse(jsonMatch[0])
    return Response.json({ result })

  } catch (error) {
    console.error('Quiz analysis error:', error)
    return Response.json({ result: FALLBACK })
  }
}
