import type { Document } from "../Storage";
import type { Adapter } from "./Adapter";

export class InstanceAdapter<D extends Document = any> implements Adapter<D> {
  readonly type = "InstanceAdapter";

  readonly cache = new Map<string, D[]>();

  async set(name: string, documents: D[]) {
    this.cache.set(name, documents);
  }

  async get(name: string) {
    return this.cache.get(name) ?? [];
  }

  async del(name: string) {
    this.cache.delete(name);
  }

  flush() {
    this.cache.clear();
  }
}
