import type { IncomingMessage } from "http";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Action = (this: ActionResponse, req: IncomingMessage) => Response;

export type Response = Promise<Rejected | Redirect | Accepted | Respond>;

type ActionResponse = {
  reject(code: number, message: string, data?: any): Rejected;
  redirect(url: string, type?: RedirectType): Redirect;
  accept(): Accepted;
  respond(data?: any): Respond;
};

type Rejected = {
  status: "rejected";
  code: number;
  message: string;
  data: any;
};

type Redirect = {
  status: "redirect";
  type: RedirectType;
  url: string;
};

type Accepted = {
  status: "accepted";
};

type Respond = {
  status: "respond";
  data?: any;
};

export type RedirectType = "PERMANENT" | "TEMPORARY";

/*
 |--------------------------------------------------------------------------------
 | Responses
 |--------------------------------------------------------------------------------
 */

export function redirect(url: string, type: RedirectType = "PERMANENT"): Redirect {
  return {
    status: "redirect",
    type,
    url
  };
}

export function reject(code: number, message: string, data = {}): Rejected {
  return {
    status: "rejected",
    code,
    message,
    data
  };
}

export function accept(): Accepted {
  return {
    status: "accepted"
  };
}

export function respond(data?: any): Respond {
  return {
    status: "respond",
    data
  };
}
