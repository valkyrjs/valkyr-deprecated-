import type { EventBase, EventRecord } from "../Event";

export type Options = {
  filter: Filter;
};

export type Filter = {
  /**
   * Hydrated events represents events that are not seen for the first time
   * in the entierty of its lifetime across all distributed instances.
   */
  allowHydratedEvents: boolean;

  /**
   * Outdated events represents events that have already seen the same type
   * at a later occurence. Eg. If incoming event is older than the latest
   * local event of the same type, it is considered outdated.
   */
  allowOutdatedEvents: boolean;
};

export type State = {
  hydrated: boolean;
  outdated: boolean;
};

export type Message<Event extends EventRecord = EventRecord> = {
  event: Event;
  state: State;
};

export type Handler<Event extends EventBase = EventBase, Record extends EventRecord<Event> = EventRecord<Event>> = (
  record: Record
) => Promise<void>;

export type Listeners = Record<string, Set<ProjectionHandler> | undefined>;

export type ProjectionHandler<Event extends EventBase = EventBase, Record extends EventRecord<Event> = EventRecord<Event>> = (
  record: Record,
  state: State
) => Promise<void>;
