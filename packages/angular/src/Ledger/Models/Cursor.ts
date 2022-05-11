import { Injectable } from "@angular/core";
import { Document, Model } from "@valkyr/db";

export type CursorDocument = Document & {
  at: string;
};

@Injectable({ providedIn: "root" })
export class Cursor extends Model<CursorDocument> {
  readonly at!: CursorDocument["at"];

  static async set(streamId: string, at: string): Promise<void> {
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

  static async get(streamId: string): Promise<string | undefined> {
    const stream = await this.findOne({ id: streamId });
    if (stream) {
      return stream.at;
    }
    return undefined;
  }
}

export type CursorModel = typeof Cursor;
