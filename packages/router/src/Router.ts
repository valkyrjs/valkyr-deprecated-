import type { BrowserHistory, HashHistory, Location, MemoryHistory } from "history";
import { match } from "path-to-regexp";
import { Subject, Subscription } from "rxjs";

import { ActionRejectedError, Redirect, RenderProps, response } from "./Action";
import { MatchedRoute } from "./MatchedRoute";
import { RenderActionMissingError, Resolved, RouteNotFoundError } from "./Route";
import { Route } from "./Route";
import { RouteGroup } from "./RouteGroup";

export class Router<Component = unknown> {
  #base: string;

  #history: BrowserHistory | HashHistory | MemoryHistory;

  #routes: Set<Route> = new Set();

  #matched?: MatchedRoute;

  #routed = new Subject<MatchedRoute>();

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

  register(routes: (Route | RouteGroup)[]): this {
    for (const route of routes) {
      if (route instanceof RouteGroup) {
        this.register(route.routes);
      } else {
        this.#routes.add(route.base(this.#base));
      }
    }
    return this;
  }

  /**
   * Starts listening for routing changes which emits results to the provided
   * render or error method.
   *
   * @param render - Render method to execute on render actions.
   * @param error  - Error method to execute on routing exceptions.
   */
  listen({
    render,
    error
  }: {
    render(components: Component[], props: RenderProps): Component;
    error(error: ActionRejectedError | RenderActionMissingError | RouteNotFoundError): Component;
  }): this {
    if (this.#destroy !== undefined) {
      this.#destroy();
    }
    this.#destroy = this.#history.listen(async ({ location }) => {
      const resolved = this.getRoute(location.pathname);
      if (resolved === undefined) {
        return error(new RouteNotFoundError(location.pathname));
      }
      const matched = new MatchedRoute(this.#history, resolved);
      for (const action of resolved.route.actions) {
        const res = await action.call(response, matched);
        switch (res.status) {
          case "redirect": {
            return this.redirect(res);
          }
          case "render": {
            if ((location as any).state.render === true) {
              render(res.components, {});
            }
            return this.setRoute(matched);
          }
          case "reject": {
            return error(new ActionRejectedError(res.message, res.details));
          }
        }
      }
      error(new RenderActionMissingError(resolved.route.path));
    });
    return this;
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  subscribe(paths: string[], callback: (matched: MatchedRoute) => void): Subscription {
    return this.#routed.subscribe((matched) => {
      for (const path of paths) {
        if (matched.route.match(path)) {
          callback(matched);
        }
      }
    });
  }

  routed(callback: (matched: MatchedRoute) => void): Subscription {
    return this.#routed.subscribe(callback);
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
  goTo(path: string, state: { render?: boolean } & Record<string, unknown> = { render: true }): this {
    const parts = (this.#base + path.replace(this.#base, "")).replace(/\/$/, "").split("?");
    this.#history.push(
      {
        pathname: parts[0] || "/",
        search: parts[1] ? `?${parts[1]}` : ""
      },
      {
        ...state,
        render: state.render !== false
      }
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
    this.#routed.next(matched);
    return this;
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
}
