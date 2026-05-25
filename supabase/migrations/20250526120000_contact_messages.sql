-- Contact form submissions (insert via service role API only).

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now(),
  constraint contact_messages_name_length check (char_length(name) >= 1 and char_length(name) <= 100),
  constraint contact_messages_email_length check (char_length(email) >= 1 and char_length(email) <= 320),
  constraint contact_messages_subject_length check (
    subject is null or (char_length(subject) >= 0 and char_length(subject) <= 200)
  ),
  constraint contact_messages_message_length check (
    char_length(message) >= 1 and char_length(message) <= 2000
  )
);

create index if not exists contact_messages_email_idx on public.contact_messages (email);
create index if not exists contact_messages_user_id_idx on public.contact_messages (user_id);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

-- No SELECT or INSERT policies: reads and writes use service role only.
