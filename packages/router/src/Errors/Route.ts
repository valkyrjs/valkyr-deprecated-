/**
 * @classdesc
 * Inform the client that no render action has been assigned to the
 * resolved route.
 */
export class RenderActionMissingError extends Error {
  public readonly type = "RenderActionMissingError" as const;

  constructor(path: string) {
    super(`Router Violation > Routing path '${path}' has no assigned render action.`);
  }
}

/**
 * @classdesc
 * Inform the client that the requested location does not have a valid
 * route assigned to it.
 */
export class RouteNotFoundError extends Error {
  public readonly type = "RouteNotFoundError" as const;

  public readonly path: any;

  constructor(path: string) {
    super("Router Violation > Route does not exist, or has been moved to another location.");
    this.path = path;
  }
}
