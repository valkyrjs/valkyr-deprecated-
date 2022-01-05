import type { EntityCursor } from "@valkyr/event-cache";
import { Model } from "@valkyr/db";

export class Cursor extends Model<EntityCursor> {
  public static readonly $collection = "cursors";

  public readonly at: EntityCursor["at"];

  constructor(document: EntityCursor) {
    super(document);

    this.at = document.at;

    Object.freeze(this);
  }

  /*
   |--------------------------------------------------------------------------------
   | Serializer
   |--------------------------------------------------------------------------------
   */

  public toJSON(): EntityCursor {
    return super.toJSON({
      at: this.at
    });
  }
}
