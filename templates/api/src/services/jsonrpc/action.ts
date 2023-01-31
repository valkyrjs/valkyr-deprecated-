import { Notification, Params, Request, RpcError } from "@valkyr/jsonrpc";
import type { WebSocket } from "ws";

export const response: ActionResponse = {
  accept(): Accept {
    return {
      status: "accept"
    };
  },
  reject(error: RpcError): Reject {
    return {
      status: "reject",
      error
    };
  }
};

export type Action<P extends Params | void = void> = (
  this: ActionResponse,
  req: Request<P> | Notification<P>,
  ctx: ActionContext
) => Promise<Accept | Reject>;

export interface ActionContext {
  headers: {
    authorization?: string;
  };
  socket?: WebSocket;
}

type ActionResponse = {
  accept(): Accept;
  reject(error: RpcError): Reject;
};

type Accept = {
  status: "accept";
};

type Reject = {
  status: "reject";
  error: RpcError;
};
