
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

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_menu_updated BEFORE UPDATE ON public.site_menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_fs_updated BEFORE UPDATE ON public.site_footer_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_fl_updated BEFORE UPDATE ON public.site_footer_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
