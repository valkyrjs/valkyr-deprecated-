import { getParameters } from "@valkyr/utils";
import type { History, Location } from "history";

import { ActionRejectedError } from "../Errors/Action";
import { RenderActionMissingError, RouteNotFoundError } from "../Errors/Route";
import type { Action, Redirect, Request } from "../Types/Action";
import type { Resolved } from "../Types/Routes";
import { getRoute } from "../Utils/Routes";
import { response } from "./Action";
import { Query } from "./Query";
import type { Router } from "./Router";
import { State } from "./State";
import { ValueStore } from "./ValueStore";

/*
 |--------------------------------------------------------------------------------
 | Request Handler
 |--------------------------------------------------------------------------------
 */

export async function handleRoutingRequest(router: Router, location: Location, origin?: Location) {
  const resolved = getRoute(location.pathname);
  if (resolved === undefined) {
    throw new RouteNotFoundError(location.pathname);
  }
  return getRoutingResponse(resolved, router, location, origin);
}

/*
 |--------------------------------------------------------------------------------
 | Router
 |--------------------------------------------------------------------------------
 */

async function getRoutingResponse(resolved: Resolved, router: Router, location: Location, origin?: Location) {
  const route = resolved.route;
  const request = getRequest(resolved, location, router.history);
  const response = await getResponse(request, route.actions, router.setProgress);
  if (!response) {
    throw new RenderActionMissingError(route.path);
  }
  switch (response.status) {
    case "redirect": {
      redirect(response, origin, router.goTo);
      break;
    }
    case "render": {
      router.setCurrentRoute(request).setProgress(0);
      return response.components;
    }
  }
}

function getRequest(resolved: Resolved, location: Location, history: History): Request {
  return {
    location,
    params: new ValueStore(getParameters(resolved.route.params, resolved.match)),
    query: new Query(history, location.search),
    state: new State(location.state)
  };
}

/**
 * Create a response from a resolved request and routing actions.
 *
 * @param request    - Routing request object.
 * @param actions    - Route actions to validate.
 * @param onProgress - Callback to execute on progress updates.
 *
 * @returns Render, Redirect or undefined.
 */
async function getResponse(request: Request, actions: Action[], onProgress: Router["setProgress"]) {
  const total = actions.length;

  onProgress(total === 1 ? 50 : 1);

  let index = 1;
  for (const action of actions) {
    const res = await action.call(response, request);
    switch (res.status) {
      case "redirect":
      case "render": {
        onProgress(100);
        return res;
      }
      case "reject": {
        throw new ActionRejectedError(res.message, res.details);
      }
    }
    index += 1;
    onProgress((index / total) * 100);
  }
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
function redirect(response: Redirect, origin: Location | undefined, onGoTo: Router["goTo"]): void {
  if (response.isExternal) {
    window.location.replace(response.path);
  } else {
    onGoTo(response.path, { origin });
  }
}
