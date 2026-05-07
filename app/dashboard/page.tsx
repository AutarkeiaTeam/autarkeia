import Link from "next/link"

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <div className="mx-auto max-w-4xl px-4 lg:px-8 py-16">
        <h1 className="text-3xl font-light text-[#0d1b2a]">Your Dashboard</h1>
        <p className="mt-3 text-[#3d5166]">Signed in successfully. Continue by taking your quizzes and building your readiness plan.</p>
        <div className="mt-6 flex gap-3">
          <Link href="/quiz/emergency-readiness" className="rounded-lg bg-[#5c4a2a] px-4 py-2 text-sm font-medium text-white">Emergency Readiness Quiz</Link>
          <Link href="/quiz/self-sufficiency" className="rounded-lg bg-[#009b70] px-4 py-2 text-sm font-medium text-white">Self-Sufficiency Quiz</Link>
        </div>
      </div>
    </main>
  )
}
