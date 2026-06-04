"use client"

import Link from "next/link"
import { LogoLight } from "./logo"
import { useI18n } from "@/components/i18n-provider"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="bg-[#0d1b2a] border-t border-[#1a2942]">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="mb-4 inline-flex items-center">
              <LogoLight />
            </Link>
            <p className="text-sm text-[#7a8a9e]">{t("footer.tagline")}</p>
            <p className="text-xs text-[#5a6a7e] mt-4">{t("footer.region")}</p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.platform")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/quiz/emergency-readiness" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">
                  {t("footer.quiz")}
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">
                  {t("footer.marketplace")}
                </Link>
              </li>
              <li>
                <Link href="/library" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">
                  {t("footer.library")}
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">
                  {t("footer.news")}
                </Link>
              </li>
              <li>
                <Link href="/plans" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">
                  {t("footer.plans")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.communities")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/communities" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">
                  {t("footer.our_vision")}
                </Link>
              </li>
              <li>
                <Link href="/communities#register-interest" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">
                  {t("footer.register_interest")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t("footer.company")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">
                  {t("footer.contact")}
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">
                  {t("footer.refund_policy")}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-[#7a8a9e] hover:text-[#009b70]">
                  {t("footer.privacy_policy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1a2942] pt-8">
          <p className="text-xs text-[#5a6a7e]">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  )
}
