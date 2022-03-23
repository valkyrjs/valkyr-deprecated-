import { Collection, Model } from "@valkyr/db";
import type { StreamCursor } from "@valkyr/ledger";

import { adapter } from "../Providers/IdbAdapter";

export class Cursor extends Model<StreamCursor> {
  public static readonly $name = "cursors" as const;

  public readonly at: StreamCursor["at"];

  constructor(document: StreamCursor) {
    super(document);

    this.at = document.at;

    Object.freeze(this);
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

Collection.create(Cursor, adapter);
