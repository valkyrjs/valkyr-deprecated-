import { Injectable } from "@angular/core";
import { AggregateRootClass, Event, projector, Queue } from "@valkyr/ledger";

import { RemoteService } from "../RemoteService";
import { SocketService } from "../Socket/SocketService";
import { CursorModel } from "./Models/CursorModel";
import { EventModel } from "./Models/EventModel";
import { StreamSubscriber } from "./StreamSubscriber";

@Injectable({
  providedIn: "root"
})
export class LedgerService {
  readonly cursors = CursorModel;
  readonly events = EventModel;

  readonly #streams: Record<string, StreamSubscriber> = {};
  readonly #queue: Queue<Event>;

  constructor(readonly remote: RemoteService, readonly socket: SocketService) {
    this.#queue = new Queue<Event>(this.#handleEvent.bind(this));
  }

  // ### Event Handler

  async #handleEvent(event: Event) {
    const { exists, outdated } = await this.events.status(event);
    if (exists === false) {
      await this.events.insert(event);
      await projector.project(event, { hydrated: true, outdated }).catch(console.log);
    }
    await this.cursors.set(event.streamId, event.recorded);
  }

  // ### Write Utilities

  /**
   * Push event to the remote ledger.
   *
   * @param event - Event to push to the remote ledger.
   */
  push(event: Event): void {
    this.events.insert(event);
    projector.project(event, { hydrated: false, outdated: false });
    this.remote.post("/ledger", { event });
  }

  /**
   * Append a new event to observed stream. If the stream is not being observed the
   * event is simply ignored.
   */
  async append(event: Event): Promise<void> {
    await new Promise((resolve, reject) => {
      this.#queue.push(event, resolve, reject);
    });
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
  async stream(streamId: string, timestamp?: string, sortDirection: 1 | -1 = 1): Promise<EventModel[]> {
    const filter: any = { streamId };
    if (timestamp) {
      filter.created = {
        [sortDirection === 1 ? "$gt" : "$lt"]: timestamp
      };
    }
    await this.pull(streamId);
    return EventModel.find(filter, { sort: { created: sortDirection } });
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
    const events = await this.remote.get<Event[]>(url);
    if (events.length > 0) {
      for (const event of events) {
        await this.append(event);
      }
      await this.pull(streamId, iterations + 1); // keep pulling the stream until its hydrated
    }
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
   */
  subscribe(aggregate: string, streamId: string): SubscriberFn {
    const subscriber = this.#getSubscriber(streamId);
    if (subscriber.isEmpty) {
      this.join(aggregate, streamId);
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
      this.leave(streamId);
      delete this.#streams[streamId];
    }
  }

  join(aggregate: string, streamId: string): void {
    this.socket.send("streams:join", { streamId, aggregate }).then(() => {
      this.pull(streamId);
    });
  }

  leave(streamId: string): void {
    this.socket.send("streams:leave", { streamId });
  }

  // ### State Utilities

  #getSubscriber(streamId: string): StreamSubscriber {
    if (this.#streams[streamId]) {
      return this.#streams[streamId];
    }
    this.#streams[streamId] = new StreamSubscriber();
    return this.#streams[streamId];
  }
}

type SubscriberFn = { unsubscribe: () => void };
