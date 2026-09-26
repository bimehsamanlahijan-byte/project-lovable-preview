import { t as supabaseAdmin } from "./client.server-DxECWN17.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cloud-admin.server-C2hTQ8dd.js
async function getSupabaseAdmin() {
	return supabaseAdmin;
}
async function hasServiceKey() {
	return Boolean(process.env["SUPABASE_URL"] && process.env["SUPABASE_SERVICE_ROLE_KEY"]);
}
//#endregion
export { getSupabaseAdmin, hasServiceKey };
