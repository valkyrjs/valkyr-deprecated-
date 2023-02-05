import type { IDBPDatabase } from "idb";
import { Query } from "mingo";
import type { AnyVal, RawObject } from "mingo/types";

import { crypto } from "../Crypto";
import { DBLogger, InsertLog, QueryLog, RemoveLog, ReplaceLog, UpdateLog } from "../Logger";
import {
  addOptions,
  Document,
  DuplicateDocumentError,
  getInsertManyResult,
  getInsertOneResult,
  Index,
  InsertManyResult,
  InsertOneResult,
  Options,
  PartialDocument,
  RemoveResult,
  Storage,
  update,
  UpdateOperators,
  UpdateResult
} from "../Storage";
import { IndexedDbCache } from "./IndexedDb.Cache";

const OBJECT_PROTOTYPE = Object.getPrototypeOf({}) as AnyVal;
const OBJECT_TAG = "[object Object]";

export class IndexedDbStorage<D extends Document = Document> extends Storage<D> {
  readonly #cache = new IndexedDbCache<D>();
  readonly #promise: Promise<IDBPDatabase>;

  #db?: IDBPDatabase;

  constructor(name: string, promise: Promise<IDBPDatabase>, readonly log: DBLogger) {
    super(name);
    this.#promise = promise;
  }

  async resolve() {
    if (this.#db === undefined) {
      this.#db = await this.#promise;
    }
    return this;
  }

  async has(id: string): Promise<boolean> {
    const document = await this.db.getFromIndex(this.name, "id", id);
    if (document !== undefined) {
      return true;
    }
    return false;
  }

  get db() {
    if (this.#db === undefined) {
      throw new Error("Database not initialized");
    }
    return this.#db;
  }

  /*
   |--------------------------------------------------------------------------------
   | Insert
   |--------------------------------------------------------------------------------
   */

  async insertOne(data: PartialDocument<D>): Promise<InsertOneResult> {
    const logger = new InsertLog(this.name);

    const document = { ...data, id: data.id ?? crypto.randomUUID() } as D;
    if (await this.has(document.id)) {
      throw new DuplicateDocumentError(document, this);
    }
    await this.db.transaction(this.name, "readwrite", { durability: "relaxed" }).store.add(document);

    this.broadcast("insertOne", document);
    this.#cache.flush();

    this.log(logger.result());

    return getInsertOneResult(document);
  }

  async insertMany(data: PartialDocument<D>[]): Promise<InsertManyResult> {
    const logger = new InsertLog(this.name);

    const documents: D[] = [];

    const tx = this.db.transaction(this.name, "readwrite", { durability: "relaxed" });
    await Promise.all(
      data.map((data) => {
        const document = { ...data, id: data.id ?? crypto.randomUUID() } as D;
        documents.push(document);
        return tx.store.add(document);
      })
    );
    await tx.done;

    this.broadcast("insertMany", documents);
    this.#cache.flush();

    this.log(logger.result());

    return getInsertManyResult(documents);
  }

  /*
   |--------------------------------------------------------------------------------
   | Read
   |--------------------------------------------------------------------------------
   */

  async findById(id: string): Promise<D | undefined> {
    return this.db.getFromIndex(this.name, "id", id);
  }

  async find(criteria: RawObject, options: Options = {}): Promise<D[]> {
    const logger = new QueryLog(this.name, { criteria, options });

    const hashCode = this.#cache.hash(criteria, options);
    const cached = this.#cache.get(hashCode);
    if (cached !== undefined) {
      this.log(logger.result({ cached: true }));
      return cached;
    }

    const indexes = this.#resolveIndexes(criteria);
    let cursor = new Query(criteria).find(await this.#getAll({ ...options, ...indexes }));
    if (options !== undefined) {
      cursor = addOptions(cursor, options);
    }

    const documents = cursor.all() as D[];
    this.#cache.set(this.#cache.hash(criteria, options), documents);

    this.log(logger.result());

    return documents;
  }

  /**
   * TODO: Prototype! Needs to cover more mongodb query cases and investigation around
   * nested indexing in indexeddb.
   */
  #resolveIndexes(criteria: any): { index?: { [key: string]: any } } {
    const indexNames = this.db.transaction(this.name, "readonly").store.indexNames;
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
      return this.db.getAll(this.name, IDBKeyRange.bound(range.from, range.to));
    }
    if (offset !== undefined) {
      return this.#getAllByOffset(offset.value, offset.direction, limit);
    }
    return this.db.getAll(this.name, undefined, limit);
  }

  async #getAllByIndex(index: Index) {
    let result = new Set();
    for (const key in index) {
      const value = index[key];
      if (Array.isArray(value)) {
        for (const idx of value) {
          const values = await this.db.getAllFromIndex(this.name, key, idx);
          result = new Set([...result, ...values]);
        }
      } else {
        const values = await this.db.getAllFromIndex(this.name, key, value);
        result = new Set([...result, ...values]);
      }
    }
    return Array.from(result);
  }

  async #getAllByOffset(value: string, direction: 1 | -1, limit?: number) {
    if (direction === 1) {
      return this.db.getAll(this.name, IDBKeyRange.lowerBound(value), limit);
    }
    return this.#getAllByDescOffset(value, limit);
  }

  async #getAllByDescOffset(value: string, limit?: number) {
    if (limit === undefined) {
      return this.db.getAll(this.name, IDBKeyRange.upperBound(value));
    }
    const result = [];
    let cursor = await this.db
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
    const logger = new UpdateLog(this.name, { criteria, operators });

    const ids = await this.find(criteria).then((data) => data.map((d) => d.id));

    const documents: D[] = [];
    let modifiedCount = 0;

    const tx = this.db.transaction(this.name, "readwrite", { durability: "relaxed" });
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

    this.broadcast("updateMany", documents);
    this.#cache.flush();

    this.log(logger.result());

    return new UpdateResult(ids.length, modifiedCount);
  }

  async replace(criteria: RawObject, document: D): Promise<UpdateResult> {
    const logger = new ReplaceLog(this.name, document);

    const ids = await this.find(criteria).then((data) => data.map((d) => d.id));

    const documents: D[] = [];
    const count = ids.length;

    const tx = this.db.transaction(this.name, "readwrite", { durability: "relaxed" });
    await Promise.all(
      ids.map((id) => {
        const next = { ...document, id };
        documents.push(next);
        return tx.store.put(next);
      })
    );
    await tx.done;

    this.broadcast("updateMany", documents);
    this.#cache.flush();

    this.log(logger.result({ count }));

    return new UpdateResult(count, count);
  }

  async #update(id: string, criteria: RawObject, operators: UpdateOperators): Promise<UpdateResult> {
    const logger = new UpdateLog(this.name, { id, criteria, operators });

    const tx = this.db.transaction(this.name, "readwrite", { durability: "relaxed" });

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
      this.log(logger.result());
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
    const logger = new RemoveLog(this.name, { criteria });

    const documents = await this.find(criteria);
    const tx = this.db.transaction(this.name, "readwrite");

    await Promise.all(documents.map((data) => tx.store.delete(data.id)));
    await tx.done;

    this.broadcast("remove", documents);
    this.#cache.flush();

    this.log(logger.result({ count: documents.length }));

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
    return this.db.count(this.name);
  }

  /*
   |--------------------------------------------------------------------------------
   | Flush
   |--------------------------------------------------------------------------------
   */

  async flush(): Promise<void> {
    await this.db.clear(this.name);
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
