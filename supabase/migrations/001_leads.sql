create table public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  whatsapp text not null,
  consent boolean not null default false,
  source text not null default 'brochure',
  created_at timestamptz not null default now()
);
create unique index leads_email_unique on public.leads (lower(email));
alter table public.leads enable row level security;
create policy "Anyone can submit a lead" on public.leads
  for insert to anon, authenticated with check (consent = true);
