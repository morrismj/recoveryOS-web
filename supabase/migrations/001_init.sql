-- Core entities
create extension if not exists "pgcrypto";

create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  timezone text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  sleep_hours numeric not null check (sleep_hours >= 0),
  stress int not null check (stress between 1 and 5),
  soreness int not null check (soreness between 1 and 5),
  training_load text not null check (training_load in ('none', 'light', 'medium', 'hard')),
  alcohol text not null check (alcohol in ('none', '1-2', '3+')),
  energy int not null check (energy between 1 and 5),
  resting_hr int,
  hrv numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

create table if not exists public.recovery_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  recovery_score int not null check (recovery_score between 0 and 100),
  pillars jsonb not null,
  explanation text not null,
  model_version text not null,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  timestamp timestamptz not null,
  photo_url text not null,
  meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  tags text[],
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('generic_csv')),
  original_filename text not null,
  status text not null check (status in ('uploaded', 'previewed', 'processed', 'failed')),
  row_errors jsonb,
  created_at timestamptz not null default now()
);
