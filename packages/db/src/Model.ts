import { RawObject } from "mingo/types";

import type { Collection, Options } from "./Collection";
import type { Document } from "./Storage";

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
  insert(document: D): Promise<T>;
  update(document: Document & Partial<D>): Promise<T>;
  upsert(document: D): Promise<T>;
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

  public static async insert<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    document: ReturnType<T["toJSON"]>
  ): Promise<T> {
    const data = await this.$collection.insert(document);
    return new this(data as D);
  }

  public static async update<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    document: Document & Partial<ReturnType<T["toJSON"]>>
  ): Promise<T> {
    const data = await this.$collection.update(document);
    return new this(data as D);
  }

  public static async upsert<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    document: ReturnType<T["toJSON"]>
  ): Promise<T> {
    const data = await this.$collection.upsert(document);
    return new this(data as D);
  }

  public static async delete<D extends Document, T extends Model<D>>(
    this: ModelContext<T, D>,
    id: string
  ): Promise<void> {
    return this.$collection.delete(id);
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
