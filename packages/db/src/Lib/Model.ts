import type { Document } from "../Types/Storage";

export abstract class Model<D extends Document = Document> {
  public static readonly $collection: string;

  public readonly id: string;

  constructor(document: D) {
    this.id = document.id;
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
