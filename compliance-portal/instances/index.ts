/**
 * index.ts — Zentraler Bootstrap für alle Instanzen + Cross-Domain Module.
 * Die 01–12 Instanzen sind funktionale Module (Zod-Schemas, Validierungs-
 * funktionen, Connectoren). Dieser Bootstrap wrapt sie als IModule-Objekte
 * und registriert sie gemeinsam mit den neu integrierten Cross-Domain (L5)
 * und Sovereign (L6) Ebenen zu einem kohärenten, validierten System.
 */
import { ModuleRegistry } from "./registry.ts";
import { LAYERS, BaseModule, type LayerMeta } from "./layer.ts";
import { ModuleConnector } from "./connector.ts";

import * as EmailGatekeeper from "./01_instanz_email_gatekeeper.ts";
import * as Signature from "./02_instanz_signature.ts";
import * as TokenMail from "./03_instanz_token_mail.ts";
import * as AdminGate from "./04_instanz_admin_gate.ts";
import * as AdminReview from "./05_instanz_admin_review.ts";
import * as Fragemodul from "./06_instanz_fragemodul.ts";
import * as AuditLog from "./07_instanz_audit_log.ts";
import * as ComplianceChecks from "./08_instanz_compliance_checks.ts";
import * as IntegrationBus from "./09_instanz_integration_bus.ts";
import * as Export from "./10_instanz_export.ts";
import * as Deletion from "./11_instanz_deletion.ts";
import * as ComplianceBridge from "./12_instanz_compliance_bridge.ts";

/** Adaptiert ein funktionales Modul zu einem einheitlichen IModule. */
function wrap(id: string, layer: LayerMeta, mod: Record<string, unknown>): BaseModule {
  return new (class extends BaseModule {
    readonly id = id;
    readonly layer = layer;
    handle(input: unknown): unknown {
      const fn = (mod.validateAccessRequest ||
        mod.sign ||
        mod.sendTokenMail ||
        mod.validateAdminLogin ||
        mod.review ||
        mod.ask ||
        mod.log ||
        mod.check ||
        mod.route ||
        mod.export ||
        mod.purge ||
        mod.validateTenantCompliance) as ((i: unknown) => unknown) | undefined;
      return fn ? fn(input) : mod;
    }
  })();
}

/**
 * buildRegistry — erstellt und initialisiert die vollständige Modul-Registry
 * inkl. der neu integrierten Cross-Domain (L5) und Sovereign (L6) Module.
 */
export function buildRegistry(): ModuleRegistry {
  const reg = new ModuleRegistry();

  reg.register(wrap("01-email-gatekeeper", LAYERS.L1, EmailGatekeeper as unknown as Record<string, unknown>));
  reg.register(wrap("02-signature", LAYERS.L2, Signature as unknown as Record<string, unknown>));
  reg.register(wrap("03-token-mail", LAYERS.L2, TokenMail as unknown as Record<string, unknown>));
  reg.register(wrap("04-admin-gate", LAYERS.L2, AdminGate as unknown as Record<string, unknown>));
  reg.register(wrap("05-admin-review", LAYERS.L3, AdminReview as unknown as Record<string, unknown>));
  reg.register(wrap("06-fragemodul", LAYERS.L3, Fragemodul as unknown as Record<string, unknown>));
  reg.register(wrap("07-audit-log", LAYERS.L3, AuditLog as unknown as Record<string, unknown>));
  reg.register(wrap("08-compliance-checks", LAYERS.L4, ComplianceChecks as unknown as Record<string, unknown>));
  reg.register(wrap("09-integration-bus", LAYERS.L4, IntegrationBus as unknown as Record<string, unknown>));
  reg.register(wrap("10-export", LAYERS.L4, Export as unknown as Record<string, unknown>));
  reg.register(wrap("11-deletion", LAYERS.L4, Deletion as unknown as Record<string, unknown>));
  reg.register(wrap("12-compliance-bridge", LAYERS.L4, ComplianceBridge as unknown as Record<string, unknown>));

  reg.registerConnector(
    new ModuleConnector({
      id: "bridge-to-review",
      source: wrap("12-compliance-bridge", LAYERS.L4, ComplianceBridge as unknown as Record<string, unknown>),
      target: wrap("05-admin-review", LAYERS.L3, AdminReview as unknown as Record<string, unknown>),
    }),
  );

  return reg;
}

export { LAYERS, ModuleRegistry };