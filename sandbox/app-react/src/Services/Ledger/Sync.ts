import { EventRecord } from "@valkyr/ledger";

import { cursors } from "./Cursors";
import { indexes } from "./Indexes";
import { tracker } from "./Tracker";

/*
 |--------------------------------------------------------------------------------
 | Cursor Utilities
 |--------------------------------------------------------------------------------
 */

async function setCursor(key: string, created: string): Promise<void> {
  await cursors.set(key, created);
}

async function getCursor(key: string): Promise<string | undefined> {
  return cursors.get(key);
}

/*
 |--------------------------------------------------------------------------------
 | Event Utilities
 |--------------------------------------------------------------------------------
 */

async function addEvent({ id, streamId, type, created }: EventRecord): Promise<void> {
  await Promise.all([indexes.set(id, true), tracker.track(streamId, type, created)]);
}

async function hasEvent({ id }: EventRecord): Promise<boolean> {
  return indexes.has(id);
}

/*
 |--------------------------------------------------------------------------------
 | Stream Utilities
 |--------------------------------------------------------------------------------
 */

async function isOutdated({ streamId, type, created }: EventRecord): Promise<boolean> {
  return tracker.isOutdated(streamId, type, created);
}

async function getTimestamp(streamId: string, type: string): Promise<string> {
  return tracker.getTimestamp(streamId, type);
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

async function flush(): Promise<void> {
  await Promise.all([cursors.flush(), indexes.flush(), tracker.flush()]);
}

/*
 |--------------------------------------------------------------------------------
 | Export
 |--------------------------------------------------------------------------------
 */

export const sync = {
  setCursor,
  getCursor,
  hasEvent,
  addEvent,
  getTimestamp,
  isOutdated,
  flush
};
