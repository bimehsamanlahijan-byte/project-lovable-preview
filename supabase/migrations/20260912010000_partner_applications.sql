-- Sales cooperation applications (درخواست همکاری در فروش)

create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id text not null,
  full_name text not null,
  national_id text not null,
  birth_year text not null default '',
  gender text not null default 'male',
  phone text not null,
  email text not null default '',
  province text not null default '',
  city text not null default '',
  address text not null default '',
  education text not null default '',
  field_of_study text not null default '',
  experience text not null default '',
  insurance_license text not null default 'no',
  cooperation_type text not null default '',
  branches text[] not null default '{}',
  monthly_target text not null default '',
  description text not null default '',
  status text not null default 'new',
  received_at timestamptz not null default now()
);

create index if not exists partner_applications_received_at_idx
  on public.partner_applications (received_at desc);

grant select on public.partner_applications to authenticated;
grant all on public.partner_applications to service_role;

alter table public.partner_applications enable row level security;

-- No anon policies: submissions arrive only through the server route (service role).
