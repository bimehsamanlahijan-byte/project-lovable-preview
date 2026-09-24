-- Independent, controllable knowledge sources for the site assistant.
-- Each row is an official Saman Insurance page (or any approved source) that the
-- dashboard can refresh; the refresh writes a summarised entry into ai_knowledge.

CREATE TABLE IF NOT EXISTS public.ai_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  branch text,
  is_active boolean NOT NULL DEFAULT true,
  auto_approve boolean NOT NULL DEFAULT true,
  interval_hours integer NOT NULL DEFAULT 168,
  position integer NOT NULL DEFAULT 0,
  last_synced_at timestamptz,
  last_status text,
  last_error text,
  last_chars integer,
  knowledge_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.ai_sources TO authenticated;
GRANT ALL ON public.ai_sources TO service_role;

ALTER TABLE public.ai_sources ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_sources' AND policyname = 'ai sources auth read') THEN
    CREATE POLICY "ai sources auth read" ON public.ai_sources
      FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ai_sources_active ON public.ai_sources (is_active, position);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column')
     AND NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_ai_sources_updated') THEN
    CREATE TRIGGER trg_ai_sources_updated BEFORE UPDATE ON public.ai_sources
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Starter list of official Saman Insurance product pages (editable in the dashboard).
INSERT INTO public.ai_sources (title, url, branch, position)
SELECT * FROM (VALUES
  ('صفحه اصلی بیمه سامان', 'https://www.samaninsurance.ir/', NULL, 1),
  ('بیمه درمان تکمیلی سامان', 'https://www.samaninsurance.ir/insurance/health', 'درمان تکمیلی', 2),
  ('بیمه عمر و تشکیل سرمایه سامان', 'https://www.samaninsurance.ir/insurance/life', 'عمر و تشکیل سرمایه', 3),
  ('بیمه شخص ثالث سامان', 'https://www.samaninsurance.ir/insurance/third-party', 'شخص ثالث', 4),
  ('بیمه بدنه خودرو سامان', 'https://www.samaninsurance.ir/insurance/car-body', 'بدنه خودرو', 5),
  ('بیمه آتش‌سوزی سامان', 'https://www.samaninsurance.ir/insurance/fire', 'آتش‌سوزی', 6),
  ('بیمه مسئولیت سامان', 'https://www.samaninsurance.ir/insurance/liability', 'مسئولیت', 7),
  ('بیمه مسافرتی سامان', 'https://www.samaninsurance.ir/insurance/travel', 'مسافرتی', 8)
) AS seed(title, url, branch, position)
WHERE NOT EXISTS (SELECT 1 FROM public.ai_sources);
