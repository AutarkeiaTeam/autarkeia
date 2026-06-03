'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ExternalLink, Calendar, Clock, Target, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useI18n } from '@/components/i18n-provider'
import type { QuizType, QuizResult, QuizAnswers } from '@/lib/quiz-data'
import { getQuizConfig } from '@/lib/quiz-data'
import { amazonSearchUrl } from '@/lib/marketplace-data'

interface QuizResultsProps {
  quizType: QuizType
}

function getScoreColor(score: number): string {
  if (score >= 70) return '#009b70'
  if (score >= 40) return '#f59e0b'
  return '#ef4444'
}

function ScoreRing({
  score,
  accentColor,
  overallLabel,
}: {
  score: number
  accentColor: string
  overallLabel: string
}) {
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
        <span className="text-sm font-light text-[#8a9bb0]">{overallLabel}</span>
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
  accentColor,
  estimatedCostLabel,
  translatePriority,
}: { 
  title: string
  description: string
  estimated_cost: string
  priority: string
  accentColor: string
  estimatedCostLabel: string
  translatePriority: (value: string) => string
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
          {translatePriority(priority)}
        </span>
      </div>
      <p className="text-sm text-[#3d5166] font-light mb-3">{description}</p>
      <p className="text-xs text-[#8a9bb0]">{estimatedCostLabel} {estimated_cost}</p>
    </div>
  )
}

function ProductCard({ 
  category, 
  name, 
  why, 
  estimated_price,
  accentColor,
  buyLabel,
}: { 
  category: string
  name: string
  why: string
  estimated_price: string
  accentColor: string
  buyLabel: string
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
          asChild
          size="sm"
          className="text-white text-xs"
          style={{ backgroundColor: accentColor }}
        >
          <a
            href={amazonSearchUrl(name)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {buyLabel} <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </Button>
      </div>
    </div>
  )
}

export function QuizResults({ quizType }: QuizResultsProps) {
  const { t, locale } = useI18n()
  const [result, setResult] = useState<QuizResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<QuizAnswers | null>(null)
  const [email, setEmail] = useState('')
  const [emailBusy, setEmailBusy] = useState(false)
  const [emailFeedback, setEmailFeedback] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)

  const config = getQuizConfig(quizType)
  const otherQuizType = quizType === 'self-sufficiency' ? 'emergency-readiness' : 'self-sufficiency'
  const otherQuizConfig = getQuizConfig(otherQuizType)
  const quizTitle = t(`quiz.${quizType}.title`)
  const otherQuizTitle = t(`quiz.${otherQuizType}.title`)
  const format = (key: string, vars: Record<string, string>) =>
    Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, v), t(key))
  const translatePriority = (value: string) => t(`quiz.results.priority.${value}`)
  const scoreLabelMap: Record<string, string> = {
    'Just getting started': t('quiz.results.score_label.just_getting_started'),
    'Early stage': t('quiz.results.score_label.early_stage'),
    'Moderately self-sufficient': t('quiz.results.score_label.moderately_self_sufficient'),
    'Highly self-sufficient': t('quiz.results.score_label.highly_self_sufficient'),
  }
  const localizedScoreLabel = scoreLabelMap[result?.score_label ?? ''] ?? result?.score_label ?? ''

  useEffect(() => {
    async function analyzeQuiz() {
      try {
        const storedAnswers = sessionStorage.getItem(`quiz-answers-${quizType}`)
        if (!storedAnswers) {
          setError(t('quiz.results.no_answers'))
          setIsLoading(false)
          return
        }

        const answers: QuizAnswers = JSON.parse(storedAnswers)
        setAnswers(answers)

        // Add artificial delay for better UX
        await new Promise(resolve => setTimeout(resolve, 2000))

        const response = await fetch('/api/quiz/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quizType, answers }),
        })

        if (!response.ok) {
          throw new Error(t('quiz.results.analyze_error'))
        }

        const data = await response.json()
        setResult(data.result)
      } catch (err) {
        console.error('Error analyzing quiz:', err)
        setError(t('quiz.results.analyze_error'))
      } finally {
        setIsLoading(false)
      }
    }

    analyzeQuiz()
  }, [quizType, t])

  async function sendResultsEmail() {
    if (!result || !answers) return
    setEmailBusy(true)
    setEmailError(null)
    setEmailFeedback(null)
    try {
      const response = await fetch('/api/quiz/email-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          quizType,
          answers,
          locale,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        const translatedByKey =
          typeof data.errorKey === 'string' ? t(data.errorKey) : null
        setEmailError(
          translatedByKey ||
            (typeof data.error === 'string' ? data.error : t('quiz.results.email_error'))
        )
        return
      }
      setEmailFeedback(typeof data.message === 'string' ? data.message : t('quiz.results.email_success'))
    } catch {
      setEmailError(t('quiz.results.network_error'))
    } finally {
      setEmailBusy(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div 
          className="h-16 w-16 animate-spin rounded-full border-4 border-t-transparent mb-6"
          style={{ borderColor: `${config.accentColor}33`, borderTopColor: config.accentColor }}
        />
        <p className="text-lg font-light text-[#0d1b2a]">{t('quiz.flow.calculating')}</p>
        <p className="text-sm text-[#8a9bb0] mt-2">{t('quiz.flow.analysing')}</p>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-lg text-[#0d1b2a] mb-4">{error || t('quiz.results.analyze_error')}</p>
        <Link href={`/quiz/${quizType}`}>
          <Button style={{ backgroundColor: config.accentColor }} className="text-white">
            {t('quiz.results.retake')}
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
          {format('quiz.results.your_results', { title: quizTitle })}
        </p>
        
        <ScoreRing score={result.overall_score} accentColor={config.accentColor} overallLabel={t('common.overall')} />
        
        <h2 className="text-2xl font-medium text-[#0d1b2a] mt-6 mb-2">
          {localizedScoreLabel}
        </h2>
        <p className="text-[#3d5166] font-light max-w-md mx-auto">
          {result.overall_score < 30 
            ? t('quiz.results.score_beginning')
            : result.overall_score < 50
            ? t('quiz.results.score_progress')
            : result.overall_score < 70
            ? t('quiz.results.score_good')
            : t('quiz.results.score_impressive')}
        </p>
      </div>

      {/* Category Scores */}
      <div className="bg-white rounded-2xl border border-[#d4dce8] p-6 mb-8" style={{ borderWidth: '0.5px' }}>
        <h3 className="text-lg font-medium text-[#0d1b2a] mb-6">{t('quiz.results.category_breakdown')}</h3>
        <div className="space-y-4">
          {config.categories.map((category) => (
            <CategoryBar 
              key={category} 
              name={t(`quiz.category.${category}`)}
              score={result.category_scores[category] || 0} 
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#d4dce8] p-6 mb-8" style={{ borderWidth: '0.5px' }}>
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${config.accentColor}18` }}
          >
            <Mail className="h-5 w-5" style={{ color: config.accentColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-[#0d1b2a]">{t('quiz.results.email_title')}</h3>
            <p className="mt-1 text-sm text-[#3d5166] font-light">
              {t('quiz.results.email_sub')}
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label htmlFor="quiz-results-email" className="sr-only">
                  {t('auth.email')}
                </label>
                <input
                  id="quiz-results-email"
                  type="email"
                  autoComplete="email"
                  placeholder={t('auth.placeholder_email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#d4dce8] px-3 py-2 text-sm outline-none focus:border-[#009b70]"
                />
              </div>
              <Button
                type="button"
                className="text-white shrink-0"
                style={{ backgroundColor: config.accentColor }}
                disabled={emailBusy || !email.trim() || !answers}
                onClick={() => void sendResultsEmail()}
              >
                {emailBusy ? t('quiz.results.sending') : t('quiz.results.send_email')}
              </Button>
            </div>
            {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
            {emailFeedback && <p className="mt-2 text-sm text-[#009b70]">{emailFeedback}</p>}
          </div>
        </div>
      </div>

      {/* Action Plan */}
      <div className="bg-white rounded-2xl border border-[#d4dce8] p-6 mb-8" style={{ borderWidth: '0.5px' }}>
        <h3 className="text-lg font-medium text-[#0d1b2a] mb-6">{t('quiz.results.action_plan')}</h3>
        
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="w-full mb-6 bg-[#f5f7fa] p-1 rounded-lg">
            <TabsTrigger value="week" className="flex-1 gap-2 data-[state=active]:bg-white">
              <Clock className="h-4 w-4" />
              {t('quiz.results.this_week')}
            </TabsTrigger>
            <TabsTrigger value="month" className="flex-1 gap-2 data-[state=active]:bg-white">
              <Calendar className="h-4 w-4" />
              {t('quiz.results.next_30')}
            </TabsTrigger>
            <TabsTrigger value="year" className="flex-1 gap-2 data-[state=active]:bg-white">
              <Target className="h-4 w-4" />
              {t('quiz.results.this_year')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="week" className="space-y-4">
            {result.action_plan.week.map((item, idx) => (
              <ActionItem
                key={idx}
                {...item}
                accentColor={config.accentColor}
                estimatedCostLabel={t('quiz.results.estimated_cost')}
                translatePriority={translatePriority}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="month" className="space-y-4">
            {result.action_plan.month.map((item, idx) => (
              <ActionItem
                key={idx}
                {...item}
                accentColor={config.accentColor}
                estimatedCostLabel={t('quiz.results.estimated_cost')}
                translatePriority={translatePriority}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="year" className="space-y-4">
            {result.action_plan.year.map((item, idx) => (
              <ActionItem
                key={idx}
                {...item}
                accentColor={config.accentColor}
                estimatedCostLabel={t('quiz.results.estimated_cost')}
                translatePriority={translatePriority}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Recommendations */}
      <div className="bg-white rounded-2xl border border-[#d4dce8] p-6 mb-8" style={{ borderWidth: '0.5px' }}>
        <h3 className="text-lg font-medium text-[#0d1b2a] mb-6">{t('quiz.results.recommended_products')}</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.product_recommendations.map((product, idx) => (
            <ProductCard key={idx} {...product} accentColor={config.accentColor} buyLabel={t('common.buy')} />
          ))}
        </div>
      </div>

      {/* Take Other Quiz CTA */}
      <div 
        className="rounded-2xl p-8 text-center"
        style={{ backgroundColor: `${otherQuizConfig.accentColor}08` }}
      >
        <h3 className="text-lg font-medium text-[#0d1b2a] mb-2">
          {t('quiz.results.complete_picture')}
        </h3>
        <p className="text-[#3d5166] font-light mb-6">
          {format('quiz.results.take_other', { title: otherQuizTitle })}
        </p>
        <Link href={`/quiz/${otherQuizType}`}>
          <Button 
            className="text-white px-8"
            style={{ backgroundColor: otherQuizConfig.accentColor }}
          >
            {format('quiz.results.take_other_btn', { title: otherQuizTitle })}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
