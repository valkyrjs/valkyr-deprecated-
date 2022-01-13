import { container } from "../Container";
import { Event } from "../Event";
import { publisher } from "../Projection";
import { Queue } from "../Queue";
import type { Entities, EntityObserver } from "./Interface";

const entities: Entities = {};

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
 * Append a new event to observed entity. If the entity is not being observed the
 * event is simply ignored.
 */
export async function append(event: Event): Promise<void> {
  await new Promise((resolve) => {
    entities[event.entityId]?.queue.push(event, resolve);
  });
}

/**
 * Decrement observer amount by 1 and delete the entity stream observer if the
 * remaining subscribers is 0 or less.
 */
function unsubscribe(entityId: string, stream = container.get("EntitySubscriber")) {
  const observer = entities[entityId];
  observer.subscribers -= 1;
  if (observer.subscribers < 1) {
    stream.unsubscribe(entityId);
    delete entities[entityId];
  }
}

/**
 * Retrieve a entity observer or create a new one if it does not exist.
 */
function getObserver(entityId: string, subscriber = container.get("EntitySubscriber")): EntityObserver {
  if (entities[entityId]) {
    return entities[entityId];
  }
  entities[entityId] = {
    subscribers: 0,
    queue: new Queue<Event>(async (event) => {
      const { exists, outdated } = await subscriber.getCachedStatus(event);
      if (!exists) {
        await subscriber.addCachedEvent(event);
        await subscriber.setCursor(event.entityId, event.recorded);
        await publisher.project(event, { hydrated: true, outdated });
      }
    })
  };
  subscriber.subscribe(entityId, entities[entityId].queue.push);
  return entities[entityId];
}
