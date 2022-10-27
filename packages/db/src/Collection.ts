import type { RawObject } from "mingo/types";
import { Observable } from "rxjs";

import { observe, observeOne } from "./Observe";
import { Document, Options, PartialDocument, Storage } from "./Storage";
import { IndexedDbStorage } from "./Storage/Adapters/IndexedDbStorage";
import { MemoryStorage } from "./Storage/Adapters/MemoryStorage";
import { InsertResult } from "./Storage/Operators/Insert";
import { RemoveResult } from "./Storage/Operators/Remove";
import { UpdateOperators, UpdateResult } from "./Storage/Operators/Update";

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

  async insertOne(document: PartialDocument<D>): Promise<InsertResult> {
    return this.storage.waitForReady().then(() => this.storage.insertOne(document));
  }

  async insertMany(documents: PartialDocument<D>[]): Promise<InsertResult> {
    return this.storage.waitForReady().then(() => this.storage.insertMany(documents));
  }

  async updateOne(criteria: RawObject, update: UpdateOperators): Promise<UpdateResult> {
    return this.storage.waitForReady().then(() => this.storage.update(criteria, update, { justOne: true }));
  }

  async updateMany(criteria: RawObject, update: UpdateOperators): Promise<UpdateResult> {
    return this.storage.waitForReady().then(() => this.storage.update(criteria, update));
  }

  async replaceOne(criteria: RawObject, document: D): Promise<UpdateResult> {
    return this.storage.waitForReady().then(() => this.storage.replace(criteria, document));
  }

  async remove(criteria: RawObject): Promise<RemoveResult> {
    return this.storage.waitForReady().then(() => this.storage.remove(criteria));
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
    return this.storage.waitForReady().then(() => this.storage.findByIndex("id", id).then((result) => result?.[0]));
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
    return this.storage.waitForReady().then(() => this.storage.find(criteria, options));
  }

  /**
   * Performs a mingo criteria search over the collection data and returns
   * the count of all documents found matching the criteria and options.
   */
  async count(criteria: RawObject = {}): Promise<number> {
    return this.storage.waitForReady().then(() => this.storage.count(criteria));
  }

  /**
   * Removes all documents from the storage instance.
   */
  flush(): void {
    this.storage.flush();
  }
}
