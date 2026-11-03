-- Adults-only direct messages, built on the existing rooms and messages
alter table public.profiles add column under_18 boolean not null default false;

alter table public.rooms drop constraint rooms_type_check;
alter table public.rooms add constraint rooms_type_check check (type in ('pod', 'community', 'dm'));
alter table public.rooms add column pair_key text unique;
alter table public.rooms add column created_by uuid references public.profiles(id);
alter table public.rooms add column created_at timestamptz not null default now();

create table public.dm_members (
  room_id uuid not null references public.rooms(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  primary key (room_id, profile_id)
);
create table public.dm_blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);
alter table public.dm_members enable row level security;
alter table public.dm_blocks enable row level security;
create policy "See own dm membership" on public.dm_members for select to authenticated using (profile_id = auth.uid());
create policy "See own blocks" on public.dm_blocks for select to authenticated using (blocker_id = auth.uid());
create policy "Block someone" on public.dm_blocks for insert to authenticated with check (blocker_id = auth.uid());
create policy "Unblock someone" on public.dm_blocks for delete to authenticated using (blocker_id = auth.uid());

-- Can the two people in this conversation still message each other?
create or replace function public.dm_open(p_room uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.dm_members a join public.dm_members b
      on a.room_id = b.room_id and a.profile_id <> b.profile_id
    where a.room_id = p_room and a.profile_id = auth.uid()
      and not exists (select 1 from public.dm_blocks k
        where (k.blocker_id = a.profile_id and k.blocked_id = b.profile_id)
           or (k.blocker_id = b.profile_id and k.blocked_id = a.profile_id))
      and not exists (select 1 from public.profiles p
        where p.id in (a.profile_id, b.profile_id) and p.under_18))
$$;

create or replace function public.can_access_room(p_room uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.rooms r where r.id = p_room and (
      (r.type = 'community' and public.my_role() in ('owner', 'team', 'tutor', 'student'))
      or (r.type = 'pod' and r.pod_id in (select public.my_pod_ids()))
      or (r.type = 'dm' and exists (select 1 from public.dm_members m where m.room_id = r.id and m.profile_id = auth.uid()))))
$$;

create or replace function public.can_post(p_room uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.can_access_room(p_room) and (
    case (select type from public.rooms where id = p_room)
      when 'community' then not exists (select 1 from public.profiles where id = auth.uid() and muted_until > now())
      when 'dm' then public.dm_open(p_room)
      else true end)
$$;

-- Start (or reopen) a conversation. Same answer for every refusal, so nobody learns why.
create or replace function public.start_dm(p_other uuid) returns uuid
language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid(); k text; rid uuid; orole public.user_role; ou18 boolean; mu18 boolean;
begin
  if me is null or p_other is null or p_other = me then raise exception 'Not available'; end if;
  if public.my_role() not in ('owner', 'team', 'tutor', 'student') then raise exception 'Not available'; end if;
  select role, under_18 into orole, ou18 from public.profiles where id = p_other;
  select under_18 into mu18 from public.profiles where id = me;
  if orole is null or orole not in ('owner', 'team', 'tutor', 'student') or ou18 or mu18 then raise exception 'Not available'; end if;
  if exists (select 1 from public.dm_blocks where (blocker_id = me and blocked_id = p_other) or (blocker_id = p_other and blocked_id = me)) then
    raise exception 'Not available';
  end if;
  k := least(me::text, p_other::text) || ':' || greatest(me::text, p_other::text);
  select id into rid from public.rooms where pair_key = k;
  if rid is not null then return rid; end if;
  if (select count(*) from public.rooms where type = 'dm' and created_by = me and created_at > now() - interval '24 hours') >= 15 then
    raise exception 'Too many new conversations today';
  end if;
  insert into public.rooms (type, name, pair_key, created_by) values ('dm', 'Direct message', k, me) returning id into rid;
  insert into public.dm_members (room_id, profile_id) values (rid, me), (rid, p_other);
  return rid;
end $$;
revoke all on function public.start_dm(uuid) from public, anon;
grant execute on function public.start_dm(uuid) to authenticated;

-- The people I am chatting with (name and photo of the other person)
create or replace function public.my_dms() returns table (room_id uuid, partner_id uuid, partner_name text, avatar_url text)
language sql stable security definer set search_path = '' as $$
  select m.room_id, o.profile_id,
         coalesce(nullif(mp.display_name, ''), nullif(p.full_name, ''), 'Member'), mp.avatar_url
  from public.dm_members m
  join public.dm_members o on o.room_id = m.room_id and o.profile_id <> m.profile_id
  join public.profiles p on p.id = o.profile_id
  left join public.member_profiles mp on mp.profile_id = o.profile_id
  where m.profile_id = auth.uid()
$$;
revoke all on function public.my_dms() from public, anon;
grant execute on function public.my_dms() to authenticated;

-- Only the team can mark a member as under 18 (extends the earlier guard)
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
    if (new.muted_until is distinct from old.muted_until or new.under_18 is distinct from old.under_18) and not public.is_team() then
      raise exception 'Only the team can change this';
    end if;
    if (new.id is distinct from old.id or new.email is distinct from old.email
        or new.lead_id is distinct from old.lead_id) and not public.is_team() then
      raise exception 'Not allowed';
    end if;
  end if;
  return new;
end $$;
