import { MethodNotFoundError } from "../src/errors";
import { JsonRpcNotification } from "../src/notification";
import { JsonRpcRequest } from "../src/request";
import { JsonRpcErrorResponse, JsonRpcSuccessResponse } from "../src/response";

const methods = new Map<string, (...args: any[]) => Promise<any>>();

async function inject<Result = unknown>(
  request: JsonRpcRequest
): Promise<JsonRpcSuccessResponse<Result> | JsonRpcErrorResponse>;
async function inject(request: JsonRpcNotification): Promise<void>;
async function inject<Result = unknown>(
  request: JsonRpcRequest | JsonRpcNotification
): Promise<JsonRpcSuccessResponse<Result> | JsonRpcErrorResponse | void> {
  const handle = methods.get(request.method);
  if ("id" in request) {
    if (handle === undefined) {
      return {
        jsonrpc: "2.0",
        error: new MethodNotFoundError({ method: request.method }),
        id: request.id
      };
    }
    try {
      return {
        jsonrpc: "2.0",
        result: await handle(request.params),
        id: request.id
      };
    } catch (error) {
      return {
        jsonrpc: "2.0",
        error,
        id: request.id
      };
    }
  }
  await handle?.(request.params);
}

export const consumer = {
  methods,
  inject
};
