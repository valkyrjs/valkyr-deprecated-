import { Inject, Injectable } from "@angular/core";
import {
  AggregateRootClass,
  createEventRecord,
  EventRecord,
  getLogicalTimestamp,
  LedgerEvent,
  LedgerEventStatus,
  Queue,
  validator
} from "@valkyr/ledger";

import { RemoteService } from "../../Remote";
import { SocketService } from "../../Socket";
import { projector } from "../Lib/Projector";
import { StreamSubscriber } from "../Lib/StreamSubscriber";
import { Event, EventDocument, EventModel } from "../Models/Event";
import { EventTracker, EventTrackerModel } from "../Models/EventTracker";

export const PUBLIC_LEDGER_ALIAS = "ledger:public";
export const LEDGER_STREAM_KEY = "ledger:streams";

@Injectable({ providedIn: "root" })
export class LedgerService {
  readonly #streams: Record<string, StreamSubscriber> = {};
  readonly #queue: Queue<EventRecord>;

  constructor(
    @Inject(Event) readonly events: EventModel,
    @Inject(EventTracker) readonly tracker: EventTrackerModel,
    readonly remote: RemoteService,
    readonly socket: SocketService
  ) {
    this.#queue = new Queue<EventRecord>(this.#handleEvent.bind(this));
    socket.on("ledger:event", (event: EventRecord) => {
      event.recorded = getLogicalTimestamp();
      this.insert(event, true);
    });
  }

  // ### Event Handler

  async #handleEvent(event: EventRecord) {
    await this.events.insert(event);
  }

  // ### Write Utilities

  /**
   * Append a new event to the ledger.
   *
   * @remarks This is a origin operation describing the first existence of
   * the provided event.
   *
   * @param streamId - Stream to append the event record to.
   * @param event    - Event to append to the ledger.
   */
  async append(streamId: string, event: LedgerEvent): Promise<void> {
    const record = createEventRecord(streamId, event);
    await this.insert(record);
    this.#push(record);
  }

  /**
   * Insert event record onto the ledger.
   *
   * @param event    - Event record to insert.
   * @param hydrated - Is this part of a newly created event?
   */
  async insert(event: EventRecord, hydrated = false): Promise<void> {
    const status = await this.status(event);
    if (status.exists === false) {
      await validator.validate(event);
      await this.#queue.push(event, Promise.resolve, Promise.reject);
      await projector.project(event, { hydrated, outdated: status.outdated }).catch(console.log);
    }
  }

  /**
   * Enable the ability to check an incoming events status in relation to
   * the local ledger. This is to determine what actions to take upon the
   * ledger based on the current status.
   *
   * **Exists**
   *
   * References the existence of the event in the local ledger. It is
   * determined by looking at the recorded event id which should be unique
   * to the entirety of the ledger.
   *
   * **Outdated**
   *
   * References the events created relationship to the same event type in
   * the hosted stream. If another event of the same type in the stream
   * is newer than the provided event, the provided event is considered
   * outdated.
   */
  async status({ id, streamId, type, created }: EventDocument): Promise<LedgerEventStatus> {
    const record = await this.events.findOne({ id });
    if (record) {
      return { exists: true, outdated: true };
    }
    const count = await this.events.count({
      streamId,
      type,
      created: {
        $gt: created
      }
    });
    return { exists: false, outdated: count > 0 };
  }

  // ### Stream Utilities

  /**
   * An event reducer aims to create an aggregate state that is as close
   * to up to date as possible. This is handy when we want to perform
   * things such as business logic on the command/action layer of the event
   * creation lifecycle.
   *
   * By default the state is as close as possible since we are operating
   * in a distributed system without a central authority or sequential
   * event bus. As such developers is advised to build with failure at a
   * later date as an option.
   *
   * This method operates by pulling all the latest known events of an event
   * stream and reduces them into a single current state representing of
   * the event stream.
   */
  async reduce<AggregateRoot extends AggregateRootClass>(
    streamId: string,
    aggregate: AggregateRoot
  ): Promise<InstanceType<AggregateRoot> | undefined> {
    const events = await this.stream(streamId);
    if (events.length === 0) {
      return undefined;
    }
    const instance = new aggregate();
    for (const event of events) {
      instance.apply(event);
    }
    return instance as InstanceType<AggregateRoot>;
  }

  /**
   * Retrieve all events for a given stream. Provided timestamp allows for
   * providing a specific point in time to retrieve before or after based
   * on a provided sort direction.
   */
  async stream(streamId: string, timestamp?: string, sortDirection: 1 | -1 = 1): Promise<EventRecord[]> {
    const filter: any = { streamId };
    if (timestamp) {
      filter.created = {
        [sortDirection === 1 ? "$gt" : "$lt"]: timestamp
      };
    }
    return this.events.find(filter, { sort: { created: sortDirection } });
  }

  // ### Subscription Utilities

  /**
   * When subscribing we keep track of all instances that are currently observing
   * the provided id. This way we can ensure that we can keep the observer alive
   * until there are no longer any active subscribers.
   *
   * This approach allows us to only have a single observer for multiple
   * subscribers removing the issue of having multiple subscribers attempting to
   * update the event store with the same event.
   *
   * @param aggregate - Aggregate the stream is being access controlled within.
   * @param streamId  - Stream to subscribe to.
   */
  subscribe(aggregate: string, streamId: string): LedgerSubscription {
    const subscriber = this.#getSubscriber(streamId);
    if (subscriber.isEmpty === true) {
      this.#join(aggregate, streamId);
    }
    if (subscriber.isSynced === false) {
      subscriber.synced();
      this.#pull(aggregate, streamId);
    }
    subscriber.increment();
    return {
      unsubscribe: () => {
        this.unsubscribe(streamId);
      }
    };
  }

  /**
   * Decrement observer amount by 1 and delete the stream stream observer if the
   * remaining subscribers is 0 or less.
   */
  unsubscribe(streamId: string): void {
    const subscriber = this.#streams[streamId];
    subscriber.decrement();
    if (subscriber.isEmpty) {
      this.#leave(streamId);
      delete this.#streams[streamId];
    }
  }

  #getSubscriber(streamId: string): StreamSubscriber {
    if (this.#streams[streamId] === undefined) {
      this.#streams[streamId] = new StreamSubscriber();
    }
    return this.#streams[streamId];
  }

  // ### Socket Utilities

  #join(aggregate: string, streamId: string): void {
    this.socket.send("streams:join", { aggregate, streamId });
  }

  #leave(streamId: string): void {
    this.socket.send("streams:leave", { streamId });
  }

  // ### Remote Utilities

  #push(event: EventRecord) {
    this.remote.post("/ledger", event).catch((error) => {
      console.log(error);
    });
  }

  /**
   * As part of ledger synchronization we pull events from the attached
   * remote service based on the last known remote event position. The
   * position being used is the `recorded` event timestamp locally on
   * the remote endpoint.
   *
   * The pull operation will keep firing until there are no unknown
   * events being returned or we hit the maximum iteration limit of the
   * pull operation. A limiter is added to eliminate the possibility of
   * an infinite refresh loop.
   */
  async #pull(aggregate: string, streamId: string, iterations = 0) {
    if (iterations > 10) {
      throw new Error(
        `Event Stream Violation: Escaping pull operation, infinite loop candidate detected after ${iterations} pull iterations.`
      );
    }
    const recorded = await this.tracker.get(streamId);
    const url = `/ledger/${aggregate}/pull/${streamId}` + (recorded ? `?recorded=${recorded}` : "");
    this.remote.get<EventRecord[]>(url).then(async (events) => {
      if (events.length > 0) {
        let tracker: TrackerMeta | undefined;
        for (const event of events) {
          tracker = { streamId: event.streamId, recorded: event.recorded };
          event.recorded = getLogicalTimestamp();
          await this.insert(event, true);
        }
        if (tracker !== undefined) {
          await this.tracker.set(tracker.streamId, tracker.recorded);
        }
        await this.#pull(aggregate, streamId, iterations + 1); // keep pulling the stream until its hydrated
      }
    });
  }
}

export type LedgerSubscription = { unsubscribe: () => void };

type TrackerMeta = {
  streamId: string;
  recorded: string;
};
