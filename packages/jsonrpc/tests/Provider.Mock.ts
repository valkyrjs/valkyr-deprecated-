import { Notification } from "../src/Notification.js";
import { Provider } from "../src/Provider.js";
import { Request } from "../src/Request.js";
import { ErrorResponse, SuccessResponse } from "../src/Response.js";
import { consumer } from "./Consumer.Mock.js";

async function notify(message: Notification): Promise<void> {
  await consumer.inject(message);
}

async function send<Result = unknown>(message: Request): Promise<SuccessResponse<Result>> {
  const response = await consumer.inject<Result>(message);
  if ("error" in response) {
    throw response.error;
  }
  return response.result as any;
}

async function batch(_: Array<Request | Notification>): Promise<Array<SuccessResponse | ErrorResponse>> {
  return [];
}

export const provider: Provider = {
  notify,
  send,
  batch
};
