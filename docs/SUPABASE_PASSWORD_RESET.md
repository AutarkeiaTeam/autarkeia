# Supabase password reset

## URL configuration

In [Supabase](https://supabase.com/dashboard) → **Authentication** → **URL configuration**:

1. **Site URL**: `https://autarkeia.world` (and `http://localhost:3000` for local dev).
2. **Redirect URLs** — add all of:
   - `https://autarkeia.world/auth/callback`
   - `https://autarkeia.world/reset-password`
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/reset-password`

## Reset password email template

In **Authentication** → **Email templates** → **Reset password**, ensure the link sends users to your app’s reset page. The app requests recovery with:

```ts
redirectTo: `${window.location.origin}/reset-password`
```

So the effective redirect after the user clicks the email should be:

- Production: `https://autarkeia.world/reset-password`
- Local: `http://localhost:3000/reset-password`

If you customize the template, use `{{ .ConfirmationURL }}` or equivalent so Supabase still appends the recovery token/code to that URL.

## Expected flow

1. User submits email on `/forgot-password` → `resetPasswordForEmail(email, { redirectTo })`.
2. User clicks the email link → lands on `/reset-password` with a recovery session (PKCE `?code=`, `?token_hash=`, or legacy `#access_token` + `type=recovery`).
3. User sets a new password → `updateUser({ password })` → “Password updated” → `/dashboard`.
4. Sign out and sign in again with the new password to confirm it was saved in `auth.users`.

Recovery links with `type=recovery` in the hash must **not** go through `/auth/callback/hash` (that route is for sign-in only).
