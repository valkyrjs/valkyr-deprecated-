import type { Subscription } from "rxjs";

import { Debounce } from "./Debounce";

export abstract class Controller<State extends RawState = RawState> {
  static readonly state: RawState = {};

  readonly state: State = {} as State;
  readonly subscriptions: Record<string, Subscription> = {};

  #debounce = new Debounce();

  constructor(readonly pushState: Function) {}

  /*
   |--------------------------------------------------------------------------------
   | Factories
   |--------------------------------------------------------------------------------
   */

  static make(pushState: Function) {
    return new (this as any)(pushState);
  }

  /*
   |--------------------------------------------------------------------------------
   | Lifecycle Methods
   |--------------------------------------------------------------------------------
   */

  async init(): Promise<this> {
    await this.resolve();
    return this;
  }

  /**
   * Loop through all registered subscriptions and unsubscribe.
   */
  async destroy(): Promise<this> {
    for (const subscription of Object.values(this.subscriptions)) {
      subscription.unsubscribe();
    }
    return this;
  }

  async resolve(): Promise<void> {}

  /*
   |--------------------------------------------------------------------------------
   | State Methods
   |--------------------------------------------------------------------------------
   */

  /**
   * Wrapper method for controller setState. Enables the ability to predefine a
   * state update function with a static supported key. Handy for creating lean
   * rxjs observer subscription updaters.
   *
   * @param key - State key to assign data to.
   */
  setNext<K extends keyof State>(key: K): (state: State[K]) => void {
    return (state: State[K]): void => {
      this.setState(key, state);
    };
  }

  setState<K extends keyof State>(key: K, value: State[K]): void {
    this.state[key] = value;
    this.#debounce.run(() => {
      this.pushState({ ...this.state });
    }, 0);
  }
}

type RawState = Record<string, unknown>;
