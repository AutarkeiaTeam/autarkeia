"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <div className="mx-auto max-w-lg px-4 py-16 lg:px-8">
        <Link href="/" className="text-sm text-[#009b70] hover:underline">
          ← Home
        </Link>
        <h1 className="mt-6 text-3xl font-light text-[#0d1b2a]">Contact</h1>
        <p className="mt-3 text-sm text-[#3d5166]">
          Send us a message. We read every note; response times depend on volume.
        </p>

        {sent ? (
          <div className="mt-8 rounded-2xl border border-[#009b70]/40 bg-[#e8f8f3] p-6 text-sm text-[#0d1b2a]">
            Thank you{name ? `, ${name}` : ""}. We have received your message and will reply when we can.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-2xl border border-[#d4dce8] bg-white p-6 shadow-sm">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-medium text-[#3d5166]">
                Name
              </label>
              <input
                id="contact-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d4dce8] px-3 py-2 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70]"
                autoComplete="name"
                required
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
                className="mt-1 w-full rounded-lg border border-[#d4dce8] px-3 py-2 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70]"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-xs font-medium text-[#3d5166]">
                Message
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="mt-1 w-full resize-y rounded-lg border border-[#d4dce8] px-3 py-2 text-sm text-[#0d1b2a] outline-none focus:border-[#009b70]"
                required
                minLength={10}
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-[#009b70] py-2.5 text-sm font-medium text-white hover:bg-[#007a58]"
            >
              Send message
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
