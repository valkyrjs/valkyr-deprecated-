export class JsonRpcError extends Error {
  constructor(message: string, readonly code: number, readonly data: unknown) {
    super(message);
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  toJSON(): JsonRpcErrorSchema {
    return {
      code: this.code,
      message: this.message,
      data: this.data
    };
  }
}

export class ParseError extends JsonRpcError {
  constructor(data?: any) {
    super("Parse error", -32700, data);
  }
}

export class InvalidRequestError extends JsonRpcError {
  constructor(data?: any) {
    super("Invalid Request", -32600, data);
  }
}

export class MethodNotFoundError extends JsonRpcError {
  constructor(data?: any) {
    super("Method not found", -32601, data);
  }
}

export class InvalidParamsError extends JsonRpcError {
  constructor(data?: any) {
    super("Invalid params", -32602, data);
  }
}

export class InternalError extends JsonRpcError {
  constructor(data?: any) {
    super("Internal error", -32603, data);
  }
}

export class ServerError extends JsonRpcError {
  constructor(code: number, data?: any) {
    super("Server error", code, data);
  }
}

export type JsonRpcErrorSchema = {
  message: string;
  code: number;
  data?: unknown;
};
