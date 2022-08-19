import { RawObject } from "mingo/types";
import { Observable, Subscription } from "rxjs";

import type { Collection, Options } from "./Collection";
import { observe, observeOne } from "./Observe";
import { Document, DocumentNotFoundError, PartialDocument, RemoveOptions, UpdateOperations } from "./Storage";
import { RemoveResult } from "./Storage/Operations/Remove";
import { UpdateResult } from "./Storage/Operations/Update";

export abstract class Model<D extends Document = any> {
  static _collection: Collection;

  readonly id!: string;

  constructor(document: D) {
    Object.assign(this, document);
  }

  static set $collection(collection: Collection) {
    this._collection = collection;
  }

  static get $collection() {
    if (!this._collection) {
      throw new Error(`Model Violation: Collection for '${this.name}' has not been resolved`);
    }
    return this._collection;
  }

  get $collection(): Collection<D> {
    return (this as any).constructor.$collection;
  }

  /*
   |--------------------------------------------------------------------------------
   | Mutators
   |--------------------------------------------------------------------------------
   */

  static async insertOne<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    document: PartialDocument<D>
  ): Promise<T> {
    const result = await this.$collection.insertOne(document);
    if (result.acknowledged === false) {
      throw result.exception;
    }
    return (this as any).findById(result.insertedId);
  }

  static async insertMany<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    documents: PartialDocument<D>[]
  ): Promise<T[]> {
    const result = await this.$collection.insertMany(documents);
    if (result.acknowledged === false) {
      throw result.exceptions;
    }
    return (this as any).find({
      id: {
        $in: result.insertedIds
      }
    });
  }

  static async updateOne<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject,
    update: UpdateOperations
  ): Promise<UpdateResult> {
    const result = await this.$collection.updateOne(criteria, update);
    if (result.acknowledged === false) {
      throw result.exceptions[0];
    }
    return result;
  }

  static async updateMany<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject,
    update: UpdateOperations
  ): Promise<UpdateResult> {
    const result = await this.$collection.updateMany(criteria, update);
    if (result.acknowledged === false) {
      throw result.exceptions;
    }
    return result;
  }

  static async replaceOne<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject,
    document: D
  ): Promise<UpdateResult> {
    const result = await this.$collection.replaceOne(criteria, document);
    if (result.acknowledged === false) {
      throw result.exceptions[0];
    }
    return result;
  }

  static async remove<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject,
    options?: RemoveOptions
  ): Promise<RemoveResult> {
    const result = await this.$collection.remove(criteria, options);
    if (result.acknowledged === false) {
      throw result.exceptions[0];
    }
    return result;
  }

  /*
   |--------------------------------------------------------------------------------
   | Observers
   |--------------------------------------------------------------------------------
   */

  static subscribe<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria?: RawObject,
    options?: SubscribeToSingle,
    next?: (document: T | undefined) => void
  ): Subscription;
  static subscribe<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria?: RawObject,
    options?: SubscribeToMany,
    next?: (documents: T[]) => void
  ): Subscription;
  static subscribe<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject = {},
    options?: Options,
    next?: (value: T[] | T | undefined) => void
  ): Subscription {
    if (options?.limit === 1) {
      return (this as ModelClass<T, D>).observeOne(criteria).subscribe({ next });
    }
    return (this as ModelClass<T, D>).observe(criteria, options).subscribe({ next });
  }

  static observe<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject = {},
    options?: Options
  ): Observable<T[]> {
    return new Observable<T[]>((subscriber) => {
      return observe(this.$collection, criteria, options, (documents) => {
        subscriber.next(documents.map((document) => new this(document as D)));
      });
    });
  }

  static observeOne<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject = {}
  ): Observable<T | undefined> {
    return new Observable<T | undefined>((subscriber) => {
      return observeOne(this.$collection, criteria, (document) => {
        subscriber.next(document !== undefined ? new this(document as D) : undefined);
      });
    });
  }

  /*
   |--------------------------------------------------------------------------------
   | Queries
   |--------------------------------------------------------------------------------
   */

  static async findById<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    id: string
  ): Promise<T | undefined> {
    const document = await this.$collection.findById(id);
    if (!document) {
      return undefined;
    }
    return new this(document as D).onInit();
  }

  static async find<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject = {},
    options?: Options
  ): Promise<T[]> {
    const documents = await this.$collection.find(criteria, options);
    return Promise.all(documents.map((document) => new this(document as D).onInit()));
  }

  static async findOne<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject = {},
    options?: Options
  ): Promise<T | undefined> {
    const document = await this.$collection.findOne(criteria, options);
    if (!document) {
      return undefined;
    }
    return new this(document as D).onInit();
  }

  static async count(criteria: RawObject = {}): Promise<number> {
    return this.$collection.count(criteria);
  }

  /*
   |--------------------------------------------------------------------------------
   | Lifecycle
   |--------------------------------------------------------------------------------
   */

  async onInit(): Promise<this> {
    return this;
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  async update(update: UpdateOperations): Promise<this> {
    const result = await this.$collection.updateOne({ id: this.id }, update);
    if (result.acknowledged === false) {
      throw result.exceptions[0];
    }
    const document = await this.$collection.findById(this.id);
    if (!document) {
      throw new DocumentNotFoundError({ id: this.id });
    }
    return new (this as any).constructor(document).onInit();
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type ModelClass<T = unknown, D = unknown> = ModelContext<T, D> & ModelMethods<T, D>;

type ModelContext<T = unknown, D = unknown> = {
  new (document: D): T;
  $collection: Collection;
};

type ModelMethods<T = unknown, D = unknown> = {
  insertOne(document: D): Promise<T>;
  insertMany(documents: D[]): Promise<T[]>;
  updateOne(criteria: RawObject, update: UpdateOperations): Promise<UpdateResult>;
  updateMany(criteria: RawObject, update: UpdateOperations): Promise<UpdateResult>;
  replaceOne(criteria: RawObject, document: D): Promise<UpdateResult>;
  remove(criteria: RawObject, options?: RemoveOptions): Promise<RemoveResult>;

  subscribe<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria?: RawObject,
    options?: SubscribeToSingle,
    next?: (document: D | undefined) => void
  ): Subscription;
  subscribe<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria?: RawObject,
    options?: SubscribeToMany,
    next?: (document: D[]) => void
  ): Subscription;
  subscribe<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject,
    options?: Options,
    next?: (document: D[] | D | undefined) => void
  ): Subscription;

  observe(criteria?: RawObject, options?: Options): Observable<T>;
  observeOne(criteria?: RawObject): Observable<T>;

  findById(id: string): Promise<T | undefined>;
  find(criteria?: RawObject, options?: Options): Promise<T[]>;
  findOne(criteria?: RawObject, options?: Options): Promise<T | undefined>;
  count(criteria?: RawObject, options?: Options): Promise<number>;
};

export type SubscriptionOptions = {
  sort?: Options["sort"];
  skip?: Options["skip"];
  limit?: Options["limit"];
};

export type SubscribeToSingle = SubscriptionOptions & {
  limit: 1;
};

export type SubscribeToMany = SubscriptionOptions & {
  limit?: number;
};
