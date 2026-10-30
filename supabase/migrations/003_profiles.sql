create type public.user_role as enum ('owner', 'team', 'tutor', 'student', 'applicant');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text,
  role public.user_role not null default 'applicant',
  pipeline_stage text not null default 'brochure_requested',
  lead_id uuid references public.leads(id),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Role helpers (security definer so policies can use them without looping)
create or replace function public.my_role() returns public.user_role
language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = auth.uid()
$$;
create or replace function public.is_owner() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.my_role() = 'owner', false)
$$;
create or replace function public.is_team() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.my_role() in ('owner', 'team'), false)
$$;
create or replace function public.is_tutor() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.my_role() = 'tutor', false)
$$;

-- Every new sign-up becomes an applicant, linked to their brochure lead by email
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, email, lead_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    (select l.id from public.leads l where lower(l.email) = lower(new.email) limit 1)
  );
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Protect sensitive columns: only the owner changes roles, only the team moves stages
create or replace function public.guard_profile_update() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is not null then
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
create trigger guard_profile_update before update on public.profiles
  for each row execute function public.guard_profile_update();

create policy "Read own profile" on public.profiles for select to authenticated
  using (id = auth.uid());
create policy "Team reads all profiles" on public.profiles for select to authenticated
  using (public.is_team());
create policy "Update own profile" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy "Team updates profiles" on public.profiles for update to authenticated
  using (public.is_team()) with check (public.is_team());

-- The team can read the brochure leads
create policy "Team reads leads" on public.leads for select to authenticated
  using (public.is_team());
