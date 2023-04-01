import type { Empty, Event } from "./Event.js";

/**
 * Creates an event factory function for a given event type.
 * The factory function can be used to create instances of the event type
 * with the specified data and metadata.
 *
 * @param type The type of event to create.
 *
 * @returns An event factory function that can create instances of the specified event type.
 */
export function makeEvent<E extends Event>(type: E["type"]): EventFactory<E> {
  return (data: E["data"] = {}, meta: E["meta"] = {}) => ({ type, data, meta } as E);
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type EventFactory<E extends Event> = E["meta"] extends Empty
  ? E["data"] extends Empty
    ? () => E
    : (data: E["data"]) => E
  : E["data"] extends Empty
  ? (data: Empty, meta: E["meta"]) => E
  : (data: E["data"], meta: E["meta"]) => E;
