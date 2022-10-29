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
import { IndexedDbTransactionQueue, TransactionHandler } from "./indexed.queue";

const OBJECT_PROTOTYPE = Object.getPrototypeOf({}) as AnyVal;
const OBJECT_TAG = "[object Object]";

export class IndexedDbStorage<D extends Document = Document> extends Storage<D> {
  readonly #db: IDBPDatabase;
  readonly #queue: IndexedDbTransactionQueue;
  readonly #cache = new Map<string, D>();

  constructor(name: string, db: IDBPDatabase, readonly log: (message: string) => void) {
    super(name);
    this.#db = db;
    this.#queue = new IndexedDbTransactionQueue(name, db, log);
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

    this.#queue.push([
      (tx) =>
        tx.store.put(document).then(() => {
          this.#cache.delete(document.id);
        })
    ]);

    return new InsertResult([document.id]);
  }

  async insertMany(data: PartialDocument<D>[]): Promise<InsertResult> {
    const ids: string[] = [];

    this.#queue.push(
      data.map((data) => {
        const document = { ...data, id: data.id ?? getId() } as D;

        ids.push(document.id);

        this.#cache.set(document.id, document);
        this.broadcast("insert", document);

        return (tx) =>
          tx.store.add(document).then(() => {
            this.#cache.delete(document.id);
          });
      })
    );

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
    const data = await this.find(criteria, { limit: options?.justOne === true ? 1 : undefined });

    let modifiedCount = 0;

    const txs: TransactionHandler[] = [];

    for (const item of data) {
      const { modified, document } = update<D>(criteria, operators, item);
      if (modified === true) {
        modifiedCount += 1;
        this.#cache.set(document.id, document);
        this.broadcast("update", document);
        txs.push((tx) =>
          tx.store.put(document).then(() => {
            this.#cache.delete(document.id);
          })
        );
      }
    }

    this.#queue.push(txs);

    return new UpdateResult(data.length, modifiedCount);
  }

  async replace(criteria: RawObject, document: D): Promise<UpdateResult> {
    const data = await this.find(criteria);

    let matchedCount = 0;
    let modifiedCount = 0;

    this.#queue.push(
      data.map((data) => {
        matchedCount += 1;
        modifiedCount += 1;

        this.#cache.set(data.id, document);
        this.broadcast("update", document);

        return (tx) => tx.store.put(document, data.id);
      })
    );

    return new UpdateResult(matchedCount, modifiedCount);
  }

  /*
   |--------------------------------------------------------------------------------
   | Remove
   |--------------------------------------------------------------------------------
   */

  async remove(criteria: RawObject): Promise<RemoveResult> {
    const data = await this.find(criteria);
    const tx = this.#db.transaction(this.name, "readwrite");
    await Promise.all([
      ...data.map((data) => {
        this.broadcast("remove", data);
        return tx.store.delete(data.id).then(() => {
          this.#cache.delete(data.id);
        });
      }),
      tx.done
    ]);
    return new RemoveResult(data.length);
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
