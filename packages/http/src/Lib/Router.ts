import type { IncomingMessage } from "http";

import { HttpMethod } from "../Types";
import * as response from "./Action";
import { getParams } from "./Params";
import { getQuery } from "./Query";
import { HttpError, HttpRedirect, HttpSuccess } from "./Response";
import { Route } from "./Route";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

/**
 * Http methods mapped to route lists.
 */
type Routes = {
  post: Route[];
  get: Route[];
  put: Route[];
  patch: Route[];
  delete: Route[];
};

/**
 * Result of a route search when resolving a request.
 */
export type Result = {
  route: Route;
  match: any;
};

/*
 |--------------------------------------------------------------------------------
 | Settings
 |--------------------------------------------------------------------------------
 */

const resolveBody = new Set(["POST", "PUT", "PATCH"]);

/*
 |--------------------------------------------------------------------------------
 | Router
 |--------------------------------------------------------------------------------
 */

export class Router {
  public routes: Routes = {
    post: [],
    get: [],
    put: [],
    patch: [],
    delete: []
  };

  /*
   |--------------------------------------------------------------------------------
   | Setup
   |--------------------------------------------------------------------------------
   */

  public register(routes: Route[]) {
    for (const route of routes) {
      this.routes[route.method].push(route);
    }
  }

  /*
   |--------------------------------------------------------------------------------
   | Resolver
   |--------------------------------------------------------------------------------
   */

  public async resolve(message: IncomingMessage): Promise<HttpSuccess | HttpRedirect | HttpError> {
    if (!message.url || !message.method) {
      return new HttpError(500, "Internal error");
    }

    const routes = this.routes[message.method.toLowerCase() as HttpMethod];
    if (!routes) {
      return new HttpError(500, "Unsupported method type.", { method: message.method });
    }

    const [path, search] = message.url.split("?");
    const result = this.get(routes, path);
    if (!result) {
      return new HttpError(404, "Route does not exist, or has been removed.", { url: message.url });
    }

    const route = result.route;

    message.params = getParams(result.route.params, result.match);
    message.query = getQuery(search);
    message.body = resolveBody.has(message.method) ? await this.body(message) : {};

    for (const action of route.actions) {
      const result = await action.call(response, message);
      switch (result.status) {
        case "rejected": {
          return new HttpError(result.code, result.message, result.data);
        }
        case "redirect": {
          return new HttpRedirect(result.url, result.type);
        }
        case "respond": {
          return new HttpSuccess(result.data);
        }
      }
    }

    return new HttpSuccess();
  }

  /*
   |--------------------------------------------------------------------------------
   | Utilities
   |--------------------------------------------------------------------------------
   */

  /**
   * Parse the incoming request body.
   *
   * @param req - Incoming http request.
   *
   * @returns Parsed http body
   */
  public async body(req: IncomingMessage): Promise<any> {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    return JSON.parse(Buffer.concat(buffers).toString());
  }

  /**
   * Returns a route that validates against the given path.
   *
   * @param routes - List of method routes.
   * @param path   - Routing path to return.
   *
   * @returns route or undefined
   */
  public get(routes: Route[], path: string): Result | undefined {
    for (const route of routes) {
      const match: boolean = route.match(path);
      if (match) {
        return { route, match };
      }
    }
  }
}
