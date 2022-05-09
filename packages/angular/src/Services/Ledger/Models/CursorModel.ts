import { Collection, Document, IndexedDbAdapter, Model } from "@valkyr/db";
import type { StreamCursor } from "@valkyr/ledger";

type CursorDocument = { at: StreamCursor["at"] } & Document;

export class CursorModel extends Model<CursorDocument> {
  public static override readonly $collection = new Collection<CursorDocument>("cursors", new IndexedDbAdapter());

  public readonly at!: CursorDocument["at"];

  public static async set(streamId: string, at: string): Promise<void> {
    const cursor = await this.findById(streamId);
    if (cursor === undefined) {
      await this.insertOne({ id: streamId, at });
    } else if (cursor.at < at) {
      this.updateOne(
        { id: streamId },
        {
          $set: {
            at
          }
        }
      );
    }
  }

  public static async get(streamId: string): Promise<string | undefined> {
    const stream = await this.findOne({ id: streamId });
    if (stream) {
      return stream.at;
    }
    return undefined;
  }
}
