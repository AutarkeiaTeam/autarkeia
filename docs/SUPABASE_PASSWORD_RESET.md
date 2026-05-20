# Supabase password reset

## URL configuration

In [Supabase](https://supabase.com/dashboard) → **Authentication** → **URL configuration**:

1. **Site URL**: `https://autarkeia.world` (and `http://localhost:3000` for local dev).
2. **Redirect URLs** — add all of:
   - `https://autarkeia.world/auth/callback`
   - `https://autarkeia.world/reset-password`
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/reset-password`

## Reset password email template (hash / implicit flow)

Password recovery **does not use PKCE**. Email links must deliver session tokens in the URL **hash**, for example:

`/reset-password#access_token=...&refresh_token=...&type=recovery`

In **Authentication** → **Email templates** → **Reset password**:

- Use `{{ .ConfirmationURL }}` so Supabase redirects to your `redirectTo` (`/reset-password`).
- Do **not** rely on `?code=` PKCE links for recovery; those fail when the user opens the email in a new browser (“PKCE code verifier not found”).

The app calls:

```ts
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`,
})
```

## Expected flow

1. User submits email on `/forgot-password` → `resetPasswordForEmail` with `redirectTo` above.
2. User clicks the email link → lands on `/reset-password#access_token=...&type=recovery` (or `?token_hash=` for some templates).
3. The page calls `setSession` from hash tokens (no `exchangeCodeForSession`).
4. User sets a new password → `updateUser({ password })` → “Password updated” → `/dashboard`.
5. Sign out and sign in with the new password to confirm it was saved.

Recovery hashes must **not** go through `/auth/callback/hash` (sign-in only). The layout script and `OAuthHashRedirect` send `type=recovery` links to `/reset-password`.

## OAuth vs recovery

- **Google sign-in**: PKCE via `/auth/callback?code=...` (verifier stored in cookies — see `lib/supabase/client.ts`).
- **Password reset**: hash tokens on `/reset-password` only.
