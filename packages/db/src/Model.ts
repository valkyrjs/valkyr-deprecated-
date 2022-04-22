import { RawObject } from "mingo/types";

import type { Collection, Options } from "./Collection";
import { Document, DocumentNotFoundError, UpdateActions } from "./Storage";

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

  observe(criteria?: RawObject, options?: Options): ModelObserveResult<T>;
  observeOne(criteria?: RawObject): ModelObserveOneResult<T>;

  findById(id: string): Promise<T | undefined>;
  find(criteria?: RawObject, options?: Options): Promise<T[]>;
  findOne(criteria?: RawObject, options?: Options): Promise<T | undefined>;
  count(criteria?: RawObject, options?: Options): Promise<number>;
};

type ModelObserveResult<T> = {
  subscribe: (next: (models: T[]) => void) => ReturnType<ReturnType<Collection["observe"]>["subscribe"]>;
  filter: (criteria?: RawObject, options?: Options) => ReturnType<ReturnType<Collection["observe"]>["filter"]>;
};

type ModelObserveOneResult<T> = {
  subscribe: (next: (model: T | undefined) => void) => ReturnType<ReturnType<Collection["observeOne"]>["subscribe"]>;
  filter: (criteria?: RawObject, options?: Options) => ReturnType<ReturnType<Collection["observeOne"]>["filter"]>;
};

/*
 |--------------------------------------------------------------------------------
 | Model
 |--------------------------------------------------------------------------------
 */

export abstract class Model<D extends Document = Document> {
  public static readonly $collection: Collection;

  public readonly id: string;

  constructor(document: D) {
    this.id = document.id;
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
    document: ReturnType<T["toJSON"]>
  ): Promise<T> {
    const { insertedId } = await this.$collection.insertOne(document);
    return (this as any).findById(insertedId);
  }

  public static async insertMany<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    documents: ReturnType<T["toJSON"]>[]
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
    document: ReturnType<T["toJSON"]>
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

  public static observe<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    criteria: RawObject = {},
    options?: Options
  ) {
    const observer = this.$collection.observe(criteria, options);
    return {
      subscribe: (next: (models: T[]) => void) => {
        return observer.subscribe((documents) => {
          next(documents.map((document) => new this(document as D)));
        });
      },
      filter: observer.filter
    };
  }

  public static observeOne<D extends Document, T extends Model<D>>(this: ModelContext<T, D>, criteria: RawObject = {}) {
    const observer = this.$collection.observeOne(criteria);
    return {
      subscribe: (next: (model: T | undefined) => void) => {
        return observer.subscribe((document) => {
          next(document !== undefined ? new this(document as D) : undefined);
        });
      },
      filter: observer.filter
    };
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
    if (document !== undefined) {
      return new this(document as D);
    }
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
    if (document !== undefined) {
      return new this(document as D);
    }
  }

  public static async count(criteria: RawObject = {}, options?: Options): Promise<number> {
    return this.$collection.count(criteria, options);
  }

  public toJSON(props: Partial<D>): D {
    return JSON.parse(
      JSON.stringify({
        id: this.id,
        ...props
      })
    );
  }
}
