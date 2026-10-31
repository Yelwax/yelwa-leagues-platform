create table public.pods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phase text not null check (phase in ('incubation', 'momentum', 'acceleration')),
  commitment_hours int not null check (commitment_hours in (2, 4, 6)),
  track text not null check (track in ('general', 'private')),
  tutor_id uuid references public.profiles(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.pod_members (
  pod_id uuid not null references public.pods(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (pod_id, student_id)
);
alter table public.pods enable row level security;
alter table public.pod_members enable row level security;

-- Helpers (security definer, so policies never loop back on themselves)
create or replace function public.my_pod_ids() returns setof uuid
language sql stable security definer set search_path = '' as $$
  select pod_id from public.pod_members where student_id = auth.uid()
  union select id from public.pods where tutor_id = auth.uid()
$$;
create or replace function public.my_tutored_pod_ids() returns setof uuid
language sql stable security definer set search_path = '' as $$
  select id from public.pods where tutor_id = auth.uid()
$$;
create or replace function public.my_tutor_ids() returns setof uuid
language sql stable security definer set search_path = '' as $$
  select p.tutor_id from public.pods p join public.pod_members m on m.pod_id = p.id
  where m.student_id = auth.uid() and p.tutor_id is not null
$$;
create or replace function public.my_student_ids() returns setof uuid
language sql stable security definer set search_path = '' as $$
  select m.student_id from public.pod_members m join public.pods p on p.id = m.pod_id
  where p.tutor_id = auth.uid()
$$;

create policy "Team manages pods" on public.pods for all to authenticated
  using (public.is_team()) with check (public.is_team());
create policy "Members read their pods" on public.pods for select to authenticated
  using (id in (select public.my_pod_ids()));
create policy "Team manages pod members" on public.pod_members for all to authenticated
  using (public.is_team()) with check (public.is_team());
create policy "Read own membership" on public.pod_members for select to authenticated
  using (student_id = auth.uid());
create policy "Tutors read their pod members" on public.pod_members for select to authenticated
  using (pod_id in (select public.my_tutored_pod_ids()));
create policy "Students read their tutor" on public.profiles for select to authenticated
  using (id in (select public.my_tutor_ids()));
create policy "Tutors read their students" on public.profiles for select to authenticated
  using (id in (select public.my_student_ids()));

-- Activation: only after payment is confirmed. Makes the applicant a student and adds them to a pod.
create or replace function public.activate_student(p_student uuid, p_pod uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare s text;
begin
  if not public.is_team() then raise exception 'Not allowed'; end if;
  select pipeline_stage into s from public.profiles where id = p_student;
  if s is distinct from 'payment_confirmed' then raise exception 'Payment must be confirmed first'; end if;
  if not exists (select 1 from public.pods where id = p_pod and active) then raise exception 'Pod not found'; end if;
  perform set_config('app.bypass_guard', 'on', true);
  update public.profiles set role = 'student', pipeline_stage = 'active' where id = p_student;
  perform set_config('app.bypass_guard', 'off', true);
  insert into public.pod_members (pod_id, student_id) values (p_pod, p_student) on conflict do nothing;
  insert into public.audit_log (actor_id, action, target_profile_id, details)
  values (auth.uid(), 'activated', p_student, jsonb_build_object('pod_id', p_pod));
end $$;
revoke all on function public.activate_student(uuid, uuid) from public, anon;
grant execute on function public.activate_student(uuid, uuid) to authenticated;
