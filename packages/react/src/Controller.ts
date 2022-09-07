import type { ModelClass, SubscribeToMany, SubscribeToSingle, SubscriptionOptions } from "@valkyr/db";
import type { Observable, Subject, Subscription } from "rxjs";

import { Debounce } from "./Debounce";
import { Refs } from "./Refs";

export abstract class Controller<State extends JsonLike = {}, Props extends JsonLike = {}> {
  static readonly state: JsonLike = {};

  /**
   * Stores a list of referenced elements identifies by a unique key.
   */
  readonly refs = new Refs();

  /**
   * Records of rxjs subscriptions. They are keyed to a subscription name for
   * easier identification when unsubscribing.
   */
  readonly subscriptions = new Map<any, Subscription>();

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
  constructor(readonly state: State = {} as State, readonly pushState: Function) {
    this.query = this.query.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.setNext = this.setNext.bind(this);
    this.setState = this.setState.bind(this);
  }

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
    const state: JsonLike = {};
    for (const key in this.state) {
      if (typeof this.state[key] === "function") {
        state[key] = this.state[key]();
      } else {
        state[key] = this.state[key];
      }
    }
    return new (this as any)(state, pushState);
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
  abstract resolve(props: Props): Promise<void>;

  /**
   * Loop through all registered subscriptions and executes the unsubscribe
   * handler for each subscription. This should be triggered when the view is
   * unmounted.
   */
  async destroy(): Promise<void> {
    for (const subscription of this.subscriptions.values()) {
      subscription.unsubscribe();
    }
    this.refs.destroy();
  }

  /*
   |--------------------------------------------------------------------------------
   | Query Methods
   |--------------------------------------------------------------------------------
   */

  query<M extends QueryModel, K extends keyof State>(
    model: M,
    query: QuerySingle,
    next: K | ((value: InstanceType<M> | undefined) => void)
  ): Promise<InstanceType<M> | undefined>;
  query<M extends QueryModel, K extends keyof State>(
    model: M,
    query: QueryMany,
    next: K | ((value: InstanceType<M>[]) => void)
  ): Promise<InstanceType<M>[]>;
  query<M extends QueryModel, K extends keyof State>(
    model: M,
    query: Query = {} as Query,
    next: K | ((value: InstanceType<M>[] | InstanceType<M> | undefined) => void)
  ) {
    this.subscriptions.get(model)?.unsubscribe();
    return new Promise<InstanceType<M>[] | InstanceType<M> | undefined>((resolve) => {
      const { where, ...options } = query;
      this.subscriptions.set(
        model,
        (model as any).subscribe(where, options, (value: any) => {
          if (this.#isStateKey(next)) {
            this.setState(next, value);
          } else {
            (next as Function)(value);
          }
          setTimeout(() => {
            resolve(value); // Allow setState to queue on the stack before resolving the promise.
          }, 0);
        })
      );
    });
  }

  /*
   |--------------------------------------------------------------------------------
   | RXJS Methods
   |--------------------------------------------------------------------------------
   */

  /**
   * Subscribe to a resource which provides a rxjs observable subscription. This
   * subscription is automatically managed and will unsubscribe when the subscribe
   * method is executed and when the controller is destroyed.
   *
   * @remarks If the subscription does not immediately resolve a value then set
   * the suspend argument to false.
   *
   * @param rxjs - RXJS Subject or Observable instance that can be subscribed to.
   * @param next - Handler method executed when a new value is provided.
   */
  subscribe<RXJS extends Subject<any> | Observable<any>>(
    rxjs: RXJS,
    next?: (value: SubscriptionType<RXJS>) => void
  ): void {
    this.subscriptions.get(rxjs)?.unsubscribe();
    this.subscriptions.set(rxjs, rxjs.subscribe(next));
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
  setState(state: Partial<State>): void;
  setState<K extends keyof State>(key: K, value: State[K]): void;
  setState<K extends keyof State>(target: K | State, value?: State[K]): void {
    let hasChanges = false;
    if (this.#isStateKey(target)) {
      if (this.state[target] !== value) {
        this.state[target] = value!;
        hasChanges = true;
      }
    } else {
      for (const key in target) {
        if (this.state[key] !== target[key]) {
          this.state[key] = target[key];
          hasChanges = true;
        }
        this.state[key] = target[key];
      }
    }
    if (hasChanges === false) {
      return;
    }
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
      if (name !== "constructor" && name !== "resolve") {
        actions[name] = (this as any)[name].bind(this);
      }
    }
    return actions;
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  #isStateKey(key: unknown): key is keyof State {
    return typeof key === "string";
  }
}

type Query = Where & SubscriptionOptions;

type QuerySingle = Where & SubscribeToSingle;

type QueryMany = Where & SubscribeToMany;

type QueryModel = {
  new (...args: any[]): any;
  findOne: ModelClass["findOne"];
  find: ModelClass["find"];
};

type Where = {
  where?: Record<string, unknown>;
};

export type JsonLike = Record<string, any>;

type SubscriptionType<Type> = Type extends Subject<infer X> | Observable<infer X> ? X : never;
