import { Collection, Document, IndexedDbAdapter, Model } from "@valkyr/db";
import { Event } from "@valkyr/ledger";

type CacheDocument = Document & {
  streamId: string;
  type: string;
  created: string;
};

export class Cache extends Model<CacheDocument> {
  public static readonly $collection = new Collection<CacheDocument>("cache", new IndexedDbAdapter());

  public readonly streamId: CacheDocument["streamId"];
  public readonly type: CacheDocument["type"];
  public readonly created: CacheDocument["created"];

  constructor(document: CacheDocument) {
    super(document);

    this.streamId = document.streamId;
    this.type = document.type;
    this.created = document.created;

    Object.freeze(this);
  }

  public static async add({ id, streamId, type, created }: Event): Promise<void> {
    const cursor = await this.findById(streamId);
    if (cursor) {
      this.updateOne(
        { id },
        {
          $set: {
            streamId,
            type,
            created
          }
        }
      );
    } else {
      await this.insertOne({ id, streamId, type, created });
    }
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

  public toJSON(): CacheDocument {
    return super.toJSON({
      streamId: this.streamId,
      type: this.type,
      created: this.created
    });
  }
}
