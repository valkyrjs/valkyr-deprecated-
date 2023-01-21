import { ErrorResponse, Notification, Provider, Request, SuccessResponse } from "@valkyr/jsonrpc";

import { messages, socket } from "./socket";

export const ws: Provider = {
  notify,
  send,
  batch
};

async function notify(notification: Notification): Promise<void> {
  await socket().then((socket) => socket.send(JSON.stringify(notification)));
}

async function send<Result = unknown>(request: Request): Promise<SuccessResponse<Result>> {
  return new Promise((resolve) => {
    messages.set(request.id, resolve);
    socket().then((socket) => socket.send(JSON.stringify(request)));
  });
}

async function batch(_: Array<Request | Notification>): Promise<Array<SuccessResponse | ErrorResponse>> {
  return [];
}
