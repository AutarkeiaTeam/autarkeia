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
      await signInWithEmail(email, password)
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
              <a href="#" className="text-xs text-[#009b70]">Forgot password?</a>
            </div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-[#d4dce8] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#009b70]" placeholder="••••••••" />
          </div>
        </div>
        <a href={googleUrl} className="mb-3 block w-full rounded-lg border border-[#d4dce8] px-4 py-2.5 text-center text-sm text-[#3d5166] hover:bg-[#f5f7fa]">
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
