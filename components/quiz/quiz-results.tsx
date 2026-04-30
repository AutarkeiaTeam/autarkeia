'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ExternalLink, Calendar, Clock, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { QuizType, QuizResult, QuizAnswers } from '@/lib/quiz-data'
import { getQuizConfig } from '@/lib/quiz-data'

interface QuizResultsProps {
  quizType: QuizType
}

function getScoreColor(score: number): string {
  if (score >= 70) return '#009b70'
  if (score >= 40) return '#f59e0b'
  return '#ef4444'
}

function ScoreRing({ score, accentColor }: { score: number; accentColor: string }) {
  const circumference = 2 * Math.PI * 56
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-40 h-40 -rotate-90">
        <circle
          cx="80"
          cy="80"
          r="56"
          stroke="#f5f7fa"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="80"
          cy="80"
          r="56"
          stroke={accentColor}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-light text-[#0d1b2a]">{score}%</span>
        <span className="text-sm font-light text-[#8a9bb0]">Overall</span>
      </div>
    </div>
  )
}

function CategoryBar({ name, score }: { name: string; score: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-normal text-[#0d1b2a]">{name}</span>
        <span className="font-light text-[#8a9bb0]">{score}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-[#f5f7fa]">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${score}%`,
            backgroundColor: getScoreColor(score),
          }}
        />
      </div>
    </div>
  )
}

function ActionItem({ 
  title, 
  description, 
  estimated_cost, 
  priority,
  accentColor 
}: { 
  title: string
  description: string
  estimated_cost: string
  priority: string
  accentColor: string
}) {
  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#009b70'
  }

  return (
    <div className="p-4 rounded-xl border border-[#d4dce8] bg-white" style={{ borderWidth: '0.5px' }}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-[#0d1b2a]">{title}</h4>
        <span 
          className="text-xs px-2 py-0.5 rounded-full text-white capitalize"
          style={{ backgroundColor: priorityColors[priority as keyof typeof priorityColors] || accentColor }}
        >
          {priority}
        </span>
      </div>
      <p className="text-sm text-[#3d5166] font-light mb-3">{description}</p>
      <p className="text-xs text-[#8a9bb0]">Estimated cost: {estimated_cost}</p>
    </div>
  )
}

function ProductCard({ 
  category, 
  name, 
  why, 
  estimated_price,
  accentColor 
}: { 
  category: string
  name: string
  why: string
  estimated_price: string
  accentColor: string
}) {
  return (
    <div className="p-5 rounded-xl border border-[#d4dce8] bg-white flex flex-col" style={{ borderWidth: '0.5px' }}>
      <span 
        className="text-xs font-medium mb-2 px-2 py-0.5 rounded w-fit"
        style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
      >
        {category}
      </span>
      <h4 className="font-medium text-[#0d1b2a] mb-2">{name}</h4>
      <p className="text-sm text-[#3d5166] font-light mb-4 flex-1">{why}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#0d1b2a]">{estimated_price}</span>
        <Button 
          size="sm" 
          className="text-white text-xs"
          style={{ backgroundColor: accentColor }}
        >
          Buy <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  )
}

export function QuizResults({ quizType }: QuizResultsProps) {
  const [result, setResult] = useState<QuizResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const config = getQuizConfig(quizType)
  const otherQuizType = quizType === 'self-sufficiency' ? 'emergency-preparedness' : 'self-sufficiency'
  const otherQuizConfig = getQuizConfig(otherQuizType)

  useEffect(() => {
    async function analyzeQuiz() {
      try {
        const storedAnswers = sessionStorage.getItem(`quiz-answers-${quizType}`)
        if (!storedAnswers) {
          setError('No quiz answers found. Please take the quiz first.')
          setIsLoading(false)
          return
        }

        const answers: QuizAnswers = JSON.parse(storedAnswers)

        // Add artificial delay for better UX
        await new Promise(resolve => setTimeout(resolve, 2000))

        const response = await fetch('/api/quiz/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quizType, answers }),
        })

        if (!response.ok) {
          throw new Error('Failed to analyze quiz')
        }

        const data = await response.json()
        setResult(data.result)
      } catch (err) {
        console.error('Error analyzing quiz:', err)
        setError('Something went wrong. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    analyzeQuiz()
  }, [quizType])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div 
          className="h-16 w-16 animate-spin rounded-full border-4 border-t-transparent mb-6"
          style={{ borderColor: `${config.accentColor}33`, borderTopColor: config.accentColor }}
        />
        <p className="text-lg font-light text-[#0d1b2a]">Calculating your score...</p>
        <p className="text-sm text-[#8a9bb0] mt-2">Analysing your answers with AI</p>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-lg text-[#0d1b2a] mb-4">{error || 'Something went wrong'}</p>
        <Link href={`/quiz/${quizType}`}>
          <Button style={{ backgroundColor: config.accentColor }} className="text-white">
            Retake Quiz
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Score Section */}
      <div className="text-center mb-12">
        <p className="text-sm font-medium mb-4" style={{ color: config.accentColor }}>
          Your {config.title} Results
        </p>
        
        <ScoreRing score={result.overall_score} accentColor={config.accentColor} />
        
        <h2 className="text-2xl font-medium text-[#0d1b2a] mt-6 mb-2">
          {result.score_label}
        </h2>
        <p className="text-[#3d5166] font-light max-w-md mx-auto">
          {result.overall_score < 30 
            ? "You're at the beginning of your journey. Here's how to get started."
            : result.overall_score < 50
            ? "You've made some progress. Let's build on what you have."
            : result.overall_score < 70
            ? "Good progress! Focus on strengthening your weak areas."
            : "Impressive! You're well prepared. Here are some final touches."}
        </p>
      </div>

      {/* Category Scores */}
      <div className="bg-white rounded-2xl border border-[#d4dce8] p-6 mb-8" style={{ borderWidth: '0.5px' }}>
        <h3 className="text-lg font-medium text-[#0d1b2a] mb-6">Category Breakdown</h3>
        <div className="space-y-4">
          {config.categories.map(category => (
            <CategoryBar 
              key={category} 
              name={category} 
              score={result.category_scores[category] || 0} 
            />
          ))}
        </div>
      </div>

      {/* Action Plan */}
      <div className="bg-white rounded-2xl border border-[#d4dce8] p-6 mb-8" style={{ borderWidth: '0.5px' }}>
        <h3 className="text-lg font-medium text-[#0d1b2a] mb-6">Your Action Plan</h3>
        
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="w-full mb-6 bg-[#f5f7fa] p-1 rounded-lg">
            <TabsTrigger value="week" className="flex-1 gap-2 data-[state=active]:bg-white">
              <Clock className="h-4 w-4" />
              This Week
            </TabsTrigger>
            <TabsTrigger value="month" className="flex-1 gap-2 data-[state=active]:bg-white">
              <Calendar className="h-4 w-4" />
              Next 30 Days
            </TabsTrigger>
            <TabsTrigger value="year" className="flex-1 gap-2 data-[state=active]:bg-white">
              <Target className="h-4 w-4" />
              This Year
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="week" className="space-y-4">
            {result.action_plan.week.map((item, idx) => (
              <ActionItem key={idx} {...item} accentColor={config.accentColor} />
            ))}
          </TabsContent>
          
          <TabsContent value="month" className="space-y-4">
            {result.action_plan.month.map((item, idx) => (
              <ActionItem key={idx} {...item} accentColor={config.accentColor} />
            ))}
          </TabsContent>
          
          <TabsContent value="year" className="space-y-4">
            {result.action_plan.year.map((item, idx) => (
              <ActionItem key={idx} {...item} accentColor={config.accentColor} />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Recommendations */}
      <div className="bg-white rounded-2xl border border-[#d4dce8] p-6 mb-8" style={{ borderWidth: '0.5px' }}>
        <h3 className="text-lg font-medium text-[#0d1b2a] mb-6">Recommended Products</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.product_recommendations.map((product, idx) => (
            <ProductCard key={idx} {...product} accentColor={config.accentColor} />
          ))}
        </div>
      </div>

      {/* Take Other Quiz CTA */}
      <div 
        className="rounded-2xl p-8 text-center"
        style={{ backgroundColor: `${otherQuizConfig.accentColor}08` }}
      >
        <h3 className="text-lg font-medium text-[#0d1b2a] mb-2">
          Want the complete picture?
        </h3>
        <p className="text-[#3d5166] font-light mb-6">
          Take the {otherQuizConfig.title} to get a full assessment of your household readiness.
        </p>
        <Link href={`/quiz/${otherQuizType}`}>
          <Button 
            className="text-white px-8"
            style={{ backgroundColor: otherQuizConfig.accentColor }}
          >
            Take {otherQuizConfig.title}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
