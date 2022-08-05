import { Query } from "mingo";
import type { Cursor } from "mingo/cursor";
import type { RawObject } from "mingo/types";
import { Observable } from "rxjs";

import { observe, observeOne } from "./Observe";
import {
  Adapter,
  DeleteResponse,
  Document,
  InsertManyResponse,
  InsertOneResponse,
  PartialDocument,
  Storage,
  UpdateActions,
  UpdateResponse
} from "./Storage";

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

/*
 |--------------------------------------------------------------------------------
 | Collection
 |--------------------------------------------------------------------------------
 */

export class Collection<D extends Document = any> {
  readonly name: string;
  readonly storage: Storage<D>;

  constructor(name: string, adapter?: Adapter<D>) {
    this.name = name;
    this.storage = new Storage<D>(this.name, adapter);
  }

  /*
   |--------------------------------------------------------------------------------
   | Mutators
   |--------------------------------------------------------------------------------
   */

  async insertOne(document: PartialDocument<D>): Promise<InsertOneResponse> {
    return {
      acknowledged: true,
      insertedId: await this.storage.insert(document)
    };
  }

  async insertMany(documents: PartialDocument<D>[]): Promise<InsertManyResponse> {
    return {
      acknowledged: true,
      insertedIds: await Promise.all(documents.map((document) => this.storage.insert(document)))
    };
  }

  async updateOne(criteria: RawObject, actions: UpdateActions): Promise<UpdateResponse> {
    const document = await this.findOne(criteria);
    if (document === undefined) {
      return { acknowledged: true, matchedCount: 0, modifiedCount: 0 };
    }
    const updated = await this.storage.update(document.id, criteria, actions);
    if (updated) {
      return { acknowledged: true, matchedCount: 1, modifiedCount: 1 };
    }
    return { acknowledged: true, matchedCount: 1, modifiedCount: 0 };
  }

  async updateMany(criteria: RawObject, actions: UpdateActions): Promise<UpdateResponse> {
    const documents = await this.find(criteria);
    const matchedCount = documents.length;
    if (matchedCount === 0) {
      return { acknowledged: true, matchedCount, modifiedCount: 0 };
    }
    const updated = await Promise.all(documents.map((document) => this.storage.update(document.id, criteria, actions)));
    return {
      acknowledged: true,
      matchedCount,
      modifiedCount: updated.filter((result) => result === true).length
    };
  }

  async replaceOne(criteria: RawObject, document: Document): Promise<UpdateResponse> {
    const { id } = (await this.findOne(criteria)) ?? {};
    if (id === undefined) {
      return { acknowledged: true, matchedCount: 0, modifiedCount: 0 };
    }
    const replaced = await this.storage.replace(id, document);
    if (replaced) {
      return { acknowledged: true, matchedCount: 1, modifiedCount: 1 };
    }
    return { acknowledged: true, matchedCount: 1, modifiedCount: 0 };
  }

  async delete(id: string): Promise<DeleteResponse> {
    const deleted = await this.storage.delete(id);
    if (deleted) {
      return { acknowledged: true, deletedCount: 1 };
    }
    return { acknowledged: true, deletedCount: 0 };
  }

  /*
   |--------------------------------------------------------------------------------
   | Observers
   |--------------------------------------------------------------------------------
   */

  observe(criteria: RawObject = {}, options?: Options): Observable<Document[]> {
    return new Observable<Document[]>((subscriber) => {
      return observe(this, criteria, options, subscriber.next);
    });
  }

  observeOne(criteria: RawObject = {}): Observable<Document | undefined> {
    return new Observable<Document | undefined>((subscriber) => {
      return observeOne(this, criteria, subscriber.next);
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
    return this.storage.load().then((storage) => storage.documents.get(id));
  }

  /**
   * Performs a mingo criteria search over the collection data and returns any
   * documents matching the provided criteria and options.
   *
   * @url https://github.com/kofrasa/mingo
   */
  async find(criteria: RawObject = {}, options?: Options) {
    return this.query(criteria, options).then((cursor) => {
      return cursor.all() as Document[];
    });
  }

  /**
   * Performs a mingo criteria search over the collection data and returns
   * a single document if one was found matching the criteria and options.
   *
   * @url https://github.com/kofrasa/mingo
   */
  async findOne(criteria: RawObject = {}, options?: Options) {
    return this.query(criteria, options).then((cursor) => {
      const documents = cursor.all() as Document[];
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
  async count(criteria: RawObject = {}, options?: Options) {
    return this.query(criteria, options).then((cursor) => cursor.count());
  }

  /**
   * Performs a mingo criteria search over the collection data and returns
   * the mingo query cursor which can be further utilized for advanced
   * querying.
   *
   * @url https://github.com/kofrasa/mingo#searching-and-filtering
   */
  async query(criteria: RawObject = {}, options?: Options) {
    await this.storage.load();
    const cursor = new Query(criteria).find(this.storage.data);
    if (options) {
      return addOptions(cursor, options);
    }
    return cursor;
  }

  /**
   * Removes all documents from the storage instance.
   */
  flush(): void {
    this.storage.flush();
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
