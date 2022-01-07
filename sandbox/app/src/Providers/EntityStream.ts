import { append, container, StreamSubscriptionHandler } from "@valkyr/event-cache";
import { EventRecord } from "@valkyr/event-store";
import type { Event } from "stores";

import { collection } from "../Collections";
import { socket } from "./Socket";

const streams: Record<string, StreamSubscriptionHandler> = {};

/*
 |--------------------------------------------------------------------------------
 | Dependency Provider
 |--------------------------------------------------------------------------------
 */

container.set("EntityStream", {
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

function subscribe(entityId: string, handler: StreamSubscriptionHandler) {
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

async function getCachedStatus({ id, entityId, type, created }: EventRecord<Event>) {
  const cache = await collection.cache.findById(id);
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

async function addCachedEvent({ id, entityId, type, created }: EventRecord<Event>) {
  await collection.cache.upsert({ id, entityId, type, created });
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
  socket
    .send("streams.pull", { entityId, recorded: await getCursor(entityId) })
    .then(async (events: EventRecord<Event>[]) => {
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
