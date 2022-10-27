import { IDBPDatabase, openDB } from "idb/with-async-ittr";

import { Collection } from "../collection";
import { IndexedDbStorage } from "./indexed.storage";
import { Registrars } from "./registrars";

export class IndexedDatabase {
  readonly #registrars: Registrars[] = [];

  #db?: IDBPDatabase;

  constructor(readonly name: string) {}

  async start(): Promise<void> {
    this.#db = await openDB(this.name, 1, {
      upgrade: (db: IDBPDatabase) => {
        for (const { name } of this.#registrars) {
          db.createObjectStore(name, { keyPath: "id" }).createIndex("id", "id", { unique: true });
        }
      }
    });
    for (const { name, model } of this.#registrars) {
      model.$collection = new Collection(name, new IndexedDbStorage(name, this.#db));
    }
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
