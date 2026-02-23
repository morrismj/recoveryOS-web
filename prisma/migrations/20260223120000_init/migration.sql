-- Prisma migration for RecoveryOS (Neon/Postgres)
create extension if not exists "pgcrypto";

create type "TrainingLoad" as enum ('none', 'light', 'medium', 'hard');
create type "AlcoholIntake" as enum ('none', '1-2', '3+');
create type "MealType" as enum ('breakfast', 'lunch', 'dinner', 'snack');
create type "ImportStatus" as enum ('uploaded', 'previewed', 'processed', 'failed');

create table "user_profiles" (
  "id" uuid primary key,
  "email" text not null unique,
  "timezone" text not null,
  "created_at" timestamptz not null default now()
);

create table "daily_checkins" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null references "user_profiles" ("id") on delete cascade,
  "date" date not null,
  "sleep_hours" numeric not null,
  "stress" int not null,
  "soreness" int not null,
  "training_load" "TrainingLoad" not null,
  "alcohol" "AlcoholIntake" not null,
  "energy" int not null,
  "resting_hr" int,
  "hrv" numeric,
  "notes" text,
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now(),
  unique ("user_id", "date")
);

create table "recovery_scores" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null references "user_profiles" ("id") on delete cascade,
  "date" date not null,
  "recovery_score" int not null,
  "pillars" jsonb not null,
  "explanation" text not null,
  "model_version" text not null,
  "created_at" timestamptz not null default now(),
  unique ("user_id", "date")
);

create table "meals" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null references "user_profiles" ("id") on delete cascade,
  "timestamp" timestamptz not null,
  "photo_url" text not null,
  "meal_type" "MealType",
  "tags" text[] not null default '{}',
  "note" text,
  "created_at" timestamptz not null default now()
);

create table "import_jobs" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null references "user_profiles" ("id") on delete cascade,
  "type" text not null,
  "original_filename" text not null,
  "status" "ImportStatus" not null,
  "row_errors" jsonb,
  "created_at" timestamptz not null default now()
);
