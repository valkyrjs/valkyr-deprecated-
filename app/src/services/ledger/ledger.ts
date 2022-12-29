import { EventRecord } from "@valkyr/ledger";

import { db } from "~services/database";

import { EventStore } from "./event-store";
import { projector } from "./projector";

const store = new EventStore();

/*
 |--------------------------------------------------------------------------------
 | Ledger
 |--------------------------------------------------------------------------------
 */

export const ledger = {
  project: projector.project,
  push: store.push,
  insert: store.record,
  pull,
  cursors: {
    set: async (id: string, timestamp: string): Promise<void> => {
      const cursor = await db.collection("cursors").findById(id);
      if (cursor === undefined) {
        await db.collection("cursors").insertOne({ id, timestamp });
      } else {
        await db.collection("cursors").updateOne({ id }, { $set: { timestamp } });
      }
    },
    get: getCursorQuery,
    timestamp: getCursorTimestamp
  }
};

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

/**
 * As part of ledger synchronization we pull events from the attached
 * remote service based on the last known remote event position. The
 * position being used is the `recorded` event timestamp locally on
 * the remote endpoint.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function pull(aggregate: string, stream: string): Promise<void> {
  // const res = await remote.get<{ events: EventRecord[] }>(`/events/${aggregate}/streams/${stream}${await getCursorQuery(streamId)}`);
  // if (res.status === "success" && res.resource.events.length > 0) {
  //   for (const event of res.resource.events) {
  //     await store.record(event);
  //   }
  //   await Cursor.set(stream, getCursorTimestamp(res.resource.events));
  // }
}

/**
 * Get from timestamp for given cursor key.
 *
 * @param stream - Cursor key to get timestamp for.
 */
async function getCursorQuery(stream: string): Promise<string> {
  const cursor = await db.collection("cursors").findById(stream);
  if (cursor !== undefined) {
    return `?from=${cursor.timestamp}`;
  }
  return "";
}

/**
 * Get the largest recorded timestamp from given list of events.
 *
 * @param events - Events to get latest recorded timestamp for.
 */
function getCursorTimestamp(events: EventRecord[]): string {
  let timestamp: undefined | string;
  for (const event of events) {
    if (timestamp === undefined || event.recorded > timestamp) {
      timestamp = event.recorded;
    }
  }
  return timestamp;
}
