/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AuditRecord {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  amount: number;
  currency: string;
  layer: "TX" | "TXA" | "GOV" | "FI" | "SWFs";
  signature: string;
  status: "VERIFIED" | "PENDING" | "AUDITED";
  hash: string;
}

export interface GovernanceNode {
  id: string;
  name: string;
  description: string;
  category: "TX" | "TXA" | "GOV" | "FI" | "SWFs" | "SWF-HUB" | "PROJECTS" | "FRAMEWORK";
  details: string;
  technicalLayers: string[];
}

export interface SWFAsset {
  name: string;
  code: string;
  anchorLP: string;
  generalPartner: string;
  allocatedCapitalBillions: number;
  marketSharePercentage: number;
  color: string;
  projectsCount: number;
}

export interface ProjectCorridor {
  name: string;
  category: "Energy" | "Digital" | "Financial" | "AI" | "Defense" | "Humanitarian";
  budgetBillions: number;
  completionPercentage: number;
  activeNodes: number;
  leadArchitect: string;
}

// ---- HNOSS Invite Governance (EU AI Act / Digital Act / Ethics Act) ----
export type AccessRequestStatus =
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "APPROVED"
  | "REJECTED";

export interface AccessRequest {
  id: string;
  integration_name: string;
  business_email: string;
  e_signature_hash: string;
  e_signature_initials: string | null;
  status: AccessRequestStatus;
  admin_notes: string | null;
  requested_at: string;
  verified_at: string | null;
  admin_action_at: string | null;
  is_active: number;
}
