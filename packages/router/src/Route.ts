import { pathToRegexp } from "path-to-regexp";

import { Action } from "./Action";

/*
 |--------------------------------------------------------------------------------
 | Route
 |--------------------------------------------------------------------------------
 */

export class Route {
  path: string;
  actions: Action[];

  regExp: RegExp;
  params: Parameter[];

  constructor(path: string, actions: Action[]) {
    this.path = path.replace(/\/$/, "");
    this.actions = actions;
    this.regExp = pathToRegexp(path);
    this.params = getParsedParameters(path);
  }

  base(path = ""): this {
    this.regExp = pathToRegexp(path + this.path);
    return this;
  }

  match(path: string): any {
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
 | Utilities
 |--------------------------------------------------------------------------------
 */

export function getParsedParameters(path: string): Parameter[] {
  return path.split("/").reduce((list: Parameter[], next: string) => {
    if (next.match(/:/)) {
      list.push({
        name: next.replace(":", ""),
        value: undefined
      });
    }
    return list;
  }, []);
}

export function getParameters<Response = any>(params: Parameter[], match: any): Response {
  const result: any = {};
  params.forEach((param, index) => {
    result[param.name] = match[index + 1];
  });
  return result;
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Parameter = {
  name: string;
  value?: string;
};

export type Resolved = {
  route: Route;
  match: any;
};