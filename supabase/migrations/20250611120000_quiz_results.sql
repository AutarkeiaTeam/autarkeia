-- Persist quiz completions per user for dashboard and public profiles.

create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  quiz_type text not null check (quiz_type in ('emergency-readiness', 'self-sufficiency')),
  overall_score smallint not null check (overall_score >= 0 and overall_score <= 100),
  category_scores jsonb not null default '{}'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  verdict_level text not null check (verdict_level in ('beginner', 'intermediate', 'advanced', 'expert')),
  taken_at timestamptz not null default now()
);

create index if not exists quiz_results_user_quiz_taken_idx
  on public.quiz_results (user_id, quiz_type, taken_at desc);

alter table public.quiz_results enable row level security;

drop policy if exists "Users can read own quiz results" on public.quiz_results;
create policy "Users can read own quiz results"
  on public.quiz_results for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own quiz results" on public.quiz_results;
create policy "Users can insert own quiz results"
  on public.quiz_results for insert
  with check (auth.uid() = user_id);

comment on table public.quiz_results is
  'Historical quiz attempts per user; latest per quiz_type used for dashboard and profile display.';
