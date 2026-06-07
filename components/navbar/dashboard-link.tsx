"use client"

import Link from "next/link"
import type { ComponentProps } from "react"
import { useAccountNavMeta } from "@/components/navbar/use-account-nav-meta"

type DashboardLinkProps = Omit<ComponentProps<typeof Link>, "href">

export function DashboardLink({ children, ...props }: DashboardLinkProps) {
  const navMeta = useAccountNavMeta()
  const href = navMeta?.username ? `/profile/${navMeta.username}` : "/account"

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}
