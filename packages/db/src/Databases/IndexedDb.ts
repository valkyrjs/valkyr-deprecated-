import { IDBPDatabase, openDB } from "idb/with-async-ittr";

import { Collection } from "../Collection";
import { DBLogger } from "../Logger";
import { Document } from "../Storage";
import { IndexedDbStorage } from "./IndexedDb.Storage";
import { Registrars } from "./Registrars";

function log() {}

type StringRecord<T> = { [x: string]: T };

type Options = {
  name: string;
  version?: number;
  registrars: Registrars[];
  log?: DBLogger;
};

export class IndexedDatabase<T extends StringRecord<Document>> {
  readonly #collections = new Map<keyof T, Collection<T[keyof T]>>();
  readonly #db: Promise<IDBPDatabase<unknown>>;

  constructor(readonly options: Options) {
    this.#db = openDB(options.name, options.version ?? 1, {
      upgrade: (db: IDBPDatabase) => {
        for (const { name, indexes = [] } of options.registrars) {
          const store = db.createObjectStore(name as string, { keyPath: "id" });
          store.createIndex("id", "id", { unique: true });
          store.createIndex("$meta.createdAt", "$meta.createdAt", { unique: false });
          store.createIndex("$meta.updatedAt", "$meta.updatedAt", { unique: false });
          for (const [keyPath, options] of indexes) {
            store.createIndex(keyPath, keyPath, options);
          }
        }
      }
    });
    for (const { name } of options.registrars) {
      this.#collections.set(name, new Collection(name, new IndexedDbStorage(name, this.#db, options.log ?? log)));
    }
  }

  /*
   |--------------------------------------------------------------------------------
   | Fetchers
   |--------------------------------------------------------------------------------
   */

  collection<D extends T[Name], Name extends keyof T = keyof T>(name: Name): Collection<D> {
    const collection = this.#collections.get(name);
    if (collection === undefined) {
      throw new Error(`Collection '${name as string}' not found`);
    }
    return collection as Collection<D>;
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  async export(name: string, options?: { offset?: string; limit?: number }): Promise<any[]> {
    return (await this.#db).getAll(name, options?.offset, options?.limit) ?? [];
  }

  async flush() {
    for (const collection of this.#collections.values()) {
      collection.flush();
    }
  }

  close() {
    this.#db.then((db) => db.close());
  }
}
