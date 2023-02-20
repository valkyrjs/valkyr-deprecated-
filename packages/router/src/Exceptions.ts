import type { Redirect } from "./Action.js";

/**
 * @classdesc
 * Inform the client that no render action has been assigned to the
 * resolved route.
 */
export class RenderActionMissingException extends Error {
  constructor(path: string) {
    super(`Router Violation: Routing path '${path}' has no assigned render action.`);
  }
}

/**
 * @classdesc
 * Inform the client that the requested location does not have a valid
 * route assigned to it.
 */
export class RouteNotFoundException extends Error {
  readonly path: any;

  constructor(path: string) {
    super(`Router Violation: Route for '${path}' does not exist, or has been moved to another location`);
    this.path = path;
  }
}

/**
 * @classdesc
 * Inform the client that an action encountered a failure event.
 */
export class ActionRejectedException extends Error {
  readonly details: any;

  constructor(message: string, details: any = {}) {
    super(message);
    this.details = details;
  }
}

/**
 * @classdesc
 * Inform the client that an action resulted in a redirect event.
 */
export class ActionRedirected extends Error {
  constructor(readonly redirect: Redirect) {
    super(`Router Redirected: Action redirected to '${redirect.path}'`);
  }
}
