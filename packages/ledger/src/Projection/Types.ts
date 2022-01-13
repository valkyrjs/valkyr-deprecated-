import type { Event } from "../Event";

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

export type Message<E extends Event = Event> = {
  event: E;
  state: State;
};

export type Handler<E extends Event = Event> = (event: E) => Promise<void>;

export type Listeners = Record<string, Set<ProjectionHandler> | undefined>;

export type ProjectionHandler<E extends Event = Event> = (event: E, state: State) => Promise<void>;
