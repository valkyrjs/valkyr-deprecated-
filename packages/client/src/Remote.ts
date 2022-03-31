import { Event, publisher, StreamSubscriptionHandler } from "@valkyr/ledger";

import { container } from "./Container";
import { Cursor } from "./Models/Cursor";
import { append } from "./Subscriber";

const streams: Record<string, StreamSubscriptionHandler> = {};

export const remote = new (class {
  public get socket() {
    return container.get("Socket");
  }

  public subscribe(streamId: string, handler: StreamSubscriptionHandler) {
    this.join(streamId);
    streams[streamId] = handler;
    this.pull(streamId);
  }

  public unsubscribe(streamId: string): void {
    this.leave(streamId);
  }

  public join(streamId: string) {
    this.socket.send("streams:join", { streamId });
  }

  public leave(streamId: string) {
    this.socket.send("streams:leave", { streamId });
  }

  /**
   * Pull the events from the connected socket to ensure we are on the latest
   * central node version of the stream. This operation keeps repeating itself
   * until it pulls an empty event array signifying we are now up to date
   * with the central node.
   *
   * A simple iteration guard is added so that we can escape out of a potential
   * infinite loop.
   */
  public async pull(streamId: string, iterations = 0) {
    if (iterations > 10) {
      throw new Error(
        `Event Stream Violation: Escaping pull operation, infinite loop candidate detected after ${iterations} pull iterations.`
      );
    }
    this.socket
      .send("streams:pull", { streamId, recorded: await Cursor.get(streamId) })
      .then(async (events: Event[]) => {
        if (events.length > 0) {
          for (const event of events) {
            await append(event);
          }
          return this.pull(streamId, iterations + 1); // keep pulling the stream until its hydrated
        }
      });
  }

  public push(event: Event) {
    publisher.project(event, { hydrated: false, outdated: false });
    this.socket.send("streams:push", { events: [event] });
  }
})();
