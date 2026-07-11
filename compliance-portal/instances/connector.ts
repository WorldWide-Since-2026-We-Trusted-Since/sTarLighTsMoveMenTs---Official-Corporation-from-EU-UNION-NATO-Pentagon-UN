/**
 * connector.ts — Standard-Connector für instanzübergreifende Kommunikation.
 */
import type { IModule } from "./layer.ts";

export interface ConnectorConfig {
  id: string;
  source: IModule;
  target: IModule;
  transform?: (payload: unknown) => unknown;
}

export interface IConnector {
  readonly id: string;
  connect(): void;
  send(payload: unknown): Promise<unknown> | unknown;
  disconnect(): void;
  readonly healthy: boolean;
}

export class ModuleConnector implements IConnector {
  readonly id: string;
  private source: IModule;
  private target: IModule;
  private transform?: (payload: unknown) => unknown;
  private connected = false;

  constructor(cfg: ConnectorConfig) {
    this.id = cfg.id;
    this.source = cfg.source;
    this.target = cfg.target;
    this.transform = cfg.transform;
  }

  connect(): void {
    if (!this.source.isReady || !this.target.isReady) {
      throw new Error(`connector ${this.id}: source/target not initialized`);
    }
    this.connected = true;
  }

  async send(payload: unknown): Promise<unknown> {
    if (!this.connected) throw new Error(`connector ${this.id}: not connected`);
    const out = this.source.handle(payload);
    const resolved = out instanceof Promise ? await out : out;
    const next = this.transform ? this.transform(resolved) : resolved;
    const res = this.target.handle(next);
    return res instanceof Promise ? await res : res;
  }

  disconnect(): void {
    this.connected = false;
  }

  get healthy(): boolean {
    return this.connected;
  }
}