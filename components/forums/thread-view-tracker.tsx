"use client"

import { useEffect } from "react"

export function ThreadViewTracker({ threadId }: { threadId: string }) {
  useEffect(() => {
    fetch(`/api/forums/threads/${threadId}/view`, { method: "POST" }).catch(() => {})
  }, [threadId])

  return null
}
