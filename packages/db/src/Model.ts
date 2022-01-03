import { RawObject } from "mingo/types";
import { Observable, Subscription } from "rxjs";

import type { Collection, Options } from "./Collection";
import { observe, observeOne } from "./Observe";
import { Document, DocumentNotFoundError, UpdateActions } from "./Storage";

export abstract class Model<D extends Document = any> {
  public static readonly $collection: Collection;

  public readonly id!: string;

  constructor(document: D) {
    Object.assign(this, document);
  }

  public get $collection(): Collection<D> {
    return (this as any).constructor.$collection;
  }

  /*
   |--------------------------------------------------------------------------------
   | Mutators
   |--------------------------------------------------------------------------------
   */

  public static async insertOne<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    document: D
  ): Promise<T> {
    const { insertedId } = await this.$collection.insertOne(document);
    return (this as any).findById(insertedId);
  }

  public static async insertMany<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    documents: D[]
  ): Promise<T[]> {
    const { insertedIds } = await this.$collection.insertMany(documents);
    return (this as any).find({
      id: {
        $in: insertedIds
      }
    });
  }

  public static async updateOne<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject,
    actions: UpdateActions
  ): Promise<void> {
    const result = await this.$collection.updateOne(criteria, actions);
    if (result.matchedCount === 0) {
      throw new DocumentNotFoundError(criteria);
    }
  }

  public static async updateMany<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject,
    actions: UpdateActions
  ): Promise<void> {
    const result = await this.$collection.updateMany(criteria, actions);
    if (result.matchedCount === 0) {
      throw new DocumentNotFoundError(criteria);
    }
  }

  public static async replaceOne<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject,
    document: D
  ): Promise<void> {
    const result = await this.$collection.replaceOne(criteria, document);
    if (result.matchedCount === 0) {
      throw new DocumentNotFoundError(criteria);
    }
  }

  public static async delete<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    id: string
  ): Promise<void> {
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

  public static subscribe<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria?: RawObject,
    options?: SubscribeToSingle,
    next?: (document: T | undefined) => void
  ): Subscription;
  public static subscribe<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria?: RawObject,
    options?: SubscribeToMany,
    next?: (documents: T[]) => void
  ): Subscription;
  public static subscribe<D extends Document, T extends Model<D>>(
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

  public static observe<D extends Document, T extends Model<D>>(
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

  public static observeOne<D extends Document, T extends Model<D>>(
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

  public static async findById<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    id: string
  ): Promise<T | undefined> {
    const document = await this.$collection.findById(id);
    if (!document) {
      return undefined;
    }
    return new this(document as D);
  }

  public static async find<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject = {},
    options?: Options
  ): Promise<T[]> {
    return this.$collection
      .find(criteria, options)
      .then((documents) => documents.map((document) => new this(document as D)));
  }

  public static async findOne<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject = {},
    options?: Options
  ): Promise<T | undefined> {
    const document = await this.$collection.findOne(criteria, options);
    if (!document) {
      return undefined;
    }
    return new this(document as D);
  }

  public static async count(criteria: RawObject = {}, options?: Options): Promise<number> {
    return this.$collection.count(criteria, options);
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
