"use client"

import { useState } from "react"

type Props = {
  src: string
  alt: string
}

function proxiedNewsImageSrc(src: string): string {
  return `/api/news-image?url=${encodeURIComponent(src)}`
}

export function NewsHeroImage({ src, alt }: Props) {
  const [hidden, setHidden] = useState(false)

  if (hidden) return null

  return (
    <div className="h-48 w-full shrink-0 overflow-hidden bg-white/5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={proxiedNewsImageSrc(src)}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover"
        onError={() => setHidden(true)}
      />
    </div>
  )
}
