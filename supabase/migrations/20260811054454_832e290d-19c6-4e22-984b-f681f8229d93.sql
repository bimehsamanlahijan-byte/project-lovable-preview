CREATE POLICY "cust docs public upload" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'customer-documents');
CREATE POLICY "cust docs staff read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'customer-documents');
CREATE POLICY "cust docs staff update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'customer-documents') WITH CHECK (bucket_id = 'customer-documents');
CREATE POLICY "cust docs staff delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'customer-documents');