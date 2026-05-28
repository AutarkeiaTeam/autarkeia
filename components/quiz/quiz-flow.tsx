'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useI18n } from '@/components/i18n-provider'
import type { QuizQuestion, QuizAnswers, QuizType } from '@/lib/quiz-data'

interface QuizFlowProps {
  quizType: QuizType
  title: string
  questions: QuizQuestion[]
  accentColor: string
}

export function QuizFlow({ quizType, title, questions, accentColor }: QuizFlowProps) {
  const { t } = useI18n()
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const isLastQuestion = currentIndex === questions.length - 1

  const currentAnswer = answers[currentQuestion.id]
  const hasAnswer = currentQuestion.type === 'single' 
    ? typeof currentAnswer === 'string' && currentAnswer.length > 0
    : Array.isArray(currentAnswer) && currentAnswer.length > 0

  const handleSingleSelect = useCallback((optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }))
  }, [currentQuestion.id])

  const handleMultiSelect = useCallback((optionId: string, isNoneOption?: boolean) => {
    setAnswers(prev => {
      const current = (prev[currentQuestion.id] as string[]) || []
      
      if (isNoneOption) {
        // If clicking "None of the above", deselect everything else and select only this
        return {
          ...prev,
          [currentQuestion.id]: current.includes(optionId) ? [] : [optionId]
        }
      }

      // Find the none option id
      const noneOptionId = currentQuestion.options.find(o => o.isNoneOption)?.id

      if (current.includes(optionId)) {
        // Deselect this option
        return {
          ...prev,
          [currentQuestion.id]: current.filter(id => id !== optionId)
        }
      } else {
        // Select this option and remove "None" if it was selected
        return {
          ...prev,
          [currentQuestion.id]: [...current.filter(id => id !== noneOptionId), optionId]
        }
      }
    })
  }, [currentQuestion.id, currentQuestion.options])

  const handleNext = useCallback(async () => {
    if (isLastQuestion) {
      setIsSubmitting(true)
      
      // Store answers in sessionStorage for the results page
      sessionStorage.setItem(`quiz-answers-${quizType}`, JSON.stringify(answers))
      
      // Navigate to results with loading state
      router.push(`/quiz/${quizType}/results`)
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }, [isLastQuestion, answers, quizType, router])

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }, [currentIndex])

  const isSelected = (optionId: string) => {
    if (currentQuestion.type === 'single') {
      return currentAnswer === optionId
    }
    return Array.isArray(currentAnswer) && currentAnswer.includes(optionId)
  }

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div 
          className="h-16 w-16 animate-spin rounded-full border-4 border-t-transparent mb-6"
          style={{ borderColor: `${accentColor}33`, borderTopColor: accentColor }}
        />
        <p className="text-lg font-light text-[#0d1b2a]">{t('quiz.flow.calculating')}</p>
        <p className="text-sm text-[#8a9bb0] mt-2">{t('quiz.flow.analysing')}</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium mb-2" style={{ color: accentColor }}>
          {title}
        </p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[#8a9bb0]">
            {t('quiz.flow.question_of')
              .replace('{current}', String(currentIndex + 1))
              .replace('{total}', String(questions.length))}
          </span>
          <span className="text-sm font-medium text-[#0d1b2a]">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress 
          value={progress} 
          className="h-2"
          style={{ 
            ['--primary' as string]: accentColor,
            backgroundColor: `${accentColor}20`
          }}
        />
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-2xl font-light text-[#0d1b2a] mb-2">
          {currentQuestion.question}
        </h2>
        {currentQuestion.type === 'multi' && (
          <p className="text-sm text-[#8a9bb0]">{t('quiz.flow.select_all')}</p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-10">
        {currentQuestion.options.map((option) => {
          const selected = isSelected(option.id)
          return (
            <button
              key={option.id}
              onClick={() => 
                currentQuestion.type === 'single' 
                  ? handleSingleSelect(option.id)
                  : handleMultiSelect(option.id, option.isNoneOption)
              }
              className={`
                w-full text-left p-4 rounded-xl border transition-all
                ${selected 
                  ? 'border-2 bg-opacity-5' 
                  : 'border-[#d4dce8] hover:border-[#8a9bb0]'
                }
              `}
              style={{
                borderColor: selected ? accentColor : undefined,
                backgroundColor: selected ? `${accentColor}08` : 'white',
                borderWidth: selected ? '2px' : '0.5px',
              }}
            >
              <div className="flex items-center justify-between">
                <span className={`font-normal ${selected ? 'text-[#0d1b2a]' : 'text-[#3d5166]'}`}>
                  {option.label}
                </span>
                {currentQuestion.type === 'multi' && (
                  <div 
                    className={`
                      h-5 w-5 rounded flex items-center justify-center border transition-all
                      ${selected ? 'border-transparent' : 'border-[#d4dce8]'}
                    `}
                    style={{
                      backgroundColor: selected ? accentColor : 'transparent',
                    }}
                  >
                    {selected && <Check className="h-3.5 w-3.5 text-white" />}
                  </div>
                )}
                {currentQuestion.type === 'single' && (
                  <div 
                    className={`
                      h-5 w-5 rounded-full flex items-center justify-center border-2 transition-all
                    `}
                    style={{
                      borderColor: selected ? accentColor : '#d4dce8',
                    }}
                  >
                    {selected && (
                      <div 
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      />
                    )}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="text-[#3d5166]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>

        <Button
          onClick={handleNext}
          disabled={!hasAnswer}
          className="text-white px-8"
          style={{ 
            backgroundColor: hasAnswer ? accentColor : '#d4dce8',
            color: hasAnswer ? 'white' : '#8a9bb0',
          }}
        >
          {isLastQuestion ? t('quiz.flow.get_score') : t('common.next')}
          {!isLastQuestion && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </div>
  )
}
