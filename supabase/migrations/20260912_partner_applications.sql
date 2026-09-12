-- درخواست‌های عضویت تیم ۸۴۵۲
create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  request_key uuid not null unique,
  form_nonce uuid not null,
  current_post_id bigint,
  fullname text not null,
  birth_date text not null,
  national_id text not null,
  province text not null,
  city text not null,
  mobile text not null,
  insurance_experience text not null,
  type_cooperation text,
  company_name text,
  description text,
  page_url text,
  referrer text,
  user_agent text,
  ip_hash text,
  status text not null default 'new'
    check (status in ('new','reviewing','approved','rejected','contacted')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_partner_applications_created_at
  on public.partner_applications (created_at desc);

create index if not exists idx_partner_applications_status
  on public.partner_applications (status);

create index if not exists idx_partner_applications_mobile
  on public.partner_applications (mobile);

alter table public.partner_applications enable row level security;

-- Public/browser clients must not read applications.
revoke all on public.partner_applications from anon, authenticated;

-- Server-side service_role is the only writer/reader.
grant all on public.partner_applications to service_role;

create or replace function public.set_partner_application_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_partner_applications_updated
  on public.partner_applications;

create trigger trg_partner_applications_updated
before update on public.partner_applications
for each row
execute function public.set_partner_application_updated_at();
