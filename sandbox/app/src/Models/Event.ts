import { Model } from "@valkyr/db";
import { EventRecord } from "@valkyr/event-store";

type Attributes = { id: string } & EventRecord;

export class Event extends Model<Attributes> {
  public static readonly $collection = "events";

  public readonly streamId: Attributes["streamId"];
  public readonly type: Attributes["type"];
  public readonly data: Attributes["data"];
  public readonly meta: Attributes["meta"];
  public readonly date: Attributes["date"];
  public readonly height: Attributes["height"];
  public readonly parent: Attributes["parent"];
  public readonly commit: Attributes["commit"];

  constructor(document: Attributes) {
    super(document);

    this.streamId = document.streamId;
    this.type = document.type;
    this.data = document.data;
    this.meta = document.meta;
    this.date = document.date;
    this.height = document.height;
    this.parent = document.parent;
    this.commit = document.commit;

    Object.freeze(this);
  }

  public toJSON(): Attributes {
    return super.toJSON({
      streamId: this.streamId,
      type: this.type,
      data: this.data,
      meta: this.meta,
      date: this.date,
      height: this.height,
      parent: this.parent,
      commit: this.commit
    });
  }
}
