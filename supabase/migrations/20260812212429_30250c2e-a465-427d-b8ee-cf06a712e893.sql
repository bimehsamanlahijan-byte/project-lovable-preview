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
GRANT SELECT, INSERT, UPDATE, DELETE ON public.damage_reports TO authenticated;
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
CREATE POLICY "damage auth update" ON public.damage_reports FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "damage auth delete" ON public.damage_reports FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.site_menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  href TEXT,
  parent_id UUID REFERENCES public.site_menu_items(id) ON DELETE CASCADE,
  position INT NOT NULL DEFAULT 0,
  device TEXT NOT NULL DEFAULT 'both',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_menu_items TO authenticated;
GRANT ALL ON public.site_menu_items TO service_role;
ALTER TABLE public.site_menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "menu public read" ON public.site_menu_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "menu auth write" ON public.site_menu_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "menu auth update" ON public.site_menu_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "menu auth delete" ON public.site_menu_items FOR DELETE TO authenticated USING (true);

CREATE TABLE public.site_footer_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_footer_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_footer_sections TO authenticated;
GRANT ALL ON public.site_footer_sections TO service_role;
ALTER TABLE public.site_footer_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fs public read" ON public.site_footer_sections FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "fs auth insert" ON public.site_footer_sections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "fs auth update" ON public.site_footer_sections FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "fs auth delete" ON public.site_footer_sections FOR DELETE TO authenticated USING (true);

CREATE TABLE public.site_footer_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.site_footer_sections(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_footer_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_footer_links TO authenticated;
GRANT ALL ON public.site_footer_links TO service_role;
ALTER TABLE public.site_footer_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fl public read" ON public.site_footer_links FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "fl auth insert" ON public.site_footer_links FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "fl auth update" ON public.site_footer_links FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "fl auth delete" ON public.site_footer_links FOR DELETE TO authenticated USING (true);

CREATE TRIGGER trg_menu_updated BEFORE UPDATE ON public.site_menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_fs_updated BEFORE UPDATE ON public.site_footer_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_fl_updated BEFORE UPDATE ON public.site_footer_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings auth insert" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "settings auth update" ON public.site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "settings auth delete" ON public.site_settings FOR DELETE TO authenticated USING (true);

CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  label TEXT NOT NULL,
  username TEXT,
  url TEXT NOT NULL,
  icon_key TEXT,
  custom_icon_url TEXT,
  size_px INT NOT NULL DEFAULT 40,
  position INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.social_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_links TO authenticated;
GRANT ALL ON public.social_links TO service_role;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "social public read" ON public.social_links FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "social auth insert" ON public.social_links FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "social auth update" ON public.social_links FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "social auth delete" ON public.social_links FOR DELETE TO authenticated USING (true);

CREATE TABLE public.ai_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT,
  position INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ai_knowledge TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_knowledge TO authenticated;
GRANT ALL ON public.ai_knowledge TO service_role;
ALTER TABLE public.ai_knowledge ENABLE ROW LEVEL SECURITY;
CREATE POLICY "kb public read" ON public.ai_knowledge FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "kb auth insert" ON public.ai_knowledge FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "kb auth update" ON public.ai_knowledge FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "kb auth delete" ON public.ai_knowledge FOR DELETE TO authenticated USING (true);

CREATE TABLE public.chat_room_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT 'مهمان',
  body TEXT NOT NULL,
  is_staff BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_chat_room_messages_created ON public.chat_room_messages (created_at DESC);
GRANT SELECT, INSERT ON public.chat_room_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_room_messages TO authenticated;
GRANT ALL ON public.chat_room_messages TO service_role;
ALTER TABLE public.chat_room_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chat public read" ON public.chat_room_messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "chat public insert" ON public.chat_room_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "chat auth delete" ON public.chat_room_messages FOR DELETE TO authenticated USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_room_messages;

CREATE TABLE public.document_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.document_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.document_categories TO authenticated;
GRANT ALL ON public.document_categories TO service_role;
ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "doccat public read" ON public.document_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "doccat auth insert" ON public.document_categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "doccat auth update" ON public.document_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "doccat auth delete" ON public.document_categories FOR DELETE TO authenticated USING (true);

CREATE TABLE public.customer_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  full_name TEXT,
  phone TEXT,
  category TEXT,
  note TEXT,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.customer_documents TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_documents TO authenticated;
GRANT ALL ON public.customer_documents TO service_role;
ALTER TABLE public.customer_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "docs public insert" ON public.customer_documents FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "docs auth read" ON public.customer_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "docs auth update" ON public.customer_documents FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "docs auth delete" ON public.customer_documents FOR DELETE TO authenticated USING (true);

CREATE TRIGGER trg_social_updated BEFORE UPDATE ON public.social_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_kb_updated BEFORE UPDATE ON public.ai_knowledge FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_doccat_updated BEFORE UPDATE ON public.document_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_docs_updated BEFORE UPDATE ON public.customer_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.social_links (platform, label, username, url, icon_key, size_px, position) VALUES
  ('telegram', 'تلگرام', '@azarakhsh_saman', 'https://t.me/azarakhsh_saman', 'telegram', 40, 1),
  ('whatsapp', 'واتساپ', '09123456789', 'https://wa.me/989123456789', 'whatsapp', 40, 2),
  ('instagram', 'اینستاگرام', 'azarakhsh.saman', 'https://instagram.com/azarakhsh.saman', 'instagram', 40, 3),
  ('eitaa', 'ایتا', '@azarakhsh_saman', 'https://eitaa.com/azarakhsh_saman', 'eitaa', 40, 4),
  ('bale', 'بله', '@azarakhsh_saman', 'https://ble.ir/azarakhsh_saman', 'bale', 40, 5),
  ('rubika', 'روبیکا', '@azarakhsh_saman', 'https://rubika.ir/azarakhsh_saman', 'rubika', 40, 6),
  ('soroush', 'سروش', '@azarakhsh_saman', 'https://splus.ir/azarakhsh_saman', 'soroush', 40, 7),
  ('facebook', 'فیسبوک', 'azarakhsh.saman', 'https://facebook.com/azarakhsh.saman', 'facebook', 40, 8);

INSERT INTO public.site_settings (key, value) VALUES
  ('social_layout', '{"layout":"row","align":"start","gap":12,"shape":"circle","showLabels":false,"showUsernames":true}'::jsonb),
  ('ai_assistant', '{"model":"google/gemini-3.6-flash","enabled":true,"title":"دستیار هوشمند بیمه سامان","welcome":"سلام! درباره انواع بیمه‌های سامان، شرایط و مدارک از من بپرسید.","systemPrompt":"شما دستیار هوشمند نمایندگی آذرخش بیمه سامان هستید. فقط به فارسی و مؤدبانه پاسخ دهید.","temperature":0.4}'::jsonb),
  ('live_chat', '{"enabled":true,"title":"چت روم آنلاین","welcome":"به چت روم آنلاین نمایندگی آذرخش خوش آمدید."}'::jsonb),
  ('docs_intake', '{"enabled":true,"title":"ارسال مدارک بیمه","maxSizeMb":10,"acceptedTypes":"image/*,application/pdf"}'::jsonb);

INSERT INTO public.document_categories (label, position) VALUES
  ('بیمه شخص ثالث', 1), ('بیمه بدنه', 2), ('بیمه عمر و سرمایه‌گذاری', 3),
  ('بیمه درمان تکمیلی', 4), ('بیمه آتش‌سوزی', 5), ('بیمه مسئولیت', 6), ('سایر مدارک', 7);

INSERT INTO public.ai_knowledge (title, content, tags, position) VALUES
  ('معرفی نمایندگی', 'نمایندگی آذرخش بیمه سامان ارائه‌دهنده انواع بیمه‌های اشخاص، اموال و مسئولیت است. مشاوره رایگان و صدور آنلاین بیمه‌نامه از خدمات اصلی ماست.', 'معرفی,نمایندگی', 1),
  ('مدارک بیمه شخص ثالث', 'برای صدور بیمه شخص ثالث: کارت خودرو یا سند، کارت ملی مالک و بیمه‌نامه قبلی (در صورت وجود) لازم است.', 'ثالث,مدارک', 2);

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
GRANT SELECT, INSERT, UPDATE, DELETE ON public.telegram_runs TO authenticated;
GRANT ALL ON public.telegram_runs TO service_role;
ALTER TABLE public.telegram_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tgrun auth read" ON public.telegram_runs FOR SELECT TO authenticated USING (true);
CREATE POLICY "tgrun auth insert" ON public.telegram_runs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "tgrun auth update" ON public.telegram_runs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "tgrun auth delete" ON public.telegram_runs FOR DELETE TO authenticated USING (true);

CREATE TABLE public.telegram_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID REFERENCES public.telegram_bots(id) ON DELETE CASCADE,
  update_id BIGINT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  chat_id BIGINT,
  from_user TEXT,
  text TEXT,
  raw JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (bot_id, update_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.telegram_updates TO authenticated;
GRANT ALL ON public.telegram_updates TO service_role;
ALTER TABLE public.telegram_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tgupd auth read" ON public.telegram_updates FOR SELECT TO authenticated USING (true);
CREATE POLICY "tgupd auth insert" ON public.telegram_updates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "tgupd auth update" ON public.telegram_updates FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "tgupd auth delete" ON public.telegram_updates FOR DELETE TO authenticated USING (true);

CREATE TRIGGER trg_tgbot_updated BEFORE UPDATE ON public.telegram_bots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_tgflow_updated BEFORE UPDATE ON public.telegram_flows FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();