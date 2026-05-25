"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { CONTACT_MESSAGE_MAX_LENGTH } from "@/lib/contact"

const inputClass =
  "mt-1 w-full rounded-lg border border-[#d4dce8] px-3 py-2 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70]"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const messageLength = message.length
  const atMessageLimit = messageLength >= CONTACT_MESSAGE_MAX_LENGTH

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      })

      const data = (await response.json().catch(() => null)) as { error?: string; ok?: boolean }

      if (!response.ok) {
        throw new Error(data?.error || "Could not send your message.")
      }

      setStatus("success")
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch (err) {
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : "Could not send your message.")
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <div className="mx-auto max-w-lg px-4 py-16 lg:px-8">
        <Link href="/" className="text-sm text-[#009b70] hover:underline">
          ← Home
        </Link>
        <h1 className="mt-6 text-3xl font-light text-[#0d1b2a]">Contact</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#3d5166]">
          Questions about Autarkeia, communities, or membership? Send us a message below. We read
          every note; response times depend on volume.
        </p>
        <p className="mt-3 text-sm text-[#3d5166]">
          Prefer email?{" "}
          <a href="mailto:hello@autarkeia.world" className="font-medium text-[#009b70] hover:underline">
            hello@autarkeia.world
          </a>
        </p>

        {status === "success" ? (
          <div className="mt-8 rounded-2xl border border-[#009b70]/40 bg-[#e8f8f3] p-6 text-sm text-[#0d1b2a]">
            Thank you. We have received your message and sent a confirmation to your email. We will
            reply when we can.
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mt-8 space-y-5 rounded-2xl border border-[#d4dce8] bg-white p-6 shadow-sm"
          >
            <div>
              <label htmlFor="contact-name" className="block text-xs font-medium text-[#3d5166]">
                Name
              </label>
              <input
                id="contact-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                autoComplete="name"
                required
                maxLength={100}
                disabled={status === "loading"}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-xs font-medium text-[#3d5166]">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                autoComplete="email"
                required
                disabled={status === "loading"}
              />
            </div>
            <div>
              <label htmlFor="contact-subject" className="block text-xs font-medium text-[#3d5166]">
                Subject <span className="font-normal text-[#8a9bb0]">(optional)</span>
              </label>
              <input
                id="contact-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={inputClass}
                maxLength={200}
                placeholder="What is this about?"
                disabled={status === "loading"}
              />
            </div>
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <label htmlFor="contact-message" className="block text-xs font-medium text-[#3d5166]">
                  Message
                </label>
                <span
                  className={`text-xs tabular-nums ${atMessageLimit ? "text-amber-700" : "text-[#8a9bb0]"}`}
                  aria-live="polite"
                >
                  {messageLength} / {CONTACT_MESSAGE_MAX_LENGTH}
                </span>
              </div>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, CONTACT_MESSAGE_MAX_LENGTH))}
                rows={6}
                className={`${inputClass} resize-y`}
                required
                maxLength={CONTACT_MESSAGE_MAX_LENGTH}
                placeholder="How can we help?"
                disabled={status === "loading"}
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-lg bg-[#009b70] py-2.5 text-sm font-medium text-white hover:bg-[#007a58] disabled:opacity-60"
            >
              {status === "loading" ? "Sending…" : "Send message"}
            </button>
            {status === "error" && errorMessage && (
              <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errorMessage}
              </p>
            )}
          </form>
        )}
      </div>
    </main>
  )
}
