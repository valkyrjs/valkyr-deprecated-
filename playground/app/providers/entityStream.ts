import { append, container, EntitySubscriptionHandler } from "@valkyr/ledger";
import type { Event } from "stores";

import { collection } from "../collections";
import { socket } from "./socket";

const streams: Record<string, EntitySubscriptionHandler> = {};

/*
 |--------------------------------------------------------------------------------
 | Dependency Provider
 |--------------------------------------------------------------------------------
 */

container.set("EntitySubscriber", {
  subscribe,
  unsubscribe,
  addCachedEvent,
  getCachedStatus,
  setCursor,
  getCursor
});

/*
 |--------------------------------------------------------------------------------
 | Subscription Handlers
 |--------------------------------------------------------------------------------
 */

function subscribe(entityId: string, handler: EntitySubscriptionHandler) {
  socket.streams.join(entityId);
  streams[entityId] = handler;
  pull(entityId);
}

function unsubscribe(entityId: string): void {
  socket.streams.leave(entityId);
}

/*
 |--------------------------------------------------------------------------------
 | Cache Handlers
 |--------------------------------------------------------------------------------
 */

async function getCachedStatus({ eventId, entityId, type, created }: Event) {
  const cache = await collection.cache.findById(eventId);
  if (cache) {
    return { exists: true, outdated: true };
  }
  const count = await collection.cache.count({
    entityId,
    type,
    created: {
      $gt: created
    }
  });
  return { exists: false, outdated: count > 0 };
}

async function addCachedEvent({ eventId, entityId, type, created }: Event) {
  await collection.cache.upsert({ id: eventId, entityId, type, created });
}

/*
 |--------------------------------------------------------------------------------
 | Cursor Handlers
 |--------------------------------------------------------------------------------
 */

async function setCursor(entityId: string, at: string) {
  await collection.cursors.upsert({ id: entityId, at });
}

async function getCursor(entityId: string) {
  const stream = await collection.cursors.findOne({ id: entityId });
  if (stream) {
    return stream.at;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

/**
 * Pull the events from the connected socket to ensure we are on the latest
 * central node version of the stream. This operation keeps repeating itself
 * until it pulls an empty event array signifying we are now up to date
 * with the central node.
 *
 * A simple itteration guard is added so that we can escape out of a potential
 * infinite loop.
 */
async function pull(entityId: string, itterations = 0) {
  if (itterations > 10) {
    throw new Error(
      `Event Stream Violation: Escaping pull operation, infinite loop candidate detected after ${itterations} pull itterations.`
    );
  }
  socket.send("streams.pull", { entityId, recorded: await getCursor(entityId) }).then(async (events: Event[]) => {
    if (events.length > 0) {
      for (const event of events) {
        await append(event);
      }
      return pull(entityId, itterations + 1); // keep pulling the stream until its hydrated
    }
  });
}

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

socket.on("event", append);
