import { Query } from "mingo";
import { RawObject } from "mingo/types";

import type { ModelClass } from "../Model";
import { observe, observeOne } from "../Observe";
import { Adapter, Document, Storage } from "../Storage";
import { addOptions } from "./Query";
import type { Options } from "./Types";

export class Collection<D extends Document = Document> {
  public readonly name: string;
  public readonly storage: Storage;

  private constructor(name: string, adapter: Adapter) {
    this.name = name;
    this.storage = new Storage(this.name, adapter);
  }

  public static create<M extends ModelClass>(model: M, adapter: Adapter) {
    const collection = new this(model.$name, adapter);
    model.$collection = collection;
  }

  /*
   |--------------------------------------------------------------------------------
   | Mutators
   |--------------------------------------------------------------------------------
   */

  public async insert(document: D) {
    return this.storage.insert(document);
  }

  public async update(document: Document & Partial<D>) {
    return this.storage.update(document);
  }

  public async upsert(document: D) {
    return this.storage.upsert(document);
  }

  public async delete(id: string) {
    return this.storage.delete(id);
  }

  /*
   |--------------------------------------------------------------------------------
   | Observers
   |--------------------------------------------------------------------------------
   */

  public observe(criteria: RawObject = {}, options?: Options) {
    let unsubscribe: () => void;
    let next: (value: Document[]) => void;
    return {
      subscribe: (_next: (value: Document[]) => void) => {
        next = _next;
        unsubscribe = observe(this, criteria, options, next);
        return { unsubscribe };
      },
      filter: (criteria: RawObject, options?: Options) => {
        unsubscribe();
        unsubscribe = observe(this, criteria, options, next);
      }
    };
  }

  public observeOne(criteria: RawObject = {}) {
    let unsubscribe: () => void;
    let next: (value?: Document) => void;
    return {
      subscribe: (_next: (value?: Document) => void) => {
        next = _next;
        unsubscribe = observeOne(this, criteria, next);
        return { unsubscribe };
      },
      filter: (criteria: RawObject) => {
        unsubscribe();
        unsubscribe = observeOne(this, criteria, next);
      }
    };
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
  public async findById(id: string) {
    return this.storage.documents.get(id);
  }

  /**
   * Performs a mingo criteria search over the collection data and returns any
   * documents matching the provided criteria and options.
   *
   * @url https://github.com/kofrasa/mingo
   */
  public async find(criteria: RawObject = {}, options?: Options) {
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
  public async findOne(criteria: RawObject = {}, options?: Options) {
    return this.query(criteria, options).then((cursor) => {
      const documents = cursor.all() as Document[];
      if (documents.length > 0) {
        return documents[0];
      }
    });
  }

  /**
   * Performs a mingo criteria search over the collection data and returns
   * a document count of all documents found matching the criteria and options.
   *
   * @url https://github.com/kofrasa/mingo
   */
  public async count(criteria: RawObject = {}, options?: Options) {
    return this.query(criteria, options).then((cursor) => cursor.count());
  }

  /**
   * Performs a mingo criteria search over the collection data and returns
   * the mingo query cursor which can be further utilized for advanced
   * querying.
   *
   * @url https://github.com/kofrasa/mingo#searching-and-filtering
   */
  public async query(criteria: RawObject = {}, options?: Options) {
    await this.storage.load();
    const cursor = new Query(criteria).find(this.storage.data);
    if (options) {
      return addOptions(cursor, options);
    }
    return cursor;
  }
}
