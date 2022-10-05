import type { ModelClass, SubscribeToMany, SubscribeToSingle, SubscriptionOptions } from "@valkyr/db";
import { deepEqual } from "fast-equals";
import type { Observable, Subject, Subscription } from "rxjs";

import { Refs } from "./ControllerRefs";
import { Debounce } from "./Debounce";

export class Controller<State extends JsonLike = {}, Props extends JsonLike = {}> {
  props: Props = {} as Props;

  #state: any = {
    current: {},
    pushed: {}
  };

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
   * Has the controller fully resolved the .onInit lifecycle method?
   */
  $resolved = false;

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
  constructor(readonly pushState: Function) {
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
    return new (this as any)(pushState);
  }

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  get state(): State {
    return this.#state.current as State;
  }

  /*
   |--------------------------------------------------------------------------------
   | Bootstrap & Teardown
   |--------------------------------------------------------------------------------
   */

  async $resolve(props: Props): Promise<void> {
    this.props = props;
    let state: Partial<State> = this.state;
    if (this.$resolved === false) {
      state = {
        ...state,
        ...(await this.onInit())
      };
    }
    state = {
      ...state,
      ...((await this.onResolve()) ?? {})
    };
    this.$resolved = true;
    this.setState(state);
  }

  async $destroy(): Promise<void> {
    for (const subscription of this.subscriptions.values()) {
      subscription.unsubscribe();
    }
    await this.onDestroy();
    this.refs.destroy();
  }

  /*
   |--------------------------------------------------------------------------------
   | Lifecycle Methods
   |--------------------------------------------------------------------------------
   */

  /**
   * Method runs once per controller view lifecycle. This is where you should
   * subscribe to and return initial controller state. A component is kept in
   * loading state until the initial resolve is completed.
   *
   * Once the initial resolve is completed the controller will not run the onInit
   * method again unless the controller is destroyed and re-created.
   *
   * @returns Partial state or undefined.
   */
  async onInit(): Promise<Partial<State> | undefined> {
    return {};
  }

  /**
   * Method runs every time the controller is resolved. This is where you should
   * subscribe to and return state that is reflecting changes to the parent views
   * properties.
   *
   * @returns Partial state or undefined.
   */
  async onResolve(): Promise<Partial<State> | undefined> {
    return {};
  }

  /**
   * Method runs when the controller parent view is destroyed.
   */
  async onDestroy(): Promise<void> {}

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
          setTimeout(() => resolve(value), 0);
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
    this.#state.current = this.#isStateKey(target)
      ? {
          ...this.state,
          [target]: value
        }
      : {
          ...this.state,
          ...(target as Partial<State>)
        };
    this.#pushState();
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

  #pushState() {
    if (this.$resolved === true && deepEqual(this.state, this.#state.pushed) === false) {
      this.#debounce.run(() => {
        this.pushState(this.state);
        this.#state.pushed = this.state;
      }, 0);
    }
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
