-- Track one-time welcome email per user (reset on account deletion via profiles CASCADE).

alter table public.profiles
  add column if not exists welcome_email_sent_at timestamptz;

comment on column public.profiles.welcome_email_sent_at is
  'When the post-signup welcome email was sent via Resend; null until first send.';
