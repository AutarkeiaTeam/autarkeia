-- GDPR: remove PII when a user deletes their account (right to erasure).
-- Replaces ON DELETE SET NULL with ON DELETE CASCADE for user-linked submissions.

alter table public.community_interest
  drop constraint if exists community_interest_user_id_fkey;

alter table public.community_interest
  add constraint community_interest_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete cascade;

alter table public.contact_messages
  drop constraint if exists contact_messages_user_id_fkey;

alter table public.contact_messages
  add constraint contact_messages_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete cascade;
