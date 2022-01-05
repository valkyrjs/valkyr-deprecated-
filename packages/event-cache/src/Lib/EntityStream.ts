import { EventRecord, publisher, Queue } from "@valkyr/event-store";

import { container } from "../Container";
import type { StreamObserver, Streams } from "../Types/EntityStream";

const streams: Streams = {};

/*
 |--------------------------------------------------------------------------------
 | Entity Stream
 |--------------------------------------------------------------------------------
 */

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
export function subscribe(entityId: string): () => void {
  const observer = getObserver(entityId);
  observer.subscribers += 1;
  return () => unsubscribe(entityId);
}

/**
 * Append a new event to observed entity stream. If the entity stream is not
 * being observed the event is simply ignored.
 */
export async function append(event: EventRecord): Promise<void> {
  await new Promise((resolve) => {
    streams[event.entityId]?.queue.push(event, resolve);
  });
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

/**
 * Decrement observer amount by 1 and delete the entity stream observer if the
 * remaining subscribers is 0 or less.
 */
function unsubscribe(entityId: string, stream = container.get("EntityStream")) {
  const observer = streams[entityId];
  observer.subscribers -= 1;
  if (observer.subscribers < 1) {
    stream.unsubscribe(entityId);
    delete streams[entityId];
  }
}

/**
 * Retrieve a stream observer or create a new one if it does not exist.
 */
function getObserver(entityId: string, stream = container.get("EntityStream")): StreamObserver {
  if (streams[entityId]) {
    return streams[entityId];
  }
  streams[entityId] = {
    subscribers: 0,
    queue: new Queue<EventRecord>(async (event) => {
      const { exists, outdated } = await stream.getCachedStatus(event);
      if (!exists) {
        await stream.addCachedEvent(event);
        await stream.setCursor(event.entityId, event.recorded);
        await publisher.project(event, { hydrated: true, outdated });
      }
    })
  };
  stream.subscribe(entityId, streams[entityId].queue.push);
  return streams[entityId];
}
