import { Subscription } from "rxjs";
import { Component, createComponent } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { createMutable, createStore, SetStoreFunction, Store, StoreNode } from "solid-js/store";

import { Plugin } from "./Controller.Plugin.js";
import { ControllerClass, ControllerComponent } from "./Controller.Types.js";
import { ControllerView } from "./Controller.View.jsx";
import { JsonLike } from "./JsonLike.js";

const RESERVED_MEMBERS = ["state", "onInit", "onDestroy", "setState", "toActions"] as const;

export const controllers: {
  loading: Component;
  error: Component;
} = {
  loading: () => null,
  error: () => null
};

export abstract class Controller<State extends JsonLike = {}, Props extends JsonLike = {}> {
  $lifecycle: StoreNode;

  readonly plugins: Plugin[] = [];
  readonly #state: [get: Store<State>, set: SetStoreFunction<State>];
  readonly #subscriptions = new Map<string, Subscription>();

  /**
   * Creates a new controller instance with given default state and pushState
   * handler method.
   *
   * @param state    - Default state to assign to controller.
   * @param pushData - Push data handler method.
   */
  constructor(readonly props: Props = {} as Props) {
    this.$lifecycle = createMutable({ loading: true, error: undefined });
    this.#state = createStore({} as State);
  }

  static setDefaultLoadingComponent(component: Component) {
    controllers.loading = component;
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
    component: ControllerComponent<Props, T>,
    options: Partial<ViewOptions> = {}
  ) {
    return (props: any) => {
      return createComponent(ControllerView, {
        $components: {
          view: component,
          loading: options.loading ?? controllers.loading,
          error: options.error ?? controllers.error
        },
        controller: new (this as any)(props).$resolve()
      });
    };
  }

  /*
   |--------------------------------------------------------------------------------
   | State Accessors
   |--------------------------------------------------------------------------------
   */

  get state(): Store<State> {
    return this.#state[0];
  }

  get setState(): SetStoreFunction<State> {
    return this.#state[1];
  }

  /*
   |--------------------------------------------------------------------------------
   | Bootstrap & Teardown
   |--------------------------------------------------------------------------------
   */

  $resolve(): this {
    this.onInit()
      .then(() => Promise.all(this.plugins.map(({ plugin, options }) => new plugin(this as any, options).onResolve())))
      .then(() => {
        this.$lifecycle.loading = false;
      });
    return this;
  }

  async $destroy(): Promise<void> {
    await this.onDestroy();
    for (const subscription of this.#subscriptions.values()) {
      subscription.unsubscribe();
    }
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
  async onInit(): Promise<void> {}

  /**
   * Method runs when the controller parent view is destroyed.
   */
  async onDestroy(): Promise<void> {}

  /*
   |--------------------------------------------------------------------------------
   | Subscription Management
   |--------------------------------------------------------------------------------
   */

  setSubscription(subscriptions: { [id: string]: Subscription }): void {
    for (const id in subscriptions) {
      this.#subscriptions.get(id)?.unsubscribe();
      this.#subscriptions.set(id, subscriptions[id]);
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
  toActions(): Omit<this, ReservedPropertyMembers[number]> {
    const actions: any = {};
    for (const name of Object.getOwnPropertyNames(this.constructor.prototype)) {
      if (name !== "constructor" && name !== "resolve" && RESERVED_MEMBERS.includes(name as any) === false) {
        actions[name] = (this as any)[name].bind(this);
      }
    }
    return actions;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type ReservedPropertyMembers = typeof RESERVED_MEMBERS;

type ViewOptions = {
  name?: string;
  loading: () => JSX.Element;
  error: (error: string) => JSX.Element;
};
