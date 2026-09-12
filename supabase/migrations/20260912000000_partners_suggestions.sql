-- Partners (marketers/referrers) automation + suggestions/criticism box

-- 1) Partners of team 8452
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  full_name text not null,
  commission_percent numeric(5,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

grant select on public.partners to anon;
grant select on public.partners to authenticated;
grant all on public.partners to service_role;

alter table public.partners enable row level security;

-- Public read is limited by the API layer (lookup by code); keep table readable
-- so the stats endpoint can resolve a partner by its public code.
create policy "Partners readable by code lookup"
  on public.partners for select to anon using (true);
create policy "Partners readable by authenticated"
  on public.partners for select to authenticated using (true);

-- 2) Sales recorded per partner and per insurance branch
create table if not exists public.partner_sales (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  insurance_branch text not null,
  policy_type text not null default '',
  amount bigint not null default 0,
  sold_at timestamptz not null default now()
);

grant select on public.partner_sales to anon;
grant select on public.partner_sales to authenticated;
grant all on public.partner_sales to service_role;

alter table public.partner_sales enable row level security;

create policy "Partner sales readable for stats"
  on public.partner_sales for select to anon using (true);
create policy "Partner sales readable by authenticated"
  on public.partner_sales for select to authenticated using (true);

-- 3) Suggestions & criticism inbox (only receipt date/time surface in the panel)
create table if not exists public.suggestions (
  id uuid primary key default gen_random_uuid(),
  tracking_id bigint generated always as identity,
  full_name text not null,
  phone text not null,
  category text not null default 'suggestion',
  message text not null,
  received_at timestamptz not null default now()
);

grant select on public.suggestions to authenticated;
grant all on public.suggestions to service_role;

alter table public.suggestions enable row level security;

-- No anon policies: submissions arrive only through the server route (service role).

-- Demo rows so the partner dashboard works out of the box
insert into public.partners (code, full_name, commission_percent) values
  ('8452-001', 'همکار نمونه اول', 12.5),
  ('8452-002', 'همکار نمونه دوم', 10)
on conflict (code) do nothing;

insert into public.partner_sales (partner_id, insurance_branch, policy_type, amount, sold_at)
select p.id, v.branch, v.ptype, v.amount, now() - (v.days || ' days')::interval
from public.partners p
join (values
  ('8452-001', 'بیمه آتش‌سوزی', 'بیمه منازل مسکونی', 45000000, 3),
  ('8452-001', 'بیمه اتومبیل', 'بیمه شخص ثالث', 18000000, 6),
  ('8452-001', 'بیمه اتومبیل', 'بیمه بدنه', 32000000, 9),
  ('8452-001', 'بیمه درمان', 'بیمه درمان خانواده', 75000000, 12),
  ('8452-002', 'بیمه زندگی', 'بیمه عمر و سرمایه‌گذاری', 120000000, 4),
  ('8452-002', 'بیمه مسافرتی', 'بیمه مسافرتی خارجی', 9500000, 8)
) as v(code, branch, ptype, amount, days) on v.code = p.code;
