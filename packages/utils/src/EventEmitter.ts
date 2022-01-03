import { EventEmitter as EventEmitter3 } from "eventemitter3";

type EventListener<T extends ValidEventTypes, K extends EventNames<T>> = T extends string | symbol
  ? (...args: any[]) => void
  : (...args: ArgumentMap<Exclude<T, string | symbol>>[Extract<K, keyof T>]) => void;

type EventNames<T extends ValidEventTypes> = T extends string | symbol ? T : keyof T;

type ValidEventTypes = string | symbol | Record<string, unknown>;

type ArgumentMap<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends (...args: any[]) => void ? Parameters<T[K]> : T[K] extends any[] ? T[K] : any[];
};

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
