import type { BrowserHistory, HashHistory, Location, MemoryHistory } from "history";
import { match, Path } from "path-to-regexp";
import { Subject, Subscription } from "rxjs";

import { Redirect, RenderProps } from "./Action.js";
import { Resolved } from "./Resolved.js";
import { Resolver } from "./Resolver.js";
import { Route } from "./Route.js";
import { isHashChange } from "./Utilities.js";

export class Router<Component = unknown> {
  readonly routes: Route[] = [];

  #base: string;
  #resolver: Resolver<Component>;
  #hash = new Subject<string>();

  #destroy?: () => void;

  constructor(readonly history: BrowserHistory | HashHistory | MemoryHistory, base = "") {
    this.#base = base === "" || base === "/" ? "" : base;
    this.#resolver = new Resolver<Component>(this);
  }

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  get resolve() {
    return this.#resolver.resolve.bind(this.#resolver);
  }

  get state(): Location["state"] {
    return this.history.location["state"];
  }

  get params(): Resolved["params"] {
    return this.current.params;
  }

  get query(): Resolved["query"] {
    return this.current.query;
  }

  get route(): Resolved["route"] {
    return this.current.route;
  }

  get current(): Resolved {
    if (this.#resolver.current === undefined) {
      throw new Error("No route has been resolved yet");
    }
    return this.#resolver.current;
  }

  get onRender() {
    return this.#resolver.onRender.bind(this.#resolver);
  }

  get onError() {
    return this.#resolver.onError.bind(this.#resolver);
  }

  /*
   |--------------------------------------------------------------------------------
   | Setup
   |--------------------------------------------------------------------------------
   */

  register(routes: Route[], parent?: Route): this {
    for (const route of routes) {
      route.parent = parent;
      if (route.children !== undefined) {
        this.routes.push(route.register(this.#base));
        this.register(route.children, route);
      } else {
        this.routes.push(route.register(this.#base));
      }
    }
    return this;
  }

  /*
   |--------------------------------------------------------------------------------
   | Listeners
   |--------------------------------------------------------------------------------
   */

  /**
   * Starts listening for routing changes which emits results to the provided
   * render or error method.
   *
   * @param render - Render method to execute on render actions.
   * @param error  - Error method to execute on routing exceptions.
   */
  listen(): this {
    if (this.#destroy !== undefined) {
      this.#destroy();
    }

    let prevLocation = this.history.location;

    // ### History Listener
    // Register a listener for history changes that results in triggering
    // a new route resolution.

    this.#destroy = this.history.listen(async ({ location }) => {
      if (isHashChange(prevLocation, location) === true) {
        prevLocation = location;
        return this.#hash.next(location.hash);
      }
      prevLocation = location;
      this.#resolver.push(location.pathname, location.search);
    });

    // ### Initial Route
    // The initial route is resolved on the first call to `listen` so that
    // the router can initialize and render the current location state.

    this.#resolver.push(this.history.location.pathname, this.history.location.search);

    return this;
  }

  /*
   |--------------------------------------------------------------------------------
   | Actions
   |--------------------------------------------------------------------------------
   */

  /**
   * Push a new routing request into the history instance triggering a new routing
   * transition.
   *
   * @param path  - Path to resolve.
   * @param state - State to pass.
   */
  goto(path: string, state: Record<string, unknown> = {}): this {
    const parts = (this.#base + path.replace(this.#base, "")).replace(/\/$/, "").split("?");
    this.history.push(
      {
        pathname: parts[0] || "/",
        search: parts[1] ? `${parts[1]}` : ""
      },
      state
    );
    return this;
  }

  /**
   * Redirect response.
   *
   * @remarks
   * When redirecting internally the origin is passed to the new route in case
   * we want to reference it.
   *
   * @param response - Redirect response.
   * @param origin   - Origin to assign with the redirect.
   * @param onGoTo   - Callback to execute on internal routing.
   */
  redirect(response: Redirect): this {
    if (response.isExternal) {
      window.location.replace(response.path);
    } else {
      this.goto(response.path, { origin: this.history.location });
    }
    return this;
  }

  /**
   * Move browser history one step forwards, if there is no history item in the
   * forward direction this action does nothing.
   */
  forward = (): this => {
    this.history.forward();
    return this;
  };

  /**
   * Move browser history one step back, if there is no history item in the back
   * direction this action does nothing.
   */
  back = (): this => {
    this.history.back();
    return this;
  };

  /**
   * Reload the current route by re-executing the request.
   *
   * @returns Router
   */
  reload(): this {
    this.history.replace(
      {
        pathname: this.history.location.pathname,
        search: this.history.location.search
      },
      this.history.location.state
    );
    return this;
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  /**
   * Check if the provided path matches the current route location.
   *
   * @param path - RegEx path to match against location.
   */
  isCurrentPath(path: Path): boolean {
    return match(path)(this.history.location.pathname) !== false;
  }

  /**
   * Get a route by its assigned id.
   *
   * @param id - Route id to retrieve.
   */
  getRouteById(id: string): Route | undefined {
    return this.routes.find((route) => route.id === id);
  }

  /*
   |--------------------------------------------------------------------------------
   | Subscribers
   |--------------------------------------------------------------------------------
   */

  /**
   * Subscribe to route changes.
   *
   * @param next - Handler to execute on incoming route.
   *
   * @returns RXJS Subscription.
   */
  subscribe(next: (resolved: Resolved) => void): Subscription {
    return this.#resolver.resolved.subscribe(next);
  }

  /**
   * Subscribe to a list of paths and execute the next handler when the incoming
   * route matches any of the paths.
   *
   * @param paths - List of paths to subscribe to.
   * @param next  - Handler to execute on incoming route.
   *
   * @returns RXJS Subscription.
   */
  subscribeToPaths(paths: string[], next: (resolved: Resolved, path: string) => void): Subscription {
    return this.#resolver.resolved.subscribe((matched) => {
      for (const path of paths) {
        if (matched.route.match(path)) {
          next(matched, path);
        }
      }
    });
  }

  /**
   * Subscribe to changes in the location hash value. This is useful for
   * applications that use wants to use the hash for custom page behavior
   * that is not connected to rendering new views.
   *
   * @param next - Handler to execute on hash changes.
   *
   * @returns RXJS Subscription.
   */
  subscribeToHash(next: (hash: string) => void): Subscription {
    return this.#hash.subscribe((hash: string) => {
      next(hash);
    });
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type RoutedResult<Router> = {
  id?: string;
  name?: string;
  location: Location;
  component: RouterComponent<Router>;
  props: RenderProps;
};

export type RouterComponent<Type> = Type extends Router<infer X> ? X : never;
