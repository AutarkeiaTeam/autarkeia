"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  imageSource?: string | null
  creditName?: string | null
  creditUrl?: string | null
  creditPhotoLabel: string
  creditOnLabel: string
}

function proxiedNewsImageSrc(src: string): string {
  return `/api/news-image?url=${encodeURIComponent(src)}`
}

export function NewsHeroImage({
  src,
  alt,
  className,
  imgClassName,
  imageSource,
  creditName,
  creditUrl,
  creditPhotoLabel,
  creditOnLabel,
}: Props) {
  const [hidden, setHidden] = useState(false)

  if (hidden) return null

  const showCredit =
    imageSource === "unsplash" && creditName && creditUrl

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-white/[0.03]",
        className
      )}
    >
      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={proxiedNewsImageSrc(src)}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          className={cn("object-contain", imgClassName)}
          onError={() => setHidden(true)}
        />
      </div>
      {showCredit ? (
        <p className="mt-2 w-full px-1 text-center text-xs text-white/40">
          {creditPhotoLabel}{" "}
          <a
            href={creditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-white/20 underline-offset-2 hover:text-white/60"
          >
            {creditName}
          </a>{" "}
          {creditOnLabel}
        </p>
      ) : null}
    </div>
  )
}
