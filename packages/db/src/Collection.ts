import type { RawObject } from "mingo/types";
import { Observable, Subscription } from "rxjs";

import { IndexedDbStorage } from "./Databases/IndexedDb.Storage.js";
import { MemoryStorage } from "./Databases/MemoryDb.Storage.js";
import { observe, observeOne } from "./Observe/mod.js";
import {
  ChangeEvent,
  Document,
  InsertManyResult,
  InsertOneResult,
  Options,
  PartialDocument,
  RemoveResult,
  UpdateOperators,
  UpdateResult
} from "./Storage/mod.js";

/*
 |--------------------------------------------------------------------------------
 | Collection
 |--------------------------------------------------------------------------------
 */

export class Collection<D extends Document = any> {
  constructor(readonly name: string, readonly storage: IndexedDbStorage<D> | MemoryStorage<D>) {}

  get observable() {
    return this.storage.observable;
  }

  /*
   |--------------------------------------------------------------------------------
   | Mutators
   |--------------------------------------------------------------------------------
   */

  async insertOne(document: PartialDocument<D>): Promise<InsertOneResult> {
    return this.storage.resolve().then((storage) => storage.insertOne(document));
  }

  async insertMany(documents: PartialDocument<D>[]): Promise<InsertManyResult> {
    return this.storage.resolve().then((storage) => storage.insertMany(documents));
  }

  async updateOne(criteria: RawObject, update: UpdateOperators): Promise<UpdateResult> {
    return this.storage.resolve().then((storage) => storage.updateOne(criteria, update));
  }

  async updateMany(criteria: RawObject, update: UpdateOperators): Promise<UpdateResult> {
    return this.storage.resolve().then((storage) => storage.updateMany(criteria, update));
  }

  async replaceOne(criteria: RawObject, document: D): Promise<UpdateResult> {
    return this.storage.resolve().then((storage) => storage.replace(criteria, document));
  }

  async remove(criteria: RawObject): Promise<RemoveResult> {
    return this.storage.resolve().then((storage) => storage.remove(criteria));
  }

  /*
   |--------------------------------------------------------------------------------
   | Observers
   |--------------------------------------------------------------------------------
   */

  subscribe(criteria?: RawObject, options?: SubscribeToSingle, next?: (document: D | undefined) => void): Subscription;
  subscribe(
    criteria?: RawObject,
    options?: SubscribeToMany,
    next?: (documents: D[], changed: D[], type: ChangeEvent["type"]) => void
  ): Subscription;
  subscribe(criteria: RawObject = {}, options?: Options, next?: (...args: any[]) => void): Subscription {
    if (options?.limit === 1) {
      return this.#observeOne(criteria).subscribe({ next });
    }
    return this.#observe(criteria, options).subscribe({
      next: (value: [D[], D[], ChangeEvent["type"]]) => next?.(...value)
    });
  }

  #observe(criteria: RawObject = {}, options?: Options): Observable<[D[], D[], ChangeEvent["type"]]> {
    return new Observable<[D[], D[], ChangeEvent["type"]]>((subscriber) => {
      return observe(this, criteria, options, (values, changed, type) =>
        subscriber.next([values, changed, type] as any)
      );
    });
  }

  #observeOne(criteria: RawObject = {}): Observable<D | undefined> {
    return new Observable<D | undefined>((subscriber) => {
      return observeOne(this, criteria, (values) => subscriber.next(values as any));
    });
  }

  /*
   |--------------------------------------------------------------------------------
   | Queries
   |--------------------------------------------------------------------------------
   */

  /**
   * Retrieve a record by the document 'id' key.
   */
  async findById(id: string): Promise<D | undefined> {
    return this.storage.resolve().then((storage) => storage.findById(id));
  }

  /**
   * Performs a mingo criteria search over the collection data and returns
   * a single document if one was found matching the criteria and options.
   */
  async findOne(criteria: RawObject = {}, options?: Options): Promise<D | undefined> {
    return this.find(criteria, options).then((documents) => documents[0]);
  }

  /**
   * Performs a mingo criteria search over the collection data and returns any
   * documents matching the provided criteria and options.
   */
  async find(criteria: RawObject = {}, options?: Options): Promise<D[]> {
    return this.storage.resolve().then((storage) => storage.find(criteria, options));
  }

  /**
   * Performs a mingo criteria search over the collection data and returns
   * the count of all documents found matching the criteria and options.
   */
  async count(criteria?: RawObject): Promise<number> {
    return this.storage.resolve().then((storage) => storage.count(criteria));
  }

  /**
   * Removes all documents from the storage instance.
   */
  flush(): void {
    this.storage.resolve().then((storage) => {
      storage.broadcast("flush");
      storage.flush();
    });
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type SubscriptionOptions = {
  sort?: Options["sort"];
  skip?: Options["skip"];
  range?: Options["range"];
  offset?: Options["offset"];
  limit?: Options["limit"];
  index?: Options["index"];
};

export type SubscribeToSingle = Options & {
  limit: 1;
};

export type SubscribeToMany = Options & {
  limit?: number;
};
