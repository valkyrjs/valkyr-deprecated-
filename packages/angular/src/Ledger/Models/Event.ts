import { Injectable } from "@angular/core";
import { Document, Model } from "@valkyr/db";

export type EventDocument = Document & {
  streamId: string;
  type: string;
  data: any;
  meta: any;
  created: string;
  recorded: string;
};

@Injectable({ providedIn: "root" })
export class Event extends Model<EventDocument> {
  readonly streamId!: EventDocument["streamId"];
  readonly type!: EventDocument["type"];
  readonly data!: EventDocument["data"];
  readonly meta!: EventDocument["meta"];
  readonly created!: EventDocument["created"];
  readonly recorded!: EventDocument["recorded"];

  static async insert(document: EventDocument): Promise<Event> {
    return this.insertOne(document);
  }
}

export type EventModel = typeof Event;
