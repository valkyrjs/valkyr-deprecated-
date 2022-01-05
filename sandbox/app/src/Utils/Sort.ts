import { Event } from "../Models/Event";

export function byLocalId(a: Event, b: Event): number {
  if (a.event.meta.revised > b.event.meta.revised) {
    return 1;
  }
  return -1;
}

export function byOriginId(a: Event, b: Event): number {
  if (a.event.meta.created > b.event.meta.created) {
    return 1;
  }
  return -1;
}

export function byReversedOriginId(a: Event, b: Event): number {
  if (a.event.meta.created < b.event.meta.created) {
    return 1;
  }
  return -1;
}
