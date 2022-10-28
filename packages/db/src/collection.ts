import type { RawObject } from "mingo/types";
import { Observable } from "rxjs";

import { IndexedDbStorage } from "./databases/indexed.storage";
import { MemoryStorage } from "./databases/memory.storage";
import { observe, observeOne } from "./observe";
import {
  Document,
  InsertResult,
  Options,
  PartialDocument,
  RemoveResult,
  UpdateOperators,
  UpdateResult
} from "./storage";

/*
 |--------------------------------------------------------------------------------
 | Collection
 |--------------------------------------------------------------------------------
 */

export class Collection<D extends Document = any> {
  constructor(readonly name: string, readonly storage: IndexedDbStorage<D> | MemoryStorage<D>) {}

  /*
   |--------------------------------------------------------------------------------
   | Mutators
   |--------------------------------------------------------------------------------
   */

  async insertOne(document: PartialDocument<D>): Promise<InsertResult> {
    return this.storage.insertOne(document);
  }

  async insertMany(documents: PartialDocument<D>[]): Promise<InsertResult> {
    return this.storage.insertMany(documents);
  }

  async updateOne(criteria: RawObject, update: UpdateOperators): Promise<UpdateResult> {
    return this.storage.update(criteria, update, { justOne: true });
  }

  async updateMany(criteria: RawObject, update: UpdateOperators): Promise<UpdateResult> {
    return this.storage.update(criteria, update);
  }

  async replaceOne(criteria: RawObject, document: D): Promise<UpdateResult> {
    return this.storage.replace(criteria, document);
  }

  async remove(criteria: RawObject): Promise<RemoveResult> {
    return this.storage.remove(criteria);
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
   */
  async findById(id: string): Promise<D | undefined> {
    return this.storage.findById(id);
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
    return this.storage.find(criteria, options);
  }

  /**
   * Performs a mingo criteria search over the collection data and returns
   * the count of all documents found matching the criteria and options.
   */
  async count(criteria: RawObject = {}): Promise<number> {
    return this.storage.count(criteria);
  }

  /**
   * Removes all documents from the storage instance.
   */
  flush(): void {
    this.storage.flush();
  }
}
