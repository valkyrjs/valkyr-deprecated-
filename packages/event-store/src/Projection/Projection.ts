import type { EventBase, EventRecord } from "../Event";
import { Queue } from "../Queue";
import type { Filter, Handler, Listeners, Message, Options, ProjectionHandler, State } from "./Types";

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
 | Projection
 |--------------------------------------------------------------------------------
 */

export class Projection<Event extends EventBase> {
  public readonly type: Event["type"];
  public readonly handle: Handler<Event>;
  public readonly filter: Filter;

  private listener?: () => void;

  constructor(type: Event["type"], handler: Handler<Event>, options: Options) {
    this.type = type;
    this.handle = handler;
    this.filter = options.filter;
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
    if (this.filter.allowHydratedEvents === false && hydrated === true) {
      return false;
    }
    if (this.filter.allowOutdatedEvents === false && outdated === true) {
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
    this.listener = projections.on(this.type as string, async (event, state) => {
      if (this.isValid(state)) {
        await this.handle(event as EventRecord<Event>);
      }
    });
  }

  /**
   * Stop the projection by removing the projection handler registered with the
   * projections event emitter.
   */
  public stop() {
    this.listener?.();
  }
}

/*
 |--------------------------------------------------------------------------------
 | Projections
 |--------------------------------------------------------------------------------
 */

export const projections = new (class ProjectionEmitter {
  public listeners: Listeners = {};

  public queue: Queue<Message>;

  constructor() {
    this.project = this.project.bind(this);
    this.queue = new Queue(async ({ event, state }) => {
      return Promise.all(Array.from(this.listeners[event.type as string] || []).map((fn) => fn(event, state)));
    });
  }

  public async project<Event extends EventRecord>(event: Event, state: State) {
    return new Promise<boolean>((resolve) => {
      this.queue.push({ event, state }, resolve);
    });
  }

  public on(type: string, fn: ProjectionHandler) {
    const listeners = this.listeners[type];
    if (listeners) {
      listeners.add(fn);
    } else {
      this.listeners[type] = new Set([fn]);
    }
    return () => {
      this.off(type, fn);
    };
  }

  public off(type: string, fn: ProjectionHandler) {
    this.listeners[type]?.delete(fn);
  }
})();

/*
 |--------------------------------------------------------------------------------
 | Projection Factory
 |--------------------------------------------------------------------------------
 */

export const projection = {
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
   * We dissallow `hydrate` and `outdated` as these events represents events
   * that has already been processed.
   */
  once<Event extends EventBase>(type: Event["type"], handler: Handler<Event>) {
    return new Projection<Event>(type, handler, { filter: FILTER_ONCE });
  },

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
   * the latest events. We dissallow `outdated` as we do not want the latest
   * data to be overriden by outdated ones.
   *
   * NOTE! The nature of this pattern means that outdated events are never
   * run by this projection. Make sure to handle `outdated` events if you
   * have processing requirements that needs to know about every unknown
   * events that has occured in the event stream.
   */
  on<Event extends EventBase>(type: Event["type"], handler: Handler<Event>) {
    return new Projection<Event>(type, handler, { filter: FILTER_CONTINUOUS });
  },

  /**
   * Create a catch all projection handler.
   *
   * @remarks
   *
   * This method is a catch all for events that does not fall under the
   * stricter defintitons of once and on patterns. This is a good place
   * to deal with data that does not depend on a strict order of events.
   */
  all<Event extends EventBase>(type: Event["type"], handler: Handler<Event>) {
    return new Projection<Event>(type, handler, { filter: FILTER_ALL });
  }
};
