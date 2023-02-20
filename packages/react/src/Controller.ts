import type { ChangeEvent, Collection, SubscribeToMany, SubscribeToSingle, SubscriptionOptions } from "@valkyr/db";
import type { Observable, Subject, Subscription } from "rxjs";

import { ControllerClass, ReactComponent, ReservedPropertyMembers } from "./Controller.Types.js";
import { makeControllerView, ViewOptions } from "./Controller.View.js";
import { ControllerRefs } from "./ControllerRefs.js";
import { Debounce } from "./Debounce.js";

export class Controller<State extends JsonLike = {}, Props extends JsonLike = {}> {
  state: State = {} as State;
  props: Props = {} as Props;

  /**
   * Stores a list of referenced elements identifies by a unique key.
   */
  readonly refs = new ControllerRefs();

  /**
   * Records of rxjs subscriptions. They are keyed to a subscription name for
   * easier identification when unsubscribing.
   */
  readonly subscriptions = new Map<any, Subscription>();

  /**
   * Has the controller fully resolved the .onInit lifecycle method?
   */
  #resolved = false;

  /**
   * Internal debounce instance used to ensure that we aren't triggering state
   * updates too frequently when updates are happening in quick succession.
   */
  #debounce = new Debounce();

  /**
   * Creates a new controller instance with given default state and pushState
   * handler method.
   *
   * @param state    - Default state to assign to controller.
   * @param pushData - Push data handler method.
   */
  constructor(readonly view: ReactComponent<Props, any>, readonly setView: Function) {
    this.query = this.query.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.setState = this.setState.bind(this);
  }

  /*
   |--------------------------------------------------------------------------------
   | Factories
   |--------------------------------------------------------------------------------
   */

  /**
   * Register a react component as a view for this controller.
   *
   * @param component - Component to render.
   * @param options   - View options.
   */
  static view<T extends ControllerClass, Props extends {} = InstanceType<T>["props"]>(
    this: T,
    component: ReactComponent<Props, T>,
    options?: Partial<ViewOptions<Props>>
  ) {
    return makeControllerView(this)(component, options);
  }

  /**
   * Creates a new controller instance using the given component and setView handler.
   *
   * @param component - Component to render.
   * @param setView   - Method to provide a resolved view component.
   */
  static make<T extends ControllerClass, Props extends {} = InstanceType<T>["props"]>(
    this: T,
    component: ReactComponent<Props, T>,
    setView: Function
  ) {
    return new this(component, setView);
  }

  /*
   |--------------------------------------------------------------------------------
   | Bootstrap & Teardown
   |--------------------------------------------------------------------------------
   */

  async $resolve(props: Props): Promise<void> {
    this.props = props;
    let state: Partial<State> = {};
    try {
      if (this.#resolved === false) {
        state = {
          ...state,
          ...((await this.onInit()) ?? {})
        };
      }
      state = {
        ...state,
        ...((await this.onResolve()) ?? {})
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
    this.#resolved = true;
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
   * @returns Partial state or void.
   */
  async onInit(): Promise<Partial<State> | void> {
    return {};
  }

  /**
   * Method runs every time the controller is resolved. This is where you should
   * subscribe to and return state that is reflecting changes to the parent views
   * properties.
   *
   * @returns Partial state or void.
   */
  async onResolve(): Promise<Partial<State> | void> {
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

  /**
   * Executes a query on a given collection and returns the initial result. A
   * subsequent internal subscription is also created, which automatically updates
   * the controller state when changes are made to the data in which the query
   * subscribes.
   *
   * @param collection - Collection to query.
   * @param query      - Query to execute.
   * @param options    - Query options.
   */
  query<C extends Collection, K extends keyof State>(
    collection: C,
    query: QuerySingle,
    next: K | ((value: CollectionType<C> | undefined) => Promise<Partial<State>>)
  ): Promise<CollectionType<C> | undefined>;
  query<C extends Collection, K extends keyof State>(
    collection: C,
    query: QueryMany,
    next:
      | K
      | ((
          documents: CollectionType<C>[],
          changed: CollectionType<C>[],
          type: ChangeEvent["type"]
        ) => Promise<Partial<State>>)
  ): Promise<CollectionType<C>[]>;
  query<C extends Collection, K extends keyof State>(
    collection: C,
    query: Query = {} as Query,
    next: K | ((...args: any[]) => Promise<Partial<State>>)
  ) {
    let resolved = false;
    this.subscriptions.get(collection)?.unsubscribe();
    return new Promise<CollectionType<C>[] | CollectionType<C> | undefined>((resolve) => {
      const { where, ...options } = query;
      this.subscriptions.set(
        collection.name,
        collection.subscribe(where, options, (...args: any[]) => {
          if (this.#isStateKey(next)) {
            if (resolved === true) {
              this.setState(next, args[0]);
            }
          } else {
            (next as any)(...args).then(this.setState);
          }
          setTimeout(() => {
            resolve(args[0]);
            resolved = true;
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
  subscribe<RxJs extends Subject<any> | Observable<any>, K extends keyof State>(
    rxjs: RxJs,
    next: K | ((value: SubscriptionType<RxJs>) => Promise<Partial<State> | void>)
  ): void {
    this.subscriptions.get(rxjs)?.unsubscribe();
    this.subscriptions.set(
      rxjs,
      rxjs.subscribe((value) => {
        if (this.#isStateKey(next)) {
          this.setState(next, value);
        } else {
          (next as any)(value).then((state: State) => {
            if (state !== undefined) {
              this.setState(state);
            }
          });
        }
      })
    );
  }

  /*
   |--------------------------------------------------------------------------------
   | State Methods
   |--------------------------------------------------------------------------------
   */

  /**
   * Updates the state of the controller and triggers a state update via the push
   * state handler. This method will debounce state updates to prevent excessive
   * state updates.
   *
   * @param key   - State key to assign data to.
   * @param value - State value to assign.
   */
  setState(state: Partial<State>): void;
  setState<K extends keyof State>(key: K): (state: State[K]) => void;
  setState<K extends keyof State>(key: K, value: State[K]): void;
  setState<K extends keyof State>(...args: [K | State, State[K]?]): void | ((state: State[K]) => void) {
    const [target, value] = args;

    if (this.#isStateKey(target) && args.length === 1) {
      return (value: State[K]) => {
        this.setState(target, value);
      };
    }

    this.state = this.#isStateKey(target)
      ? {
          ...this.state,
          [target]: value
        }
      : {
          ...this.state,
          ...(target as Partial<State>)
        };

    if (this.#resolved === true) {
      this.#debounce.run(() => {
        this.setView(
          this.view({
            props: this.props,
            state: this.state,
            actions: this.toActions(),
            refs: this.refs
          })
        );
      }, 0);
    }
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
  toActions(): Omit<this, ReservedPropertyMembers> {
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

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Query = Where & SubscriptionOptions;

type QuerySingle = Where & SubscribeToSingle;

type QueryMany = Where & SubscribeToMany;

type Where = {
  where?: Record<string, unknown>;
};

export type JsonLike = {
  [key: string]: any;
};

type CollectionType<Type> = Type extends Collection<infer X> ? X : never;

type SubscriptionType<Type> = Type extends Subject<infer X> | Observable<infer X> ? X : never;
