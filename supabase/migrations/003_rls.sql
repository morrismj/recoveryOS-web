-- Enable RLS on core tables
alter table public.user_profiles enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.recovery_scores enable row level security;
alter table public.meals enable row level security;
alter table public.import_jobs enable row level security;

-- User profiles
create policy "Users manage own profile" on public.user_profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Daily check-ins
create policy "Users manage own checkins" on public.daily_checkins
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Recovery scores
create policy "Users manage own scores" on public.recovery_scores
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Meals
create policy "Users manage own meals" on public.meals
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Import jobs
create policy "Users manage own imports" on public.import_jobs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
