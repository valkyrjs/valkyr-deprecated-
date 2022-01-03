import { Event } from "./Event";
import { Queue } from "./Queue";

export const validator = new (class Projector {
  public listeners: Listeners = {};

  public queue: Queue<Event>;

  constructor() {
    this.validate = this.validate.bind(this);
    this.queue = new Queue(async (event) => {
      return Promise.all(Array.from(this.listeners[event.type] || []).map((fn) => fn(event)));
    });
  }

  public async validate<E extends Event>(event: E) {
    return new Promise<boolean>((resolve, reject) => {
      this.queue.push(event, resolve, reject);
    });
  }

  public on(type: string, fn: ValidationHandler) {
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

  public off(type: string, fn: ValidationHandler) {
    this.listeners[type]?.delete(fn);
  }
})();

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Listeners = Record<string, Set<ValidationHandler>>;

type ValidationHandler<E extends Event = Event> = (event: E) => Promise<void>;
