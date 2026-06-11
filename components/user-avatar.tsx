"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { preloadAvatarImageUrl } from "@/lib/avatar-upload"
import { cn } from "@/lib/utils"

type UserAvatarProps = {
  src?: string | null
  fallbackInitials: string
  size?: number
  className?: string
}

export function UserAvatar({
  src,
  fallbackInitials,
  size = 32,
  className,
}: UserAvatarProps) {
  const [displaySrc, setDisplaySrc] = useState<string | null>(src ?? null)
  const dimension = `${size}px`
  const fontSize = Math.max(10, Math.round(size * 0.35))

  useEffect(() => {
    if (!src) {
      setDisplaySrc(null)
      return
    }

    let cancelled = false
    void preloadAvatarImageUrl(src).then(() => {
      if (!cancelled) setDisplaySrc(src)
    })

    return () => {
      cancelled = true
    }
  }, [src])

  return (
    <Avatar
      className={cn("border border-[#d4dce8] bg-[#e8f8f3]", className)}
      style={{ width: dimension, height: dimension }}
    >
      {displaySrc ? <AvatarImage src={displaySrc} alt="" className="object-cover" /> : null}
      <AvatarFallback
        className="rounded-full bg-[#e8f8f3] font-semibold text-[#009b70]"
        style={{ fontSize }}
      >
        {fallbackInitials}
      </AvatarFallback>
    </Avatar>
  )
}
