import { IDBPDatabase, openDB } from "idb";

import { Document, Storage } from "../Storage";

const OBJECT_STORE_NAME = "documents";

export class IndexedDbStorage<D extends Document = Document> extends Storage<D> {
  #db!: IDBPDatabase;

  #cache = new Map<string, D>();

  async init(): Promise<void> {
    this.#db = await openDB(this.name, 1, {
      upgrade(db: IDBPDatabase) {
        const store = db.createObjectStore(OBJECT_STORE_NAME, {
          keyPath: "id"
        });
        store.createIndex("primary", "id", { unique: true });
      }
    });
  }

  async hasDocument(id: string): Promise<boolean> {
    if (this.#cache.has(id) === true) {
      return true;
    }
    const document = await this.getDocument(id);
    if (document !== undefined) {
      return true;
    }
    return false;
  }

  async getDocument(id: string): Promise<D | undefined> {
    const cachedDocument = this.#cache.get(id);
    if (cachedDocument) {
      return cachedDocument;
    }
    return this.#db.get(OBJECT_STORE_NAME, id);
  }

  async getDocuments(): Promise<D[]> {
    return [...(await this.#db.getAll(OBJECT_STORE_NAME)), ...Array.from(this.#cache.values())];
  }

  async setDocument(document: D): Promise<void> {
    this.#cache.set(document.id, document);
    this.#db.put(OBJECT_STORE_NAME, document).then(() => {
      this.#cache.delete(document.id);
    });
  }

  async delDocument(id: string): Promise<void> {
    this.#db.delete(OBJECT_STORE_NAME, id).then(() => {
      this.#cache.delete(id);
    });
  }

  async count(): Promise<number> {
    return this.#db.count(OBJECT_STORE_NAME);
  }

  async flush(): Promise<void> {
    this.#db.clear(OBJECT_STORE_NAME);
  }
}
