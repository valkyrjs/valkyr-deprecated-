import { EventRecord } from "@valkyr/ledger";

import { db } from "./Database";

export const cursor = {
  set: setCursor,
  get: getCursor,
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
 * @param streamId - Cursor key to get timestamp for.
 */
async function getCursor(stream: string): Promise<string> {
  const cursor = await db.collection("cursors").findById(stream);
  if (cursor !== undefined) {
    return cursor.timestamp;
  }
  return "";
}

/**
 * Get the largest recorded timestamp from given list of events.
 *
 * @param events - Events to get latest recorded timestamp for.
 */
function getCursorTimestamp(events: EventRecord[]): string {
  let timestamp: string | undefined;
  for (const event of events) {
    if (timestamp === undefined || event.recorded > timestamp) {
      timestamp = event.recorded;
    }
  }
  if (timestamp === undefined) {
    throw new Error("Events did not produce a valid recorded timestamp!");
  }
  return timestamp;
}
