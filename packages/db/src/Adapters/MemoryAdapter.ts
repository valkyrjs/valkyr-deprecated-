import type { Adapter, Document } from "../Types/Storage";

const cache = new Map<string, Document[]>();

export class MemoryAdapter implements Adapter {
  public async set(name: string, documents: Document[]) {
    cache.set(name, documents);
  }
  public async get(name: string) {
    return cache.get(name) ?? [];
  }
  public async del(name: string) {
    cache.delete(name);
  }
}
