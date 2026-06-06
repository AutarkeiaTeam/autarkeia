"use client"

import Link from "next/link"
import { useI18n } from "@/components/i18n-provider"
import { useAccountNavMeta } from "@/components/navbar/use-account-nav-meta"

export function MobileProfileLink({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useI18n()
  const navMeta = useAccountNavMeta()

  const profileHref =
    navMeta?.profilePublic && navMeta.username
      ? `/profile/${navMeta.username}`
      : "/account"

  return (
    <>
      <Link
        href={profileHref}
        className="block py-2 text-[13px] font-normal text-[#3d5166] hover:text-[#009b70]"
        onClick={onNavigate}
      >
        {t("nav.view_profile")}
      </Link>
      {navMeta && !navMeta.profilePublic ? (
        <p className="pb-2 text-xs text-[#8a9bb0]">{t("nav.view_profile_private_hint")}</p>
      ) : null}
    </>
  )
}
