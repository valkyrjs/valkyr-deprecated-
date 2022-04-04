/*
 |--------------------------------------------------------------------------------
 | Success
 |--------------------------------------------------------------------------------
 */

export class HttpSuccess {
  constructor(public readonly data?: any) {}

  public get code(): number {
    if (this.data !== undefined) {
      return 200;
    }
    return 204;
  }

  public toJSON(): any {
    return this.data;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Redirect
 |--------------------------------------------------------------------------------
 */

export class HttpRedirect {
  /**
   * Create a new HttpRedirect instance.
   *
   * @param code - Type of redirect, 301 = Permanent, 307 = Temporary
   * @param url  - Url to redirect the request to.
   */
  constructor(public readonly code: 301 | 307, public readonly url: string) {}

  public toJSON(): string {
    return this.url;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Error
 |--------------------------------------------------------------------------------
 */

export class HttpError {
  /**
   * Create a new HttpError instance.
   *
   * @param code    - Error code.
   * @param message - Error message.
   * @param data    - (Optional) Additional error data.
   */
  constructor(public readonly code: number, public readonly message: string, public readonly data = {}) {}

  public toJSON(): Pick<HttpError, "code" | "message" | "data"> {
    return {
      code: this.code,
      message: this.message,
      data: this.data
    };
  }
}
