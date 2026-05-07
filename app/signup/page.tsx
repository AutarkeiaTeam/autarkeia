"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getGoogleAuthUrl, signUpWithEmail } from "@/lib/supabase-auth"

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async () => {
    try {
      setIsLoading(true)
      setError("")
      await signUpWithEmail(email, password)
      router.push("/quiz")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign up.")
    } finally {
      setIsLoading(false)
    }
  }

  const googleUrl = getGoogleAuthUrl(`${process.env.NEXT_PUBLIC_SITE_URL || "https://autarkeia.world"}/quiz`)

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center px-4">
      <div className="bg-white border border-[#d4dce8] rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <p className="text-xl font-light tracking-[3px] text-[#0d1b2a] mb-1">
              AUT<span className="text-[#009b70]">ARK</span>EIA
            </p>
          </Link>
          <h1 className="text-2xl font-light text-[#0d1b2a] mt-4 mb-2">Create your account</h1>
          <p className="text-sm text-[#8a9bb0]">Free to start. Get your self-sufficiency score today.</p>
          <span className="mt-3 inline-block rounded-full bg-[#e8f8f3] px-3 py-1 text-xs font-medium text-[#009b70]">Free plan</span>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <a href={googleUrl} className="w-full flex items-center justify-center gap-3 border border-[#d4dce8] rounded-lg px-4 py-2.5 text-sm text-[#3d5166] hover:bg-[#f5f7fa] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </a>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[#d4dce8]"></div>
          <span className="text-xs text-[#8a9bb0]">or</span>
          <div className="flex-1 h-px bg-[#d4dce8]"></div>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="text-xs font-medium text-[#3d5166] mb-1.5 block">Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-[#d4dce8] rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70] transition-colors" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#3d5166] mb-1.5 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-[#d4dce8] rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70] transition-colors" placeholder="Min. 8 characters" />
          </div>
        </div>

        <button onClick={handleSignup} disabled={isLoading} className="w-full bg-[#009b70] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#007a58] transition-colors mb-2 disabled:opacity-60">
          {isLoading ? "Creating account..." : "Create free account"}
        </button>
        {error && <p className="mb-3 text-xs text-red-600">{error}</p>}

        <p className="text-center text-xs text-[#8a9bb0]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#009b70] hover:underline font-medium">Sign in</Link>
        </p>

        <p className="text-center text-xs text-[#8a9bb0] mt-4">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="text-[#009b70] hover:underline">Terms</Link> and{" "}
          <Link href="/privacy" className="text-[#009b70] hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
