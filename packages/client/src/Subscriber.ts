import { Event, publisher, Queue, StreamObserver, Streams } from "@valkyr/ledger";

import { Cache } from "./Models/Cache";
import { Cursor } from "./Models/Cursor";
import { remote } from "./Remote";

const streams: Streams = {};

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
export function subscribe(streamId: string): () => void {
  const observer = getObserver(streamId);
  observer.subscribers += 1;
  return () => unsubscribe(streamId);
}

/**
 * Append a new event to observed stream. If the stream is not being observed the
 * event is simply ignored.
 */
export async function append(event: Event): Promise<void> {
  await new Promise((resolve) => {
    streams[event.streamId]?.queue.push(event, resolve);
  });
}

/**
 * Decrement observer amount by 1 and delete the stream stream observer if the
 * remaining subscribers is 0 or less.
 */
function unsubscribe(streamId: string) {
  const observer = streams[streamId];
  observer.subscribers -= 1;
  if (observer.subscribers < 1) {
    remote.unsubscribe(streamId);
    delete streams[streamId];
  }
}

/**
 * Retrieve a stream observer or create a new one if it does not exist.
 */
function getObserver(streamId: string): StreamObserver {
  if (streams[streamId]) {
    return streams[streamId];
  }
  streams[streamId] = {
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
  remote.subscribe(streamId, streams[streamId].queue.push);
  return streams[streamId];
}
