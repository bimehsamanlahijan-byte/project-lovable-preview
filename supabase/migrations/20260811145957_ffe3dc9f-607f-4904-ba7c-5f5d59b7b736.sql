CREATE POLICY "cust docs public upload" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'customer-documents');
CREATE POLICY "cust docs staff read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'customer-documents');
CREATE POLICY "cust docs staff update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'customer-documents') WITH CHECK (bucket_id = 'customer-documents');
CREATE POLICY "cust docs staff delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'customer-documents');
CREATE POLICY "site assets staff read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'site-assets');
CREATE POLICY "site assets staff write" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-assets');
CREATE POLICY "site assets staff update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-assets') WITH CHECK (bucket_id = 'site-assets');
CREATE POLICY "site assets staff delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-assets');

CREATE TABLE public.telegram_bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bot_token TEXT NOT NULL,
  bot_username TEXT,
  webhook_secret TEXT,
  default_chat_ids TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.telegram_bots TO authenticated;
GRANT ALL ON public.telegram_bots TO service_role;
ALTER TABLE public.telegram_bots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tgbot auth read" ON public.telegram_bots FOR SELECT TO authenticated USING (true);
CREATE POLICY "tgbot auth insert" ON public.telegram_bots FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "tgbot auth update" ON public.telegram_bots FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "tgbot auth delete" ON public.telegram_bots FOR DELETE TO authenticated USING (true);

CREATE TABLE public.telegram_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID REFERENCES public.telegram_bots(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL DEFAULT 'manual',
  trigger_keyword TEXT,
  schedule_cron TEXT,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.telegram_flows TO authenticated;
GRANT ALL ON public.telegram_flows TO service_role;
ALTER TABLE public.telegram_flows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tgflow auth read" ON public.telegram_flows FOR SELECT TO authenticated USING (true);
CREATE POLICY "tgflow auth insert" ON public.telegram_flows FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "tgflow auth update" ON public.telegram_flows FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "tgflow auth delete" ON public.telegram_flows FOR DELETE TO authenticated USING (true);

CREATE TABLE public.telegram_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id UUID REFERENCES public.telegram_flows(id) ON DELETE CASCADE,
  bot_id UUID REFERENCES public.telegram_bots(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'ok',
  message TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_telegram_runs_created ON public.telegram_runs (created_at DESC);
GRANT SELECT, INSERT, DELETE ON public.telegram_runs TO authenticated;
GRANT ALL ON public.telegram_runs TO service_role;
ALTER TABLE public.telegram_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tgrun auth read" ON public.telegram_runs FOR SELECT TO authenticated USING (true);
CREATE POLICY "tgrun auth insert" ON public.telegram_runs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "tgrun auth delete" ON public.telegram_runs FOR DELETE TO authenticated USING (true);

CREATE TABLE public.telegram_updates (
  update_id BIGINT PRIMARY KEY,
  bot_id UUID REFERENCES public.telegram_bots(id) ON DELETE CASCADE,
  chat_id BIGINT,
  from_user TEXT,
  text TEXT,
  raw JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.telegram_updates TO authenticated;
GRANT ALL ON public.telegram_updates TO service_role;
ALTER TABLE public.telegram_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tgupd auth read" ON public.telegram_updates FOR SELECT TO authenticated USING (true);
CREATE POLICY "tgupd auth delete" ON public.telegram_updates FOR DELETE TO authenticated USING (true);

CREATE TRIGGER trg_tgbot_updated BEFORE UPDATE ON public.telegram_bots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_tgflow_updated BEFORE UPDATE ON public.telegram_flows FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();