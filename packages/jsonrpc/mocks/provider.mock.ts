import { JsonRpcNotification } from "../src/notification";
import { JsonRpcProvider } from "../src/provider";
import { JsonRpcRequest } from "../src/request";
import { JsonRpcErrorResponse, JsonRpcSuccessResponse } from "../src/response";
import { consumer } from "./consumer.mock";

async function notify(message: JsonRpcNotification): Promise<void> {
  await consumer.inject(message);
}

async function send<Result = unknown>(message: JsonRpcRequest): Promise<JsonRpcSuccessResponse<Result>> {
  const response = await consumer.inject<Result>(message);
  if ("error" in response) {
    throw response.error;
  }
  return response.result as any;
}

async function batch(
  _: Array<JsonRpcRequest | JsonRpcNotification>
): Promise<Array<JsonRpcSuccessResponse | JsonRpcErrorResponse>> {
  return [];
}

export const provider: JsonRpcProvider = {
  notify,
  send,
  batch
};
