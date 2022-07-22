import { EventRecord } from "@valkyr/ledger";

import { cursors } from "./EventCursor";
import { index } from "./EventIndex";
import { tracker } from "./EventTracker";
import type { EventStorageClass } from "./Storage/Storage";

export * from "./Storage/IndexedDbStorage";
export * from "./Storage/InstanceStorage";

function setStorage(storage: EventStorageClass): void {
  cursors.storage = new storage("event:cursors");
  index.storage = new storage("event:index");
  tracker.storage = new storage("event:tracker");
}

async function setCursor(streamId: string, at: string): Promise<void> {
  await cursors.set(streamId, at);
}

async function getCursor(streamId: string): Promise<string | undefined> {
  return cursors.get(streamId);
}

async function addEvent({ id, streamId, type, created }: EventRecord): Promise<void> {
  await Promise.all([index.set(id, true), tracker.track(streamId, type, created)]);
}

async function hasEvent({ id }: EventRecord): Promise<boolean> {
  return index.has(id);
}

async function isOutdated({ streamId, type, created }: EventRecord): Promise<boolean> {
  return tracker.isOutdated(streamId, type, created);
}

async function getTimestamp(streamId: string, type: string): Promise<string> {
  return tracker.getTimestamp(streamId, type);
}

async function flush(): Promise<void> {
  await Promise.all([cursors.flush(), index.flush(), tracker.flush()]);
}

export const sync = {
  storage: setStorage,
  setCursor,
  getCursor,
  hasEvent,
  addEvent,
  getTimestamp,
  isOutdated,
  flush
};
