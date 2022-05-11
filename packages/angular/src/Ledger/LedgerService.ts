import { Inject, Injectable } from "@angular/core";
import {
  AggregateRootClass,
  createEventRecord,
  Event as LedgerEvent,
  EventStatus,
  projector,
  Queue,
  validator
} from "@valkyr/ledger";

import { RemoteService } from "../Services/RemoteService";
import { SocketService } from "../Services/Socket/SocketService";
import { Cursor, CursorModel } from "./Models/Cursor";
import { Event, EventDocument, EventModel } from "./Models/Event";
import { StreamSubscriber } from "./StreamSubscriber";

@Injectable({ providedIn: "root" })
export class LedgerService {
  readonly #streams: Record<string, StreamSubscriber> = {};
  readonly #queue: Queue<LedgerEvent>;

  constructor(
    @Inject(Cursor) readonly cursors: CursorModel,
    @Inject(Event) readonly events: EventModel,
    readonly remote: RemoteService,
    readonly socket: SocketService
  ) {
    this.#queue = new Queue<LedgerEvent>(this.#handleEvent.bind(this));
    socket.on("ledger:event", (event: LedgerEvent) => {
      this.append(event, true, true);
    });
  }

  // ### Event Handler

  async #handleEvent(event: LedgerEvent) {
    await this.events.insert(event);
  }

  // ### Write Utilities

  /**
   *
   */
  async append(event: LedgerEvent, hydrated = false, remote = false): Promise<void> {
    const record = createEventRecord(event);
    const status = await this.status(event);
    if (status.exists === true) {
      if (remote === true) {
        await this.cursors.set(event.streamId, event.recorded);
      }
      return; // event already exists, no further actions required
    }

    await validator.validate(event);
    await this.#queue.push(record, Promise.resolve, Promise.reject);
    await projector.project(event, { hydrated, outdated: status.outdated }).catch(console.log);

    if (remote === true) {
      await this.cursors.set(event.streamId, event.recorded);
    } else {
      await this.remote.post("/ledger", { event });
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
  async status({ id, streamId, type, created }: EventDocument): Promise<EventStatus> {
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
   * @remarks If sequential handling of an event is required, make sure to
   *          perform said event creation on a central back end ledger.
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
   *
   * To ensure that we have the latest events in the stream at the time
   * of the request, we send a pull request to the attached remote service
   * before executing the local event query.
   */
  async stream(streamId: string, timestamp?: string, sortDirection: 1 | -1 = 1): Promise<Event[]> {
    const filter: any = { streamId };
    if (timestamp) {
      filter.created = {
        [sortDirection === 1 ? "$gt" : "$lt"]: timestamp
      };
    }
    await this.pull(streamId);
    return this.events.find(filter, { sort: { created: sortDirection } });
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
  async pull(streamId: string, iterations = 0): Promise<void> {
    if (iterations > 10) {
      throw new Error(
        `Event Stream Violation: Escaping pull operation, infinite loop candidate detected after ${iterations} pull iterations.`
      );
    }
    const recorded = await this.cursors.get(streamId);
    const url = `/ledger/${streamId}/pull` + (recorded ? `?recorded=${recorded}` : "");
    const events = await this.remote.get<LedgerEvent[]>(url);
    if (events.length > 0) {
      for (const event of events) {
        await this.append(event, true, true);
      }
      await this.pull(streamId, iterations + 1); // keep pulling the stream until its hydrated
    }
  }

  // ### Subscription Utilities

  relay(aggregate: string, streamId: string, event: LedgerEvent) {
    this.socket.send("streams:relay", { aggregate, streamId, event });
  }

  /**
   * When subscribing we keep track of all instances that are currently observing
   * the provided id. This way we can ensure that we can keep the observer alive
   * until there are no longer any active subscribers.
   *
   * This approach allows us to only have a single observer for multiple
   * subscribers removing the issue of having multiple subscribers attempting to
   * update the event store with the same event.
   *
   * @param aggregate  - Aggregate the stream is being access controlled within.
   * @param streamId   - Stream to subscribe to.
   * @param pullEvents - Should we pull potential unknown events from the server? (Default: false)
   */
  subscribe(aggregate: string, streamId: string, pullEvents = false): LedgerSubscription {
    const subscriber = this.#getSubscriber(streamId);
    if (subscriber.isEmpty === true) {
      this.#join(aggregate, streamId);
    }
    if (pullEvents === true && subscriber.isSynced === false) {
      subscriber.synced();
      this.pull(streamId);
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

  #join(aggregate: string, streamId: string): void {
    this.socket.send("streams:join", { aggregate, streamId });
  }

  #leave(streamId: string): void {
    this.socket.send("streams:leave", { streamId });
  }

  // ### State Utilities

  #getSubscriber(streamId: string): StreamSubscriber {
    if (this.#streams[streamId] === undefined) {
      this.#streams[streamId] = new StreamSubscriber();
    }
    return this.#streams[streamId];
  }
}

export type LedgerSubscription = { unsubscribe: () => void };
