import { del, get, set } from "idb-keyval";

import type { Document } from "../Storage";
import type { Adapter } from "./Adapter";

export class IndexedDbAdapter<D extends Document = Document> implements Adapter<D> {
  readonly type = "IndexedDbAdapter";

  async set(name: string, documents: D[]) {
    return set(name, documents);
  }

  async get(name: string) {
    const documents = await get(name);
    if (documents) {
      return documents;
    }
    return [];
  }

  async del(name: string) {
    return del(name);
  }

  flush() {}
}
