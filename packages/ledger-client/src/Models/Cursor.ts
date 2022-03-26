import { Collection, Model } from "@valkyr/db";
import type { StreamCursor } from "@valkyr/ledger";

import { database } from "../Database";

export class Cursor extends Model<StreamCursor> {
  public static readonly $collection = new Collection<StreamCursor>("cursors", database);

  public readonly at: StreamCursor["at"];

  constructor(document: StreamCursor) {
    super(document);

    this.at = document.at;

    Object.freeze(this);
  }

  public static async set(streamId: string, at: string): Promise<void> {
    await this.upsert({ id: streamId, at });
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

  public toJSON(): StreamCursor {
    return super.toJSON({
      at: this.at
    });
  }
}
