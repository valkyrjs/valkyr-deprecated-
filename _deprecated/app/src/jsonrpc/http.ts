import { ErrorResponse, Notification, Provider, Request, SuccessResponse } from "@valkyr/jsonrpc";

import { config } from "./config";

export const http: Provider = {
  notify,
  send,
  batch
};

async function notify(message: Notification): Promise<void> {
  await fetch(config.http, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  });
}

async function send<Result = unknown>(message: Request): Promise<SuccessResponse<Result>> {
  return fetch(config.http, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  }).then((res) => res.json());
}

async function batch(_: Array<Request | Notification>): Promise<Array<SuccessResponse | ErrorResponse>> {
  return [];
}
