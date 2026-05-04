import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { QuizAnswers, QuizResult, quizQuestions } from '@/lib/quiz-types'
import { calculateLocalScore } from '@/lib/quiz-scoring'

export async function POST(request: Request) {
  try {
    const { answers } = (await request.json()) as { answers: QuizAnswers }

    if (!answers || Object.keys(answers).length === 0) {
      return NextResponse.json(
        { error: 'No answers provided' },
        { status: 400 }
      )
    }

    // Calculate local score first (used as fallback and for AI context)
    const localResult = calculateLocalScore(answers)

    // Try to enhance with AI analysis
    const apiKey = process.env.ANTHROPIC_API_KEY
    
    if (!apiKey) {
      // No API key - return local calculation
      console.log('[v0] No ANTHROPIC_API_KEY found, using local scoring')
      return NextResponse.json(localResult)
    }

    try {
      const anthropic = new Anthropic({
        apiKey,
      })

      // Build context about the user's answers
      const answersContext = quizQuestions
        .map((q) => {
          const answer = answers[q.id]
          if (answer === undefined) return null
          const selectedOption = q.options.find((o) => o.value === answer)
          return `${q.question}: ${selectedOption?.label || 'Unknown'} (${answer}%)`
        })
        .filter(Boolean)
        .join('\n')

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `You are an expert in self-sufficiency, homesteading, and emergency preparedness. Analyze this person's self-sufficiency quiz results and provide personalized insights.

Quiz Results:
${answersContext}

Overall Score: ${localResult.overallScore}%
Category Scores:
${localResult.categoryScores.map((c) => `- ${c.label}: ${c.score}%`).join('\n')}

Provide a JSON response with:
1. "summary": A 2-3 sentence personalized summary of their preparedness level (warm, encouraging tone)
2. "strengths": Array of 2-3 specific strengths based on their high-scoring areas
3. "improvements": Array of 2-3 specific, actionable improvements for their lowest areas
4. "recommendations": Array of 3-4 practical next steps they can take

Respond ONLY with valid JSON, no markdown or code blocks.`,
          },
        ],
      })

      // Parse AI response
      const textContent = message.content.find((c) => c.type === 'text')
      if (textContent && textContent.type === 'text') {
        try {
          const aiInsights = JSON.parse(textContent.text)
          
          // Merge AI insights with calculated scores
          const enhancedResult: QuizResult = {
            overallScore: localResult.overallScore,
            categoryScores: localResult.categoryScores,
            summary: aiInsights.summary || localResult.summary,
            strengths: aiInsights.strengths || localResult.strengths,
            improvements: aiInsights.improvements || localResult.improvements,
            recommendations: aiInsights.recommendations || localResult.recommendations,
          }
          
          return NextResponse.json(enhancedResult)
        } catch {
          // AI response wasn't valid JSON - use local result
          console.log('[v0] Failed to parse AI response, using local scoring')
          return NextResponse.json(localResult)
        }
      }

      // No text content in AI response - use local result
      return NextResponse.json(localResult)
    } catch (aiError) {
      // AI call failed - use local result as fallback
      console.log('[v0] Anthropic API error, falling back to local scoring:', aiError)
      return NextResponse.json(localResult)
    }
  } catch (error) {
    // Even if everything fails, return a basic result
    console.error('[v0] Quiz analysis error:', error)
    
    // Return a generic fallback result
    const fallbackResult: QuizResult = {
      overallScore: 50,
      categoryScores: [
        { category: 'food', score: 42, label: 'Food' },
        { category: 'water', score: 50, label: 'Water' },
        { category: 'energy', score: 50, label: 'Energy' },
        { category: 'shelter', score: 50, label: 'Shelter' },
        { category: 'resilience', score: 50, label: 'Resilience' },
      ],
      summary: "We couldn't fully analyze your responses, but based on typical patterns, you're making progress on your self-sufficiency journey. Every step counts!",
      strengths: ['Taking the first step by assessing your preparedness'],
      improvements: ['Continue exploring areas where you can build more independence'],
      recommendations: [
        'Start with small, achievable goals in one category',
        'Connect with others on similar journeys',
        'Track your progress over time',
      ],
    }
    
    return NextResponse.json(fallbackResult)
  }
}
