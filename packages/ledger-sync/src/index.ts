import { cursors } from "./EventCursor";
import { tracker } from "./EventTracker";
import type { EventStorage } from "./Storage/Storage";

export * from "./Storage/IndexedDbStorage";
export * from "./Storage/InstanceStorage";

function setStorage(storage: EventStorage): void {
  cursors.storage = storage;
  tracker.storage = storage;
}

async function setCursor(streamId: string, at: string): Promise<void> {
  await cursors.set(streamId, at);
}

async function getCursor(streamId: string): Promise<string | undefined> {
  return cursors.get(streamId);
}

async function trackEvent(streamId: string, type: string, at: string): Promise<void> {
  tracker.track(streamId, type, at);
}

async function getEventTimestamp(streamId: string, type: string): Promise<string> {
  return tracker.getTimestamp(streamId, type);
}

async function isEventOutdated(streamId: string, type: string, at: string): Promise<boolean> {
  return tracker.isOutdated(streamId, type, at);
}

async function flush(): Promise<void> {
  await Promise.all([cursors.flush(), tracker.flush()]);
}

export const sync = {
  storage: setStorage,
  setCursor,
  getCursor,
  trackEvent,
  getEventTimestamp,
  isEventOutdated,
  flush
};
