import { GovernanceNode, SWFAsset, ProjectCorridor, AuditRecord } from "./types";

export const GOVERNANCE_NODES: GovernanceNode[] = [
  {
    id: "tx-meta",
    name: "TX — TRANSCENDENCE LAYER",
    description: "Sovereign Ultimate Meta Governance, Strategic Intelligence, Spiritual Awareness and Supreme AI Oversight",
    category: "TX",
    details: "Coordinates global humanitarian, political, spiritual, and defense corridors at a transcendental level of execution. Integrates Spectrum Golden Awareness and supreme strategic stewardship to safeguard national and international sovereignty.",
    technicalLayers: ["HolyThreeKings Auth", "Spectrum Golden Awareness", "HNOSS™ Identity Engine", "PrisMaTHarIOn Registry"]
  },
  {
    id: "txa-tsai",
    name: "TXA — TRANSCENDENT AUTHORITY (TSAI)",
    description: "Transcendent Supervisory AI Infrastructure executing regulatory auditing across all spheres.",
    category: "TXA",
    details: "High-frequency systems supervision incorporating critical algorithmic checkpoints: SRA (Security Regulatory Authority), GCA (Global Coordination Agency), RGC (Regulatory Governance), ABN (Authorized Blockchain Network), ESA (European Space Alignment), NSA (National Systems Administration), NCA (National Cryptographic Agency), CA (Centralized Authority), RA (Regulatory Audit), SA, RB, AO, and AB.",
    technicalLayers: ["TSAI Neural Engine", "PrisMaTHarIOn System Grid", "Real-time Auditing Core", "SHA-256 Quantum Shield"]
  },
  {
    id: "gov-core",
    name: "GOV — GOVERNMENT CORE GRID",
    description: "Multi-layered secure governmental operations stack for state-level strategy and identity.",
    category: "GOV",
    details: "Coordinates administrative authentication and state-level policy execution structures: GovCore, GovNet, GovID (Sweden National ID Card), GovAPI (Sovereign Interface Protocols), and GovX representing operational defense links under expert civil law.",
    technicalLayers: ["GovX Security Kernels", "Sweden National ID (Schweden ID)", "GovAPI Secure Gateways", "Sovereign Identity Protocol"]
  },
  {
    id: "fi-settlement",
    name: "FI — FINANCIAL INFRASTRUCTURE LAYER",
    description: "Central bank settlements, clearing houses, high-volume liquidity maintenance, and sovereign exchange protocols.",
    category: "FI",
    details: "Underpinned by the CB (Central Banks Network) representing primary capital reserve settlements under EU-Union, NATO and Swiss regulatory frameworks. Fully integrated with global verification engines.",
    technicalLayers: ["CB FedNet Protocol", "LEI Registry (894500GBJSIW8L6ET310)", "Clearing Gateways", "Cross-Border Liquidity Rails"]
  },
  {
    id: "swf-anchor",
    name: "SWFs — WORLD'S STAR SOVEREIGN WEALTH FUNDS",
    description: "High-tier asset networks and capital pools matching General Partners (GPs) and Limited Partners (LPs).",
    category: "SWFs",
    details: "Coordinates sovereign capital allocation networks from prime general partners: EpsLGSEz, PgEz, pg_slz, GLp, and SAGA-PEZ. Directs high-integrity capital pools toward strategic infrastructure.",
    technicalLayers: ["D-U-N-S Registry (315676980)", "SAGA-PEZ Ledger Core", "Anchor LP Allocator", "GPs / LPs Coordination Layer"]
  },
  {
    id: "swf-hub",
    name: "WORLD'S STAR SWFs & PgEz GOVERNANCE HUB",
    description: "Joint treasury coordination, capital allocation, and partner harmonization engine.",
    category: "SWF-HUB",
    details: "Directs SAGA-PEZ capital buffers, EpsLGSEz sovereign assets, GLp resources, and pg_slz partnerships. Regulates joint GP <-> LP coordination framework to allocate capital optimally across international spaces.",
    technicalLayers: ["SAGA-PEZ Core Ledger", "EpsLGSEz Sovereign Asset Tracker", "Sovereign Capital Allocator", "GLp Partner Vault"]
  },
  {
    id: "global-projects",
    name: "GLOBAL PROJECT IMPLEMENTATION LAYER",
    description: "Sovereign engineering, energy infrastructure, quantum computing, digital infrastructure, and humanitarian programs.",
    category: "PROJECTS",
    details: "Oversees development and deployment of high-priority transzendent corridors: Energy Infrastructure Grid, Transcendent AI, Sovereign Financial Clearing Core, NATO-Aligned Strategic Defense, and UN-Supported Humanitarian Trusts.",
    technicalLayers: ["Project Node Verifier", "Energy Grid Monitor", "AI Infrastructure Telemetry", "Humanitarian Impact Ledger"]
  },
  {
    id: "ref-framework",
    name: "GLOBAL REFERENCE FRAMEWORK & ALIGNMENT",
    description: "Conceptual compatibility with the world's primary defense, political, spiritual, and humanitarian institutions.",
    category: "FRAMEWORK",
    details: "Ensures comprehensive conceptual alignment and compliance with NATO Strategic Defense Models, European Union Regulatory Layers, Pentagon Operational Defense Structures, and United Nations Global Coordination Layers under expert civil law guidance.",
    technicalLayers: ["Joint Coordination Engine", "VAT ID (DE441892129)", "UNGM Registry (1172700)", "Expert Civil Law Validator"]
  }
];

export const SWF_ASSETS: SWFAsset[] = [
  {
    name: "SAGA-PEZ Sovereign Capital",
    code: "SAGA-PEZ",
    anchorLP: "EpsLGSEz",
    generalPartner: "PgEz",
    allocatedCapitalBillions: 1420.5,
    marketSharePercentage: 35,
    color: "#bf953f",
    projectsCount: 42
  },
  {
    name: "Hnoss Treasury Reserve",
    code: "HNOSS™",
    anchorLP: "Daniel Pohl (HolyThreeKings)",
    generalPartner: "GLp",
    allocatedCapitalBillions: 980.2,
    marketSharePercentage: 24,
    color: "#fcf6ba",
    projectsCount: 29
  },
  {
    name: "EU-NATO Defense Capital",
    code: "EU-NATO-DP",
    anchorLP: "Pentagon Structure",
    generalPartner: "pg_slz",
    allocatedCapitalBillions: 890.1,
    marketSharePercentage: 22,
    color: "#ffffff",
    projectsCount: 31
  },
  {
    name: "United Nations Humanitarian Asset Pool",
    code: "UNGM-PIC",
    anchorLP: "UN Global Coordination",
    generalPartner: "EpsLGSEz",
    allocatedCapitalBillions: 760.8,
    marketSharePercentage: 19,
    color: "#00a2ff",
    projectsCount: 25
  }
];

export const PROJECT_CORRIDORS: ProjectCorridor[] = [
  {
    name: "Strategic Energy Infrastructure Grid",
    category: "Energy",
    budgetBillions: 950,
    completionPercentage: 88,
    activeNodes: 140,
    leadArchitect: "HNOSS Architecture Core"
  },
  {
    name: "Transcendent AI & Digital Infrastructure",
    category: "AI",
    budgetBillions: 1200,
    completionPercentage: 94,
    activeNodes: 280,
    leadArchitect: "Daniel Pohl / H31mBL42ur"
  },
  {
    name: "Central Bank & Sovereign Clearing Systems",
    category: "Financial",
    budgetBillions: 780,
    completionPercentage: 91,
    activeNodes: 95,
    leadArchitect: "D-U-N-S Certified Partners"
  },
  {
    name: "NATO-Aligned Strategic Defense Systems",
    category: "Defense",
    budgetBillions: 1100,
    completionPercentage: 85,
    activeNodes: 165,
    leadArchitect: "Pentagon Joint Coordination"
  },
  {
    name: "UN-Supported Global Humanitarian Programs",
    category: "Humanitarian",
    budgetBillions: 650,
    completionPercentage: 97,
    activeNodes: 210,
    leadArchitect: "HolyThreeKings Charitable Trust"
  }
];

// Seed list of verifiable audit records
export const SEED_AUDITS: AuditRecord[] = [
  {
    id: "AUD-001258",
    timestamp: "2026-06-01T10:15:30Z",
    source: "SAGA-PEZ (GPs)",
    destination: "Strategic Energy Infrastructure Grid",
    amount: 12.5,
    currency: "EUR (Sovereign)",
    layer: "SWFs",
    signature: "49a1f28b789de0c1e89f...5bb8a209e2cf43198000bcda",
    status: "VERIFIED",
    hash: "sha256:887ffbba812cca09ec30da7bba2ef445"
  },
  {
    id: "AUD-001259",
    timestamp: "2026-06-01T11:42:05Z",
    source: "EU-NATO Defense Capital",
    destination: "NATO-Aligned Strategic Defense Systems",
    amount: 24.8,
    currency: "USD (Institutional)",
    layer: "TXA",
    signature: "91cc08b770de8fa34c21...8900bbcaef514210e1902cda",
    status: "VERIFIED",
    hash: "sha256:fa234900ab38ccdaec8ef421fcadd810"
  },
  {
    id: "AUD-001260",
    timestamp: "2026-06-01T12:05:41Z",
    source: "HNOSS™ Treasury",
    destination: "Transcendent AI & Digital Infrastructure",
    amount: 35.0,
    currency: "CHF (Sovereign)",
    layer: "TX",
    signature: "ff0042da99cc0e8cb140...dc441892129ae2025d121831",
    status: "VERIFIED",
    hash: "sha256:de441892129e2025d1218310d4021200"
  },
  {
    id: "AUD-001261",
    timestamp: "2026-06-01T13:50:12Z",
    source: "United Nations (UNGM)",
    destination: "UN-Supported Global Humanitarian Programs",
    amount: 8.4,
    currency: "USD (Humanitarian)",
    layer: "GOV",
    signature: "11727cda873042778abc...894500gbjsiw8l6et310ea09",
    status: "VERIFIED",
    hash: "sha256:873042778894500gbjsiw8l6et310bf9"
  }
];

// Zero-latency SHA-256 Mock generator for perfect interactive verification
export function simulateSignAndHash(payload: string): { signature: string; hash: string } {
  let hashVal = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hashVal = (hashVal << 5) - hashVal + char;
    hashVal |= 0;
  }
  const hexString = Math.abs(hashVal).toString(16).padStart(8, '0');
  const signature = "HNOSS_SIG_" + hexString.toUpperCase() + "_" + Math.floor(Math.random() * 9000000 + 1000000);
  const hashStr = "sha256:" + hexString + "d5ce298bf3a09e081bf953fcbba02381e";
  return { signature, hash: hashStr };
}
