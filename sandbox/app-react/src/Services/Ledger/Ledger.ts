import { createEventRecord, EventRecord, LedgerEvent, LedgerEventStatus } from "@valkyr/ledger";

import { remote } from "../Remote";
import { projector } from "./Projector";
import { sync } from "./Sync";

/*
 |--------------------------------------------------------------------------------
 | Ledger
 |--------------------------------------------------------------------------------
 */

export const ledger = {
  project: projector.project,
  push,
  insert,
  pull,
  cursors: {
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
 * Push a new ledger event to be projected locally and sent to remote event store
 * api. Any queued event is sent to remote target as a origin or non hydrated
 * event to trigger first seen projections on the server side.
 *
 * @param streamId - Stream the event is being recorded under.
 * @param event    - Event to push to the ledger.
 */
async function push(streamId: string, event: LedgerEvent): Promise<void> {
  const record = createEventRecord(streamId, event);
  await remote.post("/events", record);
  await this.insert(record);
}

/**
 * Project and track the given event.
 *
 * @param event - Event to project and track.
 */
async function insert(event: EventRecord): Promise<void> {
  const status = await getStatus(event);
  if (status.exists === true) {
    return; // event already exists, no further action needed
  }
  await projector.project(event, { hydrated: true, outdated: status.outdated });
  await sync.addEvent(event);
}

/**
 * Enable the ability to check an incoming events status in relation to
 * the local ledger. This is to determine what actions to take upon the
 * ledger based on the current status.
 *
 * **Exists**
 *
 * References the existence of the event in the local ledger. It is
 * determined by looking at the recorded event id which should be unique
 * to the entirety of the ledger.
 *
 * **Outdated**
 *
 * References the events created relationship to the same event type in
 * the hosted stream. If another event of the same type in the stream
 * is newer than the provided event, the provided event is considered
 * outdated.
 */
async function getStatus(event: EventRecord): Promise<LedgerEventStatus> {
  return {
    exists: await sync.hasEvent(event),
    outdated: await sync.isOutdated(event)
  };
}

/**
 * As part of ledger synchronization we pull events from the attached
 * remote service based on the last known remote event position. The
 * position being used is the `recorded` event timestamp locally on
 * the remote endpoint.
 */
async function pull(aggregate: string, streamId: string): Promise<void> {
  const res = await remote.get<{ events: EventRecord[] }>(`/events/${aggregate}/streams/${streamId}${await getCursorQuery(streamId)}`);
  if (res.status === "success" && res.resource.events.length > 0) {
    for (const event of res.resource.events) {
      await insert(event);
    }
    await sync.setCursor(streamId, getCursorTimestamp(res.resource.events));
  }
}

/**
 * Get from timestamp for given cursor key.
 *
 * @param key - Cursor key to get timestamp for.
 */
async function getCursorQuery(key: string): Promise<string> {
  const from = await sync.getCursor(key);
  if (from !== undefined) {
    return `?from=${from}`;
  }
  return "";
}

/**
 * Get the largest recorded timestamp from given list of events.
 *
 * @param events - Events to get latest recorded timestamp for.
 */
function getCursorTimestamp(events: EventRecord[]): string {
  let timestamp = "";
  for (const event of events) {
    if (event.recorded > timestamp) {
      timestamp = event.recorded;
    }
  }
  return timestamp;
}
