import { Collection, Document, IndexedDbAdapter, Model } from "@valkyr/db";
import { createEventRecord } from "@valkyr/ledger";

export type EventDocument = Document & {
  streamId: string;
  type: string;
  data: any;
  meta: any;
  created: string;
  recorded: string;
};

export class EventModel extends Model<EventDocument> {
  public static override readonly $collection = new Collection<EventDocument>("events", new IndexedDbAdapter());

  public readonly streamId!: EventDocument["streamId"];
  public readonly type!: EventDocument["type"];
  public readonly data!: EventDocument["data"];
  public readonly meta!: EventDocument["meta"];
  public readonly created!: EventDocument["created"];
  public readonly recorded!: EventDocument["recorded"];

  public static async insert(document: EventDocument) {
    const record = createEventRecord(document);
    await this.insertOne(record);
  }

  public static async status({ id, streamId, type, created }: EventDocument) {
    const record = await this.findById(id);
    if (record) {
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
}
