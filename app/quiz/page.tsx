"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { quizQuestions, QuizAnswers } from "@/lib/quiz-types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function QuizPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = quizQuestions[currentIndex]
  const progress = ((currentIndex + 1) / quizQuestions.length) * 100
  const isLastQuestion = currentIndex === quizQuestions.length - 1
  const hasCurrentAnswer = answers[currentQuestion.id] !== undefined

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit()
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Store answers in sessionStorage for results page
    sessionStorage.setItem("quizAnswers", JSON.stringify(answers))
    
    // Navigate to results page
    router.push("/quiz/results")
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: "#22c55e",
      water: "#3b82f6",
      energy: "#f59e0b",
      shelter: "#8b5cf6",
      resilience: "#ef4444",
    }
    return colors[category] || "#009b70"
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      food: "Food",
      water: "Water",
      energy: "Energy",
      shelter: "Shelter",
      resilience: "Resilience",
    }
    return labels[category] || category
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="bg-white border-b border-[#d4dce8]" style={{ borderBottomWidth: "0.5px" }}>
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo className="text-lg" />
          </Link>
          <span className="text-sm text-[#3d5166]">
            Question {currentIndex + 1} of {quizQuestions.length}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white border-b border-[#d4dce8]" style={{ borderBottomWidth: "0.5px" }}>
        <div className="mx-auto max-w-3xl px-4 py-3">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question */}
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          {/* Category badge */}
          <div className="mb-6">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: getCategoryColor(currentQuestion.category) }}
            >
              {getCategoryLabel(currentQuestion.category)}
            </span>
          </div>

          {/* Question text */}
          <h2 className="text-xl md:text-2xl font-light text-[#0d1b2a] mb-8">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[currentQuestion.id] === option.value
                    ? "border-[#009b70] bg-[#e8f8f3]"
                    : "border-[#d4dce8] hover:border-[#009b70] hover:bg-[#f5f7fa]"
                }`}
              >
                <span className="text-[#0d1b2a] font-normal">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#d4dce8]">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="text-[#3d5166]"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!hasCurrentAnswer || isSubmitting}
              className="bg-[#009b70] text-white hover:bg-[#008060] font-medium rounded-lg px-6"
            >
              {isSubmitting ? (
                "Analyzing..."
              ) : isLastQuestion ? (
                "Get My Score"
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Skip indicator */}
        <p className="text-center mt-6 text-sm text-[#8a9bb0]">
          {Object.keys(answers).length} of {quizQuestions.length} questions answered
        </p>
      </main>
    </div>
  )
}
