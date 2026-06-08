"use client"

import Link from "next/link"
import ReactMarkdown from "react-markdown"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import { preprocessVerifiedMentions } from "@/lib/forums-content"

const forumMarkdownSchema = {
  ...defaultSchema,
  tagNames: ["p", "strong", "em", "a", "code", "pre", "ul", "ol", "li", "blockquote", "br"],
  attributes: {
    ...defaultSchema.attributes,
    a: ["href"],
    code: ["className"],
  },
}

type ForumPostContentProps = {
  content: string
  verifiedMentions?: ReadonlySet<string>
  className?: string
}

export function ForumPostContent({
  content,
  verifiedMentions = new Set(),
  className = "",
}: ForumPostContentProps) {
  const prepared = preprocessVerifiedMentions(content, verifiedMentions)

  return (
    <div
      className={`forum-post-content text-sm leading-relaxed text-[#3d5166] [&_blockquote]:border-l-2 [&_blockquote]:border-[#d4dce8] [&_blockquote]:pl-3 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-[#f5f7fa] [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-[#d4dce8] [&_pre]:bg-[#f5f7fa] [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:list-disc [&_ul]:pl-5 ${className}`}
    >
      <ReactMarkdown
        rehypePlugins={[[rehypeSanitize, forumMarkdownSchema]]}
        components={{
          a: ({ href, children }) => {
            if (href?.startsWith("/profile/")) {
              return (
                <Link href={href} className="font-medium text-[#009b70] hover:underline">
                  {children}
                </Link>
              )
            }
            return (
              <a
                href={href}
                rel="noreferrer noopener nofollow"
                target="_blank"
                className="text-[#009b70] hover:underline"
              >
                {children}
              </a>
            )
          },
        }}
      >
        {prepared}
      </ReactMarkdown>
    </div>
  )
}
