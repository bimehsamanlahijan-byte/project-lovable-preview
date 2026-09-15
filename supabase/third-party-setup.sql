-- ============================================================
-- جداول بیمه شخص ثالث (فروش آنلاین) — یک‌بار در دیتابیس اجرا شود
-- ============================================================

create table if not exists public.third_party_customers (
    customer_id uuid primary key default gen_random_uuid(),
    national_code text not null unique,
    mobile text,
    birth_date text,
    postal_code text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

grant select, insert, update on public.third_party_customers to authenticated;
grant all on public.third_party_customers to service_role;

alter table public.third_party_customers enable row level security;

create table if not exists public.third_party_inquiries (
    inquiry_id uuid primary key default gen_random_uuid(),
    customer_id uuid references public.third_party_customers(customer_id) on delete set null,
    tracking_code text not null unique,
    status text not null default 'started',
    request_payload jsonb,
    vehicle_data jsonb,
    previous_insurance_data jsonb,
    quote_data jsonb,
    full_summary jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists third_party_inquiries_customer_idx
    on public.third_party_inquiries (customer_id);
create index if not exists third_party_inquiries_tracking_idx
    on public.third_party_inquiries (tracking_code);

grant select, insert, update on public.third_party_inquiries to authenticated;
grant all on public.third_party_inquiries to service_role;

alter table public.third_party_inquiries enable row level security;

-- ---- به‌روزرسانی: ثبت همهٔ تلاش‌های خرید (حتی ناقص یا ناموفق) ----
alter table public.third_party_inquiries
    add column if not exists reference_code text,
    add column if not exists si24_tracking_code text,
    add column if not exists error_message text;

create unique index if not exists third_party_inquiries_reference_idx
    on public.third_party_inquiries (reference_code);
