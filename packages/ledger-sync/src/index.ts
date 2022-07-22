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

async function hasEvent(eventId: string): Promise<boolean> {
  return index.has(eventId);
}

async function setEvent(eventId: string): Promise<void> {
  return index.set(eventId, true);
}

async function trackEvent(streamId: string, type: string, at: string): Promise<void> {
  tracker.track(streamId, type, at);
}

async function isEventOutdated(streamId: string, type: string, at: string): Promise<boolean> {
  return tracker.isOutdated(streamId, type, at);
}

async function getEventTimestamp(streamId: string, type: string): Promise<string> {
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
  setEvent,
  trackEvent,
  getEventTimestamp,
  isEventOutdated,
  flush
};
