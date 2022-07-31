import { EventEmitter } from "@valkyr/utils";
import type { BrowserHistory, HashHistory, Location, MemoryHistory } from "history";

import { ActionRejectedError } from "../Errors/Action";
import { RenderActionMissingError, RouteNotFoundError } from "../Errors/Route";
import type { Request } from "../Types/Action";
import { addRoute } from "../Utils/Routes";
import { Query } from "./Query";
import { Route } from "./Route";
import { handleRoutingRequest } from "./RouteHandler";
import { State } from "./State";
import { getLocationOrigin, setLocationOrigin } from "./Tracker";
import { ValueStore } from "./ValueStore";

export class Router extends EventEmitter<{
  progress: (percent: number) => void;
}> {
  public base: string;
  public history: BrowserHistory | HashHistory | MemoryHistory;

  public current: {
    query: Query;
    params: ValueStore;
    state: State;
  };

  public destroy?: () => void;

  constructor(history: BrowserHistory | HashHistory | MemoryHistory, base = "") {
    super();
    this.base = base === "" || base === "/" ? "" : base;
    this.history = history;
    this.current = {
      query: new Query(this.history),
      params: new ValueStore(),
      state: new State()
    };
    this.goTo = this.goTo.bind(this);
    this.reload = this.reload.bind(this);
    this.setCurrentRoute = this.setCurrentRoute.bind(this);
    this.setProgress = this.setProgress.bind(this);
  }

  public get location(): Location {
    return this.history.location;
  }

  public get params(): ValueStore {
    return this.current.params;
  }

  public get query(): Query {
    return this.current.query;
  }

  public get state(): State {
    return this.current.state;
  }

  /*
   |--------------------------------------------------------------------------------
   | Setup
   |--------------------------------------------------------------------------------
   */

  public register(routes: Route[]): this {
    for (const route of routes) {
      addRoute(this.base, route);
    }
    return this;
  }

  public listen({
    render,
    error
  }: {
    render(components: any[]): any;
    error(error: ActionRejectedError | RenderActionMissingError | RouteNotFoundError): any;
  }) {
    if (this.destroy) {
      this.destroy();
    }
    this.destroy = this.history.listen(async ({ location }) => {
      setLocationOrigin(location);
      handleRoutingRequest(this, location, getLocationOrigin())
        .then((components) => {
          if (components) {
            render(components);
          }
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
  public goTo(path: string, state: any = {}): this {
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
  public reload(): this {
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
  public setCurrentRoute(request: Request): this {
    this.current = {
      params: request.params,
      query: request.query,
      state: request.state
    };
    return this;
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
  public setProgress(percent: number): this {
    this.emit("progress", percent);
    return this;
  }
}
