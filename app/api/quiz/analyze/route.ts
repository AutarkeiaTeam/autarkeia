import { generateText, Output } from 'ai'
import { z } from 'zod'
import type { QuizType, QuizAnswers } from '@/lib/quiz-data'
import { getQuizConfig } from '@/lib/quiz-data'

const actionItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  estimated_cost: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
})

const productRecommendationSchema = z.object({
  category: z.string(),
  name: z.string(),
  why: z.string(),
  estimated_price: z.string(),
})

const quizResultSchema = z.object({
  overall_score: z.number().int().min(0).max(92),
  category_scores: z.record(z.string(), z.number()),
  score_label: z.string(),
  action_plan: z.object({
    week: z.array(actionItemSchema),
    month: z.array(actionItemSchema),
    year: z.array(actionItemSchema),
  }),
  product_recommendations: z.array(productRecommendationSchema),
})

function formatAnswersForPrompt(
  quizType: QuizType, 
  answers: QuizAnswers
): string {
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

    const systemPrompt = `You are Autarkeia's AI analyst. Analyse these quiz answers and return ONLY a valid JSON object with: overall_score (integer 0-92), category_scores (object with keys: ${config.categories.join(', ')} - each value 0-100), score_label (string - one of: "Just getting started", "Early stage", "Moderately self-sufficient", "Highly self-sufficient"), action_plan (object with week/month/year arrays, each item has title, description, estimated_cost, priority), product_recommendations (array of 6 items with category, name, why, estimated_price). Be specific to the user's location and situation. Never exceed 92 for overall_score. Ensure each time period has 2-3 action items.`

    const { output } = await generateText({
      model: 'anthropic/claude-sonnet-4-20250514',
      output: Output.object({
        schema: quizResultSchema,
      }),
      system: systemPrompt,
      prompt: formattedAnswers,
      maxOutputTokens: 4000,
    })

    return Response.json({ result: output })
  } catch (error) {
    console.error('Quiz analysis error:', error)
    return Response.json(
      { error: 'Failed to analyze quiz results' },
      { status: 500 }
    )
  }
}
