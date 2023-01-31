import { MethodNotFoundError } from "../src/errors";
import { Notification } from "../src/notification";
import { Request } from "../src/request";
import { ErrorResponse, SuccessResponse } from "../src/response";

const methods = new Map<string, (...args: any[]) => Promise<any>>();

async function inject<Result = unknown>(request: Request): Promise<SuccessResponse<Result> | ErrorResponse>;
async function inject(request: Notification): Promise<void>;
async function inject<Result = unknown>(
  request: Request | Notification
): Promise<SuccessResponse<Result> | ErrorResponse | void> {
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
