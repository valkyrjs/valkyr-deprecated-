import { getId } from "@valkyr/security";
import type { IDBPDatabase } from "idb";
import { Query } from "mingo";
import type { AnyVal, RawObject } from "mingo/types";

import {
  addOptions,
  Document,
  DuplicateDocumentError,
  Index,
  InsertResult,
  Options,
  PartialDocument,
  RemoveResult,
  Storage,
  update,
  UpdateOperators,
  UpdateResult
} from "../storage";

const OBJECT_PROTOTYPE = Object.getPrototypeOf({}) as AnyVal;
const OBJECT_TAG = "[object Object]";

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

  /*
   |--------------------------------------------------------------------------------
   | Insert
   |--------------------------------------------------------------------------------
   */

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

  /*
   |--------------------------------------------------------------------------------
   | Read
   |--------------------------------------------------------------------------------
   */

  async findById(id: string): Promise<D | undefined> {
    return this.#db.getFromIndex(this.name, "id", id);
  }

  async find(criteria: RawObject, options: Options = {}): Promise<D[]> {
    this.#resolveIndexes(criteria, options);
    let cursor = new Query(criteria ?? {}).find([
      ...(await this.#getAll(options)),
      ...Array.from(this.#cache.values())
    ]);
    if (options !== undefined) {
      cursor = addOptions(cursor, options);
    }
    return cursor.all() as D[];
  }

  /**
   * TODO: Prototype! Needs to cover more mongodb query cases and investigation around
   * nested indexing in indexeddb.
   */
  async #resolveIndexes(criteria: any, options: Options) {
    const indexNames = this.#db.transaction(this.name, "readonly").store.indexNames;
    for (const key in criteria) {
      if (indexNames.contains(key) === true) {
        let val: any;
        if (isObject(criteria[key]) === true) {
          if (criteria[key]["$in"] !== undefined) {
            val = criteria[key]["$in"];
          }
        } else {
          val = criteria[key];
        }
        if (val !== undefined) {
          if (options.index === undefined) {
            options.index = {};
          }
          options.index[key] = val;
        }
      }
    }
  }

  async #getAll({ index, offset, range, limit }: Options) {
    if (index !== undefined) {
      return this.#getAllByIndex(index);
    }
    if (range !== undefined) {
      return this.#db.getAll(this.name, IDBKeyRange.bound(range.from, range.to));
    }
    if (offset !== undefined) {
      return this.#getAllByOffset(offset.value, offset.direction, limit);
    }
    return this.#db.getAll(this.name, undefined, limit);
  }

  async #getAllByIndex(index: Index) {
    let result = new Set();
    for (const key in index) {
      const value = index[key];
      if (Array.isArray(value)) {
        for (const idx of value) {
          const values = await this.#db.getAllFromIndex(this.name, key, idx);
          result = new Set([...result, ...values]);
        }
      } else {
        const values = await this.#db.getAllFromIndex(this.name, key, value);
        result = new Set([...result, ...values]);
      }
    }
    return result;
  }

  async #getAllByOffset(value: string, direction: 1 | -1, limit?: number) {
    if (direction === 1) {
      return this.#db.getAll(this.name, IDBKeyRange.lowerBound(value), limit);
    }
    return this.#getAllByDescOffset(value, limit);
  }

  async #getAllByDescOffset(value: string, limit?: number) {
    if (limit === undefined) {
      return this.#db.getAll(this.name, IDBKeyRange.upperBound(value));
    }
    const result = [];
    let cursor = await this.#db
      .transaction(this.name, "readonly")
      .store.openCursor(IDBKeyRange.upperBound(value), "prev");
    for (let i = 0; i < limit; i++) {
      if (cursor === null) {
        break;
      }
      result.push(cursor.value);
      cursor = await cursor.continue();
    }
    return result.reverse();
  }

  /*
   |--------------------------------------------------------------------------------
   | Update
   |--------------------------------------------------------------------------------
   */

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

  /*
   |--------------------------------------------------------------------------------
   | Remove
   |--------------------------------------------------------------------------------
   */

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

  /*
   |--------------------------------------------------------------------------------
   | Count
   |--------------------------------------------------------------------------------
   */

  async count(criteria?: RawObject): Promise<number> {
    if (criteria !== undefined) {
      return new Query(criteria).find(await this.#db.getAll(this.name)).count();
    }
    return this.#db.count(this.name);
  }

  /*
   |--------------------------------------------------------------------------------
   | Flush
   |--------------------------------------------------------------------------------
   */

  async flush(): Promise<void> {
    this.#db.clear(this.name);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Utils
 |--------------------------------------------------------------------------------
 */

export function isObject(v: AnyVal): v is object {
  if (!v) {
    return false;
  }
  const proto = Object.getPrototypeOf(v) as AnyVal;
  return (proto === OBJECT_PROTOTYPE || proto === null) && OBJECT_TAG === Object.prototype.toString.call(v);
}
