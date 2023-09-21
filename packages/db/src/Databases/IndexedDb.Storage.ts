import type { IDBPDatabase } from "idb";
import { Query } from "mingo";
import type { AnyVal } from "mingo/types";
import { nanoid } from "nanoid";

import { DBLogger, InsertLog, QueryLog, RemoveLog, ReplaceLog, UpdateLog } from "../Logger.js";
import {
  addOptions,
  DuplicateDocumentError,
  getInsertManyResult,
  getInsertOneResult,
  Index,
  InsertManyResult,
  InsertOneResult,
  Options,
  RemoveResult,
  Storage,
  update,
  UpdateResult
} from "../Storage/mod.js";
import { Document, Filter, UpdateFilter, WithId } from "../Types.js";
import { IndexedDbCache } from "./IndexedDb.Cache.js";

const OBJECT_PROTOTYPE = Object.getPrototypeOf({}) as AnyVal;
const OBJECT_TAG = "[object Object]";

export class IndexedDbStorage<TSchema extends Document = Document> extends Storage<TSchema> {
  readonly #cache = new IndexedDbCache<TSchema>();
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

  async insertOne(data: Partial<WithId<TSchema>>): Promise<InsertOneResult> {
    const logger = new InsertLog(this.name);

    const document = { ...data, id: data.id ?? nanoid() } as any;
    if (await this.has(document.id)) {
      throw new DuplicateDocumentError(document, this as any);
    }
    await this.db.transaction(this.name, "readwrite", { durability: "relaxed" }).store.add(document);

    this.broadcast("insertOne", document);
    this.#cache.flush();

    this.log(logger.result());

    return getInsertOneResult(document);
  }

  async insertMany(data: Partial<WithId<TSchema>>[]): Promise<InsertManyResult> {
    const logger = new InsertLog(this.name);

    const documents: WithId<TSchema>[] = [];

    const tx = this.db.transaction(this.name, "readwrite", { durability: "relaxed" });
    await Promise.all(
      data.map((data) => {
        const document = { ...data, id: data.id ?? nanoid() } as WithId<TSchema>;
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

  async findById(id: string): Promise<WithId<TSchema> | undefined> {
    return this.db.getFromIndex(this.name, "id", id);
  }

  async find(filter: Filter<WithId<TSchema>>, options: Options = {}): Promise<WithId<TSchema>[]> {
    const logger = new QueryLog(this.name, { filter, options });

    const hashCode = this.#cache.hash(filter, options);
    const cached = this.#cache.get(hashCode);
    if (cached !== undefined) {
      this.log(logger.result({ cached: true }));
      return cached;
    }

    const indexes = this.#resolveIndexes(filter);
    let cursor = new Query(filter).find(await this.#getAll({ ...options, ...indexes }));
    if (options !== undefined) {
      cursor = addOptions(cursor, options);
    }

    const documents = cursor.all() as WithId<TSchema>[];
    this.#cache.set(this.#cache.hash(filter, options), documents);

    this.log(logger.result());

    return documents;
  }

  /**
   * TODO: Prototype! Needs to cover more mongodb query cases and investigation around
   * nested indexing in indexeddb.
   */
  #resolveIndexes(filter: any): { index?: { [key: string]: any } } {
    const indexNames = this.db.transaction(this.name, "readonly").store.indexNames;
    const index: { [key: string]: any } = {};
    for (const key in filter) {
      if (indexNames.contains(key) === true) {
        let val: any;
        if (isObject(filter[key]) === true) {
          if (filter[key]["$in"] !== undefined) {
            val = filter[key]["$in"];
          }
        } else {
          val = filter[key];
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

  async updateOne(filter: Filter<WithId<TSchema>>, operators: UpdateFilter<TSchema>): Promise<UpdateResult> {
    if (typeof filter.id === "string") {
      return this.#update(filter.id, filter, operators);
    }
    const documents = await this.find(filter);
    if (documents.length > 0) {
      return this.#update(documents[0].id, filter, operators);
    }
    return new UpdateResult(0, 0);
  }

  async updateMany(filter: Filter<WithId<TSchema>>, operators: UpdateFilter<TSchema>): Promise<UpdateResult> {
    const logger = new UpdateLog(this.name, { filter, operators });

    const ids = await this.find(filter).then((data) => data.map((d) => d.id));

    const documents: WithId<TSchema>[] = [];
    let modifiedCount = 0;

    const tx = this.db.transaction(this.name, "readwrite", { durability: "relaxed" });
    await Promise.all(
      ids.map((id) =>
        tx.store.get(id).then((current) => {
          if (current === undefined) {
            return;
          }
          const { modified, document } = update<TSchema>(filter, operators, current);
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

  async replace(filter: Filter<WithId<TSchema>>, document: TSchema): Promise<UpdateResult> {
    const logger = new ReplaceLog(this.name, document);

    const ids = await this.find(filter).then((data) => data.map((d) => d.id));

    const documents: WithId<TSchema>[] = [];
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

  async #update(
    id: string | number,
    filter: Filter<WithId<TSchema>>,
    operators: UpdateFilter<TSchema>
  ): Promise<UpdateResult> {
    const logger = new UpdateLog(this.name, { filter, operators });

    const tx = this.db.transaction(this.name, "readwrite", { durability: "relaxed" });

    const current = await tx.store.get(id);
    if (current === undefined) {
      await tx.done;
      return new UpdateResult(0, 0);
    }

    const { modified, document } = await update<TSchema>(filter, operators, current);
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

  async remove(filter: Filter<WithId<TSchema>>): Promise<RemoveResult> {
    const logger = new RemoveLog(this.name, { filter });

    const documents = await this.find(filter);
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

  async count(filter?: Filter<WithId<TSchema>>): Promise<number> {
    if (filter !== undefined) {
      return (await this.find(filter)).length;
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
