import type { ModelClass, SubscribeToMany, SubscribeToSingle, SubscriptionOptions } from "@valkyr/db";
import type { Observable, Subject, Subscription } from "rxjs";

import { Debounce } from "./Debounce";

export abstract class Controller<State extends JsonLike = {}, Props extends JsonLike = {}> {
  static readonly state = {};

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
  abstract resolve(props: Props): Promise<void>;

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
   | Query Methods
   |--------------------------------------------------------------------------------
   */

  query<K extends keyof State, M extends QueryModel>(
    name: K,
    query: QuerySingle<M>,
    next?: (value: InstanceType<M> | undefined) => void
  ): Promise<M | undefined>;
  query<K extends keyof State, M extends QueryModel>(
    name: K,
    query: QueryMany<M>,
    next?: (value: InstanceType<M>[]) => void
  ): Promise<InstanceType<M>[]>;
  query<K extends keyof State, M extends QueryModel>(
    name: K,
    query: Query<M> = {} as Query<M>,
    next?: (value: InstanceType<M>[] | InstanceType<M> | undefined) => State[K]
  ) {
    this.subscriptions[name as string]?.unsubscribe();
    return new Promise<State[K]>((resolve) => {
      const { model, where, ...options } = query;
      this.subscriptions[name as string] = (model as any).subscribe(where, options, (value: any) => {
        this.setState(name, next !== undefined ? next(value) : value);
        resolve(value);
      });
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
   * @param name - Name of the state key we are pushing the subscription values to.
   * @param rxjs - RXJS Subject or Observable instance that can be subscribed to.
   * @param next - Custom handler to execute instead of direct assignment to state.
   */
  subscribe<K extends keyof State, RXJS extends Subject<any> | Observable<any>>(
    name: K,
    rxjs: RXJS,
    next?: (value: SubscriptionType<RXJS>) => State[K]
  ): void {
    this.subscriptions[name as string]?.unsubscribe();
    this.subscriptions[name as string] = rxjs.subscribe((value) => {
      this.setState(name, next !== undefined ? next(value) : value);
    });
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
  setState<K extends keyof State>(key: K): (state: State[K]) => void;

  /**
   * Updates the state of the controller and triggers a state update via the push
   * state handler. This method will debounce state updates to prevent excessive
   * state updates.
   *
   * @param key   - State key to assign data to.
   * @param value - State value to assign.
   */
  setState<K extends keyof State>(key: K, value: State[K]): void;

  setState<K extends keyof State>(key: K, value?: State[K]) {
    if (value === undefined) {
      return (state: State[K]): void => {
        this.setState(key, state);
      };
    }
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

type JsonLike = Record<string, any>;

type Query<M extends QueryModel> = Model<M> & Where & SubscriptionOptions;

type QuerySingle<M extends QueryModel> = Model<M> & Where & SubscribeToSingle;

type QueryMany<M extends QueryModel> = Model<M> & Where & SubscribeToMany;

type Model<M extends QueryModel> = {
  model: M;
};

type QueryModel = {
  new (...args: any[]): any;
  findOne: ModelClass["findOne"];
  find: ModelClass["find"];
};

type Where = {
  where?: Record<string, unknown>;
};

type SubscriptionType<Type> = Type extends Subject<infer X> | Observable<infer X> ? X : never;
