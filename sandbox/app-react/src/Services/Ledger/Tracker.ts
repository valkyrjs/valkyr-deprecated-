import { Storage } from "./Storage";

const storage = new Storage("event:tracker");

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

async function track(streamId: string, type: string, created: string): Promise<void> {
  const id = getPointer(streamId, type);
  const ts = await storage.get(id);
  if (ts === undefined || created > ts) {
    await storage.set(id, created);
  }
}

async function isOutdated(streamId: string, type: string, created: string): Promise<boolean> {
  return (await getTimestamp(streamId, type)) > created;
}

async function getTimestamp(streamId: string, type: string): Promise<string> {
  return (await storage.get(getPointer(streamId, type))) ?? "";
}

function getPointer(streamId: string, type: string): string {
  return `${streamId}:${type}`;
}

/*
 |--------------------------------------------------------------------------------
 | Export
 |--------------------------------------------------------------------------------
 */

export const tracker = {
  track,
  isOutdated,
  getTimestamp,
  flush: storage.flush.bind(storage)
};
