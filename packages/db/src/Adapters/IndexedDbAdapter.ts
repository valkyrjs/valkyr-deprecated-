import { del, get, set } from "idb-keyval";

import type { Adapter, Document } from "../Storage/Types";

export class IndexedDbAdapter<D extends Document = any> implements Adapter<D> {
  public readonly type = "IndexedDbAdapter";

  public async set(name: string, documents: D[]) {
    return set(name, documents);
  }

  public async get(name: string) {
    const documents = await get(name);
    if (documents) {
      return documents;
    }
    return [];
  }

  public async del(name: string) {
    return del(name);
  }

  public flush() {}
}
