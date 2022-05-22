import { JsonRpcError } from "./Errors";

export class Notification {
  readonly jsonrpc = "2.0";

  constructor(readonly method: string, readonly params?: Params) {}

  toString() {
    return JSON.stringify(this.toJSON());
  }

  toJSON() {
    return {
      jsonrpc: this.jsonrpc,
      method: this.method,
      params: this.params
    };
  }
}

export class Request {
  readonly jsonrpc = "2.0";
  readonly method: string;
  readonly params?: Params;
  readonly id: Id;

  constructor(method: string, id: Id);
  constructor(method: string, params: Params, id: Id);
  constructor(method: string, paramsOrId: Params | Id, id?: Id) {
    this.method = method;
    if (isJsonRpcId(paramsOrId)) {
      this.id = paramsOrId;
    } else {
      this.params = paramsOrId;
      this.id = id!;
    }
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }

  toJSON() {
    return {
      jsonrpc: this.jsonrpc,
      method: this.method,
      params: this.params,
      id: this.id
    };
  }
}

export class Response<T = unknown> {
  readonly jsonrpc = "2.0";

  constructor(readonly result: T, readonly id: Id) {}

  toString() {
    return JSON.stringify(this.toJSON());
  }

  toJSON() {
    return {
      jsonrpc: this.jsonrpc,
      result: this.result,
      id: this.id
    };
  }
}

export class ErrorResponse {
  readonly jsonrpc = "2.0";

  constructor(readonly error: JsonRpcError, readonly id: Id) {}

  toString() {
    return JSON.stringify(this.toJSON());
  }

  toJSON() {
    return {
      jsonrpc: this.jsonrpc,
      error: this.error.toJSON(),
      id: this.id
    };
  }
}

function isJsonRpcId(value: unknown): value is Id {
  const type = typeof value;
  return type === "string" || type === "number" || value === null;
}

export type Id = string | number;

export type Params = unknown[] | Record<string, unknown>;

export type RpcError = {
  code: number;
  message: string;
  data?: any;
};
