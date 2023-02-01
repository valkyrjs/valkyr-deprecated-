import type { EventRecord } from "../Event/index";
import { Queue } from "../Queue";
import { FILTER_ALL, FILTER_CONTINUOUS, FILTER_ONCE } from "./Filters";
import { Projection, ProjectionEventHandler, ProjectionHandler, ProjectionState } from "./Projection";

export class Projector<Record extends EventRecord> {
  #listeners: Listeners<Record> = {};
  #queue: Queue<ProjectionMessage<Record>>;

  constructor() {
    this.project = this.project.bind(this);
    this.#queue = new Queue(async ({ event, state }) => {
      return Promise.all(Array.from(this.#listeners[event.type as string] || []).map((fn) => fn(event, state)));
    });
  }

  async project(event: Record, state: ProjectionState) {
    return new Promise<boolean>((resolve, reject) => {
      this.#queue.push({ event, state }, resolve, reject);
    });
  }

  /**
   * Create a single run projection handler.
   *
   * @remarks
   *
   * This method tells the projection that an event is only ever processed when
   * the event is originating directly from the local event store. A useful
   * pattern for when you want the event handler to submit data to a third
   * party service such as sending an email or submitting third party orders.
   *
   * We disallow `hydrate` and `outdated` as these events represents events
   * that has already been processed.
   */
  once<T extends Record["type"], R extends Record = Extract<Record, { type: T }>>(
    type: T,
    handler: ProjectionEventHandler<R>
  ): Projection<R> {
    return new Projection<any>(this, { type, handler, filter: FILTER_ONCE });
  }

  /**
   * Create a continuous projection handler.
   *
   * @remarks
   *
   * This method tells the projection to allow events directly from the event
   * store as well as events coming through hydration via sync, manual or
   * automatic stream rehydration operations. This is the default pattern
   * used for most events. This is where you usually project the latest data
   * to your read side models and data stores.
   *
   * We allow `hydrate` as they serve to keep the read side up to date with
   * the latest events. We disallow `outdated` as we do not want the latest
   * data to be overridden by outdated ones.
   *
   * NOTE! The nature of this pattern means that outdated events are never
   * run by this projection. Make sure to handle `outdated` events if you
   * have processing requirements that needs to know about every unknown
   * events that has occurred in the event stream.
   */
  on<T extends Record["type"], R extends Record = Extract<Record, { type: T }>>(
    type: T,
    handler: ProjectionEventHandler<R>
  ): Projection<R> {
    return new Projection<any>(this, { type, handler, filter: FILTER_CONTINUOUS });
  }

  /**
   * Create a catch all projection handler.
   *
   * @remarks
   *
   * This method is a catch all for events that does not fall under the
   * stricter definitions of once and on patterns. This is a good place
   * to deal with data that does not depend on a strict order of events.
   */
  all<T extends Record["type"], R extends Record = Extract<Record, { type: T }>>(
    type: T,
    handler: ProjectionEventHandler<R>
  ): Projection<R> {
    return new Projection<any>(this, { type, handler, filter: FILTER_ALL });
  }

  addEventListener(type: string, fn: ProjectionHandler) {
    const listeners = this.#listeners[type];
    if (listeners) {
      listeners.add(fn);
    } else {
      this.#listeners[type] = new Set([fn]);
    }
    return () => {
      this.removeEventListener(type, fn);
    };
  }

  removeEventListener(type: string, fn: ProjectionHandler) {
    this.#listeners[type]?.delete(fn);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Listeners<R extends EventRecord> = Record<string, Set<ProjectionHandler<R>> | undefined>;

export type ProjectionMessage<Event extends EventRecord = EventRecord> = {
  event: Event;
  state: ProjectionState;
};
