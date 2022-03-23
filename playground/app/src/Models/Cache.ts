import { Collection, Document, Model } from "@valkyr/db";

import { adapter } from "../Providers/IdbAdapter";

type Attributes = Document & {
  streamId: string;
  type: string;
  created: string;
};

export class Cache extends Model<Attributes> {
  public static readonly $name = "cache" as const;

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

Collection.create(Cache, adapter);
