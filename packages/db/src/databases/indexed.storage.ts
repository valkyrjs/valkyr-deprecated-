import { getId } from "@valkyr/security";
import { IDBPDatabase } from "idb";
import { Query } from "mingo";
import { RawObject } from "mingo/types";

import {
  addOptions,
  Document,
  DuplicateDocumentError,
  InsertResult,
  Options,
  PartialDocument,
  RemoveResult,
  Storage,
  update,
  UpdateOperators,
  UpdateResult
} from "../storage";

export class IndexedDbStorage<D extends Document = Document> extends Storage<D> {
  readonly #db: IDBPDatabase;

  #cache = new Map<string, D>();

  constructor(name: string, db: IDBPDatabase) {
    super(name);
    this.#db = db;
  }

  async has(id: string): Promise<boolean> {
    if (this.#cache.has(id) === true) {
      return true;
    }
    const document = await this.#db.getFromIndex(this.name, "id", id);
    if (document !== undefined) {
      return true;
    }
    return false;
  }

  async insertOne(data: PartialDocument<D>): Promise<InsertResult> {
    const document = { ...data, id: data.id ?? getId() } as D;
    if (await this.has(document.id)) {
      throw new DuplicateDocumentError(document, this);
    }
    this.#cache.set(document.id, document);
    this.broadcast("insert", document);
    this.#db.put(this.name, document).then(() => {
      this.#cache.delete(document.id);
    });
    return new InsertResult([document.id]);
  }

  async insertMany(data: PartialDocument<D>[]): Promise<InsertResult> {
    const tx = await this.#db.transaction(this.name, "readwrite");
    const ids: string[] = [];
    Promise.all([
      ...data.map((data) => {
        const document = { ...data, id: data.id ?? getId() } as D;

        ids.push(document.id);

        this.#cache.set(document.id, document);
        this.broadcast("insert", document);

        return tx.store.add(document).then(() => {
          this.#cache.delete(document.id);
        });
      }),
      tx.done
    ]);
    return new InsertResult(ids);
  }

  async findByIndex(index: string, value: any): Promise<D[]> {
    return this.#db.getAllFromIndex(this.name, index, value);
  }

  async find(criteria: RawObject, options?: Options): Promise<D[]> {
    let cursor = new Query(criteria ?? {}).find([
      ...(await this.#db.getAll(this.name)),
      ...Array.from(this.#cache.values())
    ]);
    if (options !== undefined) {
      cursor = addOptions(cursor, options);
    }
    return cursor.all() as D[];
  }

  async update(criteria: RawObject, operators: UpdateOperators, options?: { justOne: boolean }): Promise<UpdateResult> {
    const query = new Query(criteria);

    let matchedCount = 0;
    let modifiedCount = 0;

    const tx = this.#db.transaction(this.name, "readwrite");
    for await (const cursor of tx.store) {
      if (query.test(cursor.value) === true) {
        matchedCount += 1;

        const { modified, document } = update<D>(criteria, operators, cursor.value);
        if (modified === true) {
          modifiedCount += 1;
          this.#cache.set(document.id, document);
          this.broadcast("update", document);
          cursor.update(document).then(() => {
            this.#cache.delete(document.id);
          });
        }

        if (options?.justOne === true) {
          break;
        }
      }
    }

    return new UpdateResult(matchedCount, modifiedCount);
  }

  async replace(criteria: RawObject, document: D): Promise<UpdateResult> {
    const query = new Query(criteria);

    let matchedCount = 0;
    let modifiedCount = 0;

    const tx = this.#db.transaction(this.name, "readwrite");
    for await (const cursor of tx.store) {
      if (query.test(cursor.value) === true) {
        matchedCount += 1;
        modifiedCount += 1;

        this.#cache.set(document.id, document);
        this.broadcast("update", document);

        cursor.update(document).then(() => {
          this.#cache.delete(document.id);
        });
      }
    }

    return new UpdateResult(matchedCount, modifiedCount);
  }

  async remove(criteria: RawObject): Promise<RemoveResult> {
    let count = 0;
    if (typeof criteria.id === "string") {
      const id = criteria.id;
      this.broadcast("remove", { id } as D);
      await this.#db.delete(this.name, id).then(() => {
        this.#cache.delete(id);
        count += 1;
      });
    } else if (Object.keys(criteria).length === 0) {
      const ids = await this.#db.getAllKeys(this.name);
      for (const id of ids) {
        this.broadcast("remove", { id } as D);
        this.#db.delete(this.name, id).then(() => {
          this.#cache.delete(id as string);
          count += 1;
        });
      }
    } else {
      const query = new Query(criteria);
      const tx = this.#db.transaction(this.name, "readwrite");
      for await (const cursor of tx.store) {
        if (query.test(cursor.value) === true) {
          this.broadcast("remove", cursor.value);
          cursor.delete().then(() => {
            this.#cache.delete(cursor.value.id);
          });
          count += 1;
        }
      }
    }
    return new RemoveResult(count);
  }

  async count(): Promise<number> {
    return this.#db.count(this.name);
  }

  async flush(): Promise<void> {
    this.#db.clear(this.name);
  }
}
