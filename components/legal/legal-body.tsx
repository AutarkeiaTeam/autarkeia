"use client"

import type { ReactNode } from "react"

function formatInline(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  const re = /\*\*(.+?)\*\*|(hello@autarkeia\.world)/g
  let last = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index))
    }
    if (match[1]) {
      parts.push(
        <strong key={key++} className="font-medium text-[#0d1b2a]">
          {match[1]}
        </strong>
      )
    } else if (match[2]) {
      parts.push(
        <a key={key++} href="mailto:hello@autarkeia.world" className="text-[#009b70] hover:underline">
          hello@autarkeia.world
        </a>
      )
    }
    last = match.index + match[0].length
  }

  if (last < text.length) {
    parts.push(text.slice(last))
  }

  return parts.length ? parts : [text]
}

export function LegalBody({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/).filter(Boolean)

  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter(Boolean)
        const isList = lines.length > 0 && lines.every((line) => line.startsWith("- "))

        if (isList) {
          return (
            <ul key={i} className="my-3 list-disc space-y-1 pl-5 text-[#3d5166] leading-relaxed">
              {lines.map((line, j) => (
                <li key={j}>{formatInline(line.slice(2))}</li>
              ))}
            </ul>
          )
        }

        return (
          <p key={i} className="my-3 text-[#3d5166] leading-relaxed">
            {formatInline(block)}
          </p>
        )
      })}
    </>
  )
}
