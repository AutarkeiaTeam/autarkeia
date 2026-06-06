import type { User } from "@supabase/supabase-js"

export type OAuthProvider = "google" | "apple" | "github" | (string & {})

export type PrimaryAuthMethod =
  | { type: "email" }
  | { type: "linked"; oauthProvider: OAuthProvider }
  | { type: "oauth-only"; oauthProvider: OAuthProvider }

const OAUTH_SECURITY_URLS: Partial<Record<string, string>> = {
  google: "https://myaccount.google.com/security",
  apple: "https://appleid.apple.com/account/manage",
  github: "https://github.com/settings/security",
}

export function oauthProviderSecurityUrl(provider: string): string | null {
  return OAUTH_SECURITY_URLS[provider] ?? null
}

function collectAuthProviders(user: User): Set<string> {
  const providers = new Set<string>()

  for (const identity of user.identities ?? []) {
    if (identity.provider) providers.add(identity.provider)
  }

  const metaProviders = user.app_metadata?.providers
  if (Array.isArray(metaProviders)) {
    for (const provider of metaProviders) {
      if (typeof provider === "string") providers.add(provider)
    }
  }

  return providers
}

/** Detect whether the user can change password in-app or uses OAuth-only sign-in. */
export function getPrimaryAuthMethod(user: User): PrimaryAuthMethod {
  const providers = collectAuthProviders(user)
  const hasEmail = providers.has("email")
  const oauthProviders = [...providers].filter((provider) => provider !== "email")

  if (oauthProviders.length > 0 && !hasEmail) {
    return { type: "oauth-only", oauthProvider: oauthProviders[0] }
  }

  if (oauthProviders.length > 0 && hasEmail) {
    return { type: "linked", oauthProvider: oauthProviders[0] }
  }

  return { type: "email" }
}

export function showsPasswordForm(method: PrimaryAuthMethod): boolean {
  return method.type === "email" || method.type === "linked"
}
