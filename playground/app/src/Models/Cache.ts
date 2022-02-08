import { Document, Model } from "@valkyr/db";

type Attributes = Document & {
  streamId: string;
  type: string;
  created: string;
};

export class Cache extends Model<Attributes> {
  public static readonly $collection = "cache";

  public readonly streamId: Attributes["streamId"];
  public readonly type: Attributes["type"];
  public readonly created: Attributes["created"];

  constructor(document: Attributes) {
    super(document);

    this.streamId = document.streamId;
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
      streamId: this.streamId,
      type: this.type,
      created: this.created
    });
  }
}
