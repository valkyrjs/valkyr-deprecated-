import { RawObject } from "mingo/types";

import type { Collection, Options } from "../Collection";
import type { Document } from "../Storage";
import type { ModelClass } from "./Types";

export abstract class Model<D extends Document = Document> {
  public static readonly $name: string;
  public static readonly $collection: Collection;

  public readonly id: string;

  constructor(document: D) {
    this.id = document.id;
  }

  public get $name(): string {
    return (this.constructor as ModelClass).$name;
  }

  public get $collection(): Collection {
    return (this.constructor as ModelClass).$collection;
  }

  /*
   |--------------------------------------------------------------------------------
   | Mutators
   |--------------------------------------------------------------------------------
   */

  public static async insert<M extends Model>(this: ModelClass<M>, document: ReturnType<M["toJSON"]>): Promise<M> {
    const data = await this.$collection.insert(document);
    return new this(data);
  }

  public static async update<M extends Model>(
    this: ModelClass<M>,
    document: Document & Partial<ReturnType<M["toJSON"]>>
  ): Promise<M> {
    const data = await this.$collection.update(document);
    return new this(data);
  }

  public static async upsert<M extends Model>(this: ModelClass<M>, document: ReturnType<M["toJSON"]>): Promise<M> {
    const data = await this.$collection.upsert(document);
    return new this(data);
  }

  public static async delete<M extends Model>(this: ModelClass<M>, id: string): Promise<void> {
    return this.$collection.delete(id);
  }

  /*
   |--------------------------------------------------------------------------------
   | Queries
   |--------------------------------------------------------------------------------
   */

  public static async findById<M extends Model>(this: ModelClass<M>, id: string): Promise<M | undefined> {
    const document = await this.$collection.findById(id);
    if (document !== undefined) {
      return new this(document);
    }
  }

  public static async find<M extends Model>(
    this: ModelClass<M>,
    criteria: RawObject = {},
    options?: Options
  ): Promise<M[]> {
    return this.$collection
      .find(criteria, options)
      .then((documents) => documents.map((document) => new this(document)));
  }

  public static async findOne<M extends Model>(
    this: ModelClass<M>,
    criteria: RawObject = {},
    options?: Options
  ): Promise<M | undefined> {
    const document = this.$collection.findOne(criteria, options);
    if (document !== undefined) {
      return new this(document);
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
