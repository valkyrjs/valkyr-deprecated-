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
import { IndexedCache } from "./indexed.cache";

const OBJECT_PROTOTYPE = Object.getPrototypeOf({}) as AnyVal;
const OBJECT_TAG = "[object Object]";

export class IndexedDbStorage<D extends Document = Document> extends Storage<D> {
  readonly #db: IDBPDatabase;
  readonly #cache = new IndexedCache<D>();

  constructor(name: string, db: IDBPDatabase, readonly log: (message: string) => void) {
    super(name);
    this.#db = db;
  }

  async has(id: string): Promise<boolean> {
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
    const t0 = performance.now();
    const document = { ...data, id: data.id ?? getId() } as D;
    if (await this.has(document.id)) {
      throw new DuplicateDocumentError(document, this);
    }
    await this.#db.transaction(this.name, "readwrite", { durability: "relaxed" }).store.add(document);

    this.broadcast("insertOne", document);
    this.log(`@valkyr/db > 1 ${this.name} inserted in ${(performance.now() - t0).toFixed(2)} milliseconds`);

    this.#cache.flush();

    return new InsertResult([document]);
  }

  async insertMany(data: PartialDocument<D>[]): Promise<InsertResult> {
    const documents: D[] = [];

    const t0 = performance.now();

    const tx = this.#db.transaction(this.name, "readwrite", { durability: "relaxed" });
    await Promise.all(
      data.map((data) => {
        const document = { ...data, id: data.id ?? getId() } as D;
        documents.push(document);
        return tx.store.add(document);
      })
    );
    await tx.done;

    this.broadcast("insertMany", documents);
    this.log(
      `@valkyr/db > ${documents.length} ${this.name} inserted in ${(performance.now() - t0).toFixed(2)} milliseconds`
    );

    this.#cache.flush();

    return new InsertResult(documents);
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
    const hashCode = this.#cache.hash(criteria, options);

    const t0 = performance.now();
    const cached = this.#cache.get(hashCode);
    if (cached !== undefined) {
      this.log(
        `@valkyr/db > ${cached.length} [cached] ${this.name} found in ${(performance.now() - t0).toFixed(
          2
        )} milliseconds`
      );
      return cached;
    }

    const indexes = this.#resolveIndexes(criteria);
    let cursor = new Query(criteria).find(await this.#getAll({ ...options, ...indexes }));
    if (options !== undefined) {
      cursor = addOptions(cursor, options);
    }
    const documents = cursor.all() as D[];
    this.log(
      `@valkyr/db > ${documents.length} ${this.name} found in ${(performance.now() - t0).toFixed(2)} milliseconds`
    );
    this.#cache.set(this.#cache.hash(criteria, options), documents);
    return documents;
  }

  /**
   * TODO: Prototype! Needs to cover more mongodb query cases and investigation around
   * nested indexing in indexeddb.
   */
  #resolveIndexes(criteria: any): { index?: { [key: string]: any } } {
    const indexNames = this.#db.transaction(this.name, "readonly").store.indexNames;
    const index: { [key: string]: any } = {};
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
          index[key] = val;
        }
      }
    }
    if (Object.keys(index).length > 0) {
      return { index };
    }
    return {};
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
    return Array.from(result);
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

  async updateOne(criteria: RawObject, operators: UpdateOperators): Promise<UpdateResult> {
    if (typeof criteria.id === "string") {
      return this.#update(criteria.id, criteria, operators);
    }
    const documents = await this.find(criteria);
    if (documents.length > 0) {
      return this.#update(documents[0].id, criteria, operators);
    }
    return new UpdateResult(0, 0);
  }

  async updateMany(criteria: RawObject, operators: UpdateOperators): Promise<UpdateResult> {
    const ids = await this.find(criteria).then((data) => data.map((d) => d.id));

    const documents: D[] = [];
    let modifiedCount = 0;

    const t0 = performance.now();
    const tx = this.#db.transaction(this.name, "readwrite", { durability: "relaxed" });
    await Promise.all(
      ids.map((id) =>
        tx.store.get(id).then((current) => {
          if (current === undefined) {
            return;
          }
          const { modified, document } = update(criteria, operators, current);
          if (modified) {
            modifiedCount += 1;
            documents.push(document);
            return tx.store.put(document);
          }
        })
      )
    );

    await tx.done;

    this.log(
      `@valkyr/db > ${modifiedCount} ${this.name} updated in ${(performance.now() - t0).toFixed(2)} milliseconds`
    );
    this.broadcast("updateMany", documents);

    this.#cache.flush();

    return new UpdateResult(ids.length, modifiedCount);
  }

  async replace(criteria: RawObject, document: D): Promise<UpdateResult> {
    const t0 = performance.now();
    const ids = await this.find(criteria).then((data) => data.map((d) => d.id));

    const documents: D[] = [];
    const count = ids.length;

    const tx = this.#db.transaction(this.name, "readwrite", { durability: "relaxed" });
    await Promise.all(
      ids.map((id) => {
        const next = { ...document, id };
        documents.push(next);
        return tx.store.put(next);
      })
    );
    await tx.done;

    this.broadcast("updateMany", documents);
    this.log(`@valkyr/db > ${count} ${this.name} replaced in ${(performance.now() - t0).toFixed(2)} milliseconds`);

    this.#cache.flush();

    return new UpdateResult(count, count);
  }

  async #update(id: string, criteria: RawObject, operators: UpdateOperators): Promise<UpdateResult> {
    const t0 = performance.now();
    const tx = this.#db.transaction(this.name, "readwrite", { durability: "relaxed" });

    const current = await tx.store.get(id);
    if (current === undefined) {
      await tx.done;
      return new UpdateResult(0, 0);
    }

    const { modified, document } = await update(criteria, operators, current);
    if (modified === true) {
      await tx.store.put(document);
    }
    await tx.done;

    if (modified === true) {
      this.broadcast("updateOne", document);
      this.log(`@valkyr/db > 1 ${this.name} updated in ${(performance.now() - t0).toFixed(2)} milliseconds`);
      this.#cache.flush();
      return new UpdateResult(1, 1);
    }

    return new UpdateResult(1);
  }

  /*
   |--------------------------------------------------------------------------------
   | Remove
   |--------------------------------------------------------------------------------
   */

  async remove(criteria: RawObject): Promise<RemoveResult> {
    const t0 = performance.now();

    const documents = await this.find(criteria);
    const tx = this.#db.transaction(this.name, "readwrite");

    await Promise.all(documents.map((data) => tx.store.delete(data.id)));
    await tx.done;

    this.broadcast("remove", documents);
    this.log(
      `@valkyr/db > ${documents.length} ${this.name} removed in ${(performance.now() - t0).toFixed(2)} milliseconds`
    );

    this.#cache.flush();

    return new RemoveResult(documents.length);
  }

  /*
   |--------------------------------------------------------------------------------
   | Count
   |--------------------------------------------------------------------------------
   */

  async count(criteria?: RawObject): Promise<number> {
    if (criteria !== undefined) {
      return (await this.find(criteria)).length;
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
    this.#cache.flush();
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
