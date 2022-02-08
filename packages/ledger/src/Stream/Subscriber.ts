import { container } from "../Container";
import { Event } from "../Event";
import { publisher } from "../Projection";
import { Queue } from "../Queue";
import type { StreamObserver, Streams } from "./Interface";

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
function unsubscribe(streamId: string, stream = container.get("StreamSubscriber")) {
  const observer = streams[streamId];
  observer.subscribers -= 1;
  if (observer.subscribers < 1) {
    stream.unsubscribe(streamId);
    delete streams[streamId];
  }
}

/**
 * Retrieve a stream observer or create a new one if it does not exist.
 */
function getObserver(streamId: string, subscriber = container.get("StreamSubscriber")): StreamObserver {
  if (streams[streamId]) {
    return streams[streamId];
  }
  streams[streamId] = {
    subscribers: 0,
    queue: new Queue<Event>(async (event) => {
      const { exists, outdated } = await subscriber.getEventStatus(event);
      if (!exists) {
        await subscriber.addEvent(event);
        await subscriber.setCursor(event.streamId, event.recorded);
        await publisher.project(event, { hydrated: true, outdated });
      }
    })
  };
  subscriber.subscribe(streamId, streams[streamId].queue.push);
  return streams[streamId];
}
