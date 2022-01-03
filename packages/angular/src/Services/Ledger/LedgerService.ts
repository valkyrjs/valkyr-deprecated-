import { Injectable } from "@angular/core";
import { Event, projector, Queue, StreamObserver, Streams } from "@valkyr/ledger";

import { RemoteService } from "../RemoteService";
import { SocketService } from "../Socket/SocketService";
import { CursorModel } from "./CursorModel";
import { EventModel } from "./EventModel";

@Injectable({
  providedIn: "root"
})
export class LedgerService {
  public readonly streams: Streams = {};

  public readonly cursors = CursorModel;
  public readonly events = EventModel;

  constructor(private remoteService: RemoteService, private socketService: SocketService) {}

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
  public subscribe(aggregate: string, streamId: string): { unsubscribe: () => void } {
    const observer = this.getObserver(streamId, aggregate);
    observer.subscribers += 1;
    return {
      unsubscribe: () => {
        this.unsubscribe(streamId);
      }
    };
  }

  /**
   * Push event to the remote ledger.
   *
   * @param event - Event to push to the remote ledger.
   */
  public push(event: Event): void {
    this.events.insert(event);
    projector.project(event, { hydrated: false, outdated: false });
    this.remoteService.post("/ledger", { event });
  }

  public async pull(streamId: string, iterations = 0) {
    if (iterations > 10) {
      throw new Error(
        `Event Stream Violation: Escaping pull operation, infinite loop candidate detected after ${iterations} pull iterations.`
      );
    }
    const recorded = await this.cursors.get(streamId);
    const url = `/ledger/${streamId}/pull` + (recorded ? `?recorded=${recorded}` : "");
    this.remoteService.get<Event[]>(url).then(async (events) => {
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
    await new Promise((resolve, reject) => {
      this.streams[event.streamId]?.queue.push(event, resolve, reject);
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
  private getObserver(streamId: string, aggregate: string): StreamObserver {
    if (this.streams[streamId]) {
      return this.streams[streamId];
    }
    this.streams[streamId] = {
      subscribers: 0,
      queue: new Queue<Event>(async (event) => {
        const { exists, outdated } = await this.events.status(event);
        if (exists === false) {
          await this.events.insert(event);
          await projector.project(event, { hydrated: true, outdated }).catch(console.log);
        }
        await this.cursors.set(event.streamId, event.recorded);
      })
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
  public join(aggregate: string, streamId: string) {
    this.socketService.send("streams:join", { streamId, aggregate });
    this.pull(streamId);
  }

  /**
   * Leave remote stream.
   *
   * @param streamId - Stream to leave.
   */
  public leave(streamId: string): void {
    this.socketService.send("streams:leave", { streamId });
  }
}
