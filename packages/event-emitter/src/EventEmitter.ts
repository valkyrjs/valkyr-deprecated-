import { EventEmitter as EventEmitter3 } from "eventemitter3";

/*
 |--------------------------------------------------------------------------------
 | Event Emitter
 |--------------------------------------------------------------------------------
 */

export class EventEmitter<EventTypes extends ValidEventTypes = string | symbol> extends EventEmitter3<EventTypes> {
  /**
   * Subscribe by adding provided event listener to a event through eventemitter3
   * `addListener` method. Provide a returned unsubscribe method which subsequently
   * executes the `removeListener` on the eventemitter3 layer.
   *
   * This allows for easy subscribe unsubscribe behavior in a single method.
   *
   * @param event   - Event to listen to.
   * @param fn      - Handler method to trigger on event changes.
   * @param destroy - Callback to execute after a subscription has been unsubscribed.
   *
   * @returns Unsubscribe method to execute when the listener should no longer exist.
   */
  subscribe<T extends EventNames<EventTypes>>(
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

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type EventListener<T extends ValidEventTypes, K extends EventNames<T>> = T extends string | symbol
  ? (...args: any[]) => void
  : (...args: ArgumentMap<Exclude<T, string | symbol>>[Extract<K, keyof T>]) => void;

type EventNames<T extends ValidEventTypes> = T extends string | symbol ? T : keyof T;

type ValidEventTypes = string | symbol | Record<string, unknown>;

type ArgumentMap<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends (...args: any[]) => void ? Parameters<T[K]> : T[K] extends any[] ? T[K] : any[];
};
