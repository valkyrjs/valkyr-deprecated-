import type { BrowserHistory, HashHistory, Location, MemoryHistory } from "history";
import { match } from "path-to-regexp";
import { Subject, Subscription } from "rxjs";

import { Redirect, RenderProps, response } from "./Action";
import { ActionRejectedException, RenderActionMissingException, RouteNotFoundException } from "./Exceptions";
import { Resolved } from "./Resolved";
import { RegisterOptions } from "./Route";
import { Route } from "./Route";

export class Router<Component = unknown> {
  #base: string;
  #history: BrowserHistory | HashHistory | MemoryHistory;
  #routes: Set<Route> = new Set();
  #resolved?: Resolved;
  #subscriber = new Subject<Resolved>();

  #render?: (component: Component, props?: RenderProps) => void;
  #error?: (error: ActionRejectedException | RenderActionMissingException | RouteNotFoundException) => void;
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

  get state(): Location["state"] {
    return this.#history.location["state"];
  }

  get params(): Resolved["params"] {
    return this.resolved.params;
  }

  get query(): Resolved["query"] {
    return this.resolved.query;
  }

  get route(): Resolved["route"] {
    return this.resolved.route;
  }

  get resolved(): Resolved {
    if (this.#resolved === undefined) {
      throw new Error("No route has been resolved yet");
    }
    return this.#resolved;
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
  error(
    handler: (error: ActionRejectedException | RenderActionMissingException | RouteNotFoundException) => void
  ): this {
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
      const resolved = this.getResolvedRoute(location.pathname);
      if (resolved === undefined) {
        return this.#error?.(new RouteNotFoundException(location.pathname));
      }
      this.setRoute(resolved);
      try {
        await this.#execute(resolved.route, resolved);
      } catch (err) {
        this.#error?.(err);
      }
    });

    this.goTo(`${this.location.pathname}${this.location.search}`);

    return this;
  }

  async #execute(route: Route, resolved: Resolved): Promise<void> {
    for (const action of route.actions) {
      const res = await action.call(response, resolved);
      switch (res.status) {
        case "redirect": {
          return this.redirect(res);
        }
        case "reject": {
          throw new ActionRejectedException(res.message, res.details);
        }
        case "render": {
          if (route.parent !== undefined) {
            this.#subscriber.next(resolved);
            return this.#execute(route.parent, resolved);
          }
          return this.#render?.(res.component, res.props);
        }
      }
    }
    throw new RenderActionMissingException(route.path);
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  subscribe(paths: string[], next: RoutedHandler): Subscription {
    return this.#subscriber.subscribe((matched) => {
      for (const path of paths) {
        if (matched.route.match(path)) {
          next(matched);
        }
      }
    });
  }

  routed(next: RoutedHandler): Subscription {
    return this.#subscriber.subscribe(next);
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
   * Reload the current route by re-executing the request.#matched
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
   * @param resolved - Resolved route.
   */
  setRoute(resolved: Resolved): this {
    this.#resolved = resolved;
    return this;
  }

  /**
   * Get the resolved route for the provided path or return undefined if provided
   * path does not match any registered routes.
   *
   * @param path - Path to retrieve a route for.
   */
  getResolvedRoute(path: string): Resolved | undefined {
    const resolved = this.getRoute(path);
    if (resolved === undefined) {
      return undefined;
    }
    return new Resolved(resolved.route, resolved.params, this.#history);
  }

  /**
   * Get a route from the registered list of routes.
   *
   * @param path - Path to match against.
   */
  getRoute(path: string): { route: Route; params: Object } | undefined {
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
  async getComponent(matched: Resolved): Promise<RoutedResult<Router> | undefined> {
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

type RoutedHandler = (result: Resolved) => void;

export type RoutedResult<Router> = {
  component: RouterComponent<Router>;
  props: RenderProps;
};

export type RouterComponent<Type> = Type extends Router<infer X> ? X : never;
