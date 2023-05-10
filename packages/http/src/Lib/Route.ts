import { pathToRegexp } from "path-to-regexp";

import type { HttpMethod } from "../Types";
import type { Action } from "./Action";
import type { Parameter } from "./Params";
import { parseParams } from "./Params";

/*
 |--------------------------------------------------------------------------------
 | Route
 |--------------------------------------------------------------------------------
 */

export class Route {
  public readonly method: HttpMethod;
  public readonly path: string;
  public readonly regExp: RegExp;
  public readonly params: Parameter[];
  public readonly actions: Action[];

  constructor(method: HttpMethod, path: string, actions: Action[]) {
    this.method = method;
    this.path = path;
    this.actions = actions;
    this.regExp = pathToRegexp(path);
    this.params = parseParams(path);
  }

  /*
   |--------------------------------------------------------------------------------
   | Factories
   |--------------------------------------------------------------------------------
   */

  public static post(path: string, actions: Action[]): Route {
    return new Route("post", path, actions);
  }

  public static get(path: string, actions: Action[]): Route {
    return new Route("get", path, actions);
  }

  public static put(path: string, actions: Action[]): Route {
    return new Route("put", path, actions);
  }

  public static patch(path: string, actions: Action[]): Route {
    return new Route("patch", path, actions);
  }

  public static delete(path: string, actions: Action[]): Route {
    return new Route("delete", path, actions);
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  public match(path: string): any {
    return this.regExp.exec(path);
  }
}
