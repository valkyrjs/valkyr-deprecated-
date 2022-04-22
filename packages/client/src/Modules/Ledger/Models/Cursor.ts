import { Collection, Document, IndexedDbAdapter, Model } from "@valkyr/db";
import type { StreamCursor } from "@valkyr/ledger";

type CursorDocument = { at: StreamCursor["at"] } & Document;

export class Cursor extends Model<CursorDocument> {
  public static readonly $collection = new Collection<CursorDocument>("cursors", new IndexedDbAdapter());

  public readonly at: CursorDocument["at"];

  constructor(document: CursorDocument) {
    super(document);

    this.at = document.at;

    Object.freeze(this);
  }

  public static async set(streamId: string, at: string): Promise<void> {
    const cursor = await this.findById(streamId);
    if (cursor) {
      this.updateOne(
        { id: streamId },
        {
          $set: {
            at
          }
        }
      );
    } else {
      await this.insertOne({ id: streamId, at });
    }
  }

  public static async get(streamId: string): Promise<string | undefined> {
    const stream = await this.findOne({ id: streamId });
    if (stream) {
      return stream.at;
    }
  }

  /*
   |--------------------------------------------------------------------------------
   | Serializer
   |--------------------------------------------------------------------------------
   */

  public toJSON(): CursorDocument {
    return super.toJSON({
      at: this.at
    });
  }
}
