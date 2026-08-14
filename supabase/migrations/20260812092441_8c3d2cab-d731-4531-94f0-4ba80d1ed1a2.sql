ALTER TABLE public.telegram_updates
  ADD COLUMN IF NOT EXISTS chat_id BIGINT,
  ADD COLUMN IF NOT EXISTS from_user TEXT,
  ADD COLUMN IF NOT EXISTS text TEXT,
  ADD COLUMN IF NOT EXISTS raw JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE POLICY "tgbot auth read" ON public.telegram_bots FOR SELECT TO authenticated USING (true);
CREATE POLICY "tgbot auth insert" ON public.telegram_bots FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "tgbot auth update" ON public.telegram_bots FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "tgbot auth delete" ON public.telegram_bots FOR DELETE TO authenticated USING (true);
CREATE POLICY "tgflow auth read" ON public.telegram_flows FOR SELECT TO authenticated USING (true);
CREATE POLICY "tgflow auth insert" ON public.telegram_flows FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "tgflow auth update" ON public.telegram_flows FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "tgflow auth delete" ON public.telegram_flows FOR DELETE TO authenticated USING (true);
CREATE POLICY "tgrun auth read" ON public.telegram_runs FOR SELECT TO authenticated USING (true);
CREATE POLICY "tgrun auth insert" ON public.telegram_runs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "tgrun auth update" ON public.telegram_runs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "tgrun auth delete" ON public.telegram_runs FOR DELETE TO authenticated USING (true);
CREATE POLICY "tgupd auth read" ON public.telegram_updates FOR SELECT TO authenticated USING (true);
CREATE POLICY "tgupd auth insert" ON public.telegram_updates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "tgupd auth update" ON public.telegram_updates FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "tgupd auth delete" ON public.telegram_updates FOR DELETE TO authenticated USING (true);