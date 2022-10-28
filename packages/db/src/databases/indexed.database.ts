import { IDBPDatabase, openDB } from "idb/with-async-ittr";

import { Collection } from "../collection";
import { IndexedDbStorage } from "./indexed.storage";
import { Registrars } from "./registrars";

export class IndexedDatabase {
  readonly #registrars: Registrars[] = [];

  #db?: IDBPDatabase;

  constructor(readonly name: string, readonly version = 1) {}

  async start(): Promise<void> {
    this.#db = await openDB(this.name, this.version, {
      upgrade: (db: IDBPDatabase) => {
        for (const { name, indexes = [] } of this.#registrars) {
          const store = db.createObjectStore(name, { keyPath: "id" });
          store.createIndex("id", "id", { unique: true });
          for (const [keyPath, options] of indexes) {
            store.createIndex(keyPath, keyPath, options);
          }
        }
      }
    });
    for (const { name, model } of this.#registrars) {
      model.$collection = new Collection(name, new IndexedDbStorage(name, this.#db));
    }
  }

  async export(name: string, options?: { offset?: string; limit?: number }): Promise<any[]> {
    return this.#db?.getAll(name, options?.offset, options?.limit) ?? [];
  }

  register(registrars: Registrars[]): void {
    for (const registrar of registrars) {
      this.#registrars.push(registrar);
    }
  }

  close() {
    this.#db?.close();
  }
}
