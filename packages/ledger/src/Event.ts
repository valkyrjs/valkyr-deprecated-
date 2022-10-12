import { getId } from "@valkyr/security";

import { getLogicalTimestamp } from "./Time";

/*
 |--------------------------------------------------------------------------------
 | Event Factory
 |--------------------------------------------------------------------------------
 */

export function makeEventFactory<Event extends LedgerEvent>(type: Event["type"]): EventFactory<Event> {
  return (data: Event["data"] = {}, meta: Event["meta"] = {}) => ({ type, data, meta } as Event);
}

/*
 |--------------------------------------------------------------------------------
 | Event Recorder
 |--------------------------------------------------------------------------------
 */

export function createEventRecord<Event extends LedgerEvent>(streamId: string, event: Event): LedgerEventRecord<Event> {
  const timestamp = getLogicalTimestamp();
  return {
    id: getId(),
    streamId,
    ...event,
    created: timestamp,
    recorded: timestamp
  };
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type EventFactory<Event extends LedgerEvent> = Event["meta"] extends never
  ? (data: Event["data"]) => Event
  : (data: Event["data"], meta: Event["meta"]) => Event;

export type EventRecord = LedgerEventRecord<LedgerEvent>;

export type LedgerEventRecord<Event extends LedgerEvent> = {
  id: string;
  streamId: string;
  type: Event["type"];
  data: Event["data"];
  meta: Event["meta"];
  created: string;
  recorded: string;
};

export type LedgerEvent<EventType = string, EventData = unknown | never, EventMeta = unknown | never> = {
  type: EventType;
  data: EventData;
  meta: EventMeta;
};

export type LedgerEventStatus = {
  /**
   * Does the event already exist in the containing stream. This is an
   * optimization flag so that we can potentially ignore the processing of the
   * event if it already exists.
   */
  exists: boolean;

  /**
   * Is there another event in the stream of the same type that is newer than
   * the provided event. This is passed into projectors so that they can
   * route the event to the correct projection handlers.
   *
   * @see {@link Projection [once|on|all]}
   */
  outdated: boolean;
};

export type LedgerEventToLedgerRecord<E> = E extends LedgerEvent ? LedgerEventRecord<E> : never;
