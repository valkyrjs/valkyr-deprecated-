import { IDBPDatabase, openDB } from "idb/with-async-ittr";

import { Job, Storage } from "../Storage.js";
import { Worker } from "../Worker.js";

const stores = ["pending", "failed", "completed"];
const indexes: [string, IDBIndexParameters?][] = [["id", { unique: true }]];

export class IndexedStorage<W extends Worker> implements Storage<W> {
  #db?: IDBPDatabase;

  constructor(readonly name: string) {}

  get db() {
    if (this.#db === undefined) {
      throw new Error("IndexedStorage is not initialized");
    }
    return this.#db;
  }

  async init() {
    this.#db = await openDB(this.name, 1, {
      upgrade: (db: IDBPDatabase) => {
        for (const name of stores) {
          const store = db.createObjectStore(name, { keyPath: "id" });
          for (const [keyPath, options] of indexes) {
            store.createIndex(keyPath, keyPath, options);
          }
        }
      }
    });
  }

  async pending(): Promise<Job<W>[]> {
    return this.db.getAll("pending") ?? [];
  }

  async failed(): Promise<Job<W>[]> {
    return this.db.getAll("failed") ?? [];
  }

  async completed(): Promise<Job<W>[]> {
    return this.db.getAll("completed") ?? [];
  }

  async push(job: Job<W>): Promise<void> {
    await this.db.transaction("pending", "readwrite", { durability: "relaxed" }).store.add(job);
  }

  async fail(job: Job<W>): Promise<void> {
    await this.db.transaction("failed", "readwrite", { durability: "relaxed" }).store.add(job);
  }

  async complete(job: Job<W>): Promise<void> {
    await this.db.transaction("completed", "readwrite", { durability: "relaxed" }).store.add(job);
  }

  async next(): Promise<Job<W> | undefined> {
    const cursor = await this.db.transaction("pending", "readwrite").store.openCursor();
    if (cursor !== null) {
      const job = cursor.value;
      return cursor.delete().then(() => job);
    }
    return undefined;
  }

  async flush(): Promise<void> {
    await Promise.all([this.db.clear("pending"), this.db.clear("failed"), this.db.clear("completed")]);
  }
}
