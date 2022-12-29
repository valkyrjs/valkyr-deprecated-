import { IDBPDatabase, openDB } from "idb/with-async-ittr";

import { Collection } from "../collection";
import { Document } from "../storage";
import { IndexedDbStorage } from "./indexed.storage";
import { Registrars } from "./registrars";

type StringRecord<T> = { [x: string]: T };

export class IndexedDatabase<T extends StringRecord<Document>> {
  readonly #registrars: Registrars[] = [];
  readonly #collections = new Map<keyof T, Collection<T[keyof T]>>();

  #db?: IDBPDatabase;

  constructor(readonly name: string, readonly version = 1, readonly log = (_: string) => {}) {}

  /*
   |--------------------------------------------------------------------------------
   | Bootstrap
   |--------------------------------------------------------------------------------
   */

  async start(): Promise<void> {
    this.#db = await openDB(this.name, this.version, {
      upgrade: (db: IDBPDatabase) => {
        for (const { name, indexes = [] } of this.#registrars) {
          const store = db.createObjectStore(name as string, { keyPath: "id" });
          store.createIndex("id", "id", { unique: true });
          for (const [keyPath, options] of indexes) {
            store.createIndex(keyPath, keyPath, options);
          }
        }
      }
    });
    for (const { name } of this.#registrars) {
      this.#collections.set(name, new Collection(name, new IndexedDbStorage(name, this.#db, this.log)));
    }
  }

  /**
   * Register a new collection.
   *
   * @param registrars - Collections to register.
   */
  register(registrars: Registrars[]): this {
    for (const registrar of registrars) {
      this.#registrars.push(registrar);
    }
    return this;
  }

  /*
   |--------------------------------------------------------------------------------
   | Fetchers
   |--------------------------------------------------------------------------------
   */

  collection<Name extends keyof T>(name: Name): Collection<T[Name]> {
    const collection = this.#collections.get(name);
    if (collection === undefined) {
      throw new Error(`Collection '${name as string}' not found`);
    }
    return collection as Collection<T[Name]>;
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  async export(name: string, options?: { offset?: string; limit?: number }): Promise<any[]> {
    return this.#db?.getAll(name, options?.offset, options?.limit) ?? [];
  }

  async flush() {
    for (const collection of this.#collections.values()) {
      collection.flush();
    }
  }

  close() {
    this.#db?.close();
  }
}
