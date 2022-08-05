import { EventRecord } from "./Event";
import { Queue } from "./Queue";

export const validator = new (class Projector {
  listeners: Listeners = {};

  queue: Queue<EventRecord>;

  constructor() {
    this.validate = this.validate.bind(this);
    this.queue = new Queue(async (event) => {
      return Promise.all(Array.from(this.listeners[event.type] || []).map((fn) => fn(event)));
    });
  }

  async validate<Event extends EventRecord>(event: Event) {
    return new Promise<boolean>((resolve, reject) => {
      this.queue.push(event, resolve, reject);
    });
  }

  on(type: string, fn: ValidationHandler) {
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

  off(type: string, fn: ValidationHandler) {
    this.listeners[type]?.delete(fn);
  }
})();

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Listeners = Record<string, Set<ValidationHandler>>;

type ValidationHandler<Event extends EventRecord = EventRecord> = (event: Event) => Promise<void>;
