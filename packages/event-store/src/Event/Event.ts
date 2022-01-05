import { nanoid } from "nanoid";

import { getLogicalTimestamp } from "../Time";
import type { EventBase, EventFactoryPayload, EventRecord } from "./Types";

export function createEvent<Event extends EventBase>(type: Event["type"]) {
  return function (payload: EventFactoryPayload<Event>) {
    return getEvent(type, payload.data, payload.meta);
  };
}

export function createEventRecord<Event extends EventBase>(entityId: string, event: Event) {
  return {
    id: event.id,
    entityId,
    type: event.type,
    data: event.data,
    meta: event.meta,
    created: event.created,
    recorded: getLogicalTimestamp()
  } as EventRecord<Event>;
}

function getEvent<Event extends EventBase>(type: Event["type"], data: Event["data"] = {}, meta: Event["meta"] = {}) {
  return {
    id: nanoid(),
    type,
    data,
    meta,
    created: getLogicalTimestamp()
  } as Event;
}
