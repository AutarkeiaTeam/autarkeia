import { QuizAnswers, QuizResult, CategoryScore, quizQuestions } from './quiz-types'

const categoryLabels: Record<string, string> = {
  food: 'Food',
  water: 'Water',
  energy: 'Energy',
  shelter: 'Shelter',
  resilience: 'Resilience',
}

export function calculateLocalScore(answers: QuizAnswers): QuizResult {
  // Group questions by category
  const categoryQuestions: Record<string, { id: string; value: number }[]> = {
    food: [],
    water: [],
    energy: [],
    shelter: [],
    resilience: [],
  }

  // Collect answers by category
  for (const question of quizQuestions) {
    const answerValue = answers[question.id]
    if (answerValue !== undefined) {
      categoryQuestions[question.category].push({
        id: question.id,
        value: answerValue,
      })
    }
  }

  // Calculate category scores
  const categoryScores: CategoryScore[] = []
  let totalScore = 0
  let categoryCount = 0

  for (const [category, questions] of Object.entries(categoryQuestions)) {
    if (questions.length > 0) {
      const sum = questions.reduce((acc, q) => acc + q.value, 0)
      const avgScore = Math.round(sum / questions.length)
      categoryScores.push({
        category,
        score: avgScore,
        label: categoryLabels[category] || category,
      })
      totalScore += avgScore
      categoryCount++
    }
  }

  // Calculate overall score
  const overallScore = categoryCount > 0 ? Math.round(totalScore / categoryCount) : 0

  // Generate summary based on score
  let summary: string
  if (overallScore >= 80) {
    summary = "Excellent! You're well-prepared for self-sufficiency. Your lifestyle already reflects strong independence from external systems. Keep building on your strengths and consider mentoring others in your community."
  } else if (overallScore >= 60) {
    summary = "Good progress! You have a solid foundation for self-sufficiency. With some targeted improvements in your weaker areas, you could significantly increase your independence and resilience."
  } else if (overallScore >= 40) {
    summary = "You're on the right path. While you have some self-sufficiency practices in place, there's room for meaningful improvement. Focus on building skills and resources in your lowest-scoring categories."
  } else if (overallScore >= 20) {
    summary = "You're just getting started on your self-sufficiency journey. Don't worry—everyone begins somewhere. Small, consistent steps can make a big difference over time."
  } else {
    summary = "Your self-sufficiency journey is just beginning. You're heavily dependent on external systems, but with the right guidance and resources, you can build resilience step by step."
  }

  // Sort categories by score to find strengths and improvements
  const sortedCategories = [...categoryScores].sort((a, b) => b.score - a.score)
  
  // Identify strengths (top scoring categories)
  const strengths: string[] = sortedCategories
    .filter(c => c.score >= 50)
    .slice(0, 2)
    .map(c => {
      if (c.score >= 80) return `${c.label}: Excellent preparedness`
      if (c.score >= 60) return `${c.label}: Strong foundation`
      return `${c.label}: Good progress`
    })

  if (strengths.length === 0) {
    strengths.push('Starting your journey towards self-sufficiency')
  }

  // Identify areas for improvement (lowest scoring categories)
  const improvements: string[] = sortedCategories
    .filter(c => c.score < 60)
    .slice(-2)
    .reverse()
    .map(c => {
      const improvementTips: Record<string, string> = {
        food: 'Start a small garden or learn food preservation techniques',
        water: 'Set up rainwater collection or increase water storage',
        energy: 'Explore solar panels or alternative heating options',
        shelter: 'Learn basic repair skills or create an emergency shelter plan',
        resilience: 'Connect with neighbors and develop tradeable skills',
      }
      return improvementTips[c.category] || `Improve your ${c.label.toLowerCase()} preparedness`
    })

  // Generate recommendations
  const recommendations: string[] = []
  
  // Add specific recommendations based on lowest scores
  for (const category of sortedCategories.slice(-3)) {
    if (category.score < 40) {
      const recs: Record<string, string[]> = {
        food: [
          'Start with easy-to-grow vegetables like tomatoes, lettuce, or herbs',
          'Build a 2-week food storage with non-perishables you actually eat',
          'Learn one food preservation method like canning or dehydrating',
        ],
        water: [
          'Store at least 1 gallon of water per person per day for 2 weeks',
          'Get a quality water filter like Berkey or Sawyer',
          'Research rainwater collection systems for your area',
        ],
        energy: [
          'Start with a small solar panel and battery bank for essentials',
          'Consider a wood stove if you have access to firewood',
          'Get a camping stove and propane as backup cooking',
        ],
        shelter: [
          'Learn basic home maintenance and repair skills',
          'Create an emergency kit with tools and supplies',
          'Develop a plan for shelter alternatives if needed',
        ],
        resilience: [
          'Get to know your neighbors and their skills',
          'Take a first aid course or CPR certification',
          'Develop at least one skill that others would value',
        ],
      }
      const categoryRecs = recs[category.category] || []
      recommendations.push(...categoryRecs.slice(0, 1))
    }
  }

  // Add general recommendations
  if (overallScore < 30) {
    recommendations.push('Join a local preparedness or homesteading group')
  }
  if (recommendations.length === 0) {
    recommendations.push('Continue building on your strengths while addressing weaker areas')
  }

  return {
    overallScore,
    categoryScores,
    summary,
    recommendations: recommendations.slice(0, 4),
    strengths,
    improvements,
  }
}
