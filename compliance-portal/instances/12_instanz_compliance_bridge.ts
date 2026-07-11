/**
 * HNOSS Instance 12 — Compliance-as-API Bridge.
 *
 * Additive to the existing 01..11 instances. Calls the local Authark/q runner
 * (default http://127.0.0.1:8080) and returns a normalised compliance record.
 *
 * The bridge NEVER hides connector failures: SKIPPED_NO_CREDENTIALS is
 * surfaced to callers so admin review (instance 05) can act on it.
 */

export interface ComplianceConnectorRecord {
  status: "HEALTH_OK" | "FAIL" | "SKIPPED_NO_CREDENTIALS";
  details: string;
  source: string;
  fetched_at: string;
  content_sha: string;
}

export interface ComplianceResponse {
  status: "PASS" | "FAIL";
  per_connector: Record<string, ComplianceConnectorRecord>;
  audit_chain: string[];
  generated_at: string;
}

export interface ComplianceBridgeConfig {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

export async function validateTenantCompliance(
  tenantId: string,
  payload: Record<string, unknown> = {},
  cfg: ComplianceBridgeConfig = {},
): Promise<ComplianceResponse> {
  const base = cfg.baseUrl ?? process.env.AUTHARK_BASE_URL ?? "http://127.0.0.1:8080";
  const f = cfg.fetchImpl ?? fetch;
  const res = await f(`${base}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tenant_id: tenantId, payload }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HNOSS compliance bridge ${res.status}: ${text}`);
  }
  return (await res.json()) as ComplianceResponse;
}
