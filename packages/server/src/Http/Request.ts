import { getParameters, toQueryObject } from "@valkyr/utils";
import { IncomingMessage } from "http";

import * as response from "../Action";
import { HttpRoute } from "../Route";
import type { Routes } from "../Types";
import { HttpError, HttpRedirect, HttpSuccess } from "./Response";
import type { HttpMethod, RouteMatch } from "./Types";

/*
 |--------------------------------------------------------------------------------
 | Constants
 |--------------------------------------------------------------------------------
 */

const BODY_METHODS = new Map<string, boolean>([
  ["POST", true],
  ["PUT", true],
  ["PATCH", true]
]);

/*
 |--------------------------------------------------------------------------------
 | Request
 |--------------------------------------------------------------------------------
 */

export async function resolve(
  routes: Routes,
  message: IncomingMessage
): Promise<HttpSuccess | HttpRedirect | HttpError> {
  if (!message.url || !message.method) {
    return new HttpError(500, "Internal error");
  }

  const methodRoutes = routes[message.method.toLowerCase() as HttpMethod];
  if (!methodRoutes) {
    return new HttpError(500, "Unsupported method type.", {
      method: message.method
    });
  }

  const [path, search] = message.url.split("?");
  const result = getRouteMatch(methodRoutes, path);
  if (!result) {
    return new HttpError(404, "Route does not exist, or has been removed.", {
      url: message.url
    });
  }

  const route = result.route;

  message.params = getParameters(result.route.params, result.match);
  message.query = toQueryObject(search);
  message.body = BODY_METHODS.has(message.method) ? await body(message) : {};

  for (const action of route.actions) {
    const result = await action.call(response, message);
    switch (result.status) {
      case "rejected": {
        return new HttpError(result.code, result.message, result.data);
      }
      case "redirect": {
        return new HttpRedirect(result.type === "PERMANENT" ? 301 : 307, result.url);
      }
      case "resolved": {
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

async function body(req: IncomingMessage): Promise<any> {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  return JSON.parse(Buffer.concat(buffers).toString());
}

function getRouteMatch(routes: HttpRoute[], path: string): RouteMatch | undefined {
  for (const route of routes) {
    const match: boolean = route.match(path);
    if (match) {
      return { route, match };
    }
  }
}
