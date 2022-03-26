import { del, get, set } from "idb-keyval";

import type { Adapter, Document } from "../Storage/Types";

export class IndexedDbAdapter implements Adapter {
  public async set(name: string, documents: Document[]) {
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
