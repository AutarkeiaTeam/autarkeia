"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  Circle,
  Lock,
  Mail,
  MessageSquare,
  Newspaper,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react"
import { supabaseClient } from "@/lib/supabase-client"
import { useTier, writeCookie } from "@/lib/use-tier"

type ActionItem = { id: string; label: string; done: boolean }

const initialPlan: { week: ActionItem[]; month: ActionItem[]; year: ActionItem[] } = {
  week: [
    { id: "w1", label: "Fill three 5L jugs of water and store in a cool spot", done: false },
    { id: "w2", label: "Walk your evacuation route from front door to safe meet-up", done: false },
    { id: "w3", label: "Photograph household documents and store the photos offline", done: false },
  ],
  month: [
    { id: "m1", label: "Take a one-day Red Cross or local first aid course", done: false },
    { id: "m2", label: "Build a 14-day pantry of foods you actually eat", done: false },
    { id: "m3", label: "Identify a backup heat source and test it once", done: false },
    { id: "m4", label: "Agree a family communication plan (out-of-area contact)", done: false },
  ],
  year: [
    { id: "y1", label: "Install a 200–400W solar setup with battery backup", done: false },
    { id: "y2", label: "Plant a small kitchen garden, even on a balcony", done: false },
    { id: "y3", label: "Take a hands-on skill course: canning, sewing, or basic carpentry", done: false },
    { id: "y4", label: "Build a relationship with two neighbours you'd actually call in a crisis", done: false },
  ],
}

const scoreHistory = [
  { date: "Jan", overall: 38 },
  { date: "Feb", overall: 44 },
  { date: "Mar", overall: 49 },
  { date: "Apr", overall: 55 },
  { date: "May", overall: 61 },
  { date: "Jun", overall: 65 },
  { date: "Jul", overall: 68 },
]

const categoryScores = [
  { name: "Water", score: 72 },
  { name: "Food", score: 65 },
  { name: "Shelter & energy", score: 58 },
  { name: "Medical", score: 60 },
  { name: "Community & comms", score: 80 },
]

const newsHeadlines = [
  { title: "Iran tensions raise Strait of Hormuz disruption risk", href: "/news/iran-strait-hormuz-risk" },
  { title: "Mediterranean drought enters its fifth year in southern Spain", href: "/news" },
  { title: "European grid operators warn on winter capacity", href: "/news" },
  { title: "Antibiotic shortages reported across UK pharmacies", href: "/news" },
  { title: "Permian basin oil output rolls over for second quarter", href: "/news" },
]

function decodeUserId(value: string | undefined) {
  if (!value) return null
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const { tier, setTier } = useTier()
  const [userId, setUserId] = useState<string | null>(null)
  const [plan, setPlan] = useState(initialPlan)
  const [chatInput, setChatInput] = useState("")
  const [signOutError, setSignOutError] = useState("")
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [chatLog, setChatLog] = useState<{ role: "user" | "assistant"; text: string }[]>([
    {
      role: "assistant",
      text: "Hi — I'm your Autarkeia assistant. Ask me anything about your situation, location, household, or scores.",
    },
  ])

  useEffect(() => {
    if (typeof document === "undefined") return
    const match = document.cookie.split("; ").find((row) => row.startsWith("autarkeia-user="))
    setUserId(decodeUserId(match?.split("=")[1]))
  }, [])

  // Demo helper: when the user doesn't have an `autarkeia-user` cookie
  // yet, set one so the dashboard is usable in local dev. The real auth
  // flow will set this from Supabase session info.
  const startDemo = (asTier: "free" | "pro") => {
    const maxAge = 60 * 60 * 24 * 30
    document.cookie = `autarkeia-user=demo-${asTier}; path=/; max-age=${maxAge}; SameSite=Lax`
    setUserId(`demo-${asTier}`)
    writeCookie(asTier)
    setTier(asTier)
  }

  const togglePlanItem = (bucket: keyof typeof plan, id: string) => {
    setPlan((prev) => ({
      ...prev,
      [bucket]: prev[bucket].map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    }))
  }

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      setSignOutError("")
      await supabaseClient.auth.signOut()
      document.cookie = "autarkeia-user=; path=/; max-age=0; SameSite=Lax"
      document.cookie = "autarkeia-tier=; path=/; max-age=0; SameSite=Lax"
      setUserId(null)
      router.push("/")
      router.refresh()
    } catch (err) {
      setSignOutError(err instanceof Error ? err.message : "Unable to sign out.")
    } finally {
      setIsSigningOut(false)
    }
  }

  const sendChat = async () => {
    const text = chatInput.trim()
    if (!text) return
    setChatLog((prev) => [...prev, { role: "user", text }])
    setChatInput("")
    // Demo stub — when CLAUDE/Anthropic API is wired this will hit a route
    setChatLog((prev) => [
      ...prev,
      {
        role: "assistant",
        text: "Thanks — once the AI chat backend is wired to Claude this will give you a tailored answer based on your scores, location, and household.",
      },
    ])
  }

  if (!userId) {
    return (
      <main className="min-h-screen bg-[#f5f7fa]">
        <div className="mx-auto max-w-3xl px-4 py-20 lg:px-8">
          <h1 className="text-3xl font-light text-[#0d1b2a]">Your dashboard</h1>
          <p className="mt-3 text-sm text-[#3d5166]">
            Sign in to see your quiz results, action plan, and personalised recommendations. You can also try a
            demo dashboard below — no real account required.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              href="/login"
              className="rounded-2xl border border-[#d4dce8] bg-white p-6 hover:border-[#009b70]"
            >
              <p className="text-sm font-semibold text-[#0d1b2a]">Sign in to your account</p>
              <p className="mt-2 text-sm text-[#3d5166]">
                Use the email or Google login linked to your real Autarkeia account.
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-[#009b70]">Go to sign in →</span>
            </Link>
            <div className="rounded-2xl border border-[#d4dce8] bg-white p-6">
              <p className="text-sm font-semibold text-[#0d1b2a]">Try the demo dashboard</p>
              <p className="mt-2 text-sm text-[#3d5166]">
                Preview the experience — pick a tier to start. You can switch at any time from inside the
                dashboard.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => startDemo("free")}
                  className="rounded-lg border border-[#d4dce8] px-4 py-2 text-xs font-medium text-[#0d1b2a] hover:border-[#009b70]"
                >
                  Free demo
                </button>
                <button
                  type="button"
                  onClick={() => startDemo("pro")}
                  className="rounded-lg bg-[#009b70] px-4 py-2 text-xs font-medium text-white hover:bg-[#007a58]"
                >
                  Pro demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const isPro = tier === "pro"

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light text-[#0d1b2a]">Your dashboard</h1>
            <p className="mt-1 text-sm text-[#3d5166]">
              Signed in as <span className="font-medium text-[#0d1b2a]">{userId}</span> ·{" "}
              <span className={`font-medium ${isPro ? "text-[#009b70]" : "text-[#3d5166]"}`}>
                {isPro ? "Pro" : "Free"} member
              </span>
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="rounded-lg border border-[#d4dce8] bg-white px-4 py-2 text-xs font-medium text-[#9f1d1d] hover:border-[#c43a3a] hover:bg-[#fff5f5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </button>
            {signOutError && <p className="max-w-xs text-right text-xs text-red-600">{signOutError}</p>}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8a9bb0]">Switch tier (demo):</span>
              <button
                type="button"
                onClick={() => setTier("free")}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  tier === "free" ? "bg-[#0d1b2a] text-white" : "bg-white text-[#3d5166] border border-[#d4dce8]"
                }`}
              >
                Free
              </button>
              <button
                type="button"
                onClick={() => setTier("pro")}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  tier === "pro" ? "bg-[#009b70] text-white" : "bg-white text-[#3d5166] border border-[#d4dce8]"
                }`}
              >
                Pro
              </button>
            </div>
          </div>
        </header>

        {/* Score card */}
        <section className="mt-8 rounded-2xl border border-[#d4dce8] bg-white p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">Quiz results</p>
              <p className="mt-1 text-3xl font-light text-[#0d1b2a]">Overall score: 68%</p>
              <p className="mt-1 text-sm text-[#3d5166]">
                Based on Emergency Readiness + Self-Sufficiency quizzes.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/quiz/emergency-readiness"
                className="rounded-lg border border-[#d4dce8] px-4 py-2 text-xs font-medium text-[#0d1b2a] hover:border-[#009b70]"
              >
                Retake Emergency Readiness
              </Link>
              <Link
                href="/quiz/self-sufficiency"
                className="rounded-lg border border-[#d4dce8] px-4 py-2 text-xs font-medium text-[#0d1b2a] hover:border-[#009b70]"
              >
                Retake Self-Sufficiency
              </Link>
            </div>
          </div>

          {isPro ? (
            <div className="mt-6">
              <p className="text-sm font-medium text-[#0d1b2a]">Category breakdown</p>
              <div className="mt-3 space-y-2">
                {categoryScores.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className="w-44 text-sm text-[#3d5166]">{c.name}</span>
                    <div className="h-2 flex-1 rounded-full bg-[#e8eef5]">
                      <div className="h-full rounded-full bg-[#009b70]" style={{ width: `${c.score}%` }} />
                    </div>
                    <span className="w-10 text-right text-sm font-medium text-[#0d1b2a]">{c.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-[#d4dce8] bg-[#f9fafc] p-4">
              <p className="text-sm text-[#3d5166]">
                <Lock className="mr-1 inline h-3 w-3" /> Full category breakdown across all 5 categories is
                available with Pro.
              </p>
              <Link href="/plans" className="mt-2 inline-block text-sm font-medium text-[#009b70]">
                Upgrade to Pro →
              </Link>
            </div>
          )}
        </section>

        {/* Action plan */}
        <section className="mt-6 rounded-2xl border border-[#d4dce8] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">Action plan</p>
          <h2 className="mt-1 text-xl font-medium text-[#0d1b2a]">
            {isPro ? "This week · 30 days · 1 year" : "This week"}
          </h2>

          <div className="mt-4 grid gap-6 md:grid-cols-3">
            <PlanColumn
              title="This week"
              items={plan.week}
              onToggle={(id) => togglePlanItem("week", id)}
              isPro={true}
            />
            <PlanColumn
              title="30 days"
              items={plan.month}
              onToggle={(id) => togglePlanItem("month", id)}
              isPro={isPro}
            />
            <PlanColumn
              title="1 year"
              items={plan.year}
              onToggle={(id) => togglePlanItem("year", id)}
              isPro={isPro}
            />
          </div>

          {!isPro && (
            <p className="mt-4 text-xs text-[#8a9bb0]">
              Free shows the first 3 items for this week only. Upgrade to unlock the full 30-day and 1-year plans,
              edit items, and track progress.
            </p>
          )}
        </section>

        {/* Pro: Score history */}
        {isPro && (
          <section className="mt-6 rounded-2xl border border-[#d4dce8] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
              <TrendingUp className="mr-1 inline h-3 w-3" /> Score history
            </p>
            <h2 className="mt-1 text-xl font-medium text-[#0d1b2a]">Your trend over time</h2>
            <div className="mt-4 flex h-32 items-end gap-2">
              {scoreHistory.map((point) => (
                <div key={point.date} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-[#009b70]"
                    style={{ height: `${point.overall}%` }}
                    title={`${point.date}: ${point.overall}%`}
                  />
                  <span className="text-[10px] text-[#8a9bb0]">{point.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two-column grid: marketplace + library */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-[#d4dce8] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
              <ShoppingBag className="mr-1 inline h-3 w-3" /> Marketplace
            </p>
            <h2 className="mt-1 text-lg font-medium text-[#0d1b2a]">
              {isPro ? "Full marketplace — all sellers" : "Limited — Amazon only"}
            </h2>
            <p className="mt-2 text-sm text-[#3d5166]">
              {isPro
                ? "All vendors and bundles are unlocked. Filter by category and country."
                : "Free members see Amazon listings only. Upgrade to access regional shops, direct-from-maker bundles, and curated brands."}
            </p>
            <Link
              href="/marketplace"
              className="mt-3 inline-block text-sm font-medium text-[#009b70]"
            >
              Open marketplace →
            </Link>
          </section>

          <section className="rounded-2xl border border-[#d4dce8] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
              <Newspaper className="mr-1 inline h-3 w-3" /> Library
            </p>
            <h2 className="mt-1 text-lg font-medium text-[#0d1b2a]">
              {isPro ? "Full library — all 9 languages" : "Limited preview (20% of catalogue)"}
            </h2>
            <p className="mt-2 text-sm text-[#3d5166]">
              {isPro
                ? "Every book, article, podcast, course, app, and the 70+ Geopolitics & World Future episodes."
                : "Free members see a taster of each section. Upgrade to unlock the rest, plus all 9 languages."}
            </p>
            <Link
              href="/library"
              className="mt-3 inline-block text-sm font-medium text-[#009b70]"
            >
              Open library →
            </Link>
          </section>
        </div>

        {/* World News + Communities */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-[#d4dce8] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
              <Newspaper className="mr-1 inline h-3 w-3" /> World News Watch
            </p>
            <h2 className="mt-1 text-lg font-medium text-[#0d1b2a]">Latest headlines</h2>
            <ul className="mt-3 space-y-2">
              {newsHeadlines.slice(0, isPro ? 5 : 3).map((h) => (
                <li key={h.title}>
                  <Link href={h.href} className="text-sm text-[#3d5166] hover:text-[#009b70]">
                    · {h.title}
                  </Link>
                </li>
              ))}
            </ul>
            {isPro && (
              <div className="mt-4 rounded-lg border border-[#d4dce8] bg-[#f5f7fa] p-3">
                <p className="text-xs font-medium text-[#0d1b2a]">
                  <Mail className="mr-1 inline h-3 w-3" /> Weekly email briefing
                </p>
                <label className="mt-2 flex items-center gap-2 text-xs text-[#3d5166]">
                  <input type="checkbox" defaultChecked /> Send me Monday morning briefings
                </label>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-[#d4dce8] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
              <Users className="mr-1 inline h-3 w-3" /> Autarkeia Communities
            </p>
            <h2 className="mt-1 text-lg font-medium text-[#0d1b2a]">
              {isPro ? "Priority community access" : "Register interest"}
            </h2>
            <p className="mt-2 text-sm text-[#3d5166]">
              {isPro
                ? "Pro members are first in line when we open pilots. You'll receive private updates as sites get scoped."
                : "Tell us where you want to live and what model fits your household. Free members get all community development updates."}
            </p>
            <Link
              href="/communities#register-interest"
              className="mt-3 inline-block text-sm font-medium text-[#009b70]"
            >
              {isPro ? "Update preferences →" : "Register interest →"}
            </Link>
          </section>
        </div>

        {/* Pro: AI chat */}
        {isPro && (
          <section className="mt-6 rounded-2xl border border-[#d4dce8] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
              <MessageSquare className="mr-1 inline h-3 w-3" /> AI chat
            </p>
            <h2 className="mt-1 text-lg font-medium text-[#0d1b2a]">Ask Claude about your situation</h2>
            <p className="mt-2 text-sm text-[#3d5166]">
              Ask about your scores, location, household, climate, or any of your action items. Claude knows your
              Autarkeia profile.
            </p>
            <div className="mt-4 space-y-3 rounded-xl bg-[#f5f7fa] p-4">
              {chatLog.map((msg, i) => (
                <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
                  <span
                    className={`inline-block max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-[#009b70] text-white"
                        : "bg-white text-[#3d5166] border border-[#d4dce8]"
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Ask anything…"
                className="flex-1 rounded-lg border border-[#d4dce8] px-3 py-2 text-sm outline-none focus:border-[#009b70]"
              />
              <button
                onClick={sendChat}
                className="rounded-lg bg-[#009b70] px-4 py-2 text-sm font-medium text-white hover:bg-[#007a58]"
              >
                Send
              </button>
            </div>
          </section>
        )}

        {/* Pro: Monthly Global Report */}
        {isPro && (
          <section className="mt-6 rounded-2xl border border-[#d4dce8] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#009b70]">
              <Sparkles className="mr-1 inline h-3 w-3" /> Monthly Global Report
            </p>
            <h2 className="mt-1 text-lg font-medium text-[#0d1b2a]">Newsletter archive</h2>
            <ul className="mt-3 space-y-2 text-sm text-[#3d5166]">
              <li>· May 2026 — Hormuz, harvest, and household pantries</li>
              <li>· Apr 2026 — Cracks in the European grid</li>
              <li>· Mar 2026 — Spring planting playbook by climate zone</li>
              <li>· Feb 2026 — Insurance, climate, and where coverage is collapsing</li>
              <li>· Jan 2026 — Top systemic risks for the year ahead</li>
            </ul>
          </section>
        )}
      </div>
    </main>
  )
}

function PlanColumn({
  title,
  items,
  onToggle,
  isPro,
}: {
  title: string
  items: ActionItem[]
  onToggle: (id: string) => void
  isPro: boolean
}) {
  if (!isPro) {
    return (
      <div className="rounded-xl border border-dashed border-[#d4dce8] bg-[#f9fafc] p-4">
        <p className="text-sm font-medium text-[#0d1b2a]">{title}</p>
        <p className="mt-2 text-xs text-[#3d5166]">
          <Lock className="mr-1 inline h-3 w-3" /> Locked. Upgrade to Pro to see your full plan and track progress.
        </p>
      </div>
    )
  }
  return (
    <div className="rounded-xl border border-[#d4dce8] bg-[#f5f7fa] p-4">
      <p className="text-sm font-medium text-[#0d1b2a]">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onToggle(item.id)}
              className="flex w-full items-start gap-2 text-left text-sm text-[#3d5166] hover:text-[#0d1b2a]"
            >
              {item.done ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#009b70]" />
              ) : (
                <Circle className="mt-0.5 h-4 w-4 text-[#8a9bb0]" />
              )}
              <span className={item.done ? "line-through opacity-60" : ""}>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
