"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabaseClient } from "@/lib/supabase-client"

function getResetParams() {
  if (typeof window === "undefined") return { accessToken: null, type: null }

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""))
  const queryParams = new URLSearchParams(window.location.search)
  return {
    accessToken: hashParams.get("access_token") ?? queryParams.get("access_token"),
    type: hashParams.get("type") ?? queryParams.get("type"),
  }
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasCheckedResetLink, setHasCheckedResetLink] = useState(false)
  const [isValidResetLink, setIsValidResetLink] = useState(false)

  useEffect(() => {
    const { accessToken, type } = getResetParams()
    if (!accessToken || type !== "recovery") {
      setError("Invalid or expired reset link")
      setIsValidResetLink(false)
      setHasCheckedResetLink(true)
      return
    }

    window.localStorage.setItem("supabase.auth.token", accessToken)
    setIsValidResetLink(true)
    setHasCheckedResetLink(true)
    window.history.replaceState(null, "", window.location.pathname)
  }, [])

  const resetPasswordHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage("")
    setError("")

    if (!newPassword || !confirmPassword) {
      setError("Enter and confirm your new password.")
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      setIsLoading(true)
      const { error: updateError } = await supabaseClient.auth.updateUser({ password: newPassword })
      if (updateError) {
        setError(updateError.message)
        return
      }

      setMessage("Password reset successful - redirecting to login")
      await new Promise((resolve) => setTimeout(resolve, 2000))
      router.push("/login")
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
            {!hasCheckedResetLink
              ? "Checking your reset link..."
              : isValidResetLink
                ? "Enter your new password below."
                : "Use the latest reset link from your email."}
          </p>
        </div>

        {isValidResetLink && (
          <form onSubmit={resetPasswordHandler} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#3d5166]">New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full rounded-lg border border-[#d4dce8] px-4 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70]"
                placeholder="At least 8 characters"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#3d5166]">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-lg border border-[#d4dce8] px-4 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70]"
                placeholder="Confirm password"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#009b70] py-2.5 text-sm font-medium text-white hover:bg-[#007a58] disabled:opacity-60"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {message && <p className="mt-4 text-sm font-medium text-[#009b70]">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {hasCheckedResetLink && !isValidResetLink && (
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
