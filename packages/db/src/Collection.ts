import { Query } from "mingo";
import type { Cursor } from "mingo/cursor";
import type { RawObject } from "mingo/types";
import { Observable } from "rxjs";

import { observe, observeOne } from "./Observe";
import { Document, DocumentNotFoundError, PartialDocument, Storage, Update } from "./Storage";
import { IndexedDbStorage } from "./Storage/Adapters/IndexedDbStorage";
import { MemoryStorage } from "./Storage/Adapters/MemoryStorage";
import { InsertException, InsertManyResult, InsertResult } from "./Storage/Operators/Insert";
import { RemoveResult } from "./Storage/Operators/Remove";
import { UpdateOneException, UpdateResult } from "./Storage/Operators/Update";

/*
 |--------------------------------------------------------------------------------
 | Collection
 |--------------------------------------------------------------------------------
 */

export class Collection<D extends Document = any> {
  readonly name: string;
  readonly storage: Storage<D>;

  constructor(name: string, storage: typeof IndexedDbStorage | typeof MemoryStorage) {
    this.name = name;
    this.storage = new storage<D>(name);
  }

  /*
   |--------------------------------------------------------------------------------
   | Mutators
   |--------------------------------------------------------------------------------
   */

  async insertOne(document: PartialDocument<D>): Promise<InsertResult | InsertException> {
    return this.storage.insert(document);
  }

  async insertMany(documents: PartialDocument<D>[]): Promise<InsertManyResult> {
    return new InsertManyResult(
      await Promise.all(
        documents.map((document) => {
          return this.storage.insert(document);
        })
      )
    );
  }

  async updateOne(criteria: RawObject, update: Update["operators"]): Promise<UpdateResult> {
    const document = await this.findOne(criteria);
    if (document === undefined) {
      return new UpdateResult([new UpdateOneException(false, new DocumentNotFoundError(criteria))]);
    }
    return new UpdateResult([await this.storage.update(document.id, criteria, update)]);
  }

  async updateMany(criteria: RawObject, update: Update["operators"]): Promise<UpdateResult> {
    const documents = await this.find(criteria);
    const matchedCount = documents.length;
    if (matchedCount === 0) {
      return new UpdateResult();
    }
    return new UpdateResult(
      await Promise.all(
        documents.map((document) => {
          return this.storage.update(document.id, criteria, update);
        })
      )
    );
  }

  async replaceOne(criteria: RawObject, document: D): Promise<UpdateResult> {
    const { id } = (await this.findOne(criteria)) ?? {};
    if (id === undefined) {
      return new UpdateResult();
    }
    return new UpdateResult([await this.storage.replace(id, document)]);
  }

  async remove(criteria: RawObject, options?: { justOne: boolean }): Promise<RemoveResult> {
    const documents = await this.find(criteria);
    if (documents.length > 0 && options?.justOne === true) {
      return new RemoveResult([await this.storage.remove(documents[0].id)]);
    }
    return new RemoveResult(await Promise.all(documents.map((document) => this.storage.remove(document.id))));
  }

  /*
   |--------------------------------------------------------------------------------
   | Observers
   |--------------------------------------------------------------------------------
   */

  observe(criteria: RawObject = {}, options?: Options): Observable<D[]> {
    return new Observable<D[]>((subscriber) => {
      return observe(this, criteria, options, subscriber.next as any);
    });
  }

  observeOne(criteria: RawObject = {}): Observable<D | undefined> {
    return new Observable<D | undefined>((subscriber) => {
      return observeOne(this, criteria, subscriber.next as any);
    });
  }

  /*
   |--------------------------------------------------------------------------------
   | Queries
   |--------------------------------------------------------------------------------
   */

  /**
   * Retrieve a record by the document 'id' key.
   *
   * @remarks
   *
   * This is a optimized operation that skips the Mingo Query step and attempts to
   * retrieve the document directly from the collections document Map.
   */
  async findById(id: string): Promise<D | undefined> {
    return this.storage.waitForReady().then(() => this.storage.getDocument(id));
  }

  /**
   * Performs a mingo criteria search over the collection data and returns any
   * documents matching the provided criteria and options.
   *
   * @url https://github.com/kofrasa/mingo
   */
  async find(criteria: RawObject = {}, options?: Options): Promise<D[]> {
    return this.#query(criteria, options).then((cursor) => {
      return cursor.all() as D[];
    });
  }

  /**
   * Performs a mingo criteria search over the collection data and returns
   * a single document if one was found matching the criteria and options.
   *
   * @url https://github.com/kofrasa/mingo
   */
  async findOne(criteria: RawObject = {}, options?: Options): Promise<D | undefined> {
    return this.#query(criteria, options).then((cursor) => {
      const documents = cursor.all() as D[];
      if (documents.length > 0) {
        return documents[0];
      }
      return undefined;
    });
  }

  /**
   * Performs a mingo criteria search over the collection data and returns
   * a document count of all documents found matching the criteria and options.
   *
   * @url https://github.com/kofrasa/mingo
   */
  async count(criteria: RawObject = {}): Promise<number> {
    return this.#query(criteria).then((cursor) => cursor.count());
  }

  /**
   * Performs a mingo criteria search over the collection data and returns
   * the mingo query cursor which can be further utilized for advanced
   * querying.
   *
   * @url https://github.com/kofrasa/mingo#searching-and-filtering
   */
  async query(criteria: RawObject = {}): Promise<Cursor> {
    await this.storage.waitForReady();
    return new Query(criteria).find(await this.storage.getDocuments());
  }

  /**
   * Removes all documents from the storage instance.
   */
  flush(): void {
    this.storage.flush();
  }

  /*
   |--------------------------------------------------------------------------------
   | Helpers
   |--------------------------------------------------------------------------------
   */

  async #query(criteria: RawObject = {}, options?: Options): Promise<Cursor> {
    const cursor = await this.query(criteria);
    if (options) {
      return addOptions(cursor, options);
    }
    return cursor;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

export function addOptions(cursor: Cursor, options: Options): Cursor {
  if (options.sort) {
    cursor.sort(options.sort);
  }
  if (options.skip !== undefined) {
    cursor.skip(options.skip);
  }
  if (options.limit !== undefined) {
    cursor.limit(options.limit);
  }
  return cursor;
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Options = {
  sort?: {
    [key: string]: 1 | -1;
  };
  skip?: number;
  limit?: number;
};
