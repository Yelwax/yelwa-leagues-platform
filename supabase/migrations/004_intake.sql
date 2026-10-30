-- Intake answers (one row per applicant; answers stored as JSON, keyed by question id)
create table public.intake_responses (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'submitted')),
  submitted_at timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.intake_responses enable row level security;
create policy "Read own intake" on public.intake_responses for select to authenticated using (profile_id = auth.uid());
create policy "Insert own draft" on public.intake_responses for insert to authenticated
  with check (profile_id = auth.uid() and status = 'draft');
create policy "Update own draft" on public.intake_responses for update to authenticated
  using (profile_id = auth.uid() and status = 'draft') with check (profile_id = auth.uid() and status = 'draft');
create policy "Team reads intake" on public.intake_responses for select to authenticated using (public.is_team());

-- Team scoring sheet (applicants can never read this)
create table public.internal_review (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  knowledge_level text, digital_readiness text, commitment_level text,
  audience_category text, recommended_phase text, timetable_track text,
  pricing_proposal_amount numeric, notes text,
  welcome_message_sent boolean not null default false, welcome_sent_on date,
  intake_complete boolean not null default false,
  reviewed_by uuid references public.profiles(id), reviewed_on date
);
alter table public.internal_review enable row level security;
create policy "Team reads review" on public.internal_review for select to authenticated using (public.is_team());
create policy "Team inserts review" on public.internal_review for insert to authenticated with check (public.is_team());
create policy "Team updates review" on public.internal_review for update to authenticated
  using (public.is_team()) with check (public.is_team());

-- Audit log: team can add and read entries, nobody can edit or delete them
create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.profiles(id),
  action text not null,
  target_profile_id uuid references public.profiles(id),
  details jsonb,
  created_at timestamptz not null default now()
);
alter table public.audit_log enable row level security;
create policy "Team adds audit entries" on public.audit_log for insert to authenticated
  with check (public.is_team() and actor_id = auth.uid());
create policy "Team reads audit log" on public.audit_log for select to authenticated using (public.is_team());

-- Let the guard allow the one trusted stage change made by submit_intake()
create or replace function public.guard_profile_update() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is not null and coalesce(current_setting('app.bypass_guard', true), 'off') <> 'on' then
    if new.role is distinct from old.role and not public.is_owner() then
      raise exception 'Only the owner can change roles';
    end if;
    if new.pipeline_stage is distinct from old.pipeline_stage and not public.is_team() then
      raise exception 'Only the team can change the pipeline stage';
    end if;
    if (new.id is distinct from old.id or new.email is distinct from old.email
        or new.lead_id is distinct from old.lead_id) and not public.is_team() then
      raise exception 'Not allowed';
    end if;
  end if;
  return new;
end $$;

-- Final submit: locks the answers and moves the applicant to 'intake_submitted'
create or replace function public.submit_intake(p_answers jsonb) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  insert into public.intake_responses (profile_id, answers, status, submitted_at)
  values (auth.uid(), p_answers, 'submitted', now())
  on conflict (profile_id) do update
    set answers = excluded.answers, status = 'submitted', submitted_at = now(), updated_at = now()
    where public.intake_responses.status = 'draft';
  perform set_config('app.bypass_guard', 'on', true);
  update public.profiles set pipeline_stage = 'intake_submitted'
    where id = auth.uid() and pipeline_stage = 'brochure_requested';
  perform set_config('app.bypass_guard', 'off', true);
end $$;
revoke all on function public.submit_intake(jsonb) from public, anon;
grant execute on function public.submit_intake(jsonb) to authenticated;
