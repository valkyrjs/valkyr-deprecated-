import { EventRecord } from "./Types";

export function byCreated(a: EventRecord, b: EventRecord): number {
  if (a.created > b.created) {
    return 1;
  }
  return -1;
}

export function byReversedCreated(a: EventRecord, b: EventRecord): number {
  if (a.created < b.created) {
    return 1;
  }
  return -1;
}

export function byRecorded(a: EventRecord, b: EventRecord): number {
  if (a.recorded > b.recorded) {
    return 1;
  }
  return -1;
}

export function byReverseRecorded(a: EventRecord, b: EventRecord): number {
  if (a.recorded < b.recorded) {
    return 1;
  }
  return -1;
}
