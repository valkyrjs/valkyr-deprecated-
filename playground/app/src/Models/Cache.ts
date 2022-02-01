import { Document, Model } from "@valkyr/db";

type Attributes = Document & {
  entityId: string;
  type: string;
  created: string;
};

export class Cache extends Model<Attributes> {
  public static readonly $collection = "cache";

  public readonly entityId: Attributes["entityId"];
  public readonly type: Attributes["type"];
  public readonly created: Attributes["created"];

  constructor(document: Attributes) {
    super(document);

    this.entityId = document.entityId;
    this.type = document.type;
    this.created = document.created;

    Object.freeze(this);
  }

  /*
   |--------------------------------------------------------------------------------
   | Serializer
   |--------------------------------------------------------------------------------
   */

  public toJSON(): Attributes {
    return super.toJSON({
      entityId: this.entityId,
      type: this.type,
      created: this.created
    });
  }
}
