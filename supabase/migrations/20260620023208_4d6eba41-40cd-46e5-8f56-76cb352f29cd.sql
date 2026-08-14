CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  national_id text,
  phone text NOT NULL,
  email text,
  province text,
  insurance_type text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.damage_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  policy_number text,
  accident_date text,
  description text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;

GRANT SELECT, INSERT ON public.damage_reports TO anon;
GRANT SELECT, INSERT ON public.damage_reports TO authenticated;
GRANT ALL ON public.damage_reports TO service_role;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.damage_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact messages"
  ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can view all contact messages"
  ON public.contact_messages FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can insert damage reports"
  ON public.damage_reports FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can view all damage reports"
  ON public.damage_reports FOR SELECT TO authenticated USING (true);