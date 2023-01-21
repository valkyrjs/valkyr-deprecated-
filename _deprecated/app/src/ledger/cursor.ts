import type { EventRecord } from "@valkyr/ledger";

import { db } from "./database";

export const cursor = {
  set: setCursor,
  get: getCursorQuery,
  timestamp: getCursorTimestamp
};

async function setCursor(id: string, timestamp: string): Promise<void> {
  const cursor = await db.collection("cursors").findById(id);
  if (cursor === undefined) {
    await db.collection("cursors").insertOne({ id, timestamp });
  } else {
    await db.collection("cursors").updateOne({ id }, { $set: { timestamp } });
  }
}

/**
 * Get from timestamp for given cursor key.
 *
 * @param stream - Cursor key to get timestamp for.
 */
async function getCursorQuery(stream: string): Promise<string | undefined> {
  const cursor = await db.collection("cursors").findById(stream);
  if (cursor !== undefined) {
    return cursor.timestamp;
  }
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
  return timestamp as string;
}
