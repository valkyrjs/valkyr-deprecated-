import { RawObject } from "mingo/types";
import { Observable, Subscription } from "rxjs";

import type { Collection, Options } from "./Collection";
import { observe, observeOne } from "./Observe";
import { Document, DocumentNotFoundError, PartialDocument, UpdateActions, UpdateResponse } from "./Storage";

export type ModelDefinition<T = any> = {
  name?: string;
  model: ModelClass<T, any>;
  collection: Collection;
};

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
    const { insertedId } = await this.$collection.insertOne(document);
    return (this as any).findById(insertedId);
  }

  static async insertMany<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    documents: PartialDocument<D>[]
  ): Promise<T[]> {
    const { insertedIds } = await this.$collection.insertMany(documents);
    return (this as any).find({
      id: {
        $in: insertedIds
      }
    });
  }

  static async updateOne<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject,
    actions: UpdateActions
  ): Promise<void> {
    const result = await this.$collection.updateOne(criteria, actions);
    if (result.matchedCount === 0) {
      throw new DocumentNotFoundError(criteria);
    }
  }

  static async updateMany<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject,
    actions: UpdateActions
  ): Promise<void> {
    const result = await this.$collection.updateMany(criteria, actions);
    if (result.matchedCount === 0) {
      throw new DocumentNotFoundError(criteria);
    }
  }

  static async replaceOne<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject,
    document: D
  ): Promise<void> {
    const result = await this.$collection.replaceOne(criteria, document);
    if (result.matchedCount === 0) {
      throw new DocumentNotFoundError(criteria);
    }
  }

  static async delete<D extends Document, T extends Model<D>>(this: ModelContext<T, D>, id: string): Promise<void> {
    const result = await this.$collection.delete(id);
    if (result.deletedCount === 0) {
      throw new DocumentNotFoundError({ id });
    }
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
  ) {
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

  static async count(criteria: RawObject = {}, options?: Options): Promise<number> {
    return this.$collection.count(criteria, options);
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

  async update(actions: UpdateActions): Promise<UpdateResponse> {
    return this.$collection.updateOne({ id: this.id }, actions);
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
  updateOne(criteria: RawObject, actions: UpdateActions): Promise<void>;
  updateMany(criteria: RawObject, actions: UpdateActions): Promise<void>;
  replaceOne(criteria: RawObject, document: D): Promise<void>;
  delete(id: string): Promise<void>;

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
