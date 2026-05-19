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

`Google` → `/auth/callback?code=...` → `/dashboard` (no `#access_token` in the URL).

If users land on `/dashboard#access_token=...`, the app forwards them to `/auth/callback` to finish sign-in, but the dashboard redirect URL in Supabase should still be corrected so PKCE is used.
