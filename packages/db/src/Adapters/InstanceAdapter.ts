import type { Adapter, Document } from "../Storage/Types";

export class InstanceAdapter<D extends Document = any> implements Adapter<D> {
  public readonly type = "InstanceAdapter";

  public readonly cache = new Map<string, D[]>();

  public async set(name: string, documents: D[]) {
    this.cache.set(name, documents);
  }

  public async get(name: string) {
    return this.cache.get(name) ?? [];
  }

  public async del(name: string) {
    this.cache.delete(name);
  }

  public flush() {
    this.cache.clear();
  }
}
