/**
 * layer.ts — Abstrakte Ebenen- und Modul-Basisklassen
 * Definiert die modulare Schichten-Architektur (Layer) für das
 * Double-Gate Governance-Portal. Jede Instanz (Modul) gehört zu
 * genau einer Ebene und implementiert ein einheitliches Lifecycle-
 * Interface (init → handle → shutdown).
 *
 * Ebenen (Layers):
 *   L1 Presentation   — Einstiegspunkte / Gatekeeper
 *   L2 Application    — Business-Logik / Signatur / Token
 *   L3 Domain         — Governance-Entscheidungen (Admin/Review/Fragen)
 *   L4 Infrastructure — Audit, Compliance, Integration, Export, Deletion
 *   L5 Cross-Domain   — PNIA Infrastruktur, Governance Catalog, Python Engine,
 *                       GPP Node, Security Validation, Crypto-Tokenization, Finance
 *   L6 Sovereign      — CP01 Concil Protokoll, Staatliche Strukturen, Immunitas Shield
 */

export type LayerLevel = "L1" | "L2" | "L3" | "L4" | "L5" | "L6";

export interface LayerMeta {
  level: LayerLevel;
  name: string;
  description: string;
}

/**
 * IModule — Einheitliches Lifecycle-Interface für alle Instanzen.
 */
export interface IModule {
  readonly id: string;
  readonly layer: LayerMeta;
  readonly isReady: boolean;
  init(): void | Promise<void>;
  handle(input: unknown): unknown | Promise<unknown>;
  shutdown(): void | Promise<void>;
}

/** Zentrale Registry der bekannten Ebenen. */
export const LAYERS: Record<LayerLevel, LayerMeta> = {
  L1: { level: "L1", name: "Presentation",   description: "Einstieg / Gatekeeper / Signature" },
  L2: { level: "L2", name: "Application",    description: "Token-Versand / Admin-Login" },
  L3: { level: "L3", name: "Domain",         description: "Review / Fragemodul / Audit" },
  L4: { level: "L4", name: "Infrastructure", description: "Compliance / Integration / Export / Deletion" },
  L5: { level: "L5", name: "Cross-Domain",   description: "PNIA Infra / Governance Catalog / Python Engine / GPP Node / Security Validation / Crypto-Tokenization / Finance" },
  L6: { level: "L6", name: "Sovereign",      description: "CP01 Concil Protokoll / Staatliche Strukturen / Immunitas Shield Hard-Coded Invarianz" },
};

/**
 * BaseModule — Minimale abstrakte Basis, die das IModule-Lifecycle
 * bereitstellt. Konkrete Instanzen erben davon und überschreiben handle.
 */
export abstract class BaseModule implements IModule {
  abstract readonly id: string;
  abstract readonly layer: LayerMeta;
  protected initialized = false;

  init(): void {
    this.initialized = true;
  }

  abstract handle(input: unknown): unknown | Promise<unknown>;

  shutdown(): void {
    this.initialized = false;
  }

  get isReady(): boolean {
    return this.initialized;
  }
}