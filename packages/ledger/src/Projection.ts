import type { EventRecord } from "./Event";
import { Queue } from "./Queue";

/*
 |--------------------------------------------------------------------------------
 | Constants
 |--------------------------------------------------------------------------------
 */

export const FILTER_ONCE = Object.freeze<Filter>({
  allowHydratedEvents: false,
  allowOutdatedEvents: false
});

export const FILTER_CONTINUOUS = Object.freeze<Filter>({
  allowHydratedEvents: true,
  allowOutdatedEvents: false
});

export const FILTER_ALL = Object.freeze<Filter>({
  allowHydratedEvents: true,
  allowOutdatedEvents: true
});

/*
 |--------------------------------------------------------------------------------
 | Projector
 |--------------------------------------------------------------------------------
 */

export class Projector {
  #listeners: Listeners = {};
  #queue: Queue<Message>;

  constructor() {
    this.project = this.project.bind(this);
    this.#queue = new Queue(async ({ event, state }) => {
      return Promise.all(Array.from(this.#listeners[event.type as string] || []).map((fn) => fn(event, state)));
    });
  }

  async project<Event extends EventRecord>(event: Event, state: State) {
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
  once<Event extends EventRecord>(type: Event["type"], handler: Handler<Event>) {
    return new Projection<Event>(this, { type, handler, filter: FILTER_ONCE });
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
  on<Event extends EventRecord>(type: Event["type"], handler: Handler<Event>) {
    return new Projection<Event>(this, { type, handler, filter: FILTER_CONTINUOUS });
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
  all<Event extends EventRecord>(type: Event["type"], handler: Handler<Event>) {
    return new Projection<Event>(this, { type, handler, filter: FILTER_ALL });
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
 | Projection
 |--------------------------------------------------------------------------------
 */

type ProjectionOptions<Event extends EventRecord> = {
  type: Event["type"];
  handler: Handler<Event>;
  filter: Filter;
};

export class Projection<Event extends EventRecord> {
  #type: Event["type"];
  #handle: Handler<Event>;
  #projector: Projector;
  #filter: Filter;

  #listener?: () => void;

  constructor(projector: Projector, { type, handler, filter }: ProjectionOptions<Event>) {
    this.#type = type;
    this.#handle = handler;
    this.#projector = projector;
    this.#filter = filter;
    this.start();
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  /**
   * Check if the incoming event state is compatible with the projection filter.
   */
  public isValid({ hydrated, outdated }: State) {
    if (this.#filter.allowHydratedEvents === false && hydrated === true) {
      return false;
    }
    if (this.#filter.allowOutdatedEvents === false && outdated === true) {
      return false;
    }
    return true;
  }

  /*
   |--------------------------------------------------------------------------------
   | Controllers
   |--------------------------------------------------------------------------------
   */

  /**
   * Start the projection by registering the projection handler against the
   * projections event emitter.
   */
  public start() {
    this.#listener = this.#projector.addEventListener(this.#type as string, async (event, state) => {
      if (this.isValid(state)) {
        await this.#handle(event as Event);
      }
    });
  }

  /**
   * Stop the projection by removing the projection handler registered with the
   * projections event emitter.
   */
  public stop() {
    this.#listener?.();
  }
}

/*
 |--------------------------------------------------------------------------------
 | Errors
 |--------------------------------------------------------------------------------
 */

export class DuplicateHandlerError extends Error {
  public readonly type = "DuplicateHandlerError";

  constructor(type: string) {
    super(
      `Event Publisher Violation: Duplicate '${type}' handler, only one event handler can be defined per publisher instance.`
    );
  }
}

export class HydratedEventError<E extends Event = Event> extends Error {
  public readonly type = "HydratedEventError";

  public readonly event: E;

  constructor(event: E) {
    super(`Event Publisher Violation: Publish '${event.type}' failed, subscriber does not support hydrated events.`);
    this.event = event;
  }
}

export class OutdatedEventError<E extends Event = Event> extends Error {
  public readonly type = "OutdatedEventError";

  public readonly event: E;

  constructor(event: E) {
    super(`Event Publisher Violation: Publish '${event.type}' failed, subscriber does not support outdated events.`);
    this.event = event;
  }
}

export class RequiredHandlerError extends Error {
  public readonly type = "RequiredHandlerError";

  constructor(type: string) {
    super(
      `Event Publisher Violation: Failed to resolve '${type}' handler, make sure to register all required handlers with the event publisher.`
    );
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Options = {
  filter: Filter;
};

export type Filter = {
  /**
   * Hydrated events represents events that are not seen for the first time
   * in the entirety of its lifetime across all distributed instances.
   */
  allowHydratedEvents: boolean;

  /**
   * Outdated events represents events that have already seen the same type
   * at a later occurrence. Eg. If incoming event is older than the latest
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

export type Handler<Event extends EventRecord = EventRecord> = (event: Event) => Promise<void>;

export type Listeners = Record<string, Set<ProjectionHandler> | undefined>;

export type ProjectionHandler<Event extends EventRecord = EventRecord> = (event: Event, state: State) => Promise<void>;
