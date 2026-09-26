//#region node_modules/.nitro/vite/services/ssr/assets/partner-code-eZI_lnL0.js
/**
* Deterministic tracking code for a partner-cooperation application.
*
* The deployed database stores only `request_key` (uuid) and `created_at`,
* so the code shown to the applicant is derived from those values instead of
* being stored in a separate column. That way the dashboard can display
* exactly the same code the applicant received.
*/
function partnerApplicantCode(requestKey, isoDate) {
	const d = typeof isoDate === "string" ? new Date(isoDate) : isoDate;
	const stamp = Number.isNaN(d.getTime()) ? "00000000" : `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
	let hash = 0;
	for (const ch of String(requestKey || "")) hash = (hash * 31 + ch.charCodeAt(0)) % 9e3;
	return `PA-${stamp}-${1e3 + hash}`;
}
//#endregion
export { partnerApplicantCode };
