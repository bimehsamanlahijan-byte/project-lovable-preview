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
  ('ai_assistant', '{"model":"google/gemini-3.6-flash","enabled":true,"title":"دستیار هوشمند بیمه سامان","welcome":"سلام! درباره انواع بیمه‌های سامان، شرایط و مدارک از من بپرسید.","systemPrompt":"شما دستیار هوشمند نمایندگی آذرخش بیمه سامان هستید. فقط به فارسی و مؤدبانه پاسخ دهید. تنها بر اساس دانش تأییدشده پاسخ دهید و اگر اطلاعاتی ندارید صادقانه بگویید و کاربر را به مشاوره تلفنی راهنمایی کنید. هرگز نرخ یا شرط قطعی اعلام نکنید مگر در دانش تأییدشده آمده باشد.","temperature":0.4}'::jsonb),
  ('live_chat', '{"enabled":true,"title":"چت روم آنلاین","welcome":"به چت روم آنلاین نمایندگی آذرخش خوش آمدید."}'::jsonb),
  ('docs_intake', '{"enabled":true,"title":"ارسال مدارک بیمه","maxSizeMb":10,"acceptedTypes":"image/*,application/pdf"}'::jsonb);

INSERT INTO public.document_categories (label, position) VALUES
  ('بیمه شخص ثالث', 1), ('بیمه بدنه', 2), ('بیمه عمر و سرمایه‌گذاری', 3),
  ('بیمه درمان تکمیلی', 4), ('بیمه آتش‌سوزی', 5), ('بیمه مسئولیت', 6), ('سایر مدارک', 7);

INSERT INTO public.ai_knowledge (title, content, tags, position) VALUES
  ('معرفی نمایندگی', 'نمایندگی آذرخش بیمه سامان ارائه‌دهنده انواع بیمه‌های اشخاص، اموال و مسئولیت است. مشاوره رایگان و صدور آنلاین بیمه‌نامه از خدمات اصلی ماست.', 'معرفی,نمایندگی', 1),
  ('مدارک بیمه شخص ثالث', 'برای صدور بیمه شخص ثالث: کارت خودرو یا سند، کارت ملی مالک و بیمه‌نامه قبلی (در صورت وجود) لازم است.', 'ثالث,مدارک', 2);