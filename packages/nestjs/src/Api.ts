/*
 |--------------------------------------------------------------------------------
 | Api Responses
 |--------------------------------------------------------------------------------
 */

export const Response = {
  /**
   * The **HTTP 200 OK** success status response code indicates that the request has
   * succeeded. A 200 response is cacheable by default.
   *
   * The meaning of a success depends on the HTTP request method:
   *
   *  - **GET** The resource has been fetched and is transmitted in the message
   *    body.
   *
   *  - **HEAD** The representation headers are included in the response without
   *    any message body
   *
   *  - **POST** The resource describing the result of the action is transmitted
   *    in the message body
   *
   *  - **TRACE** The message body contains the request message as received by the
   *    server.
   *
   * The successful result of a **PUT** or a **DELETE** is often not a **200 OK**
   * but a **204 No Content** _(or a **201 Created** when the resource is uploaded
   * for the first time)_.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
   *
   * @param resource - Resource to submit with the response.
   */
  Ok<R extends ApiResponseJSON>(resource: R): OkResponse<R> {
    return new OkResponse(resource);
  },

  /**
   * The **HTTP 201 Created** success status response code indicates that the
   * request has succeeded and has led to the creation of a resource. The new
   * resource is effectively created before this response is sent back and the
   * new resource is returned in the body of the message, its location being either
   * the URL of the request, or the content of the Location header.
   *
   * The common use case of this status code is as the result of a POST request.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
   *
   * @param resource - Resource to submit with the response.
   */
  Created<R extends ApiResponseJSON>(resource: R): CreatedResponse<R> {
    return new CreatedResponse(resource);
  },

  /**
   * The **HTTP 204 No Content** success status response code indicates that a
   * request has succeeded, but that the client doesn't need to navigate away from
   * its current page.
   *
   * This might be used, for example, when implementing "save and continue editing"
   * functionality for a wiki site. In this case a **PUT** request would be used to
   * save the page, and the **204 No Content** response would be sent to indicate
   * that the editor should not be replaced by some other page.
   *
   * A 204 response is cacheable by default _(an ETag header is included in such a
   * response)_.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
   */
  NoContent(): NoContentResponse {
    return new NoContentResponse();
  }
};

export const Exception = {
  /**
   * The **HTTP 400 Bad Request** response status code indicates that the server
   * cannot or will not process the request due to something that is perceived to
   * be a client error (for example, malformed request syntax, invalid request
   * message framing, or deceptive request routing).
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
   *
   * @param response - Message or response object to submit. Default: Bad Request
   */
  BadRequest(response?: string | ApiResponseJSON): BadRequestException {
    return new BadRequestException(response);
  },

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
   *
   * @param response - Message or response object to submit. Default: Unauthorized
   */
  Unauthorized(response?: string | ApiResponseJSON): UnauthorizedException {
    return new UnauthorizedException(response);
  },

  /**
   * The **HTTP 403 Forbidden** response status code indicates that the server
   * understands the request but refuses to authorize it.
   *
   * This status is similar to **401**, but for the **403 Forbidden** status code
   * re-authenticating makes no difference. The access is permanently forbidden and
   * tied to the application logic, such as insufficient rights to a resource.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
   *
   * @param response - Message or response object to submit. Default: Forbidden
   */
  Forbidden(response?: string | ApiResponseJSON): ForbiddenException {
    return new ForbiddenException(response);
  },

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
   *
   * @param response - Message or response object to submit. Default: Not Found
   */
  NotFound(response?: string | ApiResponseJSON): NotFoundException {
    return new NotFoundException(response);
  },

  /**
   * The **HTTP 409 Conflict** response status code indicates a request conflict w
   * ith the current state of the target resource.
   *
   * Conflicts are most likely to occur in response to a PUT request. For example,
   * you may get a 409 response when uploading a file that is older than the
   * existing one on the server, resulting in a version control conflict.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
   *
   * @param response - Message or response object to submit. Default: Conflict
   */
  Conflict(response?: string | ApiResponseJSON): ConflictException {
    return new ConflictException(response);
  }
};

/*
 |--------------------------------------------------------------------------------
 | Root Response
 |--------------------------------------------------------------------------------
 */

export abstract class RootResponse {
  abstract readonly status: ApiResponseStatus;
  abstract readonly code: number;

  toJSON() {
    return {
      status: this.status,
      code: this.code
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Base Responses
 |--------------------------------------------------------------------------------
 */

export abstract class SuccessResponse extends RootResponse {
  readonly status = "success" as const;
}

export abstract class ExceptionResponse extends RootResponse {
  readonly status = "error" as const;

  constructor(readonly response: string | ApiResponseJSON) {
    super();
  }

  toJSON() {
    if (typeof this.response === "string") {
      return {
        ...super.toJSON(),
        message: this.response
      };
    }
    return {
      ...super.toJSON(),
      error: this.response
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Success Responses
 |--------------------------------------------------------------------------------
 */

/**
 * Respond with a **HTTP 200 OK** response.
 *
 * The **HTTP 200 OK** success status response code indicates that the request has
 * succeeded. A 200 response is cacheable by default.
 *
 * The meaning of a success depends on the HTTP request method:
 *
 *  - **GET** The resource has been fetched and is transmitted in the message
 *    body.
 *
 *  - **HEAD** The representation headers are included in the response without
 *    any message body
 *
 *  - **POST** The resource describing the result of the action is transmitted
 *    in the message body
 *
 *  - **TRACE** The message body contains the request message as received by the
 *    server.
 *
 * The successful result of a **PUT** or a **DELETE** is often not a **200 OK**
 * but a **204 No Content** _(or a **201 Created** when the resource is uploaded
 * for the first time)_.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
 */
export class OkResponse<R extends ApiResponseJSON> extends SuccessResponse {
  readonly code = 200 as const;

  constructor(readonly resource: R) {
    super();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      resource: this.resource
    };
  }
}

/**
 * Respond with a **HTTP 201 Created** response.
 *
 * The **HTTP 201 Created** success status response code indicates that the
 * request has succeeded and has led to the creation of a resource. The new
 * resource is effectively created before this response is sent back and the
 * new resource is returned in the body of the message, its location being either
 * the URL of the request, or the content of the Location header.
 *
 * The common use case of this status code is as the result of a POST request.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
 */
export class CreatedResponse<R extends ApiResponseJSON> extends SuccessResponse {
  readonly code = 201 as const;

  constructor(readonly resource: R) {
    super();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      resource: this.resource
    };
  }
}

/**
 * Respond with a **HTTP 204 No Content** response.
 *
 * The **HTTP 204 No Content** success status response code indicates that a
 * request has succeeded, but that the client doesn't need to navigate away from
 * its current page.
 *
 * This might be used, for example, when implementing "save and continue editing"
 * functionality for a wiki site. In this case a **PUT** request would be used to
 * save the page, and the **204 No Content** response would be sent to indicate
 * that the editor should not be replaced by some other page.
 *
 * A 204 response is cacheable by default _(an ETag header is included in such a
 * response)_.
 */
export class NoContentResponse extends SuccessResponse {
  readonly code = 204 as const;
}

/*
 |--------------------------------------------------------------------------------
 | Exception Responses
 |--------------------------------------------------------------------------------
 */

/**
 * Response with a **HTTP 400 Bad Request** exception.
 *
 * The **HTTP 400 Bad Request** response status code indicates that the server
 * cannot or will not process the request due to something that is perceived to
 * be a client error (for example, malformed request syntax, invalid request
 * message framing, or deceptive request routing).
 */
export class BadRequestException extends ExceptionResponse {
  readonly code = 400 as const;

  constructor(response?: string | ApiResponseJSON) {
    super(response ?? "Bad Request");
  }
}

/**
 * Respond with a **HTTP 401 Unauthorized** response.
 *
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
 */
export class UnauthorizedException extends ExceptionResponse {
  readonly code = 401 as const;

  constructor(response?: string | ApiResponseJSON) {
    super(response ?? "Unauthorized");
  }
}

/**
 * Response with a **HTTP 403 Forbidden** exception.
 *
 * The **HTTP 403 Forbidden** response status code indicates that the server
 * understands the request but refuses to authorize it.
 *
 * This status is similar to **401**, but for the **403 Forbidden** status code
 * re-authenticating makes no difference. The access is permanently forbidden and
 * tied to the application logic, such as insufficient rights to a resource.
 */
export class ForbiddenException extends ExceptionResponse {
  readonly code = 403 as const;

  constructor(response?: string | ApiResponseJSON) {
    super(response ?? "Forbidden");
  }
}

/**
 * Respond with a **HTTP 404 Not Found** response.
 *
 * The **HTTP 404 Not Found** response status code indicates that the server
 * cannot find the requested resource. Links that lead to a 404 page are often
 * called broken or dead links and can be subject to link rot.
 *
 * A 404 status code only indicates that the resource is missing: not whether the
 * absence is temporary or permanent. If a resource is permanently removed,
 * use the **410 _(Gone)_** status instead.
 */
export class NotFoundException extends ExceptionResponse {
  readonly code = 404 as const;

  constructor(response?: string | ApiResponseJSON) {
    super(response ?? "Not Found");
  }
}

/**
 * Respond with a **HTTP 409 Conflict** exception.
 *
 * The **HTTP 409 Conflict** response status code indicates a request conflict w
 * ith the current state of the target resource.
 *
 * Conflicts are most likely to occur in response to a PUT request. For example,
 * you may get a 409 response when uploading a file that is older than the
 * existing one on the server, resulting in a version control conflict.
 */
export class ConflictException extends ExceptionResponse {
  readonly code = 409 as const;

  constructor(response?: string | ApiResponseJSON) {
    super(response ?? "Conflict");
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type ApiResponseStatus = "success" | "error";

type ApiResponseJSON = Record<string, unknown>;

export type ApiResponse<R extends ApiResponseJSON = ApiResponseJSON> =
  | OkResponse<R>
  | CreatedResponse<R>
  | NoContentResponse
  | BadRequestException
  | UnauthorizedException
  | ForbiddenException
  | NotFoundException
  | ConflictException;
