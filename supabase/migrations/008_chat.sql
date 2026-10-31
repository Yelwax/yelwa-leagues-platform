alter table public.profiles add column muted_until timestamptz;

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('pod', 'community')),
  pod_id uuid unique references public.pods(id) on delete cascade,
  name text not null
);
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  sender_name text not null default '',
  body text not null,
  reply_to uuid references public.messages(id) on delete set null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (deleted_at is not null or char_length(body) between 1 and 2000)
);
create index messages_room_time on public.messages (room_id, created_at desc);
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id),
  reason text,
  context jsonb not null,
  status text not null default 'open' check (status in ('open', 'reviewed')),
  created_at timestamptz not null default now()
);
create table public.room_reads (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  room_id uuid not null references public.rooms(id) on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (profile_id, room_id)
);
alter table public.rooms enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;
alter table public.room_reads enable row level security;

-- Who can enter which room. The team is NOT in pod rooms, only in the community room.
create or replace function public.can_access_room(p_room uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.rooms r where r.id = p_room and (
      (r.type = 'community' and public.my_role() in ('owner', 'team', 'tutor', 'student'))
      or (r.type = 'pod' and r.pod_id in (select public.my_pod_ids()))))
$$;
create or replace function public.can_post(p_room uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.can_access_room(p_room)
    and (not exists (select 1 from public.rooms where id = p_room and type = 'community')
         or not exists (select 1 from public.profiles where id = auth.uid() and muted_until > now()))
$$;
create or replace function public.is_room_moderator(p_room uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.rooms r where r.id = p_room and (
      (r.type = 'pod' and exists (select 1 from public.pods p where p.id = r.pod_id and p.tutor_id = auth.uid()))
      or (r.type = 'community' and public.is_team())))
$$;

create policy "Enter your rooms" on public.rooms for select to authenticated using (public.can_access_room(id));
create policy "Read room messages" on public.messages for select to authenticated using (public.can_access_room(room_id));
create policy "Post messages" on public.messages for insert to authenticated
  with check (sender_id = auth.uid() and public.can_post(room_id));
create policy "Delete messages" on public.messages for update to authenticated
  using (sender_id = auth.uid() or public.is_room_moderator(room_id))
  with check (sender_id = auth.uid() or public.is_room_moderator(room_id));
create policy "Own read markers" on public.room_reads for all to authenticated
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "Team reads reports" on public.reports for select to authenticated using (public.is_team());
create policy "Team updates reports" on public.reports for update to authenticated
  using (public.is_team()) with check (public.is_team());

-- Name stamp and flood limit (no more than 5 messages in 10 seconds)
create or replace function public.before_message_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.messages where sender_id = new.sender_id and created_at > now() - interval '10 seconds') >= 5 then
    raise exception 'Slow down: too many messages';
  end if;
  new.sender_name := coalesce((select full_name from public.profiles where id = new.sender_id), '');
  return new;
end $$;
create trigger messages_before_insert before insert on public.messages
  for each row execute function public.before_message_insert();

-- Messages can only be soft-deleted, never edited
create or replace function public.guard_message_update() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.room_id is distinct from old.room_id or new.sender_id is distinct from old.sender_id
     or new.created_at is distinct from old.created_at or new.reply_to is distinct from old.reply_to
     or (new.deleted_at is null and new.body is distinct from old.body) then
    raise exception 'Messages can only be deleted';
  end if;
  return new;
end $$;
create trigger messages_guard_update before update on public.messages
  for each row execute function public.guard_message_update();

-- Reporting: saves the message plus the ten before it; only the team can read reports
create or replace function public.report_message(p_message uuid, p_reason text) returns void
language plpgsql security definer set search_path = '' as $$
declare m record; r record; ctx jsonb;
begin
  select * into m from public.messages where id = p_message;
  if not found or not public.can_access_room(m.room_id) then raise exception 'Not allowed'; end if;
  select type, name into r from public.rooms where id = m.room_id;
  select jsonb_build_object('room_type', r.type, 'room_name', r.name, 'reported_id', m.id,
    'reported_sender_id', m.sender_id,
    'messages', coalesce(jsonb_agg(jsonb_build_object('id', x.id, 'sender_name', x.sender_name,
      'body', x.body, 'created_at', x.created_at) order by x.created_at), '[]'::jsonb))
  into ctx
  from (select * from public.messages where room_id = m.room_id and created_at <= m.created_at
        order by created_at desc limit 11) x;
  insert into public.reports (message_id, reporter_id, reason, context)
  values (p_message, auth.uid(), left(coalesce(p_reason, ''), 300), ctx);
end $$;
revoke all on function public.report_message(uuid, text) from public, anon;
grant execute on function public.report_message(uuid, text) to authenticated;

-- A room for every pod (new and existing), and one community room
create or replace function public.create_pod_room() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.rooms (type, pod_id, name) values ('pod', new.id, new.name);
  return new;
end $$;
create trigger pod_room_on_insert after insert on public.pods
  for each row execute function public.create_pod_room();
insert into public.rooms (type, name) values ('community', 'Community');
insert into public.rooms (type, pod_id, name) select 'pod', id, name from public.pods;

-- Only the team may change a mute (extends the earlier guard)
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
    if new.muted_until is distinct from old.muted_until and not public.is_team() then
      raise exception 'Only the team can mute';
    end if;
    if (new.id is distinct from old.id or new.email is distinct from old.email
        or new.lead_id is distinct from old.lead_id) and not public.is_team() then
      raise exception 'Not allowed';
    end if;
  end if;
  return new;
end $$;

-- Live updates
alter publication supabase_realtime add table public.messages;
