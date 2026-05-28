import type { Metadata } from "next"
import Script from "next/script"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OAuthHashRedirect } from "@/components/auth/oauth-hash-redirect"
import { I18nProvider } from "@/components/i18n-provider"
import { getLocale } from "@/lib/i18n-server"
import { getMessages } from "@/lib/i18n-core"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Autarkeia — Everything you need to need nothing.",
  description:
    "Everything you need to need nothing. Global emergency readiness and self-sufficiency platform helping you live on your own terms.",
  icons: {
    icon: [{ url: "/icon.png" }],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = getMessages(locale)

  return (
    <html lang={locale} className="bg-background">
      <head>
        <Script
          id="supabase-oauth-hash-redirect"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var p=location.pathname;if(p.indexOf("/auth/callback")===0)return;if(location.hash.indexOf("access_token")===-1)return;if(location.hash.indexOf("type=recovery")!==-1){if(p!=="/reset-password")location.replace("/reset-password"+location.search+location.hash);return}location.replace("/auth/callback/hash"+location.search+location.hash)})();`,
          }}
        />
      </head>
      <body className={`${poppins.className} antialiased`}>
        <I18nProvider locale={locale} messages={messages}>
          <OAuthHashRedirect />
          <Navbar />
          {children}
          <Footer />
        </I18nProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
