import type { HttpStatus } from "../Types";
import type { RedirectType } from "./Action";

/*
 |--------------------------------------------------------------------------------
 | Response
 |--------------------------------------------------------------------------------
 */

abstract class HttpResponse {
  public status: HttpStatus;

  constructor(status: HttpStatus) {
    this.status = status;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Success
 |--------------------------------------------------------------------------------
 */

export class HttpSuccess extends HttpResponse {
  public readonly status = "success" as const;

  public data?: any;

  constructor(data?: any) {
    super("success");
    this.data = data;
  }

  public get code(): number {
    if (this.data !== undefined) {
      return 200;
    }
    return 204;
  }

  public toJSON(): Pick<HttpSuccess, "status" | "data"> {
    return {
      status: this.status,
      data: this.data
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Redirect
 |--------------------------------------------------------------------------------
 */

export class HttpRedirect extends HttpResponse {
  public readonly status = "redirect" as const;

  public type: RedirectType;
  public url: string;

  /**
   * Create a new HttpRedirect instance.
   *
   * @param url  - Url to redirect the request to.
   * @param type - (Optional) Type of redirect. Default: TEMPORARY
   */
  constructor(url: string, type: RedirectType = "TEMPORARY") {
    super("redirect");
    this.type = type;
    this.url = url;
  }

  /**
   * Retrieve the HTTP/S code for the redirect type.
   *
   * @returns HTTP/S 3xx
   */
  public get code(): number {
    switch (this.type) {
      case "TEMPORARY": {
        return 307;
      }
      default: {
        return 301;
      }
    }
  }

  public toJSON(): Pick<HttpRedirect, "status" | "type" | "url"> {
    return {
      status: this.status,
      type: this.type,
      url: this.url
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Error
 |--------------------------------------------------------------------------------
 */

export class HttpError extends HttpResponse {
  public readonly status = "error" as const;

  public code: number; // HTTP/S 4xx
  public message: string;
  public details: any;

  /**
   * Create a new HttpError instance.
   *
   * @param code    - Error code.
   * @param message - Error message.
   * @param details - (Optional) Additional details.
   */
  constructor(code: number, message: string, details = {}) {
    super("error");
    this.code = code;
    this.message = message;
    this.details = details;
  }

  public toJSON(): Pick<HttpError, "status" | "code" | "message" | "details"> {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      details: this.details
    };
  }
}
