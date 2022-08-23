import type { Subscription } from "rxjs";

import { Debounce } from "./Debounce";

export abstract class Controller<State extends RawState = RawState> {
  static readonly state: RawState = {};

  /**
   * Records of rxjs subscriptions. They are keyed to a subscription name for
   * easier identification when unsubscribing.
   */
  readonly subscriptions: Record<string, Subscription> = {};

  /**
   * Internal debounce instance used to ensure that we aren't triggering state
   * updates too frequently when updates are happening in quick succession.
   */
  #debounce = new Debounce();

  /**
   * Creates a new controller instance with given default state and pushState
   * handler method.
   *
   * @param state     - Default state to assign to controller.
   * @param pushState - Push state handler method.
   */
  constructor(readonly state: State = {} as State, readonly pushState: Function) {}

  /*
   |--------------------------------------------------------------------------------
   | Factories
   |--------------------------------------------------------------------------------
   */

  /**
   * Creates a new controller instance with given push state handler.
   *
   * @remarks This factory method will pass the static state as defined on the
   * controller.
   *
   * @param pushState - Push state handler method.
   */
  static make(pushState: Function) {
    return new (this as any)({ ...this.state }, pushState);
  }

  /*
   |--------------------------------------------------------------------------------
   | Lifecycle Methods
   |--------------------------------------------------------------------------------
   */

  /**
   * Triggered by the view controller instance when the view is mounted. This allows
   * the controller to perform data assignment tasks before rendering the view.
   */
  abstract resolve(): Promise<void>;

  /**
   * Loop through all registered subscriptions and executes the unsubscribe
   * handler for each subscription. This should be triggered when the view is
   * unmounted.
   */
  async destroy(): Promise<this> {
    for (const subscription of Object.values(this.subscriptions)) {
      subscription.unsubscribe();
    }
    return this;
  }

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

  /**
   * Updates the state of the controller and triggers a state update via the push
   * state handler. This method will debounce state updates to prevent excessive
   * state updates.
   *
   * @param key   - State key to assign data to.
   * @param value - State value to assign.
   */
  setState<K extends keyof State>(key: K, value: State[K]): void {
    this.state[key] = value;
    this.#debounce.run(() => {
      this.pushState({ ...this.state });
    }, 0);
  }

  /*
   |--------------------------------------------------------------------------------
   | Resolvers
   |--------------------------------------------------------------------------------
   */

  /**
   * Returns all the prototype methods defined on the controller as a list of
   * actions bound to the controller instance to be used in the view.
   *
   * @returns List of actions.
   */
  toActions(): unknown {
    const actions: any = {};
    for (const name of Object.getOwnPropertyNames(this.constructor.prototype)) {
      if (name !== "constructor") {
        actions[name] = (this as any)[name].bind(this);
      }
    }
    return actions;
  }
}

type RawState = Record<string, unknown>;
