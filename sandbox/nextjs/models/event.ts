import { Model } from "@valkyr/db";
import { Event as EventAttributes } from "@valkyr/ledger";

type Attributes = { id: string } & EventAttributes;

export class Event extends Model<Attributes> {
  public static readonly $collection = "events";

  public readonly eventId: Attributes["eventId"];
  public readonly entityId: Attributes["entityId"];
  public readonly type: Attributes["type"];
  public readonly data: Attributes["data"];
  public readonly meta: Attributes["meta"];
  public readonly created: Attributes["created"];
  public readonly recorded: Attributes["recorded"];

  constructor(document: Attributes) {
    super(document);

    this.eventId = document.eventId;
    this.entityId = document.entityId;
    this.type = document.type;
    this.data = document.data;
    this.meta = document.meta;
    this.created = document.created;
    this.recorded = document.recorded;

    Object.freeze(this);
  }

  public toJSON(): Attributes {
    return super.toJSON({
      eventId: this.eventId,
      entityId: this.entityId,
      type: this.type,
      data: this.data,
      meta: this.meta,
      created: this.created,
      recorded: this.recorded
    });
  }
}
