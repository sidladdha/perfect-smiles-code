-- Perfect Smiles: single-login clinic database
-- Run this in Supabase SQL Editor.

create table if not exists public.clinic_storage (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.clinic_storage enable row level security;

drop policy if exists "Authenticated clinic users can read clinic data" on public.clinic_storage;
create policy "Authenticated clinic users can read clinic data"
on public.clinic_storage for select
to authenticated
using (true);

drop policy if exists "Authenticated clinic users can insert clinic data" on public.clinic_storage;
create policy "Authenticated clinic users can insert clinic data"
on public.clinic_storage for insert
to authenticated
with check (true);

drop policy if exists "Authenticated clinic users can update clinic data" on public.clinic_storage;
create policy "Authenticated clinic users can update clinic data"
on public.clinic_storage for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated clinic users can delete clinic data" on public.clinic_storage;
create policy "Authenticated clinic users can delete clinic data"
on public.clinic_storage for delete
to authenticated
using (true);

-- IMPORTANT:
-- Create exactly one clinic login in Supabase Dashboard:
-- Authentication → Users → Add user → Create new user.
-- Do NOT enable public sign-ups for this clinic portal.
--
-- Recommended:
-- Authentication → Providers → Email enabled
-- Authentication → Settings → Disable "Allow new users to sign up"
--
-- The single account can be used by authorised clinic staff.
