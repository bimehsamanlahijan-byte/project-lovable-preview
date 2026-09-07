-- ساخت کامل دیتابیس سایت بیمه سامان لاهیجان
-- این فایل را در سوپابیس شخصی خود، بخش SQL Editor، بچسبانید و Run بزنید.
-- اجرای دوباره‌اش هم مشکلی ایجاد نمی‌کند.

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

DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can insert contact messages"
  ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users can view all contact messages" ON public.contact_messages;
CREATE POLICY "Authenticated users can view all contact messages"
  ON public.contact_messages FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Anyone can insert damage reports" ON public.damage_reports;
CREATE POLICY "Anyone can insert damage reports"
  ON public.damage_reports FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users can view all damage reports" ON public.damage_reports;
CREATE POLICY "Authenticated users can view all damage reports"
  ON public.damage_reports FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "damage auth update" ON public.damage_reports;
CREATE POLICY "damage auth update" ON public.damage_reports FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "damage auth delete" ON public.damage_reports;
CREATE POLICY "damage auth delete" ON public.damage_reports FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE IF NOT EXISTS public.site_menu_items (
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
DROP POLICY IF EXISTS "menu public read" ON public.site_menu_items;
CREATE POLICY "menu public read" ON public.site_menu_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "menu auth write" ON public.site_menu_items;
CREATE POLICY "menu auth write" ON public.site_menu_items FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "menu auth update" ON public.site_menu_items;
CREATE POLICY "menu auth update" ON public.site_menu_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "menu auth delete" ON public.site_menu_items;
CREATE POLICY "menu auth delete" ON public.site_menu_items FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.site_footer_sections (
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
DROP POLICY IF EXISTS "fs public read" ON public.site_footer_sections;
CREATE POLICY "fs public read" ON public.site_footer_sections FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "fs auth insert" ON public.site_footer_sections;
CREATE POLICY "fs auth insert" ON public.site_footer_sections FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "fs auth update" ON public.site_footer_sections;
CREATE POLICY "fs auth update" ON public.site_footer_sections FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "fs auth delete" ON public.site_footer_sections;
CREATE POLICY "fs auth delete" ON public.site_footer_sections FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.site_footer_links (
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
DROP POLICY IF EXISTS "fl public read" ON public.site_footer_links;
CREATE POLICY "fl public read" ON public.site_footer_links FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "fl auth insert" ON public.site_footer_links;
CREATE POLICY "fl auth insert" ON public.site_footer_links FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "fl auth update" ON public.site_footer_links;
CREATE POLICY "fl auth update" ON public.site_footer_links FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "fl auth delete" ON public.site_footer_links;
CREATE POLICY "fl auth delete" ON public.site_footer_links FOR DELETE TO authenticated USING (true);

CREATE TRIGGER trg_menu_updated BEFORE UPDATE ON public.site_menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_fs_updated BEFORE UPDATE ON public.site_footer_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_fl_updated BEFORE UPDATE ON public.site_footer_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "settings public read" ON public.site_settings;
CREATE POLICY "settings public read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "settings auth insert" ON public.site_settings;
CREATE POLICY "settings auth insert" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "settings auth update" ON public.site_settings;
CREATE POLICY "settings auth update" ON public.site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "settings auth delete" ON public.site_settings;
CREATE POLICY "settings auth delete" ON public.site_settings FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.social_links (
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
DROP POLICY IF EXISTS "social public read" ON public.social_links;
CREATE POLICY "social public read" ON public.social_links FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "social auth insert" ON public.social_links;
CREATE POLICY "social auth insert" ON public.social_links FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "social auth update" ON public.social_links;
CREATE POLICY "social auth update" ON public.social_links FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "social auth delete" ON public.social_links;
CREATE POLICY "social auth delete" ON public.social_links FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.ai_knowledge (
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
DROP POLICY IF EXISTS "kb public read" ON public.ai_knowledge;
CREATE POLICY "kb public read" ON public.ai_knowledge FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "kb auth insert" ON public.ai_knowledge;
CREATE POLICY "kb auth insert" ON public.ai_knowledge FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "kb auth update" ON public.ai_knowledge;
CREATE POLICY "kb auth update" ON public.ai_knowledge FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "kb auth delete" ON public.ai_knowledge;
CREATE POLICY "kb auth delete" ON public.ai_knowledge FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.chat_room_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT 'مهمان',
  body TEXT NOT NULL,
  is_staff BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_chat_room_messages_created ON public.chat_room_messages (created_at DESC);
GRANT SELECT, INSERT ON public.chat_room_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_room_messages TO authenticated;
GRANT ALL ON public.chat_room_messages TO service_role;
ALTER TABLE public.chat_room_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "chat public read" ON public.chat_room_messages;
CREATE POLICY "chat public read" ON public.chat_room_messages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "chat public insert" ON public.chat_room_messages;
CREATE POLICY "chat public insert" ON public.chat_room_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "chat auth delete" ON public.chat_room_messages;
CREATE POLICY "chat auth delete" ON public.chat_room_messages FOR DELETE TO authenticated USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_room_messages;

CREATE TABLE IF NOT EXISTS public.document_categories (
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
DROP POLICY IF EXISTS "doccat public read" ON public.document_categories;
CREATE POLICY "doccat public read" ON public.document_categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "doccat auth insert" ON public.document_categories;
CREATE POLICY "doccat auth insert" ON public.document_categories FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "doccat auth update" ON public.document_categories;
CREATE POLICY "doccat auth update" ON public.document_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "doccat auth delete" ON public.document_categories;
CREATE POLICY "doccat auth delete" ON public.document_categories FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.customer_documents (
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
DROP POLICY IF EXISTS "docs public insert" ON public.customer_documents;
CREATE POLICY "docs public insert" ON public.customer_documents FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "docs auth read" ON public.customer_documents;
CREATE POLICY "docs auth read" ON public.customer_documents FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "docs auth update" ON public.customer_documents;
CREATE POLICY "docs auth update" ON public.customer_documents FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "docs auth delete" ON public.customer_documents;
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

DROP POLICY IF EXISTS "cust docs public upload" ON storage.objects;
CREATE POLICY "cust docs public upload" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'customer-documents');
DROP POLICY IF EXISTS "cust docs staff read" ON storage.objects;
CREATE POLICY "cust docs staff read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'customer-documents');
DROP POLICY IF EXISTS "cust docs staff update" ON storage.objects;
CREATE POLICY "cust docs staff update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'customer-documents') WITH CHECK (bucket_id = 'customer-documents');
DROP POLICY IF EXISTS "cust docs staff delete" ON storage.objects;
CREATE POLICY "cust docs staff delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'customer-documents');
DROP POLICY IF EXISTS "site assets staff read" ON storage.objects;
CREATE POLICY "site assets staff read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'site-assets');
DROP POLICY IF EXISTS "site assets staff write" ON storage.objects;
CREATE POLICY "site assets staff write" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-assets');
DROP POLICY IF EXISTS "site assets staff update" ON storage.objects;
CREATE POLICY "site assets staff update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-assets') WITH CHECK (bucket_id = 'site-assets');
DROP POLICY IF EXISTS "site assets staff delete" ON storage.objects;
CREATE POLICY "site assets staff delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-assets');

CREATE TABLE IF NOT EXISTS public.telegram_bots (
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
DROP POLICY IF EXISTS "tgbot auth read" ON public.telegram_bots;
CREATE POLICY "tgbot auth read" ON public.telegram_bots FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "tgbot auth insert" ON public.telegram_bots;
CREATE POLICY "tgbot auth insert" ON public.telegram_bots FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "tgbot auth update" ON public.telegram_bots;
CREATE POLICY "tgbot auth update" ON public.telegram_bots FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "tgbot auth delete" ON public.telegram_bots;
CREATE POLICY "tgbot auth delete" ON public.telegram_bots FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.telegram_flows (
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
DROP POLICY IF EXISTS "tgflow auth read" ON public.telegram_flows;
CREATE POLICY "tgflow auth read" ON public.telegram_flows FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "tgflow auth insert" ON public.telegram_flows;
CREATE POLICY "tgflow auth insert" ON public.telegram_flows FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "tgflow auth update" ON public.telegram_flows;
CREATE POLICY "tgflow auth update" ON public.telegram_flows FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "tgflow auth delete" ON public.telegram_flows;
CREATE POLICY "tgflow auth delete" ON public.telegram_flows FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.telegram_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id UUID REFERENCES public.telegram_flows(id) ON DELETE CASCADE,
  bot_id UUID REFERENCES public.telegram_bots(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'ok',
  message TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_telegram_runs_created ON public.telegram_runs (created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.telegram_runs TO authenticated;
GRANT ALL ON public.telegram_runs TO service_role;
ALTER TABLE public.telegram_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tgrun auth read" ON public.telegram_runs;
CREATE POLICY "tgrun auth read" ON public.telegram_runs FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "tgrun auth insert" ON public.telegram_runs;
CREATE POLICY "tgrun auth insert" ON public.telegram_runs FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "tgrun auth update" ON public.telegram_runs;
CREATE POLICY "tgrun auth update" ON public.telegram_runs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "tgrun auth delete" ON public.telegram_runs;
CREATE POLICY "tgrun auth delete" ON public.telegram_runs FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.telegram_updates (
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
DROP POLICY IF EXISTS "tgupd auth read" ON public.telegram_updates;
CREATE POLICY "tgupd auth read" ON public.telegram_updates FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "tgupd auth insert" ON public.telegram_updates;
CREATE POLICY "tgupd auth insert" ON public.telegram_updates FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "tgupd auth update" ON public.telegram_updates;
CREATE POLICY "tgupd auth update" ON public.telegram_updates FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "tgupd auth delete" ON public.telegram_updates;
CREATE POLICY "tgupd auth delete" ON public.telegram_updates FOR DELETE TO authenticated USING (true);

CREATE TRIGGER trg_tgbot_updated BEFORE UPDATE ON public.telegram_bots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_tgflow_updated BEFORE UPDATE ON public.telegram_flows FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Private admin settings (service-role only; never exposed to browsers)
CREATE TABLE IF NOT EXISTS public.admin_private_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.admin_private_settings TO service_role;
ALTER TABLE public.admin_private_settings ENABLE ROW LEVEL SECURITY;
-- no policies: only service_role (which bypasses RLS) may touch this table

-- Roles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

DROP POLICY IF EXISTS "users read own roles" ON public.user_roles;
CREATE POLICY "users read own roles" ON public.user_roles
FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "users read own roles" ON public.user_roles;
CREATE POLICY "users read own roles" ON public.user_roles
FOR SELECT TO authenticated USING (user_id = auth.uid());

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;


-- فضای ذخیره‌سازی فایل‌ها
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true), ('customer-documents', 'customer-documents', false)
ON CONFLICT (id) DO NOTHING;

-- محتوای فعلی سایت
DELETE FROM public.social_links;

INSERT INTO public.social_links (id, platform, label, username, url, icon_key, custom_icon_url, size_px, position, is_active, created_at, updated_at) VALUES
  ('793dc408-dab9-434b-8f6c-d385bc8cf55e', 'telegram', 'تلگرام', '@azarakhsh_saman', 'https://t.me/azarakhsh_saman', 'telegram', NULL, 40, 1, true, '2026-08-14T15:52:48.08082+00:00', '2026-08-14T15:52:48.08082+00:00'),
  ('ec33a054-d87f-4b13-b35b-65cc15253b9c', 'whatsapp', 'واتساپ', '09123456789', 'https://wa.me/989123456789', 'whatsapp', NULL, 40, 2, true, '2026-08-14T15:52:48.08082+00:00', '2026-08-14T15:52:48.08082+00:00'),
  ('b3d0e3f5-fe27-49c1-88f2-f9a6eb6491aa', 'instagram', 'اینستاگرام', 'azarakhsh.saman', 'https://instagram.com/azarakhsh.saman', 'instagram', NULL, 40, 3, true, '2026-08-14T15:52:48.08082+00:00', '2026-08-14T15:52:48.08082+00:00'),
  ('ac11fe9c-3073-48b8-894f-b76977f2224e', 'eitaa', 'ایتا', '@azarakhsh_saman', 'https://eitaa.com/azarakhsh_saman', 'eitaa', NULL, 40, 4, true, '2026-08-14T15:52:48.08082+00:00', '2026-08-14T15:52:48.08082+00:00'),
  ('e029cb84-e1ef-4cf5-bbc8-a9b508917a2a', 'bale', 'بله', '@azarakhsh_saman', 'https://ble.ir/azarakhsh_saman', 'bale', NULL, 40, 5, true, '2026-08-14T15:52:48.08082+00:00', '2026-08-14T15:52:48.08082+00:00'),
  ('9ae7cbec-14a2-4816-b059-41e9d2d69094', 'rubika', 'روبیکا', '@azarakhsh_saman', 'https://rubika.ir/azarakhsh_saman', 'rubika', NULL, 40, 6, true, '2026-08-14T15:52:48.08082+00:00', '2026-08-14T15:52:48.08082+00:00'),
  ('0a4fcfe4-cdaa-417a-8e31-2280cca554bf', 'soroush', 'سروش', '@azarakhsh_saman', 'https://splus.ir/azarakhsh_saman', 'soroush', NULL, 40, 7, true, '2026-08-14T15:52:48.08082+00:00', '2026-08-14T15:52:48.08082+00:00'),
  ('d4b9369f-7464-4437-8819-8a39d6b55f61', 'facebook', 'فیسبوک', 'azarakhsh.saman', 'https://facebook.com/azarakhsh.saman', 'facebook', NULL, 40, 8, true, '2026-08-14T15:52:48.08082+00:00', '2026-08-14T15:52:48.08082+00:00');

DELETE FROM public.ai_knowledge;

INSERT INTO public.ai_knowledge (id, title, content, tags, position, is_active, created_at, updated_at) VALUES
  ('e0850cf6-d1bd-4ecd-bc2a-bdf43c835eaa', 'معرفی نمایندگی', 'نمایندگی آذرخش بیمه سامان ارائه‌دهنده انواع بیمه‌های اشخاص، اموال و مسئولیت است. مشاوره رایگان و صدور آنلاین بیمه‌نامه از خدمات اصلی ماست.', 'معرفی,نمایندگی', 1, true, '2026-08-14T15:52:48.08082+00:00', '2026-08-14T15:52:48.08082+00:00'),
  ('c00f6279-6e6b-41fa-81b9-952647996666', 'مدارک بیمه شخص ثالث', 'برای صدور بیمه شخص ثالث: کارت خودرو یا سند، کارت ملی مالک و بیمه‌نامه قبلی (در صورت وجود) لازم است.', 'ثالث,مدارک', 2, true, '2026-08-14T15:52:48.08082+00:00', '2026-08-14T15:52:48.08082+00:00');

DELETE FROM public.document_categories;

INSERT INTO public.document_categories (id, label, position, is_active, created_at, updated_at) VALUES
  ('a0da0a10-3f43-4db7-a81e-138fb05f2b02', 'بیمه شخص ثالث', 1, true, '2026-08-14T15:52:48.08082+00:00', '2026-08-14T15:52:48.08082+00:00'),
  ('26f14b12-36d3-44fc-8e01-8a49bd6a51a5', 'بیمه بدنه', 2, true, '2026-08-14T15:52:48.08082+00:00', '2026-08-14T15:52:48.08082+00:00'),
  ('f9a05ede-e218-4ff5-b485-bf6e5b569a39', 'بیمه عمر و سرمایه‌گذاری', 3, true, '2026-08-14T15:52:48.08082+00:00', '2026-08-14T15:52:48.08082+00:00'),
  ('7f14921b-3208-49b3-9075-99c287e4ccc0', 'بیمه درمان تکمیلی', 4, true, '2026-08-14T15:52:48.08082+00:00', '2026-08-14T15:52:48.08082+00:00'),
  ('c31b40b0-b370-42c8-97c2-798e60b692d9', 'بیمه آتش‌سوزی', 5, true, '2026-08-14T15:52:48.08082+00:00', '2026-08-14T15:52:48.08082+00:00'),
  ('3fca70c1-5aeb-4954-832a-8bc9682c188b', 'بیمه مسئولیت', 6, true, '2026-08-14T15:52:48.08082+00:00', '2026-08-14T15:52:48.08082+00:00'),
  ('463a5b96-9cb0-460e-9eb2-9df6c25827ee', 'سایر مدارک', 7, true, '2026-08-14T15:52:48.08082+00:00', '2026-08-14T15:52:48.08082+00:00');

INSERT INTO public.chat_room_messages (id, session_id, display_name, body, is_staff, created_at) VALUES
  ('fd509d37-08a0-4596-9b69-ca600e81d231', '4c7m4mdz4rwmtk6yuvk', 'مهمان', 'سلام', false, '2026-09-03T16:56:50.945682+00:00'),
  ('8a28ecee-a102-4c1c-838b-884a73b89343', '4c7m4mdz4rwmtk6yuvk', 'مهمان', 'حالتون خوبه', false, '2026-09-05T05:55:14.79393+00:00')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.site_settings (key, value) VALUES
  ('social_layout', '{"gap": 12, "align": "start", "shape": "circle", "layout": "row", "showLabels": false, "showUsernames": true}'::jsonb),
  ('ai_assistant', '{"model": "google/gemini-3.6-flash", "title": "دستیار هوشمند بیمه سامان", "enabled": true, "welcome": "سلام! درباره انواع بیمه‌های سامان، شرایط و مدارک از من بپرسید.", "temperature": 0.4, "systemPrompt": "شما دستیار هوشمند نمایندگی آذرخش بیمه سامان هستید. فقط به فارسی و مؤدبانه پاسخ دهید."}'::jsonb),
  ('live_chat', '{"title": "چت روم آنلاین", "enabled": true, "welcome": "به چت روم آنلاین نمایندگی آذرخش خوش آمدید."}'::jsonb),
  ('docs_intake', '{"title": "ارسال مدارک بیمه", "enabled": true, "maxSizeMb": 10, "acceptedTypes": "image/*,application/pdf"}'::jsonb),
  ('hero_slider', '{"fit": "cover", "loop": true, "ratioH": 360, "ratioW": 1200, "slides": [], "autoplay": true, "heightPx": 420, "autoplayMs": 3750, "heightMode": "ratio"}'::jsonb),
  ('wheel_intro', '{"float": true, "buttonX": 0, "buttonY": 0, "enabled": true, "hintText": "برای دیدن همه بیمه‌نامه‌ها کلیک کنید", "animation": "explode", "innerMode": "modal", "particles": true, "buttonText": "خرید آنلاین بیمه", "durationMs": 900, "innerLabel": "ارائه کلیه خدمات بیمه‌ای در سریع‌ترین زمان ممکن", "buttonScale": 1, "centerTitle": "بیمه‌نامه‌های سامان", "innerAnimMs": 500, "centerImageUrl": "", "centerSubtitle": "روی هر بیمه قرار بگیرید", "centerImageSize": 56}'::jsonb),
  ('visual_overrides', '{"map": {"body > div:nth-of-type(1) > header > div > div:nth-of-type(2) > nav > div:nth-of-type(5) > a": {"html": "انتقادات و پیشنهادات", "hover": {}, "style": {"color": "#001a00", "font-size": "14px", "text-align": "start", "font-family": "Vazirmatn, system-ui, sans-serif", "font-weight": "500"}, "hoverDeep": false}}}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
