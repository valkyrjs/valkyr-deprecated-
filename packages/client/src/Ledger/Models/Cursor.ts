import { Document, Model } from "@valkyr/db";
import type { StreamCursor } from "@valkyr/ledger";

import { Collection } from "../../Decorators/Collection";

type CursorDocument = { at: StreamCursor["at"] } & Document;

@Collection("cursors")
export class Cursor extends Model<CursorDocument> {
  public readonly at: CursorDocument["at"];

  constructor(document: CursorDocument) {
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

  public toJSON(): CursorDocument {
    return super.toJSON({
      at: this.at
    });
  }
}
