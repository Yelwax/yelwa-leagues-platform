create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at),
  meet_url text,
  audience_type text not null check (audience_type in ('pod', 'user', 'all')),
  pod_id uuid references public.pods(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  host_id uuid not null references public.profiles(id),
  resource_id uuid references public.resources(id) on delete set null,
  replay_resource_id uuid references public.resources(id) on delete set null,
  created_at timestamptz not null default now(),
  check ((audience_type = 'pod' and pod_id is not null)
      or (audience_type = 'user' and student_id is not null)
      or audience_type = 'all')
);
alter table public.events enable row level security;

create policy "See your events" on public.events for select to authenticated using (
  public.is_team()
  or host_id = auth.uid()
  or (audience_type = 'all' and public.my_role() in ('tutor', 'student'))
  or (audience_type = 'pod' and pod_id in (select public.my_pod_ids()))
  or (audience_type = 'user' and (student_id = auth.uid() or student_id in (select public.my_student_ids())))
);
create policy "Team manages events" on public.events for all to authenticated
  using (public.is_team()) with check (public.is_team());
create policy "Tutors schedule for their own pods and students" on public.events for insert to authenticated
  with check (public.is_tutor() and host_id = auth.uid() and (
    (audience_type = 'pod' and pod_id in (select public.my_tutored_pod_ids()))
    or (audience_type = 'user' and student_id in (select public.my_student_ids()))));
create policy "Tutors edit their own events" on public.events for update to authenticated
  using (public.is_tutor() and host_id = auth.uid()) with check (public.is_tutor() and host_id = auth.uid());
create policy "Tutors delete their own events" on public.events for delete to authenticated
  using (public.is_tutor() and host_id = auth.uid());
