import { Query } from "mingo";
import { RawObject } from "mingo/types";

import type { Options } from "../Types/Collection";
import type { ModelClass } from "../Types/Model";
import type { Adapter } from "../Types/Storage";
import { Document } from "../Types/Storage";
import { addOptions } from "../Utils/Query";
import { observe } from "./Observe";
import { observeOne } from "./ObserveOne";
import { Storage } from "./Storage";

export class Collection<M extends ModelClass = ModelClass> {
  public readonly name: string;
  public readonly model: M;
  public readonly storage: Storage;

  constructor(model: M, adapter: Adapter) {
    this.name = model.$collection;
    this.model = model;
    this.storage = new Storage(this.name, adapter);
  }

  /*
   |--------------------------------------------------------------------------------
   | Mutators
   |--------------------------------------------------------------------------------
   */

  public async insert(document: ReturnType<InstanceType<M>["toJSON"]>) {
    return this.toModel(await this.storage.insert(document));
  }

  public async update(document: Document & Partial<ReturnType<InstanceType<M>["toJSON"]>>) {
    return this.toModel(await this.storage.update(document));
  }

  public async upsert(document: ReturnType<InstanceType<M>["toJSON"]>) {
    return this.toModel(await this.storage.upsert(document));
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
    let next: (value: InstanceType<M>[]) => void;
    return {
      subscribe: (_next: (value: InstanceType<M>[]) => void) => {
        next = _next;
        unsubscribe = observe(this, criteria, options, (documents: Document[]) => {
          next(documents.map((document) => this.toModel(document)));
        });
        return { unsubscribe };
      },
      filter: (criteria: RawObject, options?: Options) => {
        unsubscribe();
        unsubscribe = observe(this, criteria, options, (documents: Document[]) => {
          next(documents.map((document) => this.toModel(document)));
        });
      }
    };
  }

  public observeOne(criteria: RawObject = {}) {
    let unsubscribe: () => void;
    let next: (value?: InstanceType<M>) => void;
    return {
      subscribe: (_next: (value?: InstanceType<M>) => void) => {
        next = _next;
        unsubscribe = observeOne(this, criteria, (document: Document | undefined) => {
          next(document ? this.toModel(document) : undefined);
        });
        return { unsubscribe };
      },
      filter: (criteria: RawObject) => {
        unsubscribe();
        unsubscribe = observeOne(this, criteria, (document: Document | undefined) => {
          next(document ? this.toModel(document) : undefined);
        });
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
    const document = this.storage.documents.get(id);
    if (document) {
      return this.toModel(document);
    }
  }

  /**
   * Performs a mingo criteria search over the collection data and returns any
   * documents matching the provided criteria and options.
   *
   * @url https://github.com/kofrasa/mingo
   */
  public async find(criteria: RawObject = {}, options?: Options) {
    return this.query(criteria, options).then((cursor) => {
      const documents = cursor.all() as Document[];
      return documents.map((document) => this.toModel(document));
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
        return this.toModel(documents[0]);
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

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  private toModel(document: Document) {
    return new this.model(document) as InstanceType<M>;
  }
}
