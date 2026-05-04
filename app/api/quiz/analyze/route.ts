import Anthropic from '@anthropic-ai/sdk'
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
  return `Quiz Type: ${quizType === 'self-sufficiency' ? 'Self-Sufficiency' : 'Emergency Preparedness'}\n\n${formattedAnswers}`
}

export async function POST(req: Request) {
  try {
    const { quizType, answers } = await req.json() as {
      quizType: QuizType
      answers: QuizAnswers
    }
    const config = getQuizConfig(quizType)
    const formattedAnswers = formatAnswersForPrompt(quizType, answers)
    const systemPrompt = `You are Autarkeia's AI analyst. Analyse these quiz answers and return ONLY a valid JSON object with no markdown, no backticks, just raw JSON with: overall_score (integer 0-92), category_scores (object with keys: ${config.categories.join(', ')} - each value 0-100), score_label (string - one of: "Just getting started", "Early stage", "Moderately self-sufficient", "Highly self-sufficient"), action_plan (object with week/month/year arrays, each item has title, description, estimated_cost, priority as high/medium/low), product_recommendations (array of 6 items with category, name, why, estimated_price). Be specific to the user's location and situation. Never exceed 92 for overall_score. Each time period must have exactly 3 action items.`

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: formattedAnswers,
        }
      ],
      system: systemPrompt,
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    const result = JSON.parse(content.text)
    return Response.json({ result })

  } catch (error) {
    console.error('Quiz analysis error:', error)
    // Fallback scoring if API fails
    return Response.json({
      result: {
        overall_score: 35,
        category_scores: { food: 30, water: 40, energy: 35, shelter: 40, resilience: 25 },
        score_label: "Early stage",
        action_plan: {
          week: [
            { title: "Store 72 hours of water", description: "Buy at minimum 9 litres per person. Start today.", estimated_cost: "€15-25", priority: "high" },
            { title: "Audit your food supply", description: "Check how many days of food you currently have at home.", estimated_cost: "€0", priority: "high" },
            { title: "Charge a power bank", description: "Keep a 20,000mAh power bank charged at all times.", estimated_cost: "€25-40", priority: "high" }
          ],
          month: [
            { title: "Build a 2-week food store", description: "Rice, lentils, pasta, canned goods. Rotate every 6 months.", estimated_cost: "€80-150", priority: "medium" },
            { title: "Buy a water filter", description: "A gravity filter covers water quality for stored and natural sources.", estimated_cost: "€45-120", priority: "medium" },
            { title: "Start a small garden", description: "Even herbs and lettuce on a windowsill starts the habit.", estimated_cost: "€20-50", priority: "medium" }
          ],
          year: [
            { title: "Install solar backup", description: "A 500W panel and battery covers essentials. Halves grid dependence.", estimated_cost: "€800-2000", priority: "low" },
            { title: "Learn food preservation", description: "Fermentation, dehydrating and cold storage extend your harvest.", estimated_cost: "€50-100", priority: "low" },
            { title: "Join an Autarkeia community", description: "The fastest way to accelerate is shared knowledge and shared land.", estimated_cost: "€0-varies", priority: "low" }
          ]
        },
        product_recommendations: [
          { category: "Water", na
