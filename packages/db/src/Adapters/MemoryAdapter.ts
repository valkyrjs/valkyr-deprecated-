import type { Adapter, Document } from "../Storage/Types";

const cache = new Map<string, any[]>();

export class MemoryAdapter<D extends Document = any> implements Adapter<D> {
  readonly type = "MemoryAdapter";

  async set(name: string, documents: D[]) {
    cache.set(name, documents);
  }

  async get(name: string) {
    return cache.get(name) ?? [];
  }

  async del(name: string) {
    cache.delete(name);
  }

  flush() {
    cache.clear();
  }
}
