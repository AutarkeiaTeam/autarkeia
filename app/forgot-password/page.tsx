"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { supabaseClient } from "@/lib/supabase-client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const forgotPasswordHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage("")
    setError("")

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError("Enter your email address.")
      return
    }

    try {
      setIsLoading(true)
      const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(trimmedEmail)
      if (resetError) {
        setError(resetError.message)
        return
      }
      setMessage("Check your email for reset link")
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
          <h1 className="mt-4 text-2xl font-light text-[#0d1b2a]">Reset your password</h1>
          <p className="mt-2 text-sm text-[#8a9bb0]">
            Enter your email and we&apos;ll send a link to set a new password.
          </p>
        </div>

        <form onSubmit={forgotPasswordHandler}>
          <label className="mb-1.5 block text-xs font-medium text-[#3d5166]">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-[#d4dce8] px-4 py-2.5 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70]"
            placeholder="you@example.com"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full rounded-lg bg-[#009b70] py-2.5 text-sm font-medium text-white hover:bg-[#007a58] disabled:opacity-60"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm font-medium text-[#009b70]">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <p className="mt-6 text-center text-xs text-[#8a9bb0]">
          <Link href="/login" className="font-medium text-[#009b70] hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
