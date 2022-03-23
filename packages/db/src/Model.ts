import { RawObject } from "mingo/types";

import type { Collection, Options } from "./Collection";
import type { Document } from "./Storage";

export type ModelClass<T, D> = {
  new (document: D): T;
  $collection: Collection;
};

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
    this: ModelClass<T, D>,
    document: ReturnType<T["toJSON"]>
  ): Promise<T> {
    const data = await this.$collection.insert(document);
    return new this(data as any);
  }

  public static async update<D extends Document, T extends Model<D>>(
    this: ModelClass<T, D>,
    document: Document & Partial<ReturnType<T["toJSON"]>>
  ): Promise<T> {
    const data = await this.$collection.update(document);
    return new this(data as any);
  }

  public static async upsert<D extends Document, T extends Model<D>>(
    this: ModelClass<T, D>,
    document: ReturnType<T["toJSON"]>
  ): Promise<T> {
    const data = await this.$collection.upsert(document);
    return new this(data as any);
  }

  public static async delete<D extends Document, T extends Model<D>>(
    this: ModelClass<T, D>,
    id: string
  ): Promise<void> {
    return this.$collection.delete(id);
  }

  /*
   |--------------------------------------------------------------------------------
   | Queries
   |--------------------------------------------------------------------------------
   */

  public static async findById<D extends Document, T extends Model<D>>(
    this: ModelClass<T, D>,
    id: string
  ): Promise<T | undefined> {
    const document = await this.$collection.findById(id);
    if (document !== undefined) {
      return new this(document as any);
    }
  }

  public static async find<D extends Document, T extends Model<D>>(
    this: ModelClass<T, D>,
    criteria: RawObject = {},
    options?: Options
  ): Promise<T[]> {
    return this.$collection
      .find(criteria, options)
      .then((documents) => documents.map((document) => new this(document as any)));
  }

  public static async findOne<D extends Document, T extends Model<D>>(
    this: ModelClass<T, D>,
    criteria: RawObject = {},
    options?: Options
  ): Promise<T | undefined> {
    const document = this.$collection.findOne(criteria, options);
    if (document !== undefined) {
      return new this(document as any);
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
