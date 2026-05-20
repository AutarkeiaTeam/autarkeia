"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { setAutarkeiaSessionCookies } from "@/lib/auth-session"
import { createClient } from "@/lib/supabase/client"

const MIN_PASSWORD_LENGTH = 8

function parseHashParams() {
  if (typeof window === "undefined") return new URLSearchParams()
  return new URLSearchParams(window.location.hash.replace(/^#/, ""))
}

/**
 * Password recovery uses implicit/hash tokens from the email link
 * (#access_token=...&refresh_token=...&type=recovery). PKCE code exchange is
 * not used here because the email opens in a fresh browser context without the
 * original PKCE verifier.
 */
async function establishRecoverySessionFromHash() {
  const supabase = createClient()
  const hashParams = parseHashParams()
  const queryParams = new URLSearchParams(window.location.search)

  const access_token = hashParams.get("access_token")
  const refresh_token = hashParams.get("refresh_token")
  const type = hashParams.get("type") ?? queryParams.get("type")
  const token_hash = queryParams.get("token_hash")

  if (access_token && refresh_token) {
    if (type && type !== "recovery") {
      throw new Error("This link is not a password reset link.")
    }
    const { error } = await supabase.auth.setSession({ access_token, refresh_token })
    if (error) throw error
    return supabase
  }

  if (token_hash && type === "recovery") {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: "recovery" })
    if (error) throw error
    return supabase
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) throw sessionError
  if (session) return supabase

  if (queryParams.get("code")) {
    throw new Error(
      "This reset link uses a sign-in code that is not valid in a new browser. Request a new reset email and open the link from that message."
    )
  }

  throw new Error("Invalid or expired reset link. Request a new one below.")
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        await establishRecoverySessionFromHash()
        if (!cancelled) {
          setSessionReady(true)
          setError("")
        }
        window.history.replaceState(null, "", "/reset-password")
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Invalid or expired reset link.")
          setSessionReady(false)
        }
      } finally {
        if (!cancelled) setIsCheckingSession(false)
      }
    }

    void init()

    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage("")
    setError("")

    if (!sessionReady) {
      setError("Invalid or expired reset link.")
      return
    }

    if (!newPassword || !confirmPassword) {
      setError("Enter and confirm your new password.")
      return
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      setIsLoading(true)
      const supabase = createClient()
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) throw updateError

      if (data.user) {
        setAutarkeiaSessionCookies(data.user)
      }

      setMessage("Password updated")
      router.refresh()
      await new Promise((resolve) => setTimeout(resolve, 1500))
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#d4dce8] bg-white p-8">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <p className="mb-1 text-xl font-light tracking-[3px] text-[#0d1b2a]">
              AUT<span className="text-[#009b70]">ARK</span>EIA
            </p>
          </Link>
          <h1 className="mt-4 text-2xl font-light text-[#0d1b2a]">Choose a new password</h1>
          <p className="mt-2 text-sm text-[#8a9bb0]">
            {isCheckingSession
              ? "Verifying your reset link…"
              : sessionReady
                ? "Enter your new password below."
                : "Use the latest reset link from your email."}
          </p>
        </div>

        {sessionReady && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#3d5166]">New password</label>
              <input
                type="password"
                required
                minLength={MIN_PASSWORD_LENGTH}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full rounded-lg border border-[#d4dce8] px-4 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70]"
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#3d5166]">
                Confirm new password
              </label>
              <input
                type="password"
                required
                minLength={MIN_PASSWORD_LENGTH}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-lg border border-[#d4dce8] px-4 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70]"
                placeholder="Confirm password"
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#009b70] py-2.5 text-sm font-medium text-white hover:bg-[#007a58] disabled:opacity-60"
            >
              {isLoading ? "Updating…" : "Update password"}
            </button>
          </form>
        )}

        {message && <p className="mt-4 text-sm font-medium text-[#009b70]">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {!isCheckingSession && !sessionReady && (
          <p className="mt-6 text-center text-xs text-[#8a9bb0]">
            <Link href="/forgot-password" className="font-medium text-[#009b70] hover:underline">
              Request a new reset link
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
