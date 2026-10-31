create table public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  shelf text not null check (shelf in ('curriculum', 'books', 'tutor', 'replays')),
  phase text check (phase in ('incubation', 'momentum', 'acceleration')),
  course text,
  module text,
  file_type text not null default 'pdf' check (file_type in ('pdf', 'video', 'link')),
  storage_path text,
  external_url text,
  video_url text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.resources enable row level security;

create policy "Members read resources" on public.resources for select to authenticated
  using (public.my_role() in ('owner', 'team', 'tutor', 'student'));
create policy "Team manages resources" on public.resources for all to authenticated
  using (public.is_team()) with check (public.is_team());
create policy "Tutors add to the tutor shelf" on public.resources for insert to authenticated
  with check (public.is_tutor() and shelf = 'tutor' and uploaded_by = auth.uid());
create policy "Tutors edit their own tutor items" on public.resources for update to authenticated
  using (public.is_tutor() and shelf = 'tutor' and uploaded_by = auth.uid())
  with check (public.is_tutor() and shelf = 'tutor' and uploaded_by = auth.uid());
create policy "Tutors delete their own tutor items" on public.resources for delete to authenticated
  using (public.is_tutor() and shelf = 'tutor' and uploaded_by = auth.uid());

-- Private file store: nothing is reachable without a login and a short-lived link
insert into storage.buckets (id, name, public, file_size_limit)
values ('library', 'library', false, 52428800) on conflict (id) do nothing;

create policy "Members read library files" on storage.objects for select to authenticated
  using (bucket_id = 'library' and public.my_role() in ('owner', 'team', 'tutor', 'student'));
create policy "Upload library files" on storage.objects for insert to authenticated
  with check (bucket_id = 'library' and (public.is_team() or (public.is_tutor() and name like 'tutor/%')));
create policy "Delete library files" on storage.objects for delete to authenticated
  using (bucket_id = 'library' and (public.is_team() or (public.is_tutor() and name like 'tutor/%')));
