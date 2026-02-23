-- Storage bucket for meal photos
insert into storage.buckets (id, name, public)
values ('meal-photos', 'meal-photos', false)
on conflict (id) do nothing;

alter table storage.objects enable row level security;

create policy "Meal photo access" on storage.objects
  for all
  using (bucket_id = 'meal-photos' and auth.uid() = owner)
  with check (bucket_id = 'meal-photos' and auth.uid() = owner);
