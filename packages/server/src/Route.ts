import { getParsedParameters, Parameter } from "@valkyr/utils";
import { pathToRegexp } from "path-to-regexp";

import type { HttpAction, WsAction } from "./Action";
import type { HttpMethod } from "./Http";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Routes = Record<HttpMethod, HttpRoute[]> & Record<"on", Map<string, WsRoute>>;

/*
 |--------------------------------------------------------------------------------
 | Http
 |--------------------------------------------------------------------------------
 */

export class HttpRoute {
  public readonly type = "http" as const;

  public readonly regExp: RegExp;
  public readonly params: Parameter[];

  constructor(public readonly method: HttpMethod, public readonly path: string, public readonly actions: HttpAction[]) {
    this.regExp = pathToRegexp(path);
    this.params = getParsedParameters(path);
  }

  public match(path: string): any {
    return this.regExp.exec(path);
  }
}

/*
 |--------------------------------------------------------------------------------
 | WebSocket
 |--------------------------------------------------------------------------------
 */

export class WsRoute {
  public readonly type = "ws" as const;

  constructor(public readonly path: string, public readonly actions: WsAction[]) {}
}

/*
 |--------------------------------------------------------------------------------
 | Factories
 |--------------------------------------------------------------------------------
 */

export function addRouteTo(routes: Routes) {
  return {
    post(path: string, actions: HttpAction[]): void {
      routes.post.push(new HttpRoute("post", path, actions));
    },

    get(path: string, actions: HttpAction[]): void {
      routes.get.push(new HttpRoute("get", path, actions));
    },

    put(path: string, actions: HttpAction[]): void {
      routes.put.push(new HttpRoute("put", path, actions));
    },

    patch(path: string, actions: HttpAction[]): void {
      routes.patch.push(new HttpRoute("patch", path, actions));
    },

    delete(path: string, actions: HttpAction[]): void {
      routes.delete.push(new HttpRoute("delete", path, actions));
    },

    on(path: string, actions: WsAction[]): void {
      routes.on.set(path, new WsRoute(path, actions));
    }
  };
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

export function getInitialRoutes(): Routes {
  return {
    post: [],
    get: [],
    put: [],
    patch: [],
    delete: [],
    on: new Map()
  };
}
