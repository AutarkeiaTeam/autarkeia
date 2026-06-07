"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  const dimension = `${size}px`
  const fontSize = Math.max(10, Math.round(size * 0.35))

  return (
    <Avatar
      className={cn("border border-[#d4dce8] bg-[#e8f8f3]", className)}
      style={{ width: dimension, height: dimension }}
    >
      {src ? <AvatarImage src={src} alt="" className="object-cover" /> : null}
      <AvatarFallback
        className="rounded-full bg-[#e8f8f3] font-semibold text-[#009b70]"
        style={{ fontSize }}
      >
        {fallbackInitials}
      </AvatarFallback>
    </Avatar>
  )
}
