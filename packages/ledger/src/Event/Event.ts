import { nanoid } from "nanoid";

import { getLogicalTimestamp } from "../Time";
import type { Event, EventFactory } from "./Types";

export function createEvent<E extends Event>(type: E["type"]): EventFactory<E> {
  return function (entityId: string, data: E["data"] = {}, meta: E["meta"] = {}) {
    const timestamp = getLogicalTimestamp();
    return {
      eventId: nanoid(),
      entityId,
      type,
      data,
      meta,
      created: timestamp,
      recorded: timestamp
    } as E;
  };
}

export function createEventRecord<E extends Event>(event: E): E {
  return {
    ...event,
    recorded: getLogicalTimestamp()
  };
}
