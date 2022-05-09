import { Injectable } from "@angular/core";
import { AggregateRootClass, Event, projector, Queue, StreamObserver, Streams } from "@valkyr/ledger";

import { RemoteService } from "../RemoteService";
import { SocketService } from "../Socket/SocketService";
import { CursorModel } from "./CursorModel";
import { EventModel } from "./EventModel";

@Injectable({
  providedIn: "root"
})
export class LedgerService {
  readonly streams: Streams = {};

  readonly cursors = CursorModel;
  readonly events = EventModel;

  readonly #queue = new Queue<Event>(async (event) => {
    const { exists, outdated } = await this.events.status(event);
    if (exists === false) {
      await this.events.insert(event);
      await projector.project(event, { hydrated: true, outdated }).catch(console.log);
    }
    await this.cursors.set(event.streamId, event.recorded);
  });

  constructor(readonly remoteService: RemoteService, readonly socketService: SocketService) {}

  /**
   * Reduce an event stream down to its final aggregate state representation.
   *
   * We do this by left folding all events in a stream down to a single
   * representation of the entire stream.
   *
   * @param streamId - Stream to pull events from.
   * @param reducer  - Reducer method used to fold the stream events.
   *
   * @returns Aggregate state of the stream
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
   * Provide all the events for a given stream.
   *
   * @param streamId  - Stream identifier to retrieve events from.
   * @param created   - Get events from a specific point in time.
   * @param direction - Get the events in ascending or descending order.
   *
   * @returns Events found for the given stream
   */
  async stream(streamId: string, created?: string, direction: 1 | -1 = 1) {
    const filter: any = { streamId };
    if (created) {
      filter.created = {
        [direction === 1 ? "$gt" : "$lt"]: created
      };
    }
    await this.pull(streamId);
    return EventModel.find(filter, { sort: { created: direction } });
  }

  /**
   * Push event to the remote ledger.
   *
   * @param event - Event to push to the remote ledger.
   */
  push(event: Event): void {
    this.events.insert(event);
    projector.project(event, { hydrated: false, outdated: false });
    this.remoteService.post("/ledger", { event });
  }

  async pull(streamId: string, iterations = 0): Promise<void> {
    if (iterations > 10) {
      throw new Error(
        `Event Stream Violation: Escaping pull operation, infinite loop candidate detected after ${iterations} pull iterations.`
      );
    }
    const recorded = await this.cursors.get(streamId);
    const url = `/ledger/${streamId}/pull` + (recorded ? `?recorded=${recorded}` : "");
    const events = await this.remoteService.get<Event[]>(url);
    if (events.length > 0) {
      for (const event of events) {
        await this.append(event);
      }
      await this.pull(streamId, iterations + 1); // keep pulling the stream until its hydrated
    }
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

  /**
   * When subscribing we keep track of all instances that are currently observing
   * the provided id. This way we can ensure that we can keep the observer alive
   * until there are no longer any active subscribers.
   *
   * This approach allows us to only have a single observer for multiple
   * subscribers removing the issue of having multiple subscribers attempting to
   * update the event store with the same event.
   *
   * @returns Unsubscribe function to call when destroying the subscription.
   */
  subscribe(aggregate: string, streamId: string): { unsubscribe: () => void } {
    const observer = this.getObserver(streamId, aggregate);
    if (observer.subscribers === 0) {
      EventModel.count({ streamId }).then((count) => {
        if (count === 0) {
          this.pull(streamId);
        }
      });
    }
    observer.subscribers += 1;
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
  unsubscribe(streamId: string) {
    const observer = this.streams[streamId];
    observer.subscribers -= 1;
    if (observer.subscribers < 1) {
      this.leave(streamId);
      delete this.streams[streamId];
    }
  }

  /**
   * Retrieve a stream observer or create a new one if it does not exist.
   */
  getObserver(streamId: string, aggregate: string): StreamObserver {
    if (this.streams[streamId]) {
      return this.streams[streamId];
    }
    this.streams[streamId] = {
      subscribers: 0
    };
    this.join(aggregate, streamId);
    return this.streams[streamId];
  }

  /**
   * Join remote stream through websocket connection.
   *
   * @param aggregate - Aggregate the stream resides within.
   * @param streamId  - Stream to join.
   */
  join(aggregate: string, streamId: string) {
    this.socketService.send("streams:join", { streamId, aggregate });
    this.pull(streamId);
  }

  /**
   * Leave remote stream.
   *
   * @param streamId - Stream to leave.
   */
  leave(streamId: string): void {
    this.socketService.send("streams:leave", { streamId });
  }
}
