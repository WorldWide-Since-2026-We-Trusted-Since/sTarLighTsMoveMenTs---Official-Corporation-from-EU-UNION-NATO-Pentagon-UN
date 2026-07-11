/**
 * registry.ts — Zentrale Modul-Registry mit Lifecycle-Management.
 * Verwaltet alle Instanzen (Module) und Connectoren, initialisiert
 * sie in deklarierter Reihenfolge und bietet Zugriff/Routing.
 */
import { type IModule, type LayerLevel, LAYERS } from "./layer.ts";
import { type IConnector } from "./connector.ts";

export class ModuleRegistry {
  private modules = new Map<string, IModule>();
  private connectors = new Map<string, IConnector>();

  /** Registriert ein Modul unter seiner ID. */
  register(mod: IModule): void {
    if (this.modules.has(mod.id)) {
      throw new Error(`module ${mod.id} already registered`);
    }
    this.modules.set(mod.id, mod);
  }

  /** Registriert einen Connector. */
  registerConnector(c: IConnector): void {
    if (this.connectors.has(c.id)) {
      throw new Error(`connector ${c.id} already registered`);
    }
    this.connectors.set(c.id, c);
  }

  /** Holt ein Modul anhand seiner ID. */
  get(id: string): IModule {
    const m = this.modules.get(id);
    if (!m) throw new Error(`module ${id} not found`);
    return m;
  }

  /** Holt einen Connector anhand seiner ID. */
  getConnector(id: string): IConnector {
    const c = this.connectors.get(id);
    if (!c) throw new Error(`connector ${id} not found`);
    return c;
  }

  /** Initialisiert alle Module und verbindet alle Connectoren. */
  async initAll(): Promise<void> {
    for (const m of this.modules.values()) {
      await m.init();
    }
    for (const c of this.connectors.values()) {
      c.connect();
    }
  }

  /** Listet alle registrierten Module nach Ebene gruppiert. */
  listByLayer(): Record<LayerLevel, string[]> {
    const out: Record<LayerLevel, string[]> = {
      L1: [], L2: [], L3: [], L4: [], L5: [], L6: [],
    };
    for (const m of this.modules.values()) {
      out[m.layer.level].push(m.id);
    }
    return out;
  }

  /** Anzahl registrierter Module / Connectoren. */
  get stats(): { modules: number; connectors: number; layers: typeof LAYERS } {
    return {
      modules: this.modules.size,
      connectors: this.connectors.size,
      layers: LAYERS,
    };
  }

  /** Freigabe aller Ressourcen (Module + Connectoren). */
  async shutdownAll(): Promise<void> {
    for (const c of this.connectors.values()) c.disconnect();
    for (const m of this.modules.values()) await m.shutdown();
  }
}