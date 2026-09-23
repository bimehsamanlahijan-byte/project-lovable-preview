-- Central login system: site users, auth identities (provider based),
-- telegram users, per-module login requirements and login logs.
-- All access happens server-side with the service role; RLS is enabled and
-- no anon/authenticated policy is granted, so this data is never public.

create table if not exists public.site_users (
  id uuid primary key default gen_random_uuid(),
  display_name text,
  phone text,
  phone_consent_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists public.auth_identities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.site_users(id) on delete cascade,
  provider text not null,
  provider_user_id text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  last_login_at timestamptz,
  unique (provider, provider_user_id)
);
create index if not exists idx_auth_identities_user on public.auth_identities (user_id);

create table if not exists public.telegram_users (
  telegram_id bigint primary key,
  user_id uuid not null unique references public.site_users(id) on delete cascade,
  telegram_username text,
  first_name text,
  last_name text,
  phone_number text,
  profile_photo text,
  is_verified boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  last_login timestamptz
);

create table if not exists public.login_requirements (
  module_key text primary key,
  label text,
  mode text not null default 'none' check (mode in ('required', 'optional', 'none')),
  methods text[] not null default array['telegram']::text[],
  updated_at timestamptz not null default now()
);

create table if not exists public.login_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.site_users(id) on delete set null,
  login_method text,
  telegram_id bigint,
  module text,
  status text not null default 'success',
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists idx_login_logs_created on public.login_logs (created_at desc);

grant all on public.site_users to service_role;
grant all on public.auth_identities to service_role;
grant all on public.telegram_users to service_role;
grant all on public.login_requirements to service_role;
grant all on public.login_logs to service_role;

alter table public.site_users enable row level security;
alter table public.auth_identities enable row level security;
alter table public.telegram_users enable row level security;
alter table public.login_requirements enable row level security;
alter table public.login_logs enable row level security;

insert into public.login_requirements (module_key, label, mode, methods) values
  ('third_party', 'استعلام و خرید بیمه شخص ثالث', 'none', array['telegram']::text[]),
  ('inquiries', 'سایر استعلام‌ها', 'none', array['telegram']::text[]),
  ('ai_chat', 'چت هوش مصنوعی', 'none', array['telegram']::text[]),
  ('live_chat', 'چت آنلاین', 'none', array['telegram']::text[]),
  ('damage_report', 'اعلام خسارت', 'none', array['telegram']::text[]),
  ('documents', 'مخزن مدارک مشتریان', 'none', array['telegram']::text[])
on conflict (module_key) do nothing;
