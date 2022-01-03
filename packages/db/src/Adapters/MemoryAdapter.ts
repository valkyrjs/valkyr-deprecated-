import type { Adapter, Document } from "../Storage/Types";

const cache = new Map<string, any[]>();

export class MemoryAdapter<D extends Document = any> implements Adapter<D> {
  public readonly type = "MemoryAdapter";

  public async set(name: string, documents: D[]) {
    cache.set(name, documents);
  }

  public async get(name: string) {
    return cache.get(name) ?? [];
  }

  public async del(name: string) {
    cache.delete(name);
  }

  public flush() {
    cache.clear();
  }
}
