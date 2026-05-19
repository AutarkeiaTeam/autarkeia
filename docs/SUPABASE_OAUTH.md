# Supabase Google OAuth (PKCE)

## Required dashboard settings

In [Supabase](https://supabase.com/dashboard) → **Authentication** → **URL configuration**:

1. **Site URL**: `https://autarkeia.world` (no `/dashboard` path).
2. **Redirect URLs** (add both):
   - `https://autarkeia.world/auth/callback`
   - `http://localhost:3000/auth/callback`

In **Authentication** → **Providers** → **Google**:

- Leave **Skip nonce check** **OFF**.
- Do not set a custom redirect URL that points to `/dashboard`.

## Expected flow

`Google` → `/auth/callback?code=...` (server exchanges code using PKCE cookie) → `/dashboard` (no hash in the URL).

PKCE code verifiers are stored in cookies via `@supabase/ssr` on both the browser client (`lib/supabase/client.ts`) and the server callback (`app/auth/callback/route.ts`).

Legacy `#access_token` redirects are handled at `/auth/callback/hash` (client-only).
