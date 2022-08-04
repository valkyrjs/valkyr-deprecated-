import { getParsedParameters, Parameter } from "@valkyr/utils";
import { pathToRegexp } from "path-to-regexp";

import { Action } from "./Action";

/*
 |--------------------------------------------------------------------------------
 | Route
 |--------------------------------------------------------------------------------
 */

export class Route {
  public path: string;
  public actions: Action[];

  public regExp: RegExp;
  public params: Parameter[];

  constructor(path: string, actions: Action[]) {
    this.path = path.replace(/\/$/, "");
    this.actions = actions;
    this.regExp = pathToRegexp(path);
    this.params = getParsedParameters(path);
  }

  public base(path = ""): this {
    this.regExp = pathToRegexp(path + this.path);
    return this;
  }

  public match(path: string): any {
    return this.regExp.exec(path);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Errors
 |--------------------------------------------------------------------------------
 */

/**
 * @classdesc
 * Inform the client that no render action has been assigned to the
 * resolved route.
 */
export class RenderActionMissingError extends Error {
  readonly type = "RenderActionMissingError" as const;

  constructor(path: string) {
    super(`Router Violation: Routing path '${path}' has no assigned render action.`);
  }
}

/**
 * @classdesc
 * Inform the client that the requested location does not have a valid
 * route assigned to it.
 */
export class RouteNotFoundError extends Error {
  readonly type = "RouteNotFoundError" as const;

  readonly path: any;

  constructor(path: string) {
    super(`Router Violation: Route for '${path}' does not exist, or has been moved to another location`);
    this.path = path;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Resolved = {
  route: Route;
  match: any;
};
