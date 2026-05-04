"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { QuizResult, QuizAnswers } from "@/lib/quiz-types"
import { calculateLocalScore } from "@/lib/quiz-scoring"
import { CheckCircle, ArrowRight, Share2, Download, RotateCcw } from "lucide-react"

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<QuizResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const analyzeResults = async () => {
      // Get answers from sessionStorage
      const storedAnswers = sessionStorage.getItem("quizAnswers")
      
      if (!storedAnswers) {
        // No answers found - redirect to quiz
        router.push("/quiz")
        return
      }

      const answers: QuizAnswers = JSON.parse(storedAnswers)

      // Calculate local score immediately for fast display
      const localResult = calculateLocalScore(answers)
      setResult(localResult)
      setIsLoading(false)

      // Try to enhance with AI analysis in the background
      try {
        const response = await fetch("/api/quiz/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        })

        if (response.ok) {
          const aiResult = await response.json()
          setResult(aiResult)
        }
        // If API fails, we already have the local result displayed
      } catch {
        // Silently fail - local result is already displayed
        console.log("[v0] API call failed, using local result")
      }
    }

    analyzeResults()
  }, [router])

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

  const getScoreColor = (score: number) => {
    if (score >= 70) return "#22c55e"
    if (score >= 40) return "#f59e0b"
    return "#ef4444"
  }

  const handleRetake = () => {
    sessionStorage.removeItem("quizAnswers")
    router.push("/quiz")
  }

  if (isLoading || !result) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009b70] mx-auto mb-4"></div>
          <p className="text-[#3d5166] font-light">Analyzing your responses...</p>
        </div>
      </div>
    )
  }

  // Calculate SVG circle properties
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (result.overallScore / 100) * circumference

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <header className="bg-white border-b border-[#d4dce8]" style={{ borderBottomWidth: "0.5px" }}>
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo className="text-lg" />
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-[#3d5166]">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button variant="ghost" size="sm" className="text-[#3d5166]">
              <Download className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Score Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Score Ring */}
            <div className="relative flex-shrink-0">
              <svg width="200" height="200" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                />
                {/* Score circle */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke={getScoreColor(result.overallScore)}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 100 100)"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-light text-[#0d1b2a]">
                  {result.overallScore}%
                </span>
                <span className="text-sm text-[#8a9bb0]">Self-Sufficiency Score</span>
              </div>
            </div>

            {/* Category Bars */}
            <div className="flex-1 w-full space-y-4">
              {result.categoryScores.map((cat) => (
                <div key={cat.category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-[#0d1b2a]">{cat.label}</span>
                    <span className="text-sm text-[#3d5166]">{cat.score}%</span>
                  </div>
                  <div className="h-3 bg-[#e5e7eb] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${cat.score}%`,
                        backgroundColor: getCategoryColor(cat.category),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
          <h2 className="text-xl font-medium text-[#0d1b2a] mb-4">Your Assessment</h2>
          <p className="text-[#3d5166] font-light leading-relaxed">{result.summary}</p>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Strengths */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-[#0d1b2a] mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#22c55e]" />
              Your Strengths
            </h3>
            <ul className="space-y-3">
              {result.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] mt-2 flex-shrink-0" />
                  <span className="text-[#3d5166] font-light">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-[#0d1b2a] mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-[#f59e0b]" />
              Areas to Improve
            </h3>
            <ul className="space-y-3">
              {result.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mt-2 flex-shrink-0" />
                  <span className="text-[#3d5166] font-light">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-[#0d1b2a] rounded-2xl p-6 md:p-8 mb-6">
          <h3 className="text-lg font-medium text-white mb-4">Recommended Next Steps</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {result.recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-xl p-4 flex items-start gap-3"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#009b70] text-white text-sm flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-white/90 font-light text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-[#0d1b2a]">Ready to improve your score?</h3>
              <p className="text-[#3d5166] font-light text-sm">
                Get personalized guidance with Autarkeia Pro
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleRetake}
                className="border-[#d4dce8] text-[#3d5166]"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Retake Quiz
              </Button>
              <Link href="/#pricing">
                <Button className="bg-[#009b70] text-white hover:bg-[#008060] font-medium rounded-lg">
                  Explore Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
