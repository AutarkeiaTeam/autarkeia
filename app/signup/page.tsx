"use client"
import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { setAutarkeiaSessionCookies } from "@/lib/auth-session"
import { signInWithGoogle, signUpWithEmail, type SignupMetadata } from "@/lib/supabase-auth"

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep] = useState<"account" | "profile">("account")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [age, setAge] = useState("")
  const [location, setLocation] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const continueToProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    if (!email.trim() || !password.trim()) {
      setError("Enter an email address and password to continue.")
      return
    }
    setStep("profile")
  }

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      setIsLoading(true)
      setError("")
      if (!firstName.trim() || !lastName.trim()) {
        setError("First name and last name are required.")
        return
      }

      const parsedAge = age.trim() ? Number(age) : undefined
      if (parsedAge !== undefined && (!Number.isFinite(parsedAge) || parsedAge < 0)) {
        setError("Enter a valid age, or leave it blank.")
        return
      }

      const metadata: SignupMetadata = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        ...(parsedAge !== undefined ? { age: parsedAge } : {}),
        ...(location.trim() ? { location: location.trim() } : {}),
      }
      const data = await signUpWithEmail(email, password, metadata)
      if (data.user?.id) {
        setAutarkeiaSessionCookies({
          id: data.user.id,
          email: data.user.email ?? email,
          user_metadata: data.user.user_metadata,
        })
      }

      if (data.session) {
        router.refresh()
        router.push("/dashboard")
        return
      }

      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (signInError) {
        setError("Account created. Check your email to confirm, then sign in.")
        return
      }
      if (signInData.user?.id) {
        setAutarkeiaSessionCookies({
          id: signInData.user.id,
          email: signInData.user.email ?? email,
          user_metadata: signInData.user.user_metadata,
        })
      }
      router.refresh()
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign up.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError("")
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in with Google.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center px-4">
      <div className="bg-white border border-[#d4dce8] rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <p className="text-xl font-light tracking-[3px] text-[#0d1b2a] mb-1">
              AUT<span className="text-[#009b70]">ARK</span>EIA
            </p>
          </Link>
          <h1 className="text-2xl font-light text-[#0d1b2a] mt-4 mb-2">
            {step === "account" ? "Create your account" : "Tell us about yourself"}
          </h1>
          <p className="text-sm text-[#8a9bb0]">
            {step === "account"
              ? "Free to start. Get your self-sufficiency score today."
              : "These details help personalise your Autarkeia dashboard."}
          </p>
          <span className="mt-3 inline-block rounded-full bg-[#e8f8f3] px-3 py-1 text-xs font-medium text-[#009b70]">Free plan</span>
        </div>

        {step === "account" ? (
          <>
            <div className="flex flex-col gap-3 mb-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 border border-[#d4dce8] rounded-lg px-4 py-2.5 text-sm text-[#3d5166] hover:bg-[#f5f7fa] transition-colors disabled:opacity-60"
              >
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-[#d4dce8]"></div>
              <span className="text-xs text-[#8a9bb0]">or</span>
              <div className="flex-1 h-px bg-[#d4dce8]"></div>
            </div>

            <form onSubmit={continueToProfile}>
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

              <button type="submit" className="w-full bg-[#009b70] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#007a58] transition-colors mb-2">
                Continue to basic info
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="flex flex-col gap-4 mb-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-[#3d5166] mb-1.5 block">First name</label>
                  <input required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full border border-[#d4dce8] rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70] transition-colors" placeholder="Jane" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#3d5166] mb-1.5 block">Last name</label>
                  <input required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full border border-[#d4dce8] rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70] transition-colors" placeholder="Smith" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-[#3d5166] mb-1.5 block">Age <span className="font-normal text-[#8a9bb0]">(optional)</span></label>
                <input type="number" min="0" value={age} onChange={e => setAge(e.target.value)} className="w-full border border-[#d4dce8] rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70] transition-colors" placeholder="34" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#3d5166] mb-1.5 block">Location <span className="font-normal text-[#8a9bb0]">(optional)</span></label>
                <input value={location} onChange={e => setLocation(e.target.value)} className="w-full border border-[#d4dce8] rounded-lg px-4 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70] transition-colors" placeholder="City, country" />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setStep("account")} className="flex-1 rounded-lg border border-[#d4dce8] px-4 py-2.5 text-sm text-[#3d5166] hover:bg-[#f5f7fa]">
                Back
              </button>
              <button type="submit" disabled={isLoading} className="flex-1 bg-[#009b70] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#007a58] transition-colors disabled:opacity-60">
                {isLoading ? "Creating..." : "Finish signup"}
              </button>
            </div>
          </form>
        )}
        {error && <p className="mb-3 mt-2 text-xs text-red-600">{error}</p>}

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
