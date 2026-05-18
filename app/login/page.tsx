"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getGoogleAuthUrl, signInWithEmail } from "@/lib/supabase-auth"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await signInWithEmail(email, password)
      // Persist a lightweight `autarkeia-user` cookie so the navbar,
      // dashboard, and forums recognise the session. Real Supabase
      // session cookies are set by the SDK in a follow-up step.
      const userId = data?.user?.id || data?.user?.email || email
      if (userId) {
        const maxAge = 60 * 60 * 24 * 30
        document.cookie = `autarkeia-user=${encodeURIComponent(userId)}; path=/; max-age=${maxAge}; SameSite=Lax`
        window.dispatchEvent(new Event("autarkeia-auth-change"))
      }
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.")
    } finally {
      setIsLoading(false)
    }
  }

  const googleUrl = getGoogleAuthUrl(`${process.env.NEXT_PUBLIC_SITE_URL || "https://autarkeia.world"}/dashboard`)

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center px-4">
      <div className="bg-white border border-[#d4dce8] rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <p className="text-xl font-light tracking-[3px] text-[#0d1b2a] mb-1">
              AUT<span className="text-[#009b70]">ARK</span>EIA
            </p>
          </Link>
          <h1 className="text-2xl font-light text-[#0d1b2a] mt-4 mb-2">Welcome back</h1>
          <p className="text-sm text-[#8a9bb0]">Sign in to your account</p>
        </div>
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="text-xs font-medium text-[#3d5166] mb-1.5 block">Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-[#d4dce8] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#009b70]" placeholder="you@example.com" />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-medium text-[#3d5166]">Password</label>
              <Link href="/forgot-password" className="text-xs text-[#009b70]">
                Forgot password?
              </Link>
            </div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-[#d4dce8] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#009b70]" placeholder="••••••••" />
          </div>
        </div>
        <a href={googleUrl} className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#d4dce8] px-4 py-2.5 text-center text-sm text-[#3d5166] hover:bg-[#f5f7fa]">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="h-5 w-5 shrink-0">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </a>
        <button onClick={handleLogin} disabled={isLoading} className="w-full bg-[#009b70] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#007a58] mb-2 disabled:opacity-60">
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
        {error && <p className="mb-3 text-xs text-red-600">{error}</p>}
        <p className="text-center text-xs text-[#8a9bb0]">
          No account? <Link href="/signup" className="text-[#009b70] font-medium">Create one free</Link>
        </p>
      </div>
    </div>
  )
}
