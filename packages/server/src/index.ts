import type { RequestBody, RequestState } from "./Types/Request";

/*
 |--------------------------------------------------------------------------------
 | Overrides
 |--------------------------------------------------------------------------------
 */

declare module "http" {
  interface IncomingMessage {
    params: RequestState;
    query: RequestState;
    body: RequestBody;
  }
}

/*
 |--------------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------------
 */

export * from "./Lib/Action";
export type { Client } from "./Lib/Client";
export * from "./Lib/Response";
export { Server } from "./Server";
export type { HttpAction, WsAction } from "./Types/Action";
export type { Middleware } from "./Types/Middleware";
