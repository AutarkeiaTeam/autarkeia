"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, Suspense, useEffect, useState } from "react"

const CATEGORIES = [
  { id: "housing-land", name: "Housing & Land" },
  { id: "food-systems", name: "Food Systems" },
  { id: "energy-water", name: "Energy & Water" },
  { id: "governance", name: "Governance" },
  { id: "general", name: "General" },
]

function NewThreadPageInner() {
  const router = useRouter()
  const params = useSearchParams()
  const presetCategory = params.get("category") ?? "general"
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState(presetCategory)
  const [body, setBody] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    if (typeof document === "undefined") return
    setAuthed(document.cookie.split("; ").some((row) => row.startsWith("autarkeia-user=")))
  }, [])

  useEffect(() => {
    setCategory(presetCategory)
  }, [presetCategory])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch("/api/forums/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, body }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Could not create thread")
      }
      router.push(`/forums/${data.thread.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setSubmitting(false)
    }
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-[#f5f7fa]">
        <div className="mx-auto max-w-2xl px-4 py-20 lg:px-8">
          <Link href="/forums" className="text-sm text-[#009b70]">
            ← Forums
          </Link>
          <h1 className="mt-6 text-3xl font-light text-[#0d1b2a]">Sign in to start a discussion</h1>
          <p className="mt-3 text-sm text-[#3d5166]">
            Reading is open to everyone; posting requires an account so threads can be moderated.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-[#009b70] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#007a58]"
          >
            Sign in →
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <div className="mx-auto max-w-2xl px-4 py-14 lg:px-8">
        <Link href="/forums" className="text-sm text-[#009b70]">
          ← Forums
        </Link>
        <h1 className="mt-6 text-3xl font-light text-[#0d1b2a]">New discussion</h1>

        <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-[#d4dce8] bg-white p-6">
          <div>
            <label className="block text-xs font-medium text-[#3d5166]">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d4dce8] p-3 text-sm outline-none focus:border-[#009b70]"
              placeholder="A short, specific title"
              required
              minLength={4}
              maxLength={200}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#3d5166]">Short description (optional)</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d4dce8] p-3 text-sm outline-none focus:border-[#009b70]"
              placeholder="One sentence to help others decide if it's for them"
              maxLength={500}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#3d5166]">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d4dce8] bg-white p-3 text-sm outline-none focus:border-[#009b70]"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#3d5166]">First post</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#d4dce8] p-3 text-sm outline-none focus:border-[#009b70]"
              rows={8}
              required
              minLength={4}
              placeholder="Share your situation, question, or proposal. Specifics get better replies."
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[#009b70] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#007a58] disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Create discussion"}
          </button>
        </form>
      </div>
    </main>
  )
}

export default function NewThreadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewThreadPageInner />
    </Suspense>
  )
}
