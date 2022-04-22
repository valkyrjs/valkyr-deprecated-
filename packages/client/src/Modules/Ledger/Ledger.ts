import { Event, publisher, Queue, StreamObserver, Streams } from "@valkyr/ledger";

import { Injectable } from "../../Decorators/Injectable";
import { RemoteService } from "../../Services/Remote";
import { SocketService } from "../../Services/Socket";
import { Cache } from "./Models/Cache";
import { Cursor } from "./Models/Cursor";

@Injectable()
export class LedgerService {
  public readonly streams: Streams = {};

  constructor(private readonly remote: RemoteService, private readonly socket: SocketService) {}

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
  public subscribe(streamId: string): () => void {
    const observer = this.getObserver(streamId);
    observer.subscribers += 1;
    return () => this.unsubscribe(streamId);
  }

  /**
   * Push event to the remote ledger.
   *
   * @param event - Event to push to the remote ledger.
   */
  public push(event: Event): void {
    publisher.project(event, { hydrated: false, outdated: false });
    this.remote.post("/ledger", { events: [event] });
  }

  public async pull(streamId: string, iterations = 0) {
    if (iterations > 10) {
      throw new Error(
        `Event Stream Violation: Escaping pull operation, infinite loop candidate detected after ${iterations} pull iterations.`
      );
    }

    const recorded = await Cursor.get(streamId);
    const url = `/ledger/${streamId}/pull` + (recorded ? `?recorded=${recorded}` : "");

    this.remote.get<Event[]>(url).then(async (events) => {
      if (events.length > 0) {
        for (const event of events) {
          await this.append(event);
        }
        return this.pull(streamId, iterations + 1); // keep pulling the stream until its hydrated
      }
    });
  }

  /**
   * Append a new event to observed stream. If the stream is not being observed the
   * event is simply ignored.
   */
  public async append(event: Event): Promise<void> {
    await new Promise((resolve) => {
      this.streams[event.streamId]?.queue.push(event, resolve);
    });
  }

  /**
   * Decrement observer amount by 1 and delete the stream stream observer if the
   * remaining subscribers is 0 or less.
   */
  public unsubscribe(streamId: string) {
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
  private getObserver(streamId: string): StreamObserver {
    if (this.streams[streamId]) {
      return this.streams[streamId];
    }
    this.streams[streamId] = {
      subscribers: 0,
      queue: new Queue<Event>(async (event) => {
        const { exists, outdated } = await Cache.status(event);
        if (!exists) {
          await publisher.project(event, { hydrated: true, outdated });
        }
        await Cache.add(event);
        await Cursor.set(event.streamId, event.recorded);
      })
    };
    this.join(streamId);
    return this.streams[streamId];
  }

  /**
   * Join remote stream through websocket connection.
   *
   * @param streamId - Stream to join.
   */
  public join(streamId: string) {
    this.socket.send("streams:join", { streamId });
    this.pull(streamId);
  }

  /**
   * Leave remote stream.
   *
   * @param streamId - Stream to leave.
   */
  public leave(streamId: string): void {
    this.socket.send("streams:leave", { streamId });
  }
}
