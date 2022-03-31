import { Collection, Document, Model } from "@valkyr/db";
import { Event } from "@valkyr/ledger";

import { database } from "../Database";

type Attributes = Document & {
  streamId: string;
  type: string;
  created: string;
};

export class Cache extends Model<Attributes> {
  public static readonly $collection = new Collection<Attributes>("cache", database);

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

  public static async add({ id, streamId, type, created }: Event): Promise<void> {
    await this.upsert({ id, streamId, type, created });
  }

  public static async status({ id, streamId, type, created }: Event) {
    const cache = await this.findById(id);
    if (cache) {
      return { exists: true, outdated: true };
    }
    const count = await this.count({
      streamId,
      type,
      created: {
        $gt: created
      }
    });
    return { exists: false, outdated: count > 0 };
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
