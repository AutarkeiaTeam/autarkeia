"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
}

function proxiedNewsImageSrc(src: string): string {
  return `/api/news-image?url=${encodeURIComponent(src)}`
}

export function NewsHeroImage({ src, alt, className, imgClassName }: Props) {
  const [hidden, setHidden] = useState(false)

  if (hidden) return null

  return (
    <div className={cn("overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={proxiedNewsImageSrc(src)}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={cn("h-full w-full object-cover", imgClassName)}
        onError={() => setHidden(true)}
      />
    </div>
  )
}
