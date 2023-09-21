import { IndexedDatabase } from "@valkyr/db";
import { IndexedStorage, Queue } from "@valkyr/queue";
import { Subject } from "rxjs";

import { EventRecord } from "./index.js";
import { EventWorker } from "./RemoteWorker.js";
import { subscriptions } from "./Subscriptions.js";

const subject = new Subject<[EventRecord, boolean]>();

export class Remote {
  readonly #db: IndexedDatabase<{
    cursors: { timestamp: string };
  }>;

  readonly #queue: Queue<EventWorker>;

  constructor(readonly adapter: RemoteAdapter) {
    this.#db = new IndexedDatabase({
      name: `event-store:cursors`,
      version: 1,
      registrars: [
        {
          name: "cursors"
        }
      ]
    });
    this.#queue = new Queue([new EventWorker(this.adapter)], {
      storage: new IndexedStorage("event-store:queue")
    });
    this.#queue.start();
  }

  get subject() {
    return subject;
  }

  get cursors() {
    return this.#db.collection("cursors");
  }

  subscribe(type: ContainerType, id: string): RemoteSubscription {
    const subscription = subscriptions.get(id);
    if (subscription.isEmpty === true) {
      subscription.unsubscribe = this.adapter.subscribe(type, id);
    }
    let promise = Promise.resolve();
    if (subscription.isSynced === false) {
      subscription.synced();
      promise = this.pull(type, id);
    }
    subscription.increment();
    return {
      promise,
      unsubscribe: () => {
        subscriptions.unsubscribe(id);
      }
    };
  }

  push(record: EventRecord): void {
    this.#queue.push({ type: "events", payload: record });
  }

  async pull(type: ContainerType, id: string): Promise<void> {
    const timestamp = await this.getCursor(id);
    const records = await this.adapter.getEvents(type, id, timestamp);
    if (records.length > 0) {
      for (const record of records) {
        await subject.next([record, true]);
      }
      await this.setCursor(id, this.getCursorTimestamp(records));
    }
  }

  /*
   |--------------------------------------------------------------------------------
   | Cursors
   |--------------------------------------------------------------------------------
   |
   | Cursors are used to keep track of the latest recorded event in a stream. It
   | is used to determine where to start pulling events from when a stream is
   | requested from a remote service or peer.
   |
   */

  async setCursor(id: string, timestamp: string): Promise<void> {
    const cursor = await this.cursors.findOne({ id });
    if (cursor === undefined) {
      await this.cursors.insertOne({ id, timestamp });
    } else {
      await this.cursors.updateOne({ id }, { $set: { timestamp } });
    }
  }

  /**
   * Get from timestamp for given cursor key.
   *
   * @param id - Cursor key to get timestamp for.
   */
  async getCursor(id: string): Promise<string> {
    const cursor = await this.cursors.findById(id);
    if (cursor !== undefined) {
      return cursor.timestamp;
    }
    return "";
  }

  /**
   * Get the largest recorded timestamp from given list of events.
   *
   * @param events - Events to get latest recorded timestamp for.
   */
  getCursorTimestamp(events: EventRecord[]): string {
    let timestamp: string | undefined;
    for (const event of events) {
      if (timestamp === undefined || event.recorded > timestamp) {
        timestamp = event.recorded;
      }
    }
    if (timestamp === undefined) {
      throw new Error("Events did not produce a valid recorded timestamp!");
    }
    return timestamp;
  }
}

export abstract class RemoteAdapter<Record extends EventRecord = EventRecord> {
  get subject() {
    return subject;
  }
  abstract push(record: Record): Promise<void>;
  abstract getEvents(type: ContainerType, id: string, cursor?: string): Promise<Record[]>;
  abstract subscribe(type: ContainerType, id: string): () => void;
}

export type ContainerType = "tenant" | "stream";

export type RemoteSubscription = {
  promise: Promise<void>;
  unsubscribe: () => void;
};
