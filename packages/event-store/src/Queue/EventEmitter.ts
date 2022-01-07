import { EventEmitter as EventEmitter3 } from "eventemitter3";

import type { EventListener, EventNames, ValidEventTypes } from "./Types";

export class EventEmitter<EventTypes extends ValidEventTypes = string | symbol> extends EventEmitter3<EventTypes> {
  public subscribe<T extends EventNames<EventTypes>>(
    event: T,
    fn: EventListener<EventTypes, T>,
    destroy?: () => void
  ): () => void {
    this.addListener(event, fn);
    return () => {
      this.removeListener(event, fn);
      if (destroy) {
        destroy();
      }
    };
  }
}
