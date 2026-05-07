import Link from 'next/link'
import { Footer } from '@/components/footer'
import { Leaf, Shield, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Take the Quiz — Autarkeia',
  description: 'Discover your self-sufficiency score and emergency readiness level with our comprehensive quizzes.',
}

export default function QuizSelectorPage() {
  return (
    <main className="min-h-screen flex flex-col">
      
      <div className="flex-1 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-light tracking-tight text-[#0d1b2a] sm:text-4xl lg:text-5xl text-balance">
              Find out where you stand
            </h1>
            <p className="mt-4 text-lg font-light text-[#3d5166] max-w-2xl mx-auto">
              Take one of our quizzes to discover your current level of readiness and get personalised recommendations.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Self-Sufficiency Quiz Card */}
            <Link 
              href="/quiz/self-sufficiency"
              className="group relative rounded-2xl border border-[#d4dce8] bg-white p-8 transition-all hover:border-[#009b70] hover:shadow-lg"
              style={{ borderWidth: '0.5px' }}
            >
              <div 
                className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl"
                style={{ backgroundColor: 'rgba(0, 155, 112, 0.1)' }}
              >
                <Leaf className="h-7 w-7 text-[#009b70]" />
              </div>
              
              <h2 className="text-xl font-medium text-[#0d1b2a] mb-3">
                Self-Sufficiency Quiz
              </h2>
              
              <p className="text-[#3d5166] font-light mb-6 leading-relaxed">
                Discover how self-sufficient your household truly is. From food production to energy independence, find out where you excel and where you can improve.
              </p>

              <div className="flex items-center gap-2 text-[#009b70] font-medium">
                <span>Start quiz</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-[#009b70] opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>

            {/* Emergency Readiness Quiz Card */}
            <Link 
              href="/quiz/emergency-readiness"
              className="group relative rounded-2xl border border-[#d4dce8] bg-white p-8 transition-all hover:border-[#5c4a2a] hover:shadow-lg"
              style={{ borderWidth: '0.5px' }}
            >
              <div 
                className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl"
                style={{ backgroundColor: 'rgba(92, 74, 42, 0.1)' }}
              >
                <Shield className="h-7 w-7 text-[#5c4a2a]" />
              </div>
              
              <h2 className="text-xl font-medium text-[#0d1b2a] mb-3">
                Emergency Readiness Quiz
              </h2>
              
              <p className="text-[#3d5166] font-light mb-6 leading-relaxed">
                How ready are you for unexpected disruptions? Assess your water storage, food supplies, medical readiness and backup systems.
              </p>

              <div className="flex items-center gap-2 text-[#5c4a2a] font-medium">
                <span>Start quiz</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-[#5c4a2a] opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </div>

          {/* Take Both Option */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[#8a9bb0] font-light">
              Want the full picture?{' '}
              <Link href="/quiz/self-sufficiency" className="text-[#009b70] hover:underline">
                Take both quizzes
              </Link>
              {' '}to get a comprehensive assessment.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
