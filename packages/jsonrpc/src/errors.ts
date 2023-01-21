export class RpcError<D = unknown> extends Error {
  constructor(message: string, readonly code: number, readonly data?: D) {
    super(message);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      data: this.data
    };
  }
}

/**
 * Invalid JSON was received by the server. An error occurred on the server
 * while parsing the JSON text.
 */
export class ParseError<D = unknown> extends RpcError<D> {
  /**
   * Instantiate a new ParseError.
   *
   * @param data - Optional data to send with the error.
   */
  constructor(data?: D) {
    super("Parse error", -32700, data);
  }
}

/**
 * The JSON sent is not a valid Request object.
 */
export class InvalidRequestError<D = unknown> extends RpcError<D> {
  /**
   * Instantiate a new InvalidRequestError.
   *
   * @param data - Optional data to send with the error.
   */
  constructor(data?: D) {
    super("Invalid Request", -32600, data);
  }
}

/**
 * The method does not exist / is not available.
 */
export class MethodNotFoundError<D = unknown> extends RpcError<D> {
  /**
   * Instantiate a new MethodNotFoundError.
   *
   * @param data - Optional data to send with the error.
   */
  constructor(data?: D) {
    super("Method not found", -32601, data);
  }
}

/**
 * Invalid method parameter(s).
 */
export class InvalidParamsError<D = unknown> extends RpcError<D> {
  /**
   * Instantiate a new InvalidParamsError.
   *
   * @param data - Optional data to send with the error.
   */
  constructor(data?: D) {
    super("Invalid params", -32602, data);
  }
}

/**
 * Internal JSON-RPC error.
 */
export class InternalError<D = unknown> extends RpcError<D> {
  /**
   * Instantiate a new InternalError.
   *
   * @param data - Optional data to send with the error.
   */
  constructor(data?: D) {
    super("Internal error", -32603, data);
  }
}

/**
 * Reserved for implementation-defined server-errors.
 */
export class ServerError<D = unknown> extends RpcError<D> {
  /**
   * Instantiate a new ServerError.
   *
   * @param code - The error code. Must be between -32000 and -32099.
   * @param data - Optional data to send with the error.
   */
  constructor(code: number, data?: D) {
    super("Server error", code, data);
  }
}
