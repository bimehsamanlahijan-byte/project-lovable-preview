/**
 * Deterministic tracking code for a partner-cooperation application.
 *
 * The deployed database stores only `request_key` (uuid) and `created_at`,
 * so the code shown to the applicant is derived from those values instead of
 * being stored in a separate column. That way the dashboard can display
 * exactly the same code the applicant received.
 */
export function partnerApplicantCode(requestKey: string, isoDate: string | Date): string {
  const d = typeof isoDate === "string" ? new Date(isoDate) : isoDate;
  const stamp = Number.isNaN(d.getTime())
    ? "00000000"
    : `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

  let hash = 0;
  for (const ch of String(requestKey || "")) {
    hash = (hash * 31 + ch.charCodeAt(0)) % 9000;
  }
  return `PA-${stamp}-${1000 + hash}`;
}
