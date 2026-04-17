-- FAMCO — Family Command Center
-- Run this in the Supabase SQL editor

create table if not exists profiles (
  id               text primary key,           -- "{provider}:{providerAccountId}"
  email            text not null,
  first_name       text,
  last_name        text,
  city             text,
  timezone         text,
  phone            text,
  family_type      text check (family_type in
                     ('single_parent','co_parent','full_household','blended')),
  co_parent_email  text,
  partner_name     text,
  onboarding_step  int  not null default 0,
  onboarding_completed boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table if not exists kids (
  id          uuid primary key default gen_random_uuid(),
  profile_id  text not null references profiles(id) on delete cascade,
  name        text not null,
  dob         date,
  created_at  timestamptz not null default now()
);

create table if not exists calendars (
  id            uuid primary key default gen_random_uuid(),
  profile_id    text not null references profiles(id) on delete cascade,
  kid_id        uuid references kids(id) on delete set null,
  filename      text not null,
  storage_path  text not null,
  created_at    timestamptz not null default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table kids     enable row level security;
alter table calendars enable row level security;

-- Service role bypasses RLS (our API uses service role key)
-- No additional policies needed for server-side access
