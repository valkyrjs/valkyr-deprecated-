import { Observable, Subscription } from "rxjs";

import { observe, observeOne } from "./Observe/mod.js";
import {
  ChangeEvent,
  InsertManyResult,
  InsertOneResult,
  Options,
  RemoveResult,
  Storage,
  UpdateResult
} from "./Storage/mod.js";
import { Document, Filter, UpdateFilter, WithId } from "./Types.js";

/*
 |--------------------------------------------------------------------------------
 | Collection
 |--------------------------------------------------------------------------------
 */

export class Collection<TSchema extends Document = Document> {
  constructor(readonly name: string, readonly storage: Storage<TSchema>) {}

  get observable() {
    return this.storage.observable;
  }

  /*
   |--------------------------------------------------------------------------------
   | Mutators
   |--------------------------------------------------------------------------------
   */

  async insertOne(document: Partial<WithId<TSchema>>): Promise<InsertOneResult> {
    return this.storage.resolve().then((storage) => storage.insertOne(document));
  }

  async insertMany(documents: Partial<WithId<TSchema>>[]): Promise<InsertManyResult> {
    return this.storage.resolve().then((storage) => storage.insertMany(documents));
  }

  async updateOne(filter: Filter<WithId<TSchema>>, update: UpdateFilter<TSchema>): Promise<UpdateResult> {
    return this.storage.resolve().then((storage) => storage.updateOne(filter, update));
  }

  async updateMany(filter: Filter<WithId<TSchema>>, update: UpdateFilter<TSchema>): Promise<UpdateResult> {
    return this.storage.resolve().then((storage) => storage.updateMany(filter, update));
  }

  async replaceOne(filter: Filter<WithId<TSchema>>, document: TSchema): Promise<UpdateResult> {
    return this.storage.resolve().then((storage) => storage.replace(filter, document));
  }

  async remove(filter: Filter<WithId<TSchema>>): Promise<RemoveResult> {
    return this.storage.resolve().then((storage) => storage.remove(filter));
  }

  /*
   |--------------------------------------------------------------------------------
   | Observers
   |--------------------------------------------------------------------------------
   */

  subscribe(
    filter?: Filter<WithId<TSchema>>,
    options?: SubscribeToSingle,
    next?: (document: WithId<TSchema> | undefined) => void
  ): Subscription;
  subscribe(
    filter?: Filter<WithId<TSchema>>,
    options?: SubscribeToMany,
    next?: (documents: WithId<TSchema>[], changed: WithId<TSchema>[], type: ChangeEvent["type"]) => void
  ): Subscription;
  subscribe(filter: Filter<WithId<TSchema>> = {}, options?: Options, next?: (...args: any[]) => void): Subscription {
    if (options?.limit === 1) {
      return this.#observeOne(filter).subscribe({ next });
    }
    return this.#observe(filter, options).subscribe({
      next: (value: [WithId<TSchema>[], WithId<TSchema>[], ChangeEvent["type"]]) => next?.(...value)
    });
  }

  #observe(
    filter: Filter<WithId<TSchema>> = {},
    options?: Options
  ): Observable<[WithId<TSchema>[], WithId<TSchema>[], ChangeEvent["type"]]> {
    return new Observable<[WithId<TSchema>[], WithId<TSchema>[], ChangeEvent["type"]]>((subscriber) => {
      return observe(this as any, filter, options, (values, changed, type) =>
        subscriber.next([values, changed, type] as any)
      );
    });
  }

  #observeOne(filter: Filter<WithId<TSchema>> = {}): Observable<WithId<TSchema> | undefined> {
    return new Observable<WithId<TSchema> | undefined>((subscriber) => {
      return observeOne(this as any, filter, (values) => subscriber.next(values as any));
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
  async findById(id: string): Promise<WithId<TSchema> | undefined> {
    return this.storage.resolve().then((storage) => storage.findById(id));
  }

  /**
   * Performs a mingo filter search over the collection data and returns
   * a single document if one was found matching the filter and options.
   */
  async findOne(filter: Filter<WithId<TSchema>> = {}, options?: Options): Promise<WithId<TSchema> | undefined> {
    return this.find(filter, options).then(([document]) => document);
  }

  /**
   * Performs a mingo filter search over the collection data and returns any
   * documents matching the provided filter and options.
   */
  async find(filter: Filter<WithId<TSchema>> = {}, options?: Options): Promise<WithId<TSchema>[]> {
    return this.storage.resolve().then((storage) => storage.find(filter, options));
  }

  /**
   * Performs a mingo filter search over the collection data and returns
   * the count of all documents found matching the filter and options.
   */
  async count(filter?: Filter<WithId<TSchema>>): Promise<number> {
    return this.storage.resolve().then((storage) => storage.count(filter));
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
