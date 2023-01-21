import { RpcError } from "@valkyr/jsonrpc";

/**
 * The **HTTP 401 Unauthorized** response status code indicates that the client
 * request has not been completed because it lacks valid authentication
 * credentials for the requested resource.
 *
 * This status code is sent with an HTTP WWW-Authenticate response header that
 * contains information on how the client can request for the resource again after
 * prompting the user for authentication credentials.
 *
 * This status code is similar to the **403 Forbidden** status code, except that
 * in situations resulting in this status code, user authentication can allow
 * access to the resource.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
 */
export class UnauthorizedError<D = unknown> extends RpcError<D> {
  /**
   * Instantiate a new UnauthorizedError.
   *
   * @param data - Optional data to send with the error.
   */
  constructor(data?: D) {
    super("Unauthorized", -32001, data);
  }
}

/**
 * The **HTTP 403 Forbidden** response status code indicates that the server
 * understands the request but refuses to authorize it.
 *
 * This status is similar to **401**, but for the **403 Forbidden** status code
 * re-authenticating makes no difference. The access is permanently forbidden and
 * tied to the application logic, such as insufficient rights to a resource.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
 */
export class ForbiddenError<D = unknown> extends RpcError<D> {
  /**
   * Instantiate a new ForbiddenError.
   *
   * @param data - Optional data to send with the error.
   */
  constructor(data?: D) {
    super("Forbidden", -32003, data);
  }
}

/**
 * The **HTTP 404 Not Found** response status code indicates that the server
 * cannot find the requested resource. Links that lead to a 404 page are often
 * called broken or dead links and can be subject to link rot.
 *
 * A 404 status code only indicates that the resource is missing: not whether the
 * absence is temporary or permanent. If a resource is permanently removed,
 * use the **410 _(Gone)_** status instead.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
 */
export class NotFoundError<D = unknown> extends RpcError<D> {
  /**
   * Instantiate a new NotFoundError.
   *
   * @param data - Optional data to send with the error.
   */
  constructor(data?: D) {
    super("Not found", -32004, data);
  }
}

/**
 * The **HTTP 409 Conflict** response status code indicates a request conflict
 * with the current state of the target resource.
 *
 * Conflicts are most likely to occur in response to a PUT request. For example,
 * you may get a 409 response when uploading a file that is older than the
 * existing one on the server, resulting in a version control conflict.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
 */
export class ConflictError<D = unknown> extends RpcError<D> {
  /**
   * Instantiate a new ConflictError.
   *
   * @param data - Optional data to send with the error.
   */
  constructor(data?: D) {
    super("Conflict", -32009, data);
  }
}
