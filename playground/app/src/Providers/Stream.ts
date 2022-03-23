import { append, container, publisher, StreamSubscriptionHandler } from "@valkyr/ledger";
import type { Event } from "stores";

import { Cache } from "../Models/Cache";
import { Cursor } from "../Models/Cursor";
import { socket } from "./Socket";

const streams: Record<string, StreamSubscriptionHandler> = {};

/*
 |--------------------------------------------------------------------------------
 | Dependency Provider
 |--------------------------------------------------------------------------------
 */

container.set("StreamSubscriber", {
  subscribe,
  unsubscribe,
  addEvent,
  getEventStatus,
  setCursor,
  getCursor
});

/*
 |--------------------------------------------------------------------------------
 | Subscription Handlers
 |--------------------------------------------------------------------------------
 */

function subscribe(streamId: string, handler: StreamSubscriptionHandler) {
  socket.streams.join(streamId);
  streams[streamId] = handler;
  pull(streamId);
}

function unsubscribe(streamId: string): void {
  socket.streams.leave(streamId);
}

/*
 |--------------------------------------------------------------------------------
 | Cache Handlers
 |--------------------------------------------------------------------------------
 */

async function getEventStatus({ eventId, streamId, type, created }: Event) {
  const cache = await Cache.findById(eventId);
  if (cache) {
    return { exists: true, outdated: true };
  }
  const count = await Cache.count({
    streamId,
    type,
    created: {
      $gt: created
    }
  });
  return { exists: false, outdated: count > 0 };
}

async function addEvent({ eventId, streamId, type, created }: Event) {
  await Cache.upsert({ id: eventId, streamId, type, created });
}

/*
 |--------------------------------------------------------------------------------
 | Cursor Handlers
 |--------------------------------------------------------------------------------
 */

async function setCursor(streamId: string, at: string) {
  await Cursor.upsert({ id: streamId, at });
}

async function getCursor(streamId: string) {
  const stream = await Cursor.findOne({ id: streamId });
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
async function pull(streamId: string, itterations = 0) {
  if (itterations > 10) {
    throw new Error(
      `Event Stream Violation: Escaping pull operation, infinite loop candidate detected after ${itterations} pull itterations.`
    );
  }
  socket.send("streams:pull", { streamId, recorded: await getCursor(streamId) }).then(async (events: Event[]) => {
    if (events.length > 0) {
      for (const event of events) {
        await append(event);
      }
      return pull(streamId, itterations + 1); // keep pulling the stream until its hydrated
    }
  });
}

export function push(event: Event) {
  publisher.project(event, { hydrated: false, outdated: false });
  socket.send("streams:push", { events: [event] });
}

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

socket.on("event", append);
