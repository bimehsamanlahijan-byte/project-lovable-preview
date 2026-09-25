import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function getSupabaseAdmin() {
  return supabaseAdmin;
}

export async function hasServiceKey() {
  return Boolean(process.env["SUPABASE_URL"] && process.env["SUPABASE_SERVICE_ROLE_KEY"]);
}