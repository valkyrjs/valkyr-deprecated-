import type { Empty, Event } from "./Event";

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
