import { EventEmitter } from "@valkyr/event-emitter";
import type { BrowserHistory, HashHistory, Location, MemoryHistory } from "history";

import type { ActionRejectedError, Render, RenderProps, Request } from "./Action";
import { Query } from "./Query";
import type { RenderActionMissingError, Resolved, RouteNotFoundError } from "./Route";
import { Route } from "./Route";
import { handleRoutingRequest } from "./RouteHandler";
import { State } from "./State";
import { getLocationOrigin, setLocationOrigin } from "./Tracker";
import { ValueStore } from "./ValueStore";

export class Router<Component = any> extends EventEmitter<{
  progress: (percent: number) => void;
  routed: (next: { params: ValueStore; query: Query; state: State }) => void;
}> {
  base: string;
  history: BrowserHistory | HashHistory | MemoryHistory;

  #routes: Set<Route> = new Set();
  #current: {
    query: Query;
    params: ValueStore;
    state: State;
  };

  destroy?: () => void;

  constructor(history: BrowserHistory | HashHistory | MemoryHistory, base = "") {
    super();
    this.base = base === "" || base === "/" ? "" : base;
    this.history = history;
    this.#current = {
      query: new Query(this.history),
      params: new ValueStore(),
      state: new State()
    };
    this.goTo = this.goTo.bind(this);
    this.reload = this.reload.bind(this);
    this.setCurrentRoute = this.setCurrentRoute.bind(this);
    this.setProgress = this.setProgress.bind(this);
  }

  /*
   |--------------------------------------------------------------------------------
   | Accessors
   |--------------------------------------------------------------------------------
   */

  get location(): Location {
    return this.history.location;
  }

  get params(): ValueStore {
    return this.#current.params;
  }

  get query(): Query {
    return this.#current.query;
  }

  get state(): State {
    return this.#current.state;
  }

  /*
   |--------------------------------------------------------------------------------
   | Setup
   |--------------------------------------------------------------------------------
   */

  register(routes: Route[]): this {
    for (const route of routes) {
      this.#routes.add(route.base(this.base));
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
    if (this.destroy) {
      this.destroy();
    }
    this.destroy = this.history.listen(async ({ location }) => {
      setLocationOrigin(location);
      handleRoutingRequest(this, location, getLocationOrigin())
        .then(({ components, props }: Render<RenderProps, Component>) => {
          render(components, props);
        })
        .catch(error);
    });
    return this;
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  /**
   * Execute a new route request.
   *
   * @param path  - Path to resolve.
   * @param state - State to pass.
   *
   * @returns Router
   */
  goTo(path: string, state: any = {}): this {
    const parts = (this.base + path.replace(this.base, "")).replace(/\/$/, "").split("?");
    this.history.push(
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
    this.history.replace(
      {
        pathname: this.location.pathname,
        search: this.location.search
      },
      this.state
    );
    return this;
  }

  /**
   * Attach the provided request to the current route assignment.
   *
   * @remarks
   * This provides shortcut access to the currently resolved routes state, query
   * and parameter values.
   *
   * @param request - Resolved request.
   *
   * @returns Router
   */
  setCurrentRoute(request: Request): this {
    this.#current = {
      params: request.params,
      query: request.query,
      state: request.state
    };
    this.emit("routed", this.#current);
    return this;
  }

  /**
   * Get a route from the registered list of routes.
   *
   * @param path - Path to match against.
   */
  getRoute(path: string): Resolved | undefined {
    for (const route of Array.from(this.#routes.values())) {
      const match: boolean = route.match(path);
      if (match) {
        return { route, match };
      }
    }
    return undefined;
  }

  /**
   * Set percent of total actions completed.
   *
   * @remarks
   * Router progress events which shows the amount of progress of a routes loading
   * path. Some routes may have actions that can take longer to resolve in which
   * case being able to provide a load progress state to the client can be
   * beneficial.
   *
   * @param percent - Current percent of total actions completed.
   *
   * @returns Router
   */
  setProgress(percent: number): this {
    this.emit("progress", percent);
    return this;
  }
}
