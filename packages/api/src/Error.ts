import { RpcError } from "@valkyr/jsonrpc";

/**
 * The **HTTP 400 Bad Request** response status code indicates that the server
 * cannot or will not process the request due to something that is perceived to
 * be a client error.
 */
export class BadRequestError<D = unknown> extends RpcError<D> {
  /**
   * Instantiate a new BadRequestError.
   *
   * @param data - Optional data to send with the error.
   */
  constructor(message = "Bad Request", data?: D) {
    super(message, -32000, data);
  }
}

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
  constructor(message = "Unauthorized", data?: D) {
    super(message, -32001, data);
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
   * @param message - Optional message to send with the error. Default: "Forbidden".
   * @param data - Optional data to send with the error.
   */
  constructor(message = "Forbidden", data?: D) {
    super(message, -32003, data);
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
 * The **HTTP 406 Not Acceptable** client error response code indicates that the
 * server cannot produce a response matching the list of acceptable values
 * defined in the request, and that the server is unwilling to supply a default
 * representation.
 */
export class NotAcceptableError<D = unknown> extends RpcError<D> {
  /**
   * Instantiate a new NotAcceptableError.
   *
   * @param message - Optional message to send with the error. Default: "Not Acceptable".
   * @param data    - Optional data to send with the error.
   */
  constructor(message = "Not Acceptable", data?: D) {
    super(message, -32006, data);
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
   * @param message - Optional message to send with the error. Default: "Conflict".
   * @param data - Optional data to send with the error.
   */
  constructor(message = "Conflict", data?: D) {
    super(message, -32009, data);
  }
}
