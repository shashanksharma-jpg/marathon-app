-- ─────────────────────────────────────────────────────────────────────────────
-- Run this ONCE in your Supabase SQL Editor to set up the marathon app
-- Dashboard → SQL Editor → paste this → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Create the app_state table
create table if not exists app_state (
  key        text primary key,
  value      text not null,
  updated_at timestamptz default now()
);

-- 2. Allow anyone with the anon key to read and write (no auth needed)
--    This is fine for a personal app — only you have the URL
alter table app_state enable row level security;

create policy "Allow full access with anon key"
  on app_state
  for all
  using (true)
  with check (true);

-- 3. Insert a blank starting row so the first load doesn't 404
insert into app_state (key, value)
values ('marathon-app-shashank', '{}')
on conflict (key) do nothing;
