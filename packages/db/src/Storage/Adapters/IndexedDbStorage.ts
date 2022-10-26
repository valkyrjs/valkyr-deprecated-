import { IDBPDatabase, openDB } from "idb";

import { Document, Storage } from "../Storage";

const OBJECT_STORE_NAME = "documents";

export class IndexedDbStorage<D extends Document = Document> extends Storage<D> {
  #db!: IDBPDatabase;

  async init(): Promise<void> {
    this.#db = await openDB(this.name, 1, {
      upgrade(db: any) {
        db.createObjectStore(OBJECT_STORE_NAME, {
          keyPath: "id"
        });
      }
    });
  }

  async hasDocument(id: string): Promise<boolean> {
    const document = await this.getDocument(id);
    if (document !== undefined) {
      return true;
    }
    return false;
  }

  async getDocument(id: string): Promise<D | undefined> {
    return this.#db.get(OBJECT_STORE_NAME, id);
  }

  async getDocuments(): Promise<D[]> {
    return this.#db.getAll(OBJECT_STORE_NAME);
  }

  async setDocument(id: string, document: D): Promise<void> {
    this.#db.put(OBJECT_STORE_NAME, document);
  }

  async delDocument(id: string): Promise<void> {
    this.#db.delete(OBJECT_STORE_NAME, id);
  }

  async count(): Promise<number> {
    return this.#db.count(OBJECT_STORE_NAME);
  }

  async flush(): Promise<void> {
    this.#db.clear(OBJECT_STORE_NAME);
  }
}
