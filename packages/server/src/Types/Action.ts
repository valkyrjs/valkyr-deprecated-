import type { IncomingMessage } from "http";

import type { Client } from "../Lib/Client";

export type HttpAction = (this: ActionResponse, req: IncomingMessage) => Response;

export type WsAction<Data extends Record<string, unknown> = any> = (
  this: ActionResponse,
  socket: Client,
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
