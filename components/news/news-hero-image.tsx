"use client"

import { useState } from "react"

type Props = {
  src: string
  alt: string
}

export function NewsHeroImage({ src, alt }: Props) {
  const [hidden, setHidden] = useState(false)

  if (hidden) return null

  return (
    <div className="aspect-video w-full overflow-hidden bg-white/5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover"
        onError={() => setHidden(true)}
      />
    </div>
  )
}
