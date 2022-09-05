import type { BrowserHistory, HashHistory, Location, MemoryHistory } from "history";
import { match } from "path-to-regexp";
import { Subject, Subscription } from "rxjs";

import { ActionRejectedError, Redirect, RenderProps, response } from "./Action";
import { MatchedRoute } from "./MatchedRoute";
import { RegisterOptions, RenderActionMissingError, Resolved, RouteNotFoundError } from "./Route";
import { Route } from "./Route";

export class Router<Component = unknown> {
  #base: string;

  #history: BrowserHistory | HashHistory | MemoryHistory;

  #routes: Set<Route> = new Set();

  #matched?: MatchedRoute;

  #routed = new Subject<MatchedRoute>();

  #render?: (component: Component, props?: RenderProps) => void;
  #error?: (error: ActionRejectedError | RenderActionMissingError | RouteNotFoundError) => void;
  #destroy?: () => void;

  constructor(history: BrowserHistory | HashHistory | MemoryHistory, base = "") {
    this.#base = base === "" || base === "/" ? "" : base;
    this.#history = history;
  }

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  get routes(): Route[] {
    return Array.from(this.#routes);
  }

  get location(): Location {
    return this.#history.location;
  }

  get params(): MatchedRoute["params"] {
    return this.matched.params;
  }

  get query(): MatchedRoute["query"] {
    return this.matched.query;
  }

  get state(): MatchedRoute["state"] {
    return this.matched.state;
  }

  get route(): MatchedRoute["route"] {
    return this.matched.route;
  }

  get matched(): MatchedRoute {
    if (this.#matched === undefined) {
      throw new Error("No route has been resolved yet");
    }
    return this.#matched;
  }

  /*
   |--------------------------------------------------------------------------------
   | Setup
   |--------------------------------------------------------------------------------
   */

  register(routes: Route[], options?: Partial<RegisterOptions>): this {
    for (const route of routes) {
      this.#routes.add(
        route.register({
          base: options?.base ?? this.#base,
          parent: options?.parent
        })
      );
      if (route.children !== undefined) {
        this.register(route.children, {
          base: route.path,
          parent: route
        });
      }
    }
    return this;
  }

  /**
   * Register render handler receiving the component and props to render.
   *
   * @param handler - Handler method for incoming components and props.
   */
  render(handler: (component: Component, props?: RenderProps) => void): this {
    this.#render = handler;
    return this;
  }

  /**
   * Register error handler receiving the error to render.
   *
   * @param handler - Handler method for incoming errors.
   */
  error(handler: (error: ActionRejectedError | RenderActionMissingError | RouteNotFoundError) => void): this {
    this.#error = handler;
    return this;
  }

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

    this.#destroy = this.#history.listen(async ({ location }) => {
      const matched = this.getMatchedRoute(location.pathname);
      if (matched === undefined) {
        return this.#error?.(new RouteNotFoundError(location.pathname));
      }
      try {
        await this.#resolve(matched.route, matched);
      } catch (err) {
        this.#error?.(err);
      }
      this.setRoute(matched);
    });

    this.goTo(`${this.location.pathname}${this.location.search}`);

    return this;
  }

  async #resolve(route: Route, matched: MatchedRoute): Promise<void> {
    for (const action of route.actions) {
      const res = await action.call(response, matched);
      switch (res.status) {
        case "redirect": {
          return this.redirect(res);
        }
        case "reject": {
          throw new ActionRejectedError(res.message, res.details);
        }
        case "render": {
          if (route.parent !== undefined) {
            this.#routed.next(matched);
            return this.#resolve(route.parent, matched);
          }
          return this.#render?.(res.component, res.props);
        }
      }
    }
    throw new RenderActionMissingError(route.path);
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  subscribe(paths: string[], next: RoutedHandler): Subscription {
    return this.#routed.subscribe((matched) => {
      for (const path of paths) {
        if (matched.route.match(path)) {
          next(matched);
        }
      }
    });
  }

  routed(next: RoutedHandler): Subscription {
    return this.#routed.subscribe(next);
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
  redirect(response: Redirect): void {
    if (response.isExternal) {
      window.location.replace(response.path);
    } else {
      this.goTo(response.path, { origin: this.location });
    }
  }

  /**
   * Execute a new route request.
   *
   * @param path  - Path to resolve.
   * @param state - State to pass.
   *
   * @returns Router
   */
  goTo(path: string, state: Record<string, unknown> = {}): this {
    const parts = (this.#base + path.replace(this.#base, "")).replace(/\/$/, "").split("?");
    this.#history.push(
      {
        pathname: parts[0] || "/",
        search: parts[1] ? `?${parts[1]}` : ""
      },
      state
    );
    return this;
  }

  /**
   * Reload the current route by re-executing the request.
   *
   * @returns Router
   */
  reload(): this {
    this.#history.replace(
      {
        pathname: this.location.pathname,
        search: this.location.search
      },
      this.location.state
    );
    return this;
  }

  /**
   * Check if the provided path matches the current route location.
   *
   * @param path - RegEx path to match against location.
   */
  match(path: string): boolean {
    return match(path)(this.location.pathname) !== false;
  }

  /**
   * Attach the provided request to the current route assignment.
   *
   * @remarks This provides shortcut access to the currently resolved routes state,
   * query and parameter values.
   *
   * @param matched - Matched route.
   */
  setRoute(matched: MatchedRoute): this {
    this.#matched = matched;
    return this;
  }

  /**
   * Get the matched route for the provided path or return undefined if provided
   * path does not match any registered routes.
   *
   * @param path - Path to retrieve a route for.
   */
  getMatchedRoute(path: string): MatchedRoute | undefined {
    const resolved = this.getRoute(path);
    if (resolved === undefined) {
      return undefined;
    }
    return new MatchedRoute(resolved, this.#history);
  }

  /**
   * Get a route from the registered list of routes.
   *
   * @param path - Path to match against.
   */
  getRoute(path: string): Resolved | undefined {
    for (const route of Array.from(this.#routes.values())) {
      const params = route.match(path);
      if (params !== false) {
        return { route, params };
      }
    }
    return undefined;
  }

  /**
   * Return a routing result that should render for the provided matched component
   * or return undefined if the matched route does not result in a component being
   * rendered.
   *
   * @param matched - Matched route result.
   */
  async getComponent(matched: MatchedRoute): Promise<RoutedResult<Router> | undefined> {
    for (const action of matched.route.actions) {
      const res = await action.call(response, matched);
      switch (res.status) {
        case "render": {
          return {
            component: res.component,
            props: res.props
          };
        }
      }
    }
    return undefined;
  }
}

type RoutedHandler = (result: MatchedRoute) => void;

export type RoutedResult<Router> = {
  component: RouterComponent<Router>;
  props: RenderProps;
};

export type RouterComponent<Type> = Type extends Router<infer X> ? X : never;
