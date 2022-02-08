import { IncomingMessage } from "http";

import { SocketClient } from "./Socket";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type HttpAction = (this: ActionResponse, req: IncomingMessage) => Response;

export type WsAction<Data extends Record<string, any> = any> = (
  this: ActionResponse,
  socket: SocketClient,
  data: Data
) => Response;

export type Response = Promise<Rejected | Redirect | Accepted | Resolved>;

type ActionResponse = {
  reject(code: number, message: string, data?: any): Rejected;
  redirect(url: string, type?: RedirectType): Redirect;
  accept(): Accepted;
  resolve(data?: any): Resolved;
};

export type Rejected = {
  status: "rejected";
  code: number;
  message: string;
  data: any;
};

export type Redirect = {
  status: "redirect";
  type: RedirectType;
  url: string;
};

export type Accepted = {
  status: "accepted";
};

export type Resolved = {
  status: "resolved";
  code: 200 | 204;
  data?: any;
};

export type RedirectType = "PERMANENT" | "TEMPORARY";

/*
 |--------------------------------------------------------------------------------
 | Actions
 |--------------------------------------------------------------------------------
 */

export function reject(code: number, message: string, data = {}): Rejected {
  return {
    status: "rejected",
    code,
    message,
    data
  };
}

export function redirect(url: string, type: RedirectType = "PERMANENT"): Redirect {
  return {
    status: "redirect",
    type,
    url
  };
}

export function accept(): Accepted {
  return {
    status: "accepted"
  };
}

export function resolve(data?: any): Resolved {
  return {
    status: "resolved",
    code: data !== undefined ? 200 : 204,
    data
  };
}
