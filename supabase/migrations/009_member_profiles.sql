-- Member profiles: what each member chooses to share with other members
create table public.member_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  business_name text check (char_length(business_name) <= 100),
  business_summary text check (char_length(business_summary) <= 300),
  location text check (char_length(location) <= 80),
  bio text check (char_length(bio) <= 600),
  avatar_url text,
  updated_at timestamptz not null default now()
);
alter table public.member_profiles enable row level security;

create policy "Members read member profiles" on public.member_profiles for select to authenticated
  using (public.my_role() in ('owner', 'team', 'tutor', 'student'));
create policy "Add own profile" on public.member_profiles for insert to authenticated
  with check (profile_id = auth.uid() and public.my_role() in ('owner', 'team', 'tutor', 'student'));
create policy "Edit own profile" on public.member_profiles for update to authenticated
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "Delete own profile" on public.member_profiles for delete to authenticated
  using (profile_id = auth.uid());

-- Profile pictures: small images, each member can only write inside their own folder
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
create policy "Upload own avatar" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Replace own avatar" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Delete own avatar" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
